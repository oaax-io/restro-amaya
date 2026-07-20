import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Cigarette, Check, Crown, Wine, Users, Clock, Send, Loader2 } from "lucide-react";
import jungleTex from "@/assets/jungle-texture.jpg";
import loungeSlide1 from "@/assets/LuzPalokaj_Photography--14.jpg.asset.json";
import loungeSlide2 from "@/assets/LuzPalokaj_Photography--36.jpg.asset.json";
import loungeSlide3 from "@/assets/LuzPalokaj_Photography--34.jpg.asset.json";
import loungeSlide4 from "@/assets/LuzPalokaj_Photography--35.jpg.asset.json";

type LoungeImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
};

const FALLBACK_IMAGES: { image_url: string; title: string; description: string }[] = [
  { image_url: loungeSlide1.url, title: "Humidor", description: "Sorgfältig temperiert. Kubanisch, Nicaragua, Dominikanisch." },
  { image_url: loungeSlide2.url, title: "Samt & Rauch", description: "Weiche Sessel, gedämpftes Licht, tiefe Aromen." },
  { image_url: loungeSlide3.url, title: "Rare Spirits", description: "Gereifte Rums, single-cask Whiskys, exklusive Cognacs." },
  { image_url: loungeSlide4.url, title: "Members Only", description: "Ein Refugium, das nur unsere Mitglieder wirklich kennen." },
];

export const Route = createFileRoute("/lounge")({
  head: () => ({
    meta: [
      { title: "Cigar Lounge — Amaya Restaurant & Bar" },
      { name: "description", content: "Die Amaya Cigar Lounge in Rothenburg: Premium Zigarren, rare Spirituosen und ein privater Members Club. Jetzt Mitglied werden." },
      { property: "og:title", content: "Amaya Cigar Lounge" },
      { property: "og:description", content: "Premium Zigarren, gereifte Spirits, Members Club — im Herzen von Rothenburg." },
    ],
  }),
  component: LoungePage,
});

