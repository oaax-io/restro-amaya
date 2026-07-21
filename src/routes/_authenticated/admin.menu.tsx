import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Textarea, Field } from "@/components/admin/ui";
import { Trash2, Plus, Upload, Download, ExternalLink, Wand2, FileDown } from "lucide-react";
import { parseWeeklyPdf, generateWeeklyPdf, type ParsedWeekly } from "@/lib/menu-pdf";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: MenuAdmin,
});

const TYPES = [
  { key: "weekly", label: "Wochenmenü" },
  { key: "lunch", label: "Lunch" },
  { key: "mesa", label: "Mesa Amaya" },
  { key: "sushi", label: "Asian Fusion / Sushi" },
  { key: "wine", label: "Weinkarte" },
] as const;
type MenuType = typeof TYPES[number]["key"];

function MenuAdmin() {
  const [type, setType] = useState<MenuType>("weekly");
  return (
    <div>
      <PageHeader title="Speisekarte" subtitle="Alle Karten (Wochen, Lunch, Mesa, Sushi, Wein) — Kategorien, Gerichte und PDF." />
      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => setType(t.key)}
            className="px-4 py-2 rounded-full text-sm font-medium transition"
            style={{
              background: type === t.key ? "#0D2517" : "#fff",
              color: type === t.key ? "#F3E7D7" : "#0D2517",
              border: "1px solid " + (type === t.key ? "#0D2517" : "rgba(13,37,23,0.15)"),
            }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-8"><TypeEditor key={type} type={type} /></div>
    </div>
  );
}

