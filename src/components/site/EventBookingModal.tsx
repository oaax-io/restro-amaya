import { useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { X, Minus, Plus, ShieldCheck, CreditCard } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createEventCheckout } from "@/lib/events.functions";
import { MAX_PERSONS, conditionsText, formatChf, totalFor, type EventPricing } from "@/lib/event-pricing";

export type BookableEvent = EventPricing & {
  id: string;
  title: string;
  dateLabel: string;
  remaining: number | null;
};

export function EventBookingModal({ ev, onClose }: { ev: BookableEvent; onClose: () => void }) {
  const [persons, setPersons] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [accepted, setAccepted] = useState(false);
  const [step, setStep] = useState<"form" | "pay">("form");
  const [err, setErr] = useState<string | null>(null);

  const maxPersons = Math.min(MAX_PERSONS, ev.remaining ?? MAX_PERSONS);
  const total = totalFor(ev.price_chf, persons);
  const guarantee = ev.payment_mode === "guarantee";
  const canSubmit = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && accepted && persons >= 1;

  const fetchClientSecret = async () => {
    const res = await createEventCheckout({
      data: {
        eventId: ev.id, persons, ...form,
        returnUrl: `${window.location.origin}/event-booking?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in res) { setErr(res.error); setStep("form"); throw new Error(res.error); }
    return res.clientSecret;
  };

  const field = "w-full rounded-xl border border-accent/25 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="amaya-scroll relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-accent/30 bg-[#0D2517] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Schliessen" className="absolute top-4 right-4 text-muted-foreground hover:text-accent">
          <X size={20} />
        </button>
        <p className="text-[10px] tracking-[0.35em] uppercase text-accent">{guarantee ? "Platz sichern" : "Ticket kaufen"}</p>
        <h3 className="font-display text-3xl uppercase font-bold mt-2 text-gradient-gold leading-tight pr-8">{ev.title}</h3>
        {ev.dateLabel && <p className="mt-1 text-sm text-muted-foreground">{ev.dateLabel}</p>}

        {step === "form" ? (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-accent/20 bg-background/40 px-4 py-3">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Personen</div>
                <div className="text-sm text-foreground">{formatChf(Number(ev.price_chf ?? 0))} pro Person</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setPersons((p) => Math.max(1, p - 1))} className="h-9 w-9 rounded-full border border-accent/40 text-accent flex items-center justify-center disabled:opacity-40" disabled={persons <= 1}><Minus size={14} /></button>
                <span className="w-6 text-center font-display text-xl">{persons}</span>
                <button onClick={() => setPersons((p) => Math.min(maxPersons, p + 1))} className="h-9 w-9 rounded-full border border-accent/40 text-accent flex items-center justify-center disabled:opacity-40" disabled={persons >= maxPersons}><Plus size={14} /></button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Vor- und Nachname *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={field} type="email" placeholder="E-Mail *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className={`${field} sm:col-span-2`} placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea className={`${field} sm:col-span-2`} rows={2} placeholder="Notizen / Allergien" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div className="rounded-2xl border border-accent/20 bg-background/40 p-4 text-sm">
              <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.25em]">
                {guarantee ? <ShieldCheck size={14} /> : <CreditCard size={14} />} Konditionen
              </div>
              <ul className="mt-2 space-y-1 text-muted-foreground list-disc pl-5">
                {conditionsText(ev).map((l) => <li key={l}>{l}</li>)}
              </ul>
              <label className="mt-3 flex items-start gap-2 text-foreground cursor-pointer">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 accent-[#E9A580]" />
                <span>Ich akzeptiere die Konditionen.</span>
              </label>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{guarantee ? "Eventbetrag (nicht abgebucht)" : "Total"}</div>
                <div className="font-display text-3xl text-gradient-gold">{formatChf(total)}</div>
              </div>
              <button
                disabled={!canSubmit}
                onClick={() => { setErr(null); setStep("pay"); }}
                className="rounded-full bg-accent text-[#0D2517] px-7 py-3.5 text-sm uppercase tracking-[0.2em] font-semibold disabled:opacity-40 hover:bg-accent/90 transition-colors"
              >
                {guarantee ? "Karte hinterlegen" : "Jetzt bezahlen"}
              </button>
            </div>
            {err && <p className="text-sm text-red-300">{err}</p>}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl overflow-hidden bg-white">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>
    </div>
  );
}