function LoungePage() {
  const { data: images = [] } = useQuery({
    queryKey: ["public", "lounge-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lounge_images" as never)
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as LoungeImage[];
    },
  });

  const tiles = images.length > 0
    ? images
    : FALLBACK_IMAGES.map((f, i) => ({ id: `fb-${i}`, sort_order: i, ...f } as LoungeImage));

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative pt-40 pb-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— 02 · Cigar Lounge</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold text-gradient-gold">
            Rauch<br/>&amp; Samt.
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            Ein Refugium für Kenner. Gedämpftes Licht, weiche Sessel und ein Humidor,
            der Kuba, Nicaragua und die Dominikanische Republik unter einem Blätterdach vereint.
            Werde Mitglied &mdash; und öffne die Tür zu unserem privaten Kreis.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#membership" className="btn-luxury">Member werden</a>
            <a href="#cigars" className="btn-luxury btn-luxury--ghost">Mehr über unsere Zigarren</a>
          </div>
        </div>
      </section>

      {/* FLOATING TILES */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {tiles.slice(0, 8).map((t, i) => (
              <div
                key={t.id}
                className={[
                  "group relative overflow-hidden rounded-2xl border border-accent/20 shadow-2xl shadow-black/60",
                  "aspect-[3/4] bg-card",
                  "animate-[floaty_7s_ease-in-out_infinite]",
                  i % 2 === 0 ? "lg:-rotate-2 lg:translate-y-0" : "lg:rotate-2 lg:translate-y-8",
                  "hover:rotate-0 hover:-translate-y-3 hover:scale-[1.03] transition-transform duration-700 ease-out",
                ].join(" ")}
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <img src={t.image_url} alt={t.title ?? "Amaya Cigar Lounge"} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  {t.title && <h3 className="font-display text-2xl text-bone">{t.title}</h3>}
                  {t.description && <p className="mt-1 text-sm text-white/70 line-clamp-3">{t.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CIGARS INFO */}
      <section id="cigars" className="py-24 lg:py-32 border-t border-accent/10">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.4em] uppercase text-accent">— Die Kunst der Zigarre</p>
            <h2 className="font-display text-5xl lg:text-6xl mt-4 text-gradient-gold">Alles beginnt mit dem Blatt.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Unsere Zigarren sind kein Zufall. Jede einzelne wird von Hand gerollt, jahrelang gereift
              und bei exakt 21°C und 70% Luftfeuchte in unserem Humidor gelagert. Vom leichten
              Frühstückszug bis zum vollmundigen Nachtcorona &mdash; wir führen Sie durch jede Nuance.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              { icon: Cigarette, title: "Kuba", body: "Cohiba, Montecristo, Partagás — die Klassiker aus Vuelta Abajo." },
              { icon: Cigarette, title: "Nicaragua", body: "Padrón, My Father, Oliva — würzig, kräftig, komplex." },
              { icon: Cigarette, title: "Dominikanisch", body: "Arturo Fuente, Davidoff — elegant und ausgewogen." },
              { icon: Wine, title: "Pairing", body: "Rums aus 25 Jahren, torfige Whiskys, seltene Cognacs." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-accent/20 bg-card/40 p-6 hover:border-accent/50 transition">
                <Icon className="text-accent" size={22} />
                <h3 className="font-display text-2xl mt-3 text-bone">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS + FORM */}
      <section id="membership" className="py-24 lg:py-32 border-t border-accent/10 relative">
        <div className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover" }} />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.4em] uppercase text-accent">— Members Club</p>
            <h2 className="font-display text-5xl lg:text-6xl mt-4 text-gradient-gold">Werde Mitglied.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Zwei Mitgliedschaften. Ein Ziel: Ihnen den besten Zigarrenabend Ihres Lebens zu schenken.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8">
            <TierCard
              tier="Solo"
              price="CHF 1'200"
              period="pro Jahr"
              icon={Users}
              perks={[
                "Ganzjähriger Zutritt zur Cigar Lounge",
                "Persönliches Locker im Humidor",
                "10% Rabatt auf Zigarren & Spirituosen",
                "Einladung zu 2 Members Events pro Jahr",
              ]}
            />
            <TierCard
              tier="Elite"
              price="CHF 3'000"
              period="pro Jahr"
              highlighted
              icon={Crown}
              badge="24/7"
              perks={[
                "Alle Solo-Vorteile",
                "Bevorzugte Reservierung ohne Wartezeit",
                "20% Rabatt auf Zigarren, Spirits & Menu",
                "Private Tastings & exklusive Verkostungen",
                "Begleitperson jederzeit kostenlos",
                "Persönlicher Concierge-Service",
              ]}
            />
          </div>

          <div className="mt-16">
            <MembershipForm />
          </div>
        </div>
      </section>

      {/* HOURS INFO */}
      <section className="py-16 border-t border-accent/10">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Clock className="mx-auto text-accent" size={22} />
          <p className="mt-4 text-muted-foreground">
            Cigar Lounge geöffnet Di–Sa ab 18:30 Uhr. Members haben 24/7 Zutritt.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function TierCard({ tier, price, period, perks, icon: Icon, highlighted }: {
  tier: string; price: string; period: string; perks: string[]; icon: typeof Users; highlighted?: boolean;
}) {
  return (
    <div className={[
      "relative rounded-2xl p-8 lg:p-10 border transition",
      highlighted
        ? "border-accent bg-accent/5 shadow-2xl shadow-accent/20"
        : "border-accent/20 bg-card/40 hover:border-accent/50",
    ].join(" ")}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-[#0D2517] text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1 rounded-full">
          Empfohlen
        </span>
      )}
      <Icon className="text-accent" size={26} />
      <h3 className="font-display text-3xl mt-4 text-bone">{tier}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl text-gradient-gold">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      <ul className="mt-8 space-y-3">
        {perks.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm text-foreground/80">
            <Check className="text-accent shrink-0 mt-0.5" size={16} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MembershipForm() {
  const qc = useQueryClient();
  const [tier, setTier] = useState<"standard" | "premium">("standard");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      first_name: String(fd.get("first_name") ?? "").trim(),
      last_name: String(fd.get("last_name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      birth_date: String(fd.get("birth_date") ?? "") || null,
      address: String(fd.get("address") ?? "").trim() || null,
      postal_code: String(fd.get("postal_code") ?? "").trim() || null,
      city: String(fd.get("city") ?? "").trim() || null,
      membership_type: tier,
      message: String(fd.get("message") ?? "").trim() || null,
    };
    if (!payload.first_name || !payload.last_name || !payload.email) {
      setError("Bitte Vor- und Nachname sowie E-Mail ausfüllen.");
      setState("error"); return;
    }
    const { error: err } = await supabase.from("lounge_members" as never).insert(payload as never);
    if (err) { setError(err.message); setState("error"); return; }
    qc.invalidateQueries({ queryKey: ["admin", "lounge-members"] });
    setState("success");
    (e.target as HTMLFormElement).reset();
  }

  if (state === "success") {
    return (
      <div className="max-w-2xl mx-auto text-center rounded-2xl border border-accent/40 bg-card/60 p-10">
        <Check className="mx-auto text-accent" size={40} />
        <h3 className="font-display text-3xl mt-4 text-bone">Willkommen im Kreis.</h3>
        <p className="mt-3 text-muted-foreground">
          Wir haben Ihren Antrag erhalten und melden uns innert 48 Stunden mit den Zahlungsdetails.
        </p>
        <button onClick={() => setState("idle")} className="btn-luxury btn-luxury--ghost mt-8">Weiteren Antrag stellen</button>
      </div>
    );
  }

  const inputCls = "w-full bg-black/20 border border-accent/20 rounded px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:outline-none focus:border-accent transition";
  const labelCls = "block text-xs tracking-[0.25em] uppercase text-white/60 mb-2";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto rounded-2xl border border-accent/20 bg-card/40 p-8 lg:p-10 space-y-6">
      <h3 className="font-display text-3xl text-bone">Mitgliedschaft beantragen</h3>

      {/* Tier picker */}
      <div className="grid grid-cols-2 gap-3">
        {(["standard", "premium"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            className={[
              "rounded-lg px-4 py-3 text-sm font-medium border transition",
              tier === t ? "border-accent bg-accent/15 text-bone" : "border-accent/20 text-white/70 hover:border-accent/50",
            ].join(" ")}
          >
            {t === "standard" ? "Solo · CHF 1'200/J." : "Elite · CHF 3'000/J."}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Vorname *</label><input name="first_name" required className={inputCls} /></div>
        <div><label className={labelCls}>Nachname *</label><input name="last_name" required className={inputCls} /></div>
        <div><label className={labelCls}>E-Mail *</label><input name="email" type="email" required className={inputCls} /></div>
        <div><label className={labelCls}>Telefon</label><input name="phone" type="tel" className={inputCls} /></div>
        <div><label className={labelCls}>Geburtsdatum</label><input name="birth_date" type="date" className={inputCls} /></div>
        <div><label className={labelCls}>Adresse</label><input name="address" className={inputCls} /></div>
        <div><label className={labelCls}>PLZ</label><input name="postal_code" className={inputCls} /></div>
        <div><label className={labelCls}>Ort</label><input name="city" className={inputCls} /></div>
      </div>
      <div>
        <label className={labelCls}>Nachricht (optional)</label>
        <textarea name="message" rows={4} className={inputCls} placeholder="Ihre Interessen, Lieblingszigarren, besondere Wünsche…" />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-white/50">
          Nach Prüfung erhalten Sie Zahlungsdetails per E-Mail. Der Jahresbeitrag wird nach Bestätigung fällig.
        </p>
        <button type="submit" disabled={state === "loading"} className="btn-luxury inline-flex items-center gap-2 disabled:opacity-60">
          {state === "loading" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          Antrag senden
        </button>
      </div>
    </form>
  );
}