function TypeEditor({ type }: { type: MenuType }) {
  const qc = useQueryClient();
  const [newCat, setNewCat] = useState<any | null>(null);
  const [newItemFor, setNewItemFor] = useState<string | null>(null);

  const cats = useQuery({
    queryKey: ["admin","menu","cats", type],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_categories").select("*").eq("menu_type", type).order("sort_order");
      if (error) throw error; return data ?? [];
    },
  });
  const items = useQuery({
    queryKey: ["admin","menu","items", type],
    queryFn: async () => {
      const ids = (cats.data ?? []).map((c: any) => c.id);
      if (!ids.length) return [];
      const { data, error } = await supabase.from("menu_items").select("*").in("category_id", ids).order("sort_order");
      if (error) throw error; return data ?? [];
    },
    enabled: !!cats.data,
  });
  const meta = useQuery({
    queryKey: ["admin","menu","meta", type],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_meta").select("*").eq("menu_type", type).maybeSingle();
      if (error) throw error; return data;
    },
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["admin","menu"] });
    qc.invalidateQueries({ queryKey: ["menu"] });
    qc.invalidateQueries({ queryKey: ["menu-meta"] });
    qc.invalidateQueries({ queryKey: ["menu-pdf"] });
  }

  async function addCat() {
    if (!newCat) return;
    await supabase.from("menu_categories").insert({ ...newCat, menu_type: type });
    setNewCat(null); invalidate();
  }
  async function delCat(id: string) {
    if (!confirm("Kategorie und alle darin enthaltenen Einträge löschen?")) return;
    await supabase.from("menu_items").delete().eq("category_id", id);
    await supabase.from("menu_categories").delete().eq("id", id);
    invalidate();
  }
  async function updateCat(id: string, patch: any) { await supabase.from("menu_categories").update(patch).eq("id", id); invalidate(); }
  async function addItem(category_id: string, base: any) {
    await supabase.from("menu_items").insert({ ...base, category_id });
    setNewItemFor(null); invalidate();
  }
  async function delItem(id: string) {
    if (!confirm("Eintrag löschen?")) return;
    await supabase.from("menu_items").delete().eq("id", id); invalidate();
  }
  async function updateItem(id: string, patch: any) { await supabase.from("menu_items").update(patch).eq("id", id); invalidate(); }

  const isWine = type === "wine";

  return (
    <div className="space-y-8">
      {/* Meta / PDF */}
      <MetaEditor type={type} meta={meta.data} onSaved={invalidate} />

      {/* Kategorien-Verwaltung */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl">Kategorien</h2>
          <Btn onClick={() => setNewCat({ slug: "", name_de: "", name_en: "", subtitle_de: "", subtitle_en: "", sort_order: ((cats.data?.length ?? 0) + 1) * 10 })}>
            <span className="inline-flex items-center gap-2"><Plus size={16} />Neue Kategorie</span>
          </Btn>
        </div>
        {newCat && (
          <Card className="mb-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Slug"><Input value={newCat.slug} onChange={(e) => setNewCat({...newCat, slug: e.target.value})} /></Field>
              <Field label="Reihenfolge"><Input type="number" value={newCat.sort_order} onChange={(e) => setNewCat({...newCat, sort_order: Number(e.target.value)})} /></Field>
              <Field label="Name DE"><Input value={newCat.name_de} onChange={(e) => setNewCat({...newCat, name_de: e.target.value})} /></Field>
              <Field label="Name EN"><Input value={newCat.name_en} onChange={(e) => setNewCat({...newCat, name_en: e.target.value})} /></Field>
              <Field label="Untertitel DE"><Input value={newCat.subtitle_de ?? ""} onChange={(e) => setNewCat({...newCat, subtitle_de: e.target.value})} /></Field>
              <Field label="Untertitel EN"><Input value={newCat.subtitle_en ?? ""} onChange={(e) => setNewCat({...newCat, subtitle_en: e.target.value})} /></Field>
            </div>
            <div className="mt-3 flex gap-2"><Btn onClick={addCat}>Anlegen</Btn><Btn variant="ghost" onClick={() => setNewCat(null)}>Abbrechen</Btn></div>
          </Card>
        )}

        {(cats.data ?? []).map((cat: any) => {
          const rows = (items.data ?? []).filter((i: any) => i.category_id === cat.id);
          return (
            <Card key={cat.id} className="mb-6">
              {/* Kategorie-Header, editierbar */}
              <div className="grid gap-3 sm:grid-cols-6 items-end mb-4">
                <Field label="Name DE"><Input defaultValue={cat.name_de} onBlur={(e) => updateCat(cat.id, { name_de: e.target.value })} /></Field>
                <Field label="Name EN"><Input defaultValue={cat.name_en} onBlur={(e) => updateCat(cat.id, { name_en: e.target.value })} /></Field>
                <Field label="Untertitel DE"><Input defaultValue={cat.subtitle_de ?? ""} onBlur={(e) => updateCat(cat.id, { subtitle_de: e.target.value || null })} /></Field>
                <Field label="Untertitel EN"><Input defaultValue={cat.subtitle_en ?? ""} onBlur={(e) => updateCat(cat.id, { subtitle_en: e.target.value || null })} /></Field>
                <Field label="Sort"><Input type="number" defaultValue={cat.sort_order} onBlur={(e) => updateCat(cat.id, { sort_order: Number(e.target.value) })} /></Field>
                <div><Btn variant="danger" onClick={() => delCat(cat.id)} className="w-full">Löschen</Btn></div>
              </div>

              {/* Einträge-Tabelle */}
              {isWine ? <WineRows rows={rows} onUpdate={updateItem} onDelete={delItem} /> : <ItemRows rows={rows} onUpdate={updateItem} onDelete={delItem} />}

              {/* Neuer Eintrag */}
              {newItemFor === cat.id ? (
                <NewItemInline isWine={isWine} onCancel={() => setNewItemFor(null)} onSave={(base) => addItem(cat.id, base)} nextSort={(rows.at(-1)?.sort_order ?? 0) + 10} />
              ) : (
                <div className="mt-4"><Btn variant="ghost" onClick={() => setNewItemFor(cat.id)}><span className="inline-flex items-center gap-2"><Plus size={14} />Eintrag hinzufügen</span></Btn></div>
              )}
            </Card>
          );
        })}

        {(cats.data?.length ?? 0) === 0 && <p className="text-black/50 text-center py-12">Noch keine Kategorien. Lege oben eine an.</p>}
      </section>
    </div>
  );
}

