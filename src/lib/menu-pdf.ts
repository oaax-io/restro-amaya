// Weekly menu PDF parser + generator
import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";
import jsPDF from "jspdf";

// Use CDN worker matching the installed pdfjs version
if (typeof window !== "undefined" && !GlobalWorkerOptions.workerSrc) {
  GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

export type ParsedWeeklyItem = {
  name_de: string;
  description_de: string;
  price_text: string; // e.g. "19.50 | TA 15.50"
};

export type ParsedWeekly = {
  suppe_salat_de?: string;
  suppe_salat_price?: string;
  items: ParsedWeeklyItem[];
};

async function extractLines(file: File | Blob): Promise<string[]> {
  const buf = await file.arrayBuffer();
  const pdf = await getDocument({ data: buf }).promise;
  const allLines: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    // Group items by y-coordinate with tolerance (pdfjs jitters within a line)
    type Row = { y: number; parts: { x: number; s: string }[] };
    const rows: Row[] = [];
    const TOL = 2.5;
    for (const it of tc.items as any[]) {
      const s = String(it.str ?? "");
      if (!s.trim() && !it.hasEOL) continue;
      const y = it.transform[5];
      const x = it.transform[4];
      let row = rows.find((r) => Math.abs(r.y - y) <= TOL);
      if (!row) { row = { y, parts: [] }; rows.push(row); }
      row.parts.push({ x, s });
    }
    rows.sort((a, b) => b.y - a.y);
    for (const r of rows) {
      const line = r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join("").replace(/\s+/g, " ").trim();
      if (line) allLines.push(line);
    }
  }
  return allLines;
}

// Price anywhere in a line (captures optional TA variant)
const PRICE_ANY_RE = /(?:CHF\s*)?(\d{1,3}[.,]\d{2})(?:\s*[|\/]\s*TA\s*(\d{1,3}[.,]\d{2}))?/i;
const PRICE_ONLY_RE = /^\s*(?:CHF\s*)?\d{1,3}[.,]\d{2}(?:\s*[|\/]\s*TA\s*\d{1,3}[.,]\d{2})?\s*$/i;
const HOURS_RE = /\b(uhr|geschlossen|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|mo\s*-|di\s*-|do\s*-|fr\s*-)\b/i;

function isUpperTitle(s: string): boolean {
  // Strip any embedded price first
  const clean = s.replace(PRICE_ANY_RE, "").trim();
  const letters = clean.replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  if (letters.length < 3) return false;
  // Consider it a title if uppercase ratio is high
  const upper = letters.replace(/[^A-ZÄÖÜ]/g, "").length;
  return upper / letters.length >= 0.8;
}

export async function parseWeeklyPdf(file: File | Blob): Promise<ParsedWeekly> {
  const lines = await extractLines(file);
  if (typeof console !== "undefined") console.log("[menu-pdf] extracted lines:", lines);
  const out: ParsedWeekly = { items: [] };

  // Detect Suppe/Salat
  for (let i = 0; i < lines.length; i++) {
    if (/suppe.*salat|salat.*suppe/i.test(lines[i])) {
      const own = lines[i].match(PRICE_ANY_RE);
      if (own) {
        out.suppe_salat_de = lines[i].replace(PRICE_ANY_RE, "").trim();
        out.suppe_salat_price = `CHF ${own[1].replace(",", ".")}`;
      } else if (i + 1 < lines.length) {
        const m = lines[i + 1].match(PRICE_ANY_RE);
        if (m) {
          out.suppe_salat_de = lines[i].trim();
          out.suppe_salat_price = `CHF ${m[1].replace(",", ".")}`;
        }
      }
      break;
    }
  }

  // Walk lines and collect items
  let cur: ParsedWeeklyItem | null = null;
  const descBuf: string[] = [];

  const flush = () => {
    if (cur) {
      cur.description_de = descBuf.join(" ").trim();
      out.items.push(cur);
    }
    cur = null;
    descBuf.length = 0;
  };

  const setPriceFromMatch = (m: RegExpMatchArray) => {
    const p1 = m[1].replace(",", ".");
    const p2 = m[2]?.replace(",", ".");
    return p2 ? `${p1} | TA ${p2}` : p1;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (HOURS_RE.test(line)) { flush(); break; }
    if (/suppe.*salat|salat.*suppe/i.test(line)) continue;

    // Case: line is only a price
    if (PRICE_ONLY_RE.test(line)) {
      const priceM = line.match(PRICE_ANY_RE)!;
      if (cur) {
        cur.price_text = setPriceFromMatch(priceM);
        cur.description_de = descBuf.join(" ").trim();
        out.items.push(cur);
        cur = null;
        descBuf.length = 0;
      }
      continue;
    }

    if (isUpperTitle(line)) {
      flush();
      // Title may also contain the price on the same line
      const embedded = line.match(PRICE_ANY_RE);
      const cleanTitle = line.replace(PRICE_ANY_RE, "").trim();
      cur = { name_de: cleanTitle, description_de: "", price_text: embedded ? setPriceFromMatch(embedded) : "" };
      if (embedded) {
        out.items.push({ ...cur, description_de: "" });
        cur = null;
      }
      continue;
    }

    if (cur) {
      // Description line may end with price
      const embedded = line.match(PRICE_ANY_RE);
      if (embedded && PRICE_ANY_RE.test(line) && line.replace(PRICE_ANY_RE, "").trim().length < 3) {
        cur.price_text = setPriceFromMatch(embedded);
        cur.description_de = descBuf.join(" ").trim();
        out.items.push(cur);
        cur = null;
        descBuf.length = 0;
      } else {
        descBuf.push(line);
      }
    }
  }
  flush();

  // Only keep items that got a price
  out.items = out.items.filter((i) => i.price_text);
  return out;
}

