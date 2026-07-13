import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Label } from "@/components/admin/ui";
import { Trash2, ArrowUp, ArrowDown, Upload } from "lucide-react";

const SIGN_TTL = 60 * 60 * 24 * 365 * 5; // 5 years

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin","gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data;
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
        const path = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
        const up = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type, upsert: false });
        if (up.error) throw up.error;
        const signed = await supabase.storage.from("gallery").createSignedUrl(path, SIGN_TTL);
        if (signed.error) throw signed.error;
        const ins = await supabase.from("gallery_images").insert({
          image_url: signed.data.signedUrl,
          sort_order: sort,
          caption_de: null, caption_en: null,
        });
        if (ins.error) throw ins.error;
        sort += 10;
      }
      qc.invalidateQueries({ queryKey: ["admin","gallery"] });
      qc.invalidateQueries({ queryKey: ["admin","stats"] });
      qc.invalidateQueries({ queryKey: ["public","gallery"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  }

  async function remove(id: string, imageUrl: string) {
    if (!confirm("Bild wirklich löschen?")) return;
    // extract storage path from signed URL
    const m = imageUrl.match(/\/gallery\/([^?]+)/);
    if (m) await supabase.storage.from("gallery").remove([decodeURIComponent(m[1])]);
    await supabase.from("gallery_images").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","gallery"] });
    qc.invalidateQueries({ queryKey: ["public","gallery"] });
  }

  async function move(id: string, dir: -1 | 1) {
    const items = [...(q.data ?? [])];
    const idx = items.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const a = items[idx], b = items[swap];
    await Promise.all([
      supabase.from("gallery_images").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("gallery_images").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    qc.invalidateQueries({ queryKey: ["admin","gallery"] });
    qc.invalidateQueries({ queryKey: ["public","gallery"] });
  }

  async function updateCaption(id: string, patch: Partial<{ caption_de: string; caption_en: string }>) {
    await supabase.from("gallery_images").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","gallery"] });
  }

  return (
    <div>
      <PageHeader title="Galerie" subtitle="Bilder hochladen, sortieren und beschriften."
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
        {(q.data ?? []).map((img, idx) => (
          <Card key={img.id} className="p-4">
            <div className="aspect-[4/3] bg-black/5 rounded overflow-hidden">
              <img src={img.image_url} alt={img.caption_de ?? ""} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 space-y-2">
              <div>
                <Label>Untertitel (DE)</Label>
                <Input defaultValue={img.caption_de ?? ""} onBlur={(e) => updateCaption(img.id, { caption_de: e.target.value })} />
              </div>
              <div>
                <Label>Caption (EN)</Label>
                <Input defaultValue={img.caption_en ?? ""} onBlur={(e) => updateCaption(img.id, { caption_en: e.target.value })} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  <Btn variant="ghost" onClick={() => move(img.id, -1)} disabled={idx === 0} className="p-2"><ArrowUp size={14} /></Btn>
                  <Btn variant="ghost" onClick={() => move(img.id, 1)} disabled={idx === (q.data?.length ?? 0) - 1} className="p-2"><ArrowDown size={14} /></Btn>
                </div>
                <Btn variant="danger" onClick={() => remove(img.id, img.image_url)} className="p-2"><Trash2 size={14} /></Btn>
              </div>
            </div>
          </Card>
        ))}
        {q.data?.length === 0 && <p className="text-black/50 col-span-full py-12 text-center">Noch keine Bilder. Lade jetzt die ersten hoch.</p>}
      </div>
    </div>
  );
}
