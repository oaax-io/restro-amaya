import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Textarea, Field, Label } from "@/components/admin/ui";
import { Trash2, ArrowUp, ArrowDown, Upload, Plus, Eye, EyeOff, Repeat } from "lucide-react";

const SIGN_TTL = 60 * 60 * 24 * 365 * 5;

type EventRow = {
  id: string;
  flyer_url: string | null;
  kicker: string | null;
  title: string;
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  end_time: string | null;
  location: string | null;
  capacity: string | null;
  is_paid: boolean;
  price_text: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_recurring: boolean;
  recurrence: string | null;
  is_published: boolean;
  sort_order: number;
};

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: EventsAdmin,
});

function EventsAdmin() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const q = useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events" as never)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as EventRow[];
    },
  });

  async function createEvent() {
    setCreating(true); setError(null);
    try {
      const items = q.data ?? [];
      const nextSort = Math.max(0, ...items.map((i) => i.sort_order)) + 10;
      const { error } = await supabase.from("events" as never).insert({
        title: "Neues Event",
        kicker: "Event",
        cta_label: "Jetzt teilnehmen",
        cta_href: "/reservation",
        is_published: false,
        sort_order: nextSort,
      } as never);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
      qc.invalidateQueries({ queryKey: ["public", "events"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setCreating(false); }
  }

  async function updateEvent(id: string, patch: Partial<EventRow>) {
    const { error } = await supabase.from("events" as never).update(patch as never).eq("id", id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "events"] });
    qc.invalidateQueries({ queryKey: ["public", "events"] });
  }

  async function removeEvent(row: EventRow) {
    if (!confirm(`Event „${row.title}" wirklich löschen?`)) return;
    if (row.flyer_url) {
      const m = row.flyer_url.match(/\/event-flyers\/([^?]+)/);
      if (m) await supabase.storage.from("event-flyers").remove([decodeURIComponent(m[1])]);
    }
    await supabase.from("events" as never).delete().eq("id", row.id);
    qc.invalidateQueries({ queryKey: ["admin", "events"] });
    qc.invalidateQueries({ queryKey: ["public", "events"] });
  }

  async function move(id: string, dir: -1 | 1) {
    const items = [...(q.data ?? [])];
    const idx = items.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const a = items[idx], b = items[swap];
    await Promise.all([
      supabase.from("events" as never).update({ sort_order: b.sort_order } as never).eq("id", a.id),
      supabase.from("events" as never).update({ sort_order: a.sort_order } as never).eq("id", b.id),
    ]);
    qc.invalidateQueries({ queryKey: ["admin", "events"] });
    qc.invalidateQueries({ queryKey: ["public", "events"] });
  }

  async function uploadFlyer(row: EventRow, file: File) {
    setError(null);
    try {
      // remove old
      if (row.flyer_url) {
        const m = row.flyer_url.match(/\/event-flyers\/([^?]+)/);
        if (m) await supabase.storage.from("event-flyers").remove([decodeURIComponent(m[1])]);
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${row.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const up = await supabase.storage.from("event-flyers").upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("event-flyers").createSignedUrl(path, SIGN_TTL);
      if (signed.error) throw signed.error;
      await updateEvent(row.id, { flyer_url: signed.data.signedUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Flyer hochladen, Details pflegen und Reihenfolge festlegen."
        action={
          <Btn onClick={createEvent} disabled={creating}>
            <span className="inline-flex items-center gap-2"><Plus size={16} />{creating ? "…" : "Neues Event"}</span>
          </Btn>
        }
      />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 space-y-6">
        {(q.data ?? []).map((ev, idx) => (
          <EventCard
            key={ev.id}
            ev={ev}
            first={idx === 0}
            last={idx === (q.data?.length ?? 0) - 1}
            onUpdate={(patch) => updateEvent(ev.id, patch)}
            onRemove={() => removeEvent(ev)}
            onMove={(dir) => move(ev.id, dir)}
            onUploadFlyer={(f) => uploadFlyer(ev, f)}
          />
        ))}
        {q.data?.length === 0 && (
          <p className="text-black/50 py-12 text-center">Noch keine Events. Lege jetzt das erste an.</p>
        )}
      </div>
    </div>
  );
}

function EventCard({ ev, first, last, onUpdate, onRemove, onMove, onUploadFlyer }: {
  ev: EventRow;
  first: boolean;
  last: boolean;
  onUpdate: (patch: Partial<EventRow>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onUploadFlyer: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onUploadFlyer(file);
  }

  return (
    <Card>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Flyer drop zone */}
        <div>
          <Label>Flyer</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer overflow-hidden transition ${dragOver ? "border-[#0D2517] bg-[#0D2517]/5" : "border-black/20 bg-black/5 hover:border-[#0D2517]/40"}`}
          >
            {ev.flyer_url ? (
              <>
                <img src={ev.flyer_url} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition flex items-center justify-center text-white text-xs uppercase tracking-widest opacity-0 hover:opacity-100">
                  <span className="inline-flex items-center gap-2"><Upload size={14} /> Ersetzen</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black/50 text-xs text-center px-3 gap-2">
                <Upload size={22} />
                <span>Flyer hier ablegen<br />oder klicken</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadFlyer(f); if (fileRef.current) fileRef.current.value = ""; }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              <Btn variant="ghost" onClick={() => onMove(-1)} disabled={first} className="p-2"><ArrowUp size={14} /></Btn>
              <Btn variant="ghost" onClick={() => onMove(1)} disabled={last} className="p-2"><ArrowDown size={14} /></Btn>
            </div>
            <Btn variant="danger" onClick={onRemove} className="p-2"><Trash2 size={14} /></Btn>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onUpdate({ is_published: !ev.is_published })}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border transition ${ev.is_published ? "bg-green-600/10 border-green-600/30 text-green-800" : "bg-black/5 border-black/15 text-black/60"}`}
            >
              {ev.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
              {ev.is_published ? "Veröffentlicht" : "Entwurf"}
            </button>
            <button
              onClick={() => onUpdate({ is_paid: !ev.is_paid })}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border transition ${ev.is_paid ? "bg-[#E9A580]/20 border-[#E9A580]/40 text-[#0D2517]" : "bg-black/5 border-black/15 text-black/60"}`}
            >
              {ev.is_paid ? "Kostenpflichtig" : "Gratis"}
            </button>
            <button
              onClick={() => onUpdate({ is_recurring: !ev.is_recurring })}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border transition ${ev.is_recurring ? "bg-blue-600/10 border-blue-600/30 text-blue-800" : "bg-black/5 border-black/15 text-black/60"}`}
            >
              <Repeat size={12} />
              {ev.is_recurring ? "Wiederkehrend" : "Einmalig"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Titel">
              <Input defaultValue={ev.title} onBlur={(e) => e.target.value !== ev.title && onUpdate({ title: e.target.value })} />
            </Field>
            <Field label="Kicker / Kategorie">
              <Input defaultValue={ev.kicker ?? ""} placeholder="z. B. DJ Night" onBlur={(e) => onUpdate({ kicker: e.target.value || null })} />
            </Field>
          </div>

          <Field label="Beschreibung">
            <Textarea rows={3} defaultValue={ev.description ?? ""} onBlur={(e) => onUpdate({ description: e.target.value || null })} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            {!ev.is_recurring ? (
              <Field label="Datum">
                <Input type="date" defaultValue={ev.event_date ?? ""} onBlur={(e) => onUpdate({ event_date: e.target.value || null })} />
              </Field>
            ) : (
              <Field label="Rhythmus">
                <Input defaultValue={ev.recurrence ?? ""} placeholder="z. B. Jeden Sonntag" onBlur={(e) => onUpdate({ recurrence: e.target.value || null })} />
              </Field>
            )}
            <Field label="Startzeit">
              <Input defaultValue={ev.event_time ?? ""} placeholder="22:00" onBlur={(e) => onUpdate({ event_time: e.target.value || null })} />
            </Field>
            <Field label="Endzeit">
              <Input defaultValue={ev.end_time ?? ""} placeholder="04:00" onBlur={(e) => onUpdate({ end_time: e.target.value || null })} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ort">
              <Input defaultValue={ev.location ?? ""} placeholder="Amaya Bar" onBlur={(e) => onUpdate({ location: e.target.value || null })} />
            </Field>
            <Field label="Kapazität">
              <Input defaultValue={ev.capacity ?? ""} placeholder="Max. 120 Gäste" onBlur={(e) => onUpdate({ capacity: e.target.value || null })} />
            </Field>
          </div>

          {ev.is_paid && (
            <Field label="Preis (Anzeige)">
              <Input defaultValue={ev.price_text ?? ""} placeholder="CHF 45 pro Person" onBlur={(e) => onUpdate({ price_text: e.target.value || null })} />
            </Field>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button-Text">
              <Input defaultValue={ev.cta_label ?? ""} placeholder="Jetzt teilnehmen" onBlur={(e) => onUpdate({ cta_label: e.target.value || null })} />
            </Field>
            <Field label="Button-Link">
              <Input defaultValue={ev.cta_href ?? ""} placeholder="/reservation oder mailto:…" onBlur={(e) => onUpdate({ cta_href: e.target.value || null })} />
            </Field>
          </div>
        </div>
      </div>
    </Card>
  );
}