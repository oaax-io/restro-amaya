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

export function generateWeeklyPdf(data: WeeklyForPdf): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const green = [13, 37, 23] as const;
  const cream = [243, 231, 215] as const;

  // Header band
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(0, 0, pageW, 34, "F");
  doc.setTextColor(cream[0], cream[1], cream[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("AMAYA", pageW / 2, 15, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("WOCHENGERICHTE", pageW / 2, 22, { align: "center" });
  if (data.dateRange) {
    doc.setFontSize(9);
    doc.text(data.dateRange, pageW / 2, 28, { align: "center" });
  }

  let y = 46;
  doc.setTextColor(green[0], green[1], green[2]);

  if (data.suppeSalat) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text(data.suppeSalat, 20, y);
    if (data.suppeSalatPrice) {
      doc.text(data.suppeSalatPrice, pageW - 20, y, { align: "right" });
    }
    y += 4;
    doc.setDrawColor(green[0], green[1], green[2]);
    doc.setLineWidth(0.2);
    doc.line(20, y, pageW - 20, y);
    y += 8;
  }

  for (const it of data.items) {
    if (y > pageH - 40) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text((it.name || "").toUpperCase(), 20, y);
    y += 5;
    if (it.description) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(it.description, pageW - 40);
      doc.text(lines, 20, y);
      y += lines.length * 4.5;
    }
    if (it.price) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(it.price, pageW - 20, y, { align: "right" });
      y += 4;
    }
    y += 6;
  }

  // Footer
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(0, pageH - 20, pageW, 20, "F");
  doc.setTextColor(cream[0], cream[1], cream[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("MO - FR 11:30 bis 14:00 Uhr    DI - DO 18:30 bis 23:30 Uhr    FR - SA 18:30 bis 03:00 Uhr    Sonntag geschlossen", pageW / 2, pageH - 8, { align: "center" });

  return doc.output("blob");
}