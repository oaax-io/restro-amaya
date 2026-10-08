import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Card, Btn, Input } from "@/components/admin/ui";
import { chargeBookingFee, refundBooking } from "@/lib/events.functions";
import { cancellationFee, noShowFee, formatChf, type EventPricing } from "@/lib/event-pricing";
import { Download, X } from "lucide-react";

type Booking = {
  id: string; event_id: string; name: string; email: string; phone: string | null; persons: number; notes: string | null;
  amount_chf: number; payment_mode: string; status: string; payment_status: string; charged_amount_chf: number;
  stripe_payment_method_id: string | null; stripe_payment_intent_id: string | null; environment: string; created_at: string;
};
type Ev = EventPricing & { id: string; title: string; event_date: string | null };

const STATUS: Record<string, [string, string]> = {
  pending: ["Offen (nicht abgeschlossen)", "bg-slate-100 text-slate-600"],
  confirmed: ["Bestätigt", "bg-emerald-100 text-emerald-800"],
  attended: ["Teilgenommen", "bg-blue-100 text-blue-800"],
  cancelled: ["Storniert", "bg-amber-100 text-amber-800"],
  no_show: ["No-Show", "bg-red-100 text-red-800"],
};
const PAY: Record<string, string> = {
  pending: "—", paid: "Bezahlt", card_saved: "Karte hinterlegt", charged: "Gebühr belastet", refunded: "Erstattet", failed: "Fehlgeschlagen",
};

type Pending = { b: Booking; kind: "cancelled" | "no_show" | "refund"; amount: string };

