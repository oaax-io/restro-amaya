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
  price_chf: number | null;
  payment_mode: "direct" | "guarantee";
  cancel_allowed: boolean;
  cancel_days: number;
  late_fee_chf: number;
  noshow_fee_chf: number | null;
  max_tickets: number | null;
};

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: EventsAdmin,
});

function EventsAdmin() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<EventRow | null>(null);

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
      const nextSort = items.length ? Math.min(...items.map((i) => i.sort_order)) - 10 : 0;
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (row.flyer_url) {
      const m = row.flyer_url.match(/\/event-flyers\/([^?]+)/);
      if (m) await supabase.storage.from("event-flyers").remove([decodeURIComponent(m[1])]);
    }
    await supabase.from("events" as never).delete().eq("id", row.id);
    setPendingDelete(null);
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
            onRemove={() => setPendingDelete(ev)}
            onMove={(dir) => move(ev.id, dir)}
            onUploadFlyer={(f) => uploadFlyer(ev, f)}
          />
        ))}
        {q.data?.length === 0 && (
          <p className="text-black/50 py-12 text-center">Noch keine Events. Lege jetzt das erste an.</p>
        )}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPendingDelete(null)} />
          <div className="relative bg-white rounded-lg border border-black/10 shadow-xl p-6 max-w-md w-full">
            <h3 className="font-display text-2xl text-[#0D2517]">Event löschen?</h3>
            <p className="mt-3 text-sm text-black/70">
              „{pendingDelete.title}" wird dauerhaft entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Btn variant="ghost" onClick={() => setPendingDelete(null)}>Abbrechen</Btn>
              <Btn variant="danger" onClick={() => removeEvent(pendingDelete)}>Löschen</Btn>
            </div>
          </div>
        </div>
      )}
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
              {ev.is_paid ? "Kostenpflichtig" : "Freier Eintritt"}
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

          {ev.is_paid && <PricingPanel ev={ev} onUpdate={onUpdate} />}

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
function numOrNull(v: string): number | null {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function PricingPanel({ ev, onUpdate }: { ev: EventRow; onUpdate: (patch: Partial<EventRow>) => void }) {
  const modes: { key: EventRow["payment_mode"]; title: string; desc: string }[] = [
    { key: "direct", title: "Direktzahlung", desc: "Ticket wird bei der Buchung sofort bezahlt." },
    { key: "guarantee", title: "Kartengarantie", desc: "Nichts wird abgebucht – Karte nur als Sicherheit für Storno/No-Show." },
  ];
  return (
    <div className="rounded-xl border border-[#E9A580]/40 bg-[#E9A580]/5 p-4 space-y-4">
      <div className="text-xs uppercase tracking-widest text-[#0D2517]/70 font-semibold">Ticketing & Bezahlung</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Eintrittspreis pro Person (CHF)">
          <Input type="number" min="0" step="0.5" defaultValue={ev.price_chf ?? ""} placeholder="45"
            onBlur={(e) => onUpdate({ price_chf: numOrNull(e.target.value) })} />
        </Field>
        <Field label="Max. Plätze (leer = unbegrenzt)">
          <Input type="number" min="1" defaultValue={ev.max_tickets ?? ""} placeholder="60"
            onBlur={(e) => { const n = numOrNull(e.target.value); onUpdate({ max_tickets: n ? Math.floor(n) : null }); }} />
        </Field>
      </div>

      <div>
        <Label>Abrechnungsmodell (nur eines pro Event)</Label>
        <div className="mt-1 grid gap-2 sm:grid-cols-2">
          {modes.map((m) => {
            const active = ev.payment_mode === m.key;
            return (
              <button key={m.key} type="button" onClick={() => onUpdate({ payment_mode: m.key })}
                className={`text-left rounded-lg border p-3 transition ${active ? "border-[#0D2517] bg-[#0D2517] text-[#F3E7D7]" : "border-black/15 bg-white hover:border-[#0D2517]/40"}`}>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`h-3.5 w-3.5 rounded-full border-2 ${active ? "border-[#E9A580] bg-[#E9A580]" : "border-black/30"}`} />
                  {m.title}
                </div>
                <div className={`mt-1 text-xs ${active ? "text-[#F3E7D7]/75" : "text-black/55"}`}>{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={ev.cancel_allowed} onChange={(e) => onUpdate({ cancel_allowed: e.target.checked })} />
          Stornierung erlaubt
        </label>
        {ev.cancel_allowed ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Kostenlos bis (Tage vorher)">
              <Input type="number" min="0" defaultValue={ev.cancel_days}
                onBlur={(e) => onUpdate({ cancel_days: Math.max(0, Math.floor(numOrNull(e.target.value) ?? 7)) })} />
            </Field>
            <Field label="Spätstorno CHF / Person">
              <Input type="number" min="0" step="0.5" defaultValue={ev.late_fee_chf}
                onBlur={(e) => onUpdate({ late_fee_chf: numOrNull(e.target.value) ?? 0 })} />
            </Field>
            <Field label="No-Show CHF / Person">
              <Input type="number" min="0" step="0.5" defaultValue={ev.noshow_fee_chf ?? ""} placeholder="voller Betrag"
                onBlur={(e) => onUpdate({ noshow_fee_chf: numOrNull(e.target.value) })} />
            </Field>
          </div>
        ) : (
          <p className="text-xs text-black/55">Keine Stornierung möglich – bei Absage oder No-Show gilt der volle Eintrittspreis.</p>
        )}
      </div>
      {!ev.price_chf && <p className="text-xs text-red-700">Bitte Eintrittspreis eintragen, sonst ist keine Online-Buchung möglich.</p>}
    </div>
  );
}
