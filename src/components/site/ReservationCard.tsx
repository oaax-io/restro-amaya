import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import junglePattern from "@/assets/jungle-pattern.svg.asset.json";

const COUNTRY_CODES = [
  { code: "+41", label: "+41" },
  { code: "+49", label: "+49" },
  { code: "+43", label: "+43" },
  { code: "+39", label: "+39" },
  { code: "+33", label: "+33" },
  { code: "+44", label: "+44" },
];

const PARTY_SIZES = Array.from({ length: 16 }, (_, i) => `${i + 1} Personen`);

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

export interface ReservationCardProps {
  variant?: "overlay" | "page";
}

export function ReservationCard({ variant = "overlay" }: ReservationCardProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const partyNum = parseInt(String(fd.get("party_size") ?? "2"), 10);
      const phoneRaw = String(fd.get("phone") ?? "").trim();
      const cc = String(fd.get("country_code") ?? "");
      const phone = phoneRaw ? `${cc} ${phoneRaw}`.trim() : null;

      const payload = {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone,
        party_size: Number.isFinite(partyNum) ? Math.max(1, Math.min(50, partyNum)) : 2,
        reservation_date: String(fd.get("reservation_date") ?? today),
        reservation_time: String(fd.get("reservation_time") ?? "19:30"),
        notes: String(fd.get("notes") ?? "") || null,
        status: "pending" as const,
      };

      const { error } = await supabase.from("reservations").insert(payload);
      if (error) throw error;

      setDone(true);
      toast.success("Anfrage gesendet! Wir melden uns per E-Mail.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Senden fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  }

  const wrapperBase =
    "relative overflow-hidden bg-[#fdfbf7]/65 text-[#1a1a1a] border border-gold/40 rounded-2xl shadow-2xl backdrop-blur-2xl";
  const wrapperClass =
    variant === "overlay" ? `${wrapperBase} p-5 sm:p-6` : `${wrapperBase} p-6 sm:p-8`;

  const Decor = () => (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
      style={{
        backgroundImage: `url(${junglePattern.url})`,
        backgroundRepeat: "repeat",
        backgroundSize: "520px auto",
      }}
    />
  );

  if (done) {
    return (
      <div className={wrapperClass}>
        <Decor />
        <div className="relative">
          <p className="text-[#8a6a14] tracking-[0.3em] uppercase text-[10px] mb-2 font-bold">Merci!</p>
          <h3 className="font-[family-name:var(--font-balk-display)] text-2xl text-[#1a1a1a] mb-2">Anfrage erhalten.</h3>
          <p className="text-sm text-[#2d2d2d]">
            Du erhältst gleich eine Bestätigungs-E-Mail. Wir melden uns mit der finalen Zusage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form id="reserve" onSubmit={onSubmit} className={`${wrapperClass} space-y-1.5`}>
      <Decor />
      <div className="relative text-center pb-1">
        <p className="text-[#8a6a14] tracking-[0.3em] uppercase text-[10px] mb-0.5 font-bold">
          Amaya · Booking
        </p>
        <h3 className="font-[family-name:var(--font-balk-display)] text-lg sm:text-xl leading-tight text-[#1a1a1a]">
          Wir freuen uns, dich bei uns verwöhnen zu dürfen.
        </h3>
      </div>

      <Input name="name" placeholder="Name *" required maxLength={120} autoComplete="name" aria-label="Name" />

      <Input
        name="email"
        type="email"
        placeholder="E-Mail *"
        required
        maxLength={255}
        autoComplete="email"
        inputMode="email"
        aria-label="E-Mail"
      />

      <div className="grid grid-cols-[6rem_1fr] gap-1.5">
        <Select name="country_code" defaultValue="+41" aria-label="Vorwahl">
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </Select>
        <Input name="phone" type="tel" placeholder="Telefon" maxLength={40} autoComplete="tel" inputMode="tel" aria-label="Telefon" />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Input name="reservation_date" type="date" placeholder="Datum *" required min={today} defaultValue={today} aria-label="Datum" />
        <Select name="reservation_time" required defaultValue="19:30" aria-label="Uhrzeit">
          <option value="" disabled>Uhrzeit *</option>
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>

      <Select name="party_size" required defaultValue="2" aria-label="Personen">
        {PARTY_SIZES.map((p, i) => (
          <option key={p} value={String(i + 1)}>{p}</option>
        ))}
      </Select>

      <Textarea
        name="notes"
        maxLength={1000}
        rows={2}
        placeholder="Bemerkung (Allergien, Wünsche …)"
        aria-label="Bemerkung"
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-gold border border-gold active:scale-[0.99] transition disabled:opacity-50 mt-1"
      >
        {submitting ? "Wird gesendet …" : "Reservieren"}
      </button>
    </form>
  );
}

const fieldBase =
  "w-full bg-white/85 border border-gold/40 rounded-lg px-3 py-2 text-sm text-[#4a4a4a] placeholder:text-[#4a4a4a] focus:border-gold focus:ring-2 focus:ring-gold/40 outline-none transition";

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] mb-1 font-semibold">{label}</label>
      )}
      <input {...rest} className={fieldBase} />
    </div>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const { label, children, ...rest } = props;
  return (
    <div>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] mb-1 font-semibold">{label}</label>
      )}
      <select {...rest} className={fieldBase}>{children}</select>
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] mb-1 font-semibold">{label}</label>
      )}
      <textarea {...rest} className={`${fieldBase} resize-none`} />
    </div>
  );
}