// ---------- PDF Generation ----------

export type WeeklyForPdf = {
  dateRange?: string;
  suppeSalat?: string;
  suppeSalatPrice?: string;
  items: { name: string; description?: string; price?: string }[];
};

// Load the jungle pattern SVG and rasterize it to a tiled, tinted PNG data URL
// sized to cover an A4 page at the target DPI. Runs in the browser only.
async function loadJunglePatternDataUrl(
  pageWmm: number,
  pageHmm: number,
  tint: [number, number, number],
  opacity: number,
): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    // Import the asset pointer lazily so this file stays SSR-safe.
    const pointer = (await import("@/assets/jungle-pattern.svg.asset.json")).default as { url: string };
    const res = await fetch(pointer.url);
    const svgText = await res.text();
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = url;
    });

    // 150 DPI target
    const dpi = 150;
    const mmToPx = dpi / 25.4;
    const canvasW = Math.round(pageWmm * mmToPx);
    const canvasH = Math.round(pageHmm * mmToPx);

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    // Tile the pattern at a designed size (mm) so the motif reads clearly.
    const tileMm = 90;
    const tilePx = Math.round(tileMm * mmToPx);
    ctx.globalAlpha = opacity;
    for (let x = 0; x < canvasW; x += tilePx) {
      for (let y = 0; y < canvasH; y += tilePx) {
        ctx.drawImage(img, x, y, tilePx, tilePx);
      }
    }
    ctx.globalAlpha = 1;
    URL.revokeObjectURL(url);

    // Tint: colorize the drawn pattern toward the requested color.
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = `rgb(${tint[0]}, ${tint[1]}, ${tint[2]})`;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.globalCompositeOperation = "source-over";

    return canvas.toDataURL("image/png");
  } catch (err) {
    if (typeof console !== "undefined") console.warn("[menu-pdf] pattern load failed", err);
    return null;
  }
}

