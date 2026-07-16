import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ChefHat, Wine, UtensilsCrossed, Coffee, Sparkles, Upload, CheckCircle2, ArrowRight, FileText, X } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import jungleTex from "@/assets/jungle-texture.jpg";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Stellen & Karriere — Amaya Restaurant & Bar" },
      {
        name: "description",
        content:
          "Werde Teil des Amaya Teams in Rothenburg — Koch, Kellner, Bar, Küchenhilfe. Sende deine spontane Bewerbung mit Lebenslauf direkt online.",
      },
    ],
  }),
  component: JobsPage,
});

const POSITIONS = [
  { id: "Koch / Köchin", icon: ChefHat, desc: "Von À la carte bis Events — Kreativität in unserer Küche." },
  { id: "Kellner:in / Service", icon: UtensilsCrossed, desc: "Herzliche Gastgeber, die unsere Gäste begeistern." },
  { id: "Barkeeper:in", icon: Wine, desc: "Signature Drinks, Cigar Pairings und beste Vibes." },
  { id: "Küchenhilfe", icon: Coffee, desc: "Support für unser Küchenteam — voll- oder teilzeit." },
  { id: "Aushilfe / Events", icon: Sparkles, desc: "Flexibel bei DJ Nights, Brunches und privaten Feiern." },
  { id: "Andere Position", icon: Sparkles, desc: "Du siehst deine Rolle nicht? Erzähl uns, was du kannst." },
] as const;

function JobsPage() {
  const [selected, setSelected] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  function pick(pos: string) {
    setSelected(pos);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative pt-40 pb-20 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— Karriere</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold text-gradient-gold">
            Stellen.
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            Wir suchen leidenschaftliche Menschen, die Gastfreundschaft leben — Küche, Service, Bar.
            Sende uns deine spontane Bewerbung mit Lebenslauf.
          </p>
        </div>
      </section>

      {/* Positions */}
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-accent">— Positionen</p>
              <h2 className="font-display text-4xl lg:text-5xl uppercase font-bold mt-3 text-gradient-gold">
                Wo passt du hin?
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Wähle eine Rolle und wir öffnen das Bewerbungsformular. Alle Positionen sind offen für spontane Bewerbungen.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POSITIONS.map((p) => {
              const Icon = p.icon;
              const active = selected === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pick(p.id)}
                  className={[
                    "group text-left rounded-2xl border p-6 transition-all duration-300",
                    "bg-[#0D2517]/40 backdrop-blur-sm hover:-translate-y-1",
                    active ? "border-accent shadow-2xl shadow-accent/20" : "border-accent/15 hover:border-accent/40",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-11 w-11 rounded-full bg-accent/15 text-accent">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display text-xl text-foreground">{p.id}</h3>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-accent">
                    Bewerben <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section ref={formRef} className="pb-28 scroll-mt-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-[#0D2517]/70 backdrop-blur-xl p-8 lg:p-12">
            <div aria-hidden className="absolute inset-0 opacity-15 pointer-events-none"
              style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover" }} />
            <div className="relative">
              <p className="text-xs tracking-[0.4em] uppercase text-accent">— Spontane Bewerbung</p>
              <h2 className="font-display text-3xl lg:text-4xl uppercase font-bold mt-3 text-gradient-gold">
                Erzähl uns von dir.
              </h2>
              <p className="mt-4 text-muted-foreground text-sm">
                Lade deinen Lebenslauf hoch (PDF, DOC, max. 10 MB). Wir melden uns innerhalb weniger Tage.
              </p>

              <ApplicationForm selected={selected} onSelect={setSelected} />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ApplicationForm({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_MB = 10;
  const ALLOWED = [".pdf", ".doc", ".docx"];

  function pickFile(f: File | null) {
    setError(null);
    if (!f) { setFile(null); return; }
    const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ALLOWED.includes(ext)) { setError("Nur PDF, DOC oder DOCX erlaubt."); return; }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`Datei zu gross (max. ${MAX_MB} MB).`); return; }
    setFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selected) { setError("Bitte wähle oben eine Position aus."); return; }
    if (!firstName.trim() || !lastName.trim() || !email.trim()) { setError("Vorname, Nachname und E-Mail sind erforderlich."); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError("Bitte gültige E-Mail-Adresse eingeben."); return; }

    setSubmitting(true);
    try {
      let cv_url: string | null = null;
      let cv_path: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop() || "pdf";
        const safeName = `${lastName}-${firstName}`.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 40);
        const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}.${ext}`;
        const up = await supabase.storage.from("job-applications").upload(path, file, { contentType: file.type, upsert: false });
        if (up.error) throw up.error;
        cv_path = path;
        cv_url = path; // signed URL wird im Admin generiert
      }

      const { error: insErr } = await supabase.from("job_applications" as never).insert({
        position: selected,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        message: message.trim() || null,
        cv_url,
        cv_path,
      } as never);
      if (insErr) throw insErr;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <div className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="mt-5 font-display text-2xl text-foreground">Danke, {firstName}!</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Wir haben deine Bewerbung erhalten und melden uns bald bei dir.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setMessage(""); setFile(null); onSelect("");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent text-[#0D2517] px-6 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-accent/90 transition-colors"
        >
          Weitere Bewerbung senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      {/* Selected position */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Position</label>
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-[#0D2517] border border-accent/25 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
          required
        >
          <option value="">— bitte wählen —</option>
          {POSITIONS.map((p) => <option key={p.id} value={p.id}>{p.id}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Vorname *" value={firstName} onChange={setFirstName} required />
        <TextField label="Nachname *" value={lastName} onChange={setLastName} required />
        <TextField label="E-Mail *" type="email" value={email} onChange={setEmail} required />
        <TextField label="Telefon" type="tel" value={phone} onChange={setPhone} />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Nachricht</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Erzähl uns kurz von dir, deiner Erfahrung und Verfügbarkeit."
          className="w-full bg-[#0D2517] border border-accent/25 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
        />
      </div>

      {/* CV Dropzone */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Lebenslauf (PDF, DOC, DOCX)</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0] ?? null); }}
          onClick={() => inputRef.current?.click()}
          className={[
            "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            dragOver ? "border-accent bg-accent/10" : "border-accent/25 hover:border-accent/50 bg-[#0D2517]/40",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-3 text-sm text-foreground">
              <FileText size={18} className="text-accent" />
              <span className="truncate max-w-[220px]">{file.name}</span>
              <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="p-1 rounded hover:bg-accent/20 text-muted-foreground"
                aria-label="Datei entfernen"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={22} className="text-accent" />
              <p className="text-sm text-foreground">Datei hierher ziehen oder klicken</p>
              <p className="text-xs text-muted-foreground">Max. {MAX_MB} MB</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
        <p className="text-xs text-muted-foreground">Mit dem Absenden bestätigst du unsere Datenschutzhinweise.</p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-accent text-[#0D2517] px-8 py-3.5 text-sm uppercase tracking-[0.25em] font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Wird gesendet…" : "Bewerbung senden"}
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

function TextField({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0D2517] border border-accent/25 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
      />
    </div>
  );
}