export function EventBookings() {
  const qc = useQueryClient();
  const charge = useServerFn(chargeBookingFee);
  const refund = useServerFn(refundBooking);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [showPending, setShowPending] = useState(false);
  const [modal, setModal] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin", "event-bookings"],
    queryFn: async () => {
      const [b, e] = await Promise.all([
        supabase.from("event_bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("id,title,event_date,price_chf,payment_mode,cancel_allowed,cancel_days,late_fee_chf,noshow_fee_chf"),
      ]);
      if (b.error) throw b.error;
      return { bookings: (b.data ?? []) as unknown as Booking[], events: (e.data ?? []) as unknown as Ev[] };
    },
  });

  const events = q.data?.events ?? [];
  const evMap = useMemo(() => Object.fromEntries(events.map((e) => [e.id, e])), [events]);
  const items = (q.data?.bookings ?? []).filter((b) =>
    (eventFilter === "all" || b.event_id === eventFilter) && (showPending || b.status !== "pending"));
  const totalPersons = items.filter((b) => ["confirmed", "attended"].includes(b.status)).reduce((s, b) => s + b.persons, 0);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "event-bookings"] });

  async function setStatus(b: Booking, status: string) {
    await supabase.from("event_bookings").update({ status }).eq("id", b.id);
    refresh();
  }

  function openFee(b: Booking, kind: "cancelled" | "no_show") {
    const ev = evMap[b.event_id];
    const fee = ev ? (kind === "no_show" ? noShowFee(ev, b.persons) : cancellationFee(ev, b.persons, ev.event_date)) : 0;
    setModal({ b, kind, amount: fee.toFixed(2) });
  }

  async function runModal() {
    if (!modal) return;
    setBusy(true); setMsg(null);
    const amt = parseFloat(modal.amount.replace(",", ".")) || 0;
    try {
      if (modal.kind === "refund") {
        const r = await refund({ data: { bookingId: modal.b.id, amountChf: amt || undefined } });
        if ("error" in r) throw new Error(r.error);
      } else if (amt <= 0) {
        await supabase.from("event_bookings").update({ status: modal.kind }).eq("id", modal.b.id);
      } else {
        const r = await charge({ data: { bookingId: modal.b.id, amountChf: amt, reason: modal.kind } });
        if ("error" in r) throw new Error(r.error);
      }
      setModal(null); refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  function exportCsv() {
    const rows = [["Event", "Datum", "Name", "E-Mail", "Telefon", "Personen", "Betrag CHF", "Modell", "Status", "Zahlung", "Notizen"]];
    for (const b of items) {
      const ev = evMap[b.event_id];
      rows.push([ev?.title ?? "", ev?.event_date ?? "", b.name, b.email, b.phone ?? "", String(b.persons), String(b.amount_chf),
        b.payment_mode === "guarantee" ? "Kartengarantie" : "Direktzahlung", STATUS[b.status]?.[0] ?? b.status, PAY[b.payment_status] ?? b.payment_status, b.notes ?? ""]);
    }
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `event-teilnehmer${eventFilter !== "all" ? "-" + (evMap[eventFilter]?.title ?? "") : ""}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm">
          <option value="all">Alle Events</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}{e.event_date ? ` (${e.event_date})` : ""}</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs text-black/60">
          <input type="checkbox" checked={showPending} onChange={(e) => setShowPending(e.target.checked)} /> Abgebrochene Buchungen zeigen
        </label>
        <span className="text-sm text-black/60 ml-auto">{totalPersons} Gäste bestätigt</span>
        <Btn variant="ghost" onClick={exportCsv} className="px-3 py-2 text-xs inline-flex items-center gap-1.5"><Download size={13} /> Liste exportieren</Btn>
      </div>

      <Card className="mt-4 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-left">
              <tr><th className="p-3">Event</th><th className="p-3">Gast</th><th className="p-3">Pers.</th><th className="p-3">Betrag</th><th className="p-3">Status</th><th className="p-3">Zahlung</th><th className="p-3">Aktion</th></tr>
            </thead>
            <tbody>
              {q.isLoading && <tr><td colSpan={7} className="p-8 text-center text-black/50">Lädt…</td></tr>}
              {!q.isLoading && items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-black/50">Noch keine Event-Teilnehmer.</td></tr>}
              {items.map((b) => {
                const ev = evMap[b.event_id];
                const [label, color] = STATUS[b.status] ?? [b.status, "bg-slate-100"];
                const open = b.status === "confirmed";
                return (
                  <tr key={b.id} className="border-t border-black/5 align-top">
                    <td className="p-3">
                      <div className="font-medium">{ev?.title ?? "—"}</div>
                      <div className="text-xs text-black/50">{ev?.event_date ?? ""}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{b.name}</div>
                      <a href={`mailto:${b.email}`} className="text-xs underline">{b.email}</a>
                      {b.phone && <div className="text-xs text-black/60"><a href={`tel:${b.phone}`}>{b.phone}</a></div>}
                      {b.notes && <div className="text-xs text-black/60 mt-1 max-w-xs">{b.notes}</div>}
                    </td>
                    <td className="p-3">{b.persons}</td>
                    <td className="p-3 whitespace-nowrap">
                      {formatChf(Number(b.amount_chf))}
                      <div className="text-[11px] text-black/50">{b.payment_mode === "guarantee" ? "Kartengarantie" : "Direktzahlung"}</div>
                      {Number(b.charged_amount_chf) > 0 && b.payment_mode === "guarantee" && <div className="text-[11px] text-red-700">belastet {formatChf(Number(b.charged_amount_chf))}</div>}
                    </td>
                    <td className="p-3"><span className={`inline-block px-2 py-1 rounded text-xs ${color}`}>{label}</span></td>
                    <td className="p-3 text-xs whitespace-nowrap">
                      {PAY[b.payment_status] ?? b.payment_status}
                      {b.environment === "sandbox" && <div className="text-[10px] text-orange-600">Test</div>}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {open && <Btn onClick={() => setStatus(b, "attended")} className="px-2 py-1 text-xs">Teilgenommen</Btn>}
                        {open && b.payment_mode === "guarantee" && <Btn variant="ghost" onClick={() => openFee(b, "cancelled")} className="px-2 py-1 text-xs">Stornieren</Btn>}
                        {open && b.payment_mode === "guarantee" && <Btn variant="danger" onClick={() => openFee(b, "no_show")} className="px-2 py-1 text-xs">No-Show</Btn>}
                        {open && b.payment_mode === "direct" && <Btn variant="ghost" onClick={() => setModal({ b, kind: "refund", amount: Number(b.charged_amount_chf).toFixed(2) })} className="px-2 py-1 text-xs">Stornieren & erstatten</Btn>}
                        {open && b.payment_mode === "direct" && <Btn variant="danger" onClick={() => setStatus(b, "no_show")} className="px-2 py-1 text-xs">No-Show</Btn>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !busy && setModal(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">
                {modal.kind === "refund" ? "Stornieren & erstatten" : modal.kind === "no_show" ? "No-Show belasten" : "Buchung stornieren"}
              </h3>
              <button onClick={() => setModal(null)} disabled={busy}><X size={18} /></button>
            </div>
            <p className="mt-2 text-sm text-black/60">
              {modal.b.name} · {modal.b.persons} Pers. · {evMap[modal.b.event_id]?.title}
            </p>
            <label className="mt-4 block text-xs uppercase tracking-widest text-black/60">
              {modal.kind === "refund" ? "Erstattungsbetrag (CHF)" : "Betrag, der auf der Karte belastet wird (CHF)"}
            </label>
            <Input value={modal.amount} onChange={(e) => setModal({ ...modal, amount: e.target.value })} />
            <p className="mt-2 text-xs text-black/50">
              {modal.kind === "refund"
                ? "Der Betrag wird dem Gast auf seine Karte zurückerstattet."
                : "Vorschlag gemäss den Stornoregeln des Events. Bei 0 wird nur der Status geändert, ohne Belastung."}
            </p>
            {msg && <p className="mt-3 text-sm text-red-700">{msg}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setModal(null)} disabled={busy}>Abbrechen</Btn>
              <Btn variant={modal.kind === "no_show" ? "danger" : "primary"} onClick={runModal} disabled={busy}>
                {busy ? "Wird ausgeführt…" : "Bestätigen"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
