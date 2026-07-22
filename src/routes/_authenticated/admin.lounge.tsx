import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Textarea, Field } from "@/components/admin/ui";
import { Trash2, ArrowUp, ArrowDown, Upload, Eye, EyeOff } from "lucide-react";
import loungeSlide1 from "@/assets/LuzPalokaj_Photography--14.jpg.asset.json";
import loungeSlide2 from "@/assets/LuzPalokaj_Photography--36.jpg.asset.json";
import loungeSlide3 from "@/assets/LuzPalokaj_Photography--34.jpg.asset.json";
import memberCard from "@/assets/Amaya_Member.png.asset.json";

const DEFAULT_TILES = [
  { url: loungeSlide1.url, title: "Humidor", description: "Sorgfältig temperiert. Kubanisch, Nicaragua, Dominikanisch." },
  { url: loungeSlide2.url, title: "Samt & Rauch", description: "Weiche Sessel, gedämpftes Licht, tiefe Aromen." },
  { url: loungeSlide3.url, title: "Rare Spirits", description: "Gereifte Rums, single-cask Whiskys, exklusive Cognacs." },
  { url: memberCard.url, title: "Members Only", description: "Ihr persönlicher Schlüssel zum privaten Amaya Club." },
];

const SIGN_TTL = 60 * 60 * 24 * 365 * 5;

type LoungeImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
  is_published: boolean;
};

export const Route = createFileRoute("/_authenticated/admin/lounge")({
  component: LoungeAdmin,
});

function LoungeAdmin() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const q = useQuery({
    queryKey: ["admin", "lounge-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lounge_images" as never)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as LoungeImage[];
    },
  });

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true); setError(null);
    try {
      const existing = q.data ?? [];
      let sort = Math.max(0, ...existing.map((i) => i.sort_order)) + 10;
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const up = await supabase.storage.from("lounge-images").upload(path, file, { contentType: file.type, upsert: false });
        if (up.error) throw up.error;
        const signed = await supabase.storage.from("lounge-images").createSignedUrl(path, SIGN_TTL);
        if (signed.error) throw signed.error;
        const ins = await supabase.from("lounge_images" as never).insert({
          image_url: signed.data.signedUrl,
          sort_order: sort,
          title: null, description: null, is_published: true,
        } as never);
        if (ins.error) throw ins.error;
        sort += 10;
      }
      qc.invalidateQueries({ queryKey: ["admin", "lounge-images"] });
      qc.invalidateQueries({ queryKey: ["public", "lounge-images"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  }

  async function patch(id: string, patch: Partial<LoungeImage>) {
    const { error } = await supabase.from("lounge_images" as never).update(patch as never).eq("id", id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "lounge-images"] });
    qc.invalidateQueries({ queryKey: ["public", "lounge-images"] });
  }

  async function remove(img: LoungeImage) {
    if (!confirm("Bild wirklich löschen?")) return;
    const m = img.image_url.match(/\/lounge-images\/([^?]+)/);
    if (m) await supabase.storage.from("lounge-images").remove([decodeURIComponent(m[1])]);
    await supabase.from("lounge_images" as never).delete().eq("id", img.id);
    qc.invalidateQueries({ queryKey: ["admin", "lounge-images"] });
    qc.invalidateQueries({ queryKey: ["public", "lounge-images"] });
  }

  async function move(id: string, dir: -1 | 1) {
    const items = [...(q.data ?? [])];
    const idx = items.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const a = items[idx], b = items[swap];
    await Promise.all([
      supabase.from("lounge_images" as never).update({ sort_order: b.sort_order } as never).eq("id", a.id),
      supabase.from("lounge_images" as never).update({ sort_order: a.sort_order } as never).eq("id", b.id),
    ]);
    qc.invalidateQueries({ queryKey: ["admin", "lounge-images"] });
    qc.invalidateQueries({ queryKey: ["public", "lounge-images"] });
  }

  async function importDefaults() {
    setImporting(true); setError(null);
    try {
      const existing = q.data ?? [];
      let sort = Math.max(0, ...existing.map((i) => i.sort_order)) + 10;
      for (const tile of DEFAULT_TILES) {
        const res = await fetch(tile.url);
        const blob = await res.blob();
        const ext = (blob.type.split("/")[1] || "jpg").split("+")[0];
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const up = await supabase.storage.from("lounge-images").upload(path, blob, { contentType: blob.type, upsert: false });
        if (up.error) throw up.error;
        const signed = await supabase.storage.from("lounge-images").createSignedUrl(path, SIGN_TTL);
        if (signed.error) throw signed.error;
        const ins = await supabase.from("lounge_images" as never).insert({
          image_url: signed.data.signedUrl,
          title: tile.title,
          description: tile.description,
          sort_order: sort,
          is_published: true,
        } as never);
        if (ins.error) throw ins.error;
        sort += 10;
      }
      qc.invalidateQueries({ queryKey: ["admin", "lounge-images"] });
      qc.invalidateQueries({ queryKey: ["public", "lounge-images"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setImporting(false); }
  }

  return (
    <div>
      <PageHeader title="Cigar Lounge Bilder" subtitle="Bilder für die Lounge-Seite hochladen, sortieren und beschriften."
        action={
          <div>
            <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => uploadFiles(e.target.files)} />
            <Btn onClick={() => inputRef.current?.click()} disabled={uploading}>
              <span className="inline-flex items-center gap-2"><Upload size={16} />{uploading ? "Lädt hoch…" : "Bilder hochladen"}</span>
            </Btn>
          </div>
        }
      />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(q.data ?? []).length === 0 && (
          <Card className="col-span-full">
            <p className="text-sm text-black/60">Noch keine Bilder in der Datenbank. Auf der öffentlichen Seite werden aktuell die Standard-Beispielbilder angezeigt.</p>
            <div className="mt-3">
              <Btn onClick={importDefaults} disabled={importing}>
                {importing ? "Importiere…" : "Aktuelle Beispielbilder übernehmen (bearbeitbar)"}
              </Btn>
            </div>
          </Card>
        )}
        )}
        {(q.data ?? []).map((img, idx, arr) => (
          <Card key={img.id} className="p-4">
            <div className="aspect-[3/4] bg-black/5 rounded overflow-hidden relative">
              <img src={img.image_url} alt={img.title ?? ""} className="w-full h-full object-cover" />
              {!img.is_published && <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-black/70 text-white">Verborgen</span>}
            </div>
            <div className="mt-3 space-y-2">
              <Field label="Titel"><Input defaultValue={img.title ?? ""} onBlur={(e) => { if (e.currentTarget.value !== (img.title ?? "")) patch(img.id, { title: e.currentTarget.value || null }); }} /></Field>
              <Field label="Beschreibung"><Textarea rows={2} defaultValue={img.description ?? ""} onBlur={(e) => { if (e.currentTarget.value !== (img.description ?? "")) patch(img.id, { description: e.currentTarget.value || null }); }} /></Field>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  <Btn variant="ghost" onClick={() => move(img.id, -1)} disabled={idx === 0}><ArrowUp size={14} /></Btn>
                  <Btn variant="ghost" onClick={() => move(img.id, 1)} disabled={idx === arr.length - 1}><ArrowDown size={14} /></Btn>
                  <Btn variant="ghost" onClick={() => patch(img.id, { is_published: !img.is_published })}>{img.is_published ? <Eye size={14} /> : <EyeOff size={14} />}</Btn>
                </div>
                <Btn variant="danger" onClick={() => remove(img)}><Trash2 size={14} /></Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}