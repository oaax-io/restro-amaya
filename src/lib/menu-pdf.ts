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
    // Group items by y-coordinate (transform[5])
    const rows = new Map<number, { x: number; s: string }[]>();
    for (const it of tc.items as any[]) {
      const y = Math.round(it.transform[5]);
      const x = it.transform[4];
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y)!.push({ x, s: it.str });
    }
    const ys = Array.from(rows.keys()).sort((a, b) => b - a);
    for (const y of ys) {
      const line = rows.get(y)!.sort((a, b) => a.x - b.x).map((r) => r.s).join(" ").replace(/\s+/g, " ").trim();
      if (line) allLines.push(line);
    }
  }
  return allLines;
}

const PRICE_RE = /^\s*(?:CHF\s*)?(\d{1,3}[.,]\d{2})(?:\s*[|\/]\s*TA\s*(\d{1,3}[.,]\d{2}))?\s*$/i;
const HOURS_RE = /\b(uhr|geschlossen|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|mo\s*-|di\s*-|do\s*-|fr\s*-)\b/i;

function isUpperTitle(s: string): boolean {
  const letters = s.replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  if (letters.length < 3) return false;
  return letters === letters.toUpperCase();
}

export async function parseWeeklyPdf(file: File | Blob): Promise<ParsedWeekly> {
  const lines = await extractLines(file);
  const out: ParsedWeekly = { items: [] };

  // Detect Suppe/Salat
  for (let i = 0; i < lines.length - 1; i++) {
    if (/suppe.*salat|salat.*suppe/i.test(lines[i])) {
      const next = lines[i + 1];
      const m = next.match(PRICE_RE);
      if (m) {
        out.suppe_salat_de = lines[i].trim();
        out.suppe_salat_price = `CHF ${m[1].replace(",", ".")}`;
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

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (HOURS_RE.test(line)) { flush(); break; }
    if (/suppe.*salat|salat.*suppe/i.test(line)) continue;
    const priceM = line.match(PRICE_RE);
    if (priceM) {
      if (cur) {
        const p1 = priceM[1].replace(",", ".");
        const p2 = priceM[2]?.replace(",", ".");
        cur.price_text = p2 ? `${p1} | TA ${p2}` : p1;
        cur.description_de = descBuf.join(" ").trim();
        out.items.push(cur);
        cur = null;
        descBuf.length = 0;
      }
      continue;
    }
    if (isUpperTitle(line)) {
      flush();
      cur = { name_de: line, description_de: "", price_text: "" };
      continue;
    }
    if (cur) descBuf.push(line);
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