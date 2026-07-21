// Weekly menu PDF parser + generator
import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { RESTAURANT } from "@/lib/restaurant";

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

  // Detect Suppe/Salat — accept any title line containing SUPPE and/or SALAT
  // (e.g. "SUPPE & SALAT", "TAGESSUPPE", "SAISONSALAT", "SUPPE ODER SALAT").
  const suppeSalatIdx = lines.findIndex((l) => /\b(suppe|salat)\b/i.test(l) && isUpperTitle(l));
  if (suppeSalatIdx >= 0) {
    const head = lines[suppeSalatIdx];
    const own = head.match(PRICE_ANY_RE);
    if (own) {
      out.suppe_salat_de = head.replace(PRICE_ANY_RE, "").trim();
      out.suppe_salat_price = `CHF ${own[1].replace(",", ".")}`;
    } else {
      // Look ahead a few lines for the price; collect description in between
      const descParts: string[] = [];
      for (let j = suppeSalatIdx + 1; j < Math.min(lines.length, suppeSalatIdx + 6); j++) {
        const m = lines[j].match(PRICE_ANY_RE);
        if (m) {
          out.suppe_salat_price = `CHF ${m[1].replace(",", ".")}`;
          const rest = lines[j].replace(PRICE_ANY_RE, "").trim();
          if (rest && !isUpperTitle(rest)) descParts.push(rest);
          break;
        }
        if (isUpperTitle(lines[j])) break;
        descParts.push(lines[j]);
      }
      const cleanHead = head.trim();
      out.suppe_salat_de = descParts.length
        ? `${cleanHead} — ${descParts.join(" ")}`
        : cleanHead;
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

  for (let li = 0; li < lines.length; li++) {
    // Skip the Suppe/Salat block so it isn't also captured as a regular item
    if (suppeSalatIdx >= 0 && li >= suppeSalatIdx) {
      // advance past the block: header + up to next title
      if (li === suppeSalatIdx) {
        let k = suppeSalatIdx + 1;
        while (k < lines.length && !isUpperTitle(lines[k])) k++;
        li = k - 1;
        continue;
      }
    }
    const raw = lines[li];
    const line = raw.trim();
    if (!line) continue;
    if (HOURS_RE.test(line)) { flush(); break; }

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

    // Preserve the pattern's intrinsic aspect ratio so it isn't stretched.
    const nw = img.naturalWidth || 400;
    const nh = img.naturalHeight || 400;
    const aspect = nw / nh;
    const tileMm = 85;
    const tileWpx = Math.round(tileMm * mmToPx);
    const tileHpx = Math.round(tileWpx / aspect);
    ctx.globalAlpha = opacity;
    for (let x = 0; x < canvasW; x += tileWpx) {
      for (let y = 0; y < canvasH; y += tileHpx) {
        ctx.drawImage(img, x, y, tileWpx, tileHpx);
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

// Load the Amaya logo as a PNG data URL so we can embed it in jsPDF.
async function loadLogoDataUrl(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const pointer = (await import("@/assets/amaya-logo-green.png.asset.json")).default as { url: string };
    const res = await fetch(pointer.url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    if (typeof console !== "undefined") console.warn("[menu-pdf] logo load failed", err);
    return null;
  }
}

export async function generateWeeklyPdf(data: WeeklyForPdf): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Amaya CI — cream base, deep jungle green, warm apricot accent
  const cream: [number, number, number] = [248, 243, 232];
  const creamDeep: [number, number, number] = [240, 232, 214];
  const jungle: [number, number, number] = [13, 37, 23];      // #0D2517
  const jungleSoft: [number, number, number] = [70, 96, 78];
  const apricot: [number, number, number] = [233, 165, 128];  // #E9A580
  const apricotDeep: [number, number, number] = [211, 138, 101]; // #D38A65

  // Centered text helper that correctly accounts for charSpace (jsPDF's
  // built-in align:"center" does not include letter-spacing in width calc,
  // which was causing everything to appear shifted right).
  const centerText = (
    text: string,
    y: number,
    opts: { charSpace?: number } = {},
  ) => {
    const cs = opts.charSpace ?? 0;
    const baseW = doc.getTextWidth(text);
    const extra = cs * Math.max(0, text.length - 1);
    const x = pageW / 2 - (baseW + extra) / 2;
    if (cs) doc.text(text, x, y, { charSpace: cs });
    else doc.text(text, x, y);
  };

  // ---- Background: cream base + Amaya jungle pattern + logo ----
  const [patternDataUrl, logoDataUrl] = await Promise.all([
    loadJunglePatternDataUrl(pageW, pageH, jungle, 0.08),
    loadLogoDataUrl(),
  ]);

  const paintBackground = () => {
    doc.setFillColor(...cream);
    doc.rect(0, 0, pageW, pageH, "F");
    if (patternDataUrl) {
      doc.addImage(patternDataUrl, "PNG", 0, 0, pageW, pageH, undefined, "FAST");
    }
    // Single thin apricot frame, quiet and centered
    doc.setDrawColor(...apricot);
    doc.setLineWidth(0.3);
    doc.rect(12, 12, pageW - 24, pageH - 24);
  };
  paintBackground();

  // ---- Header (centered) ----
  const cx = pageW / 2;

  // Amaya monogram (dark green, transparent)
  let y = 20;
  if (logoDataUrl) {
    const logoH = 22;
    const logoW = 18;
    doc.addImage(logoDataUrl, "PNG", cx - logoW / 2, y, logoW, logoH, undefined, "FAST");
    y += logoH + 6;
  } else {
    y = 42;
  }

  doc.setTextColor(...jungle);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  centerText("AMAYA", y, { charSpace: 5 });
  y += 8;

  doc.setTextColor(...jungleSoft);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  centerText("RESTAURANT · MESA · JUNGLE KITCHEN", y, { charSpace: 2 });
  y += 12;

  // Section title — quiet, framed by thin apricot rules left & right
  doc.setTextColor(...jungle);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  centerText("WOCHENGERICHTE", y, { charSpace: 3 });
  // Decorative side rules
  doc.setDrawColor(...apricot);
  doc.setLineWidth(0.25);
  const titleTextW = doc.getTextWidth("WOCHENGERICHTE") + 3 * 13; // charSpace * (len-1)
  const ruleGap = 6;
  const ruleLen = 22;
  const rulesY = y - 1.4;
  doc.line(cx - titleTextW / 2 - ruleGap - ruleLen, rulesY, cx - titleTextW / 2 - ruleGap, rulesY);
  doc.line(cx + titleTextW / 2 + ruleGap, rulesY, cx + titleTextW / 2 + ruleGap + ruleLen, rulesY);
  y += 6;

  if (data.dateRange) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...jungleSoft);
    doc.setFontSize(9);
    centerText(data.dateRange, y + 4);
    y += 8;
  }

  y += 8;

  // ---- Suppe & Salat (no frame, just typography) ----
  if (data.suppeSalat) {
    doc.setTextColor(...jungle);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    centerText(data.suppeSalat, y, { charSpace: 0.8 });
    if (data.suppeSalatPrice) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...apricotDeep);
      centerText(data.suppeSalatPrice, y + 5);
    }
    y += 10;
    // Divider
    doc.setDrawColor(...apricot);
    doc.setLineWidth(0.2);
    doc.line(cx - 25, y, cx + 25, y);
    y += 10;
  }

  // Footer geometry is defined before laying out menu items so the content
  // never runs underneath the framed footer area.
  const boxMarginX = 22;
  const boxH = 68;
  const boxY = pageH - boxH - 18;
  const boxX = boxMarginX;
  const boxW = pageW - boxMarginX * 2;
  const footerSafeTop = boxY - 12;

  // ---- Items (centered) ----
  const contentW = 150;
  for (let i = 0; i < data.items.length; i++) {
    const it = data.items[i];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const descLines = it.description
      ? doc.splitTextToSize(it.description, contentW)
      : [];
    const blockH = 8 + descLines.length * 4.6 + (it.price ? 8 : 0) + 10;
    if (y + blockH > footerSafeTop) {
      doc.addPage();
      paintBackground();
      y = 30;
    }

    // Title
    doc.setTextColor(...jungle);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    centerText((it.name || "").toUpperCase(), y + 4, { charSpace: 1.8 });
    y += 8;

    // Description
    if (descLines.length) {
      doc.setTextColor(...jungleSoft);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const ln of descLines) {
        y += 4.6;
        centerText(ln, y);
      }
      y += 1;
    }

    // Price
    if (it.price) {
      y += 5;
      doc.setTextColor(...apricotDeep);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      centerText(it.price, y);
    }

    // Separator
    if (i < data.items.length - 1) {
      y += 7;
      doc.setDrawColor(...apricot);
      doc.setLineWidth(0.2);
      doc.line(cx - 25, y, cx + 25, y);
      y += 8;
    } else {
      y += 6;
    }
  }

  if (y > footerSafeTop) {
    doc.addPage();
    paintBackground();
  }

  // ---- Footer: framed box (like the MESA AMAYA green frame) ----
  // Inset well away from the page edge, jungle-green rounded frame,
  // opening hours on the left, QR on the right, one thick apricot
  // divider between them. All labels live inside the frame.
  // Frame
  doc.setDrawColor(...jungle);
  doc.setLineWidth(0.75);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "S");

  // Left column: opening hours
  const padX = 10;
  const padY = 10;
  const hoursLeft = boxX + padX;
  let hoursY = boxY + padY;

  doc.setTextColor(...jungle);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.3);
  doc.text("ÖFFNUNGSZEITEN", hoursLeft, hoursY, { charSpace: 0.8 });
  hoursY += 6.5;

  const dayLabels: Record<string, string> = {
    mon: "MO", tue: "DI", wed: "MI", thu: "DO", fri: "FR", sat: "SA", sun: "SO",
  };
  const formatTime = (lunch: string | null, dinner: string | null) => {
    if (lunch && dinner) return `${lunch}  ·  ${dinner}`;
    if (lunch) return lunch;
    if (dinner) return dinner;
    return "geschlossen";
  };

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(...jungleSoft);
  for (const h of RESTAURANT.hours) {
    const label = dayLabels[h.day] ?? h.day.toUpperCase();
    const time = formatTime(h.lunch, h.dinner);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...jungle);
    doc.text(label, hoursLeft, hoursY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...jungleSoft);
    doc.text(time, hoursLeft + 10.5, hoursY);
    hoursY += 4.6;
  }

  // QR column: explicit column geometry keeps QR, label, and notes inside.
  const dividerX = boxX + boxW * 0.64;
  const rightCenterX = (dividerX + boxX + boxW - padX) / 2;
  const qrSize = 25;
  const qrX = rightCenterX - qrSize / 2;
  const qrY = boxY + 11;

  // Thick apricot divider between hours and QR
  doc.setDrawColor(...apricot);
  doc.setLineWidth(1.4);
  doc.line(dividerX, boxY + 10, dividerX, boxY + boxH - 20);

  // QR image
  const menuUrl = "https://amaya.oaase.com/menu";
  try {
    const qrDataUrl = await QRCode.toDataURL(menuUrl, {
      margin: 0,
      width: 512,
      color: { dark: "#0D2517", light: "#00000000" },
      errorCorrectionLevel: "M",
    });
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize, undefined, "FAST");
  } catch (err) {
    if (typeof console !== "undefined") console.warn("[menu-pdf] QR failed", err);
  }

  // QR label inside the frame
  doc.setTextColor(...jungle);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4);
  const qrLabel = "SPEISEKARTE ONLINE";
  doc.text(qrLabel, rightCenterX, qrY + qrSize + 6, { align: "center" });

  // Take Away note inside the frame, centered at the bottom
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  doc.setTextColor(...apricotDeep);
  doc.text("Take Away möglich   ·   Preise inkl. MwSt.", boxX + boxW / 2, boxY + boxH - 12, { align: "center" });

  return doc.output("blob");
}