function MetaEditor({ type, meta, onSaved }: { type: MenuType; meta: any; onSaved: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dateDe, setDateDe] = useState(meta?.date_range_de ?? "");
  const [dateEn, setDateEn] = useState(meta?.date_range_en ?? "");
  const [suppeDe, setSuppeDe] = useState(meta?.suppe_salat_de ?? "");
  const [suppeEn, setSuppeEn] = useState(meta?.suppe_salat_en ?? "");
  const [suppePrice, setSuppePrice] = useState(meta?.suppe_salat_price ?? "");
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const qc = useQueryClient();

  async function upsert(patch: any) {
    await supabase.from("menu_meta").upsert({ menu_type: type, ...patch }, { onConflict: "menu_type" });
    onSaved();
  }
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const path = `${type}/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
      const { error } = await supabase.storage.from("menu-pdfs").upload(path, file, { upsert: true, contentType: file.type || "application/pdf" });
      if (error) throw error;
      await upsert({ pdf_url: path });
      if (type === "weekly" && confirm("PDF hochgeladen. Jetzt automatisch auslesen und Wocheneinträge übernehmen? Bestehende Wocheneinträge werden ersetzt.")) {
        await importFromPdfFile(file);
      }
    } catch (err: any) { alert("Upload-Fehler: " + err.message); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  async function removePdf() {
    if (!meta?.pdf_url) return;
    if (!confirm("PDF entfernen?")) return;
    if (!meta.pdf_url.startsWith("http")) await supabase.storage.from("menu-pdfs").remove([meta.pdf_url]);
    await upsert({ pdf_url: null });
  }
  async function openPdf() {
    if (!meta?.pdf_url) return;
    if (meta.pdf_url.startsWith("http")) window.open(meta.pdf_url, "_blank"); return;
  }
  async function signedOpen() {
    if (!meta?.pdf_url) return;
    if (meta.pdf_url.startsWith("http")) { window.open(meta.pdf_url, "_blank"); return; }
    const { data } = await supabase.storage.from("menu-pdfs").createSignedUrl(meta.pdf_url, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function getPdfBlob(): Promise<Blob | null> {
    if (!meta?.pdf_url) return null;
    let url = meta.pdf_url;
    if (!url.startsWith("http")) {
      const { data } = await supabase.storage.from("menu-pdfs").createSignedUrl(meta.pdf_url, 300);
      if (!data?.signedUrl) return null;
      url = data.signedUrl;
    }
    const r = await fetch(url); if (!r.ok) return null;
    return await r.blob();
  }

  async function importFromPdfFile(file: File | Blob) {
    setParsing(true);
    try {
      const parsed = await parseWeeklyPdf(file);
      if (!parsed.items.length) { alert("Konnte keine Einträge aus dem PDF erkennen."); return; }
      await applyParsed(parsed);
    } catch (err: any) {
      alert("Fehler beim Auslesen: " + (err?.message ?? err));
    } finally { setParsing(false); }
  }

  async function importFromStoredPdf() {
    const blob = await getPdfBlob();
    if (!blob) { alert("Kein PDF gefunden."); return; }
    if (!confirm("Wocheneinträge aus dem hochgeladenen PDF übernehmen? Bestehende Einträge werden ersetzt.")) return;
    await importFromPdfFile(blob);
  }

  async function applyParsed(parsed: ParsedWeekly) {
    // Get or create a weekly category
    let { data: cats } = await supabase.from("menu_categories").select("*").eq("menu_type", "weekly").order("sort_order");
    let cat = cats?.[0];
    if (!cat) {
      const ins = await supabase.from("menu_categories").insert({
        menu_type: "weekly", slug: "wochengerichte", name_de: "Wochengerichte", name_en: "Weekly Dishes", sort_order: 10,
      }).select().single();
      if (ins.error) throw ins.error;
      cat = ins.data;
    }
    // Delete existing items in this category
    await supabase.from("menu_items").delete().eq("category_id", cat.id);
    // Insert parsed
    const rows = parsed.items.map((it, idx) => ({
      category_id: cat!.id,
      name_de: it.name_de,
      name_en: it.name_de,
      description_de: it.description_de,
      description_en: it.description_de,
      price_text: it.price_text,
      is_visible: true,
      sort_order: (idx + 1) * 10,
    }));
    if (rows.length) {
      const { error } = await supabase.from("menu_items").insert(rows);
      if (error) throw error;
    }
    // Update meta suppe/salat if detected
    const patch: any = {};
    if (parsed.suppe_salat_de) { patch.suppe_salat_de = parsed.suppe_salat_de; setSuppeDe(parsed.suppe_salat_de); }
    if (parsed.suppe_salat_price) { patch.suppe_salat_price = parsed.suppe_salat_price; setSuppePrice(parsed.suppe_salat_price); }
    if (Object.keys(patch).length) await upsert(patch);
    qc.invalidateQueries({ queryKey: ["admin","menu"] });
    qc.invalidateQueries({ queryKey: ["menu"] });
    alert(`Fertig – ${parsed.items.length} Einträge übernommen.`);
  }

  async function generatePdf() {
    setGenerating(true);
    try {
      const { data: cats } = await supabase.from("menu_categories").select("*").eq("menu_type", "weekly").order("sort_order");
      const ids = (cats ?? []).map((c: any) => c.id);
      const { data: items } = ids.length
        ? await supabase.from("menu_items").select("*").in("category_id", ids).order("sort_order")
        : { data: [] as any[] };
      const blob = generateWeeklyPdf({
        dateRange: dateDe || dateEn || undefined,
        suppeSalat: suppeDe || undefined,
        suppeSalatPrice: suppePrice || undefined,
        items: (items ?? []).filter((i: any) => i.is_visible !== false).map((i: any) => ({
          name: i.name_de, description: i.description_de ?? "", price: i.price_text ?? "",
        })),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `Wochengerichte_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Fehler beim Erzeugen: " + (err?.message ?? err));
    } finally { setGenerating(false); }
  }

  return (
    <Card>
      <h2 className="font-display text-xl mb-4">Karten-Einstellungen</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/60 mb-2">PDF-Karte</p>
          {meta?.pdf_url ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-black/70 truncate max-w-[280px]">{meta.pdf_url.split("/").pop()}</span>
              <Btn variant="ghost" onClick={signedOpen} className="p-2"><ExternalLink size={14} /></Btn>
              <Btn variant="danger" onClick={removePdf} className="p-2"><Trash2 size={14} /></Btn>
              <Btn variant="ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>Ersetzen</Btn>
            </div>
          ) : (
            <Btn onClick={() => fileRef.current?.click()} disabled={uploading}>
              <span className="inline-flex items-center gap-2"><Upload size={14} />{uploading ? "Wird hochgeladen…" : "PDF hochladen"}</span>
            </Btn>
          )}
          <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={handleFile} />
          <p className="mt-2 text-xs text-black/50">Wird auf der Website unter „Karte als PDF" verlinkt.</p>
          {type === "weekly" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {meta?.pdf_url && (
                <Btn variant="ghost" onClick={importFromStoredPdf} disabled={parsing}>
                  <span className="inline-flex items-center gap-2"><Wand2 size={14} />{parsing ? "Lese aus…" : "Aus PDF übernehmen"}</span>
                </Btn>
              )}
              <Btn variant="ghost" onClick={generatePdf} disabled={generating}>
                <span className="inline-flex items-center gap-2"><FileDown size={14} />{generating ? "Erzeuge…" : "PDF aus Einträgen erzeugen"}</span>
              </Btn>
            </div>
          )}
        </div>

        {type === "weekly" && (
          <>
            <Field label="Datum-Bereich DE"><Input value={dateDe} onChange={(e) => setDateDe(e.target.value)} onBlur={() => upsert({ date_range_de: dateDe })} placeholder="22/06 - 26/06" /></Field>
            <Field label="Datum-Bereich EN"><Input value={dateEn} onChange={(e) => setDateEn(e.target.value)} onBlur={() => upsert({ date_range_en: dateEn })} /></Field>
            <Field label="Suppe/Salat DE"><Input value={suppeDe} onChange={(e) => setSuppeDe(e.target.value)} onBlur={() => upsert({ suppe_salat_de: suppeDe })} /></Field>
            <Field label="Suppe/Salat EN"><Input value={suppeEn} onChange={(e) => setSuppeEn(e.target.value)} onBlur={() => upsert({ suppe_salat_en: suppeEn })} /></Field>
            <Field label="Suppe/Salat Preis"><Input value={suppePrice} onChange={(e) => setSuppePrice(e.target.value)} onBlur={() => upsert({ suppe_salat_price: suppePrice })} placeholder="CHF 3.50" /></Field>
          </>
        )}
      </div>
    </Card>
  );
}