export async function generateWeeklyPdf(data: WeeklyForPdf): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Palette — light cream base with deep green + gold accents
  const cream: [number, number, number] = [248, 243, 232];
  const creamDeep: [number, number, number] = [240, 232, 214];
  const green: [number, number, number] = [22, 55, 38];
  const greenSoft: [number, number, number] = [90, 120, 95];
  const gold: [number, number, number] = [176, 141, 74];

  // ---- Background: cream base + Amaya jungle pattern (same as website) ----
  const patternDataUrl = await loadJunglePatternDataUrl(pageW, pageH, green, 0.12);

  const paintBackground = () => {
    doc.setFillColor(...cream);
    doc.rect(0, 0, pageW, pageH, "F");
    if (patternDataUrl) {
      doc.addImage(patternDataUrl, "PNG", 0, 0, pageW, pageH, undefined, "FAST");
    }
    // Faint gold side rules
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.1);
    doc.line(18, 60, 18, pageH - 40);
    doc.line(pageW - 18, 60, pageW - 18, pageH - 40);
  };
  paintBackground();

  // ---- Header (centered) ----
  const cx = pageW / 2;

  doc.setTextColor(...greenSoft);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("R E S T A U R A N T  ·  M E S A", cx, 22, { align: "center" });

  doc.setTextColor(...green);
  doc.setFont("times", "italic");
  doc.setFontSize(38);
  doc.text("Amaya", cx, 38, { align: "center" });

  // Ornamental divider — line · diamond · line
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.line(cx - 30, 44, cx - 5, 44);
  doc.line(cx + 5, 44, cx + 30, 44);
  // diamond
  doc.setFillColor(...gold);
  doc.triangle(cx - 2, 44, cx + 2, 44, cx, 41.5, "F");
  doc.triangle(cx - 2, 44, cx + 2, 44, cx, 46.5, "F");

  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("WOCHENGERICHTE", cx, 52, { align: "center", charSpace: 2 });

  if (data.dateRange) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...greenSoft);
    doc.setFontSize(9);
    doc.text(data.dateRange, cx, 58, { align: "center" });
  }

  let y = 74;

  // ---- Suppe & Salat (centered pill) ----
  if (data.suppeSalat) {
    doc.setFillColor(...creamDeep);
    const boxW = 130;
    const boxH = 16;
    doc.roundedRect(cx - boxW / 2, y - 6, boxW, boxH, 2, 2, "F");
    doc.setTextColor(...green);
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.text(data.suppeSalat, cx, y - 0.5, { align: "center" });
    if (data.suppeSalatPrice) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...gold);
      doc.text(data.suppeSalatPrice, cx, y + 5, { align: "center" });
    }
    y += 22;
  }

  // ---- Items (centered) ----
  const contentW = 140;
  for (let i = 0; i < data.items.length; i++) {
    const it = data.items[i];

    // Compute approximate block height for page break
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const descLines = it.description
      ? doc.splitTextToSize(it.description, contentW)
      : [];
    const blockH = 10 + descLines.length * 4.6 + (it.price ? 8 : 4) + 8;
    if (y + blockH > pageH - 32) {
      doc.addPage();
      paintBackground();
      y = 28;
    }

    // Small gold marker above title
    doc.setFillColor(...gold);
    doc.circle(cx, y - 2, 0.7, "F");

    // Title
    doc.setTextColor(...green);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text((it.name || "").toUpperCase(), cx, y + 4, {
      align: "center",
      charSpace: 1.2,
    });
    y += 9;

    // Description
    if (descLines.length) {
      doc.setTextColor(...greenSoft);
      doc.setFont("times", "italic");
      doc.setFontSize(10.5);
      doc.text(descLines, cx, y, { align: "center" });
      y += descLines.length * 4.8;
    }

    // Price
    if (it.price) {
      y += 2;
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(it.price, cx, y, { align: "center" });
      y += 4;
    }

    // Separator (thin gold dot) between items
    if (i < data.items.length - 1) {
      y += 5;
      doc.setFillColor(...gold);
      doc.circle(cx - 3, y, 0.5, "F");
      doc.circle(cx, y, 0.7, "F");
      doc.circle(cx + 3, y, 0.5, "F");
      y += 8;
    } else {
      y += 6;
    }
  }

  // ---- Footer ----
  const footY = pageH - 22;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(cx - 30, footY, cx - 5, footY);
  doc.line(cx + 5, footY, cx + 30, footY);
  doc.setFillColor(...gold);
  doc.triangle(cx - 2, footY, cx + 2, footY, cx, footY - 2.5, "F");
  doc.triangle(cx - 2, footY, cx + 2, footY, cx, footY + 2.5, "F");

  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ÖFFNUNGSZEITEN", cx, footY + 7, { align: "center", charSpace: 1.5 });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...greenSoft);
  doc.setFontSize(7.5);
  doc.text(
    "MO – FR  11:30 – 14:00   ·   DI – DO  18:30 – 23:30   ·   FR – SA  18:30 – 03:00   ·   SO geschlossen",
    cx,
    footY + 12,
    { align: "center" },
  );
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text("Take Away möglich  ·  Preise inkl. MwSt.", cx, footY + 16.5, {
    align: "center",
  });

  return doc.output("blob");
}