const TAG_OPTIONS = ["v","vg","gf","spicy","signature"] as const;

function ItemRows({ rows, onUpdate, onDelete }: { rows: any[]; onUpdate: (id: string, p: any) => void; onDelete: (id: string) => void }) {
  if (rows.length === 0) return <p className="text-black/50 text-sm italic py-2">Noch keine Einträge in dieser Kategorie.</p>;
  return (
    <div className="space-y-3">
      {rows.map((it) => (
        <div key={it.id} className="border border-black/10 rounded-md p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Name DE"><Input defaultValue={it.name_de} onBlur={(e) => onUpdate(it.id, { name_de: e.target.value })} /></Field>
            <Field label="Name EN"><Input defaultValue={it.name_en} onBlur={(e) => onUpdate(it.id, { name_en: e.target.value })} /></Field>
            <Field label="Beschreibung DE"><Textarea rows={2} defaultValue={it.description_de ?? ""} onBlur={(e) => onUpdate(it.id, { description_de: e.target.value })} /></Field>
            <Field label="Beschreibung EN"><Textarea rows={2} defaultValue={it.description_en ?? ""} onBlur={(e) => onUpdate(it.id, { description_en: e.target.value })} /></Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-6 mt-2 items-end">
            <Field label="Preis (Text)"><Input defaultValue={it.price_text ?? ""} onBlur={(e) => onUpdate(it.id, { price_text: e.target.value || null })} placeholder="24.00 / mit Chicken 32.00" /></Field>
            <Field label="Allergene"><Input defaultValue={(it.allergens ?? []).join(", ")} onBlur={(e) => onUpdate(it.id, { allergens: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="A, K, L" /></Field>
            <Field label="Tags">
              <div className="flex flex-wrap gap-1">
                {TAG_OPTIONS.map((tg) => {
                  const on = (it.tags ?? []).includes(tg);
                  return <button key={tg} type="button" onClick={() => {
                    const cur = new Set<string>(it.tags ?? []);
                    if (on) cur.delete(tg); else cur.add(tg);
                    onUpdate(it.id, { tags: Array.from(cur) });
                  }} className="px-2 py-1 text-[10px] uppercase tracking-widest rounded border" style={{ background: on ? "#0D2517" : "transparent", color: on ? "#F3E7D7" : "#0D2517", borderColor: "#0D2517" }}>{tg}</button>;
                })}
              </div>
            </Field>
            <Field label="Sort"><Input type="number" defaultValue={it.sort_order} onBlur={(e) => onUpdate(it.id, { sort_order: Number(e.target.value) })} /></Field>
            <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" defaultChecked={it.highlight} onChange={(e) => onUpdate(it.id, { highlight: e.target.checked })} /> Highlight</label>
            <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" defaultChecked={it.is_visible} onChange={(e) => onUpdate(it.id, { is_visible: e.target.checked })} /> Sichtbar</label>
          </div>
          <div className="mt-2 text-right"><Btn variant="danger" onClick={() => onDelete(it.id)} className="p-2"><Trash2 size={14} /></Btn></div>
        </div>
      ))}
    </div>
  );
}

function WineRows({ rows, onUpdate, onDelete }: { rows: any[]; onUpdate: (id: string, p: any) => void; onDelete: (id: string) => void }) {
  if (rows.length === 0) return <p className="text-black/50 text-sm italic py-2">Noch keine Weine in dieser Kategorie.</p>;
  return (
    <div className="space-y-3">
      {rows.map((it) => (
        <div key={it.id} className="border border-black/10 rounded-md p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Name DE"><Input defaultValue={it.name_de} onBlur={(e) => onUpdate(it.id, { name_de: e.target.value })} /></Field>
            <Field label="Name EN"><Input defaultValue={it.name_en} onBlur={(e) => onUpdate(it.id, { name_en: e.target.value })} /></Field>
            <Field label="Rebsorten / Info DE"><Input defaultValue={it.description_de ?? ""} onBlur={(e) => onUpdate(it.id, { description_de: e.target.value })} placeholder="Chardonnay · 70 cl" /></Field>
            <Field label="Rebsorten / Info EN"><Input defaultValue={it.description_en ?? ""} onBlur={(e) => onUpdate(it.id, { description_en: e.target.value })} /></Field>
            <Field label="Herkunft DE"><Input defaultValue={it.origin_de ?? ""} onBlur={(e) => onUpdate(it.id, { origin_de: e.target.value || null })} placeholder="Frankreich, Burgund" /></Field>
            <Field label="Herkunft EN"><Input defaultValue={it.origin_en ?? ""} onBlur={(e) => onUpdate(it.id, { origin_en: e.target.value || null })} /></Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 mt-2 items-end">
            <Field label="Glas CHF"><Input defaultValue={it.glass_price ?? ""} onBlur={(e) => onUpdate(it.id, { glass_price: e.target.value || null })} placeholder="14.00" /></Field>
            <Field label="Flasche CHF"><Input defaultValue={it.bottle_price ?? ""} onBlur={(e) => onUpdate(it.id, { bottle_price: e.target.value || null })} placeholder="74.00" /></Field>
            <Field label="Sort"><Input type="number" defaultValue={it.sort_order} onBlur={(e) => onUpdate(it.id, { sort_order: Number(e.target.value) })} /></Field>
            <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" defaultChecked={it.is_visible} onChange={(e) => onUpdate(it.id, { is_visible: e.target.checked })} /> Sichtbar</label>
          </div>
          <div className="mt-2 text-right"><Btn variant="danger" onClick={() => onDelete(it.id)} className="p-2"><Trash2 size={14} /></Btn></div>
        </div>
      ))}
    </div>
  );
}

function NewItemInline({ isWine, onSave, onCancel, nextSort }: { isWine: boolean; onSave: (b: any) => void; onCancel: () => void; nextSort: number }) {
  const [f, setF] = useState<any>(isWine
    ? { name_de: "", name_en: "", description_de: "", description_en: "", origin_de: "", origin_en: "", glass_price: "", bottle_price: "", is_visible: true, sort_order: nextSort }
    : { name_de: "", name_en: "", description_de: "", description_en: "", price_text: "", allergens: [], tags: [], highlight: false, is_visible: true, sort_order: nextSort });
  return (
    <Card className="mt-4 bg-black/5 border-black/20">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Name DE"><Input value={f.name_de} onChange={(e) => setF({...f, name_de: e.target.value})} /></Field>
        <Field label="Name EN"><Input value={f.name_en} onChange={(e) => setF({...f, name_en: e.target.value})} /></Field>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 mt-2">
        <Field label={isWine ? "Rebsorten DE" : "Beschreibung DE"}><Input value={f.description_de} onChange={(e) => setF({...f, description_de: e.target.value})} /></Field>
        <Field label={isWine ? "Rebsorten EN" : "Beschreibung EN"}><Input value={f.description_en} onChange={(e) => setF({...f, description_en: e.target.value})} /></Field>
      </div>
      {isWine ? (
        <div className="grid gap-2 sm:grid-cols-4 mt-2">
          <Field label="Herkunft DE"><Input value={f.origin_de} onChange={(e) => setF({...f, origin_de: e.target.value})} /></Field>
          <Field label="Herkunft EN"><Input value={f.origin_en} onChange={(e) => setF({...f, origin_en: e.target.value})} /></Field>
          <Field label="Glas CHF"><Input value={f.glass_price} onChange={(e) => setF({...f, glass_price: e.target.value})} /></Field>
          <Field label="Flasche CHF"><Input value={f.bottle_price} onChange={(e) => setF({...f, bottle_price: e.target.value})} /></Field>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 mt-2">
          <Field label="Preis"><Input value={f.price_text} onChange={(e) => setF({...f, price_text: e.target.value})} placeholder="24.00" /></Field>
          <Field label="Allergene (Komma)"><Input value={(f.allergens ?? []).join(", ")} onChange={(e) => setF({...f, allergens: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)})} placeholder="A, K" /></Field>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <Btn onClick={() => onSave({
          ...f,
          origin_de: f.origin_de || null,
          origin_en: f.origin_en || null,
          glass_price: f.glass_price || null,
          bottle_price: f.bottle_price || null,
          price_text: f.price_text || null,
        })}>Anlegen</Btn>
        <Btn variant="ghost" onClick={onCancel}>Abbrechen</Btn>
      </div>
    </Card>
  );
}