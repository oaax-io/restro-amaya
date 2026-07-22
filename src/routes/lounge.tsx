import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Cigarette, Check, Crown, Wine, Users, Clock, Send, Loader2 } from "lucide-react";
import jungleTex from "@/assets/jungle-texture.jpg";
import { DEFAULT_TIER_SOLO, DEFAULT_TIER_ELITE, type LoungeTier } from "@/lib/loungeTiers";
import loungeSlide1 from "@/assets/LuzPalokaj_Photography--14.jpg.asset.json";
import loungeSlide2 from "@/assets/LuzPalokaj_Photography--36.jpg.asset.json";
import loungeSlide3 from "@/assets/LuzPalokaj_Photography--34.jpg.asset.json";
import memberCard from "@/assets/Amaya_Member.png.asset.json";

type LoungeImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
};

const FALLBACK_TILE_KEYS = ["humidor", "samt", "rare", "members"] as const;
const FALLBACK_URLS = [loungeSlide1.url, loungeSlide2.url, loungeSlide3.url, memberCard.url];

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
  const { t } = useTranslation();
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

  const { data: tierSettings } = useQuery({
    queryKey: ["public", "lounge-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", ["lounge_tier_solo", "lounge_tier_elite"]);
      if (error) throw error;
      const m = new Map((data ?? []).map((s: { key: string; value: unknown }) => [s.key, s.value]));
      return {
        solo: (m.get("lounge_tier_solo") as LoungeTier | undefined) ?? DEFAULT_TIER_SOLO,
        elite: (m.get("lounge_tier_elite") as LoungeTier | undefined) ?? DEFAULT_TIER_ELITE,
      };
    },
  });
  const tierSolo = tierSettings?.solo ?? DEFAULT_TIER_SOLO;
  const tierElite = tierSettings?.elite ?? DEFAULT_TIER_ELITE;

  const tiles = images.length > 0
    ? images
    : FALLBACK_TILE_KEYS.map((k, i) => ({
        id: `fb-${i}`,
        sort_order: i,
        image_url: FALLBACK_URLS[i],
        title: t(`lounge.tiles.${k}.title`),
        description: t(`lounge.tiles.${k}.desc`),
      } as LoungeImage));

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative pt-40 pb-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("lounge.kicker")}</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold text-gradient-gold">
            {t("lounge.titleA")}<br/>{t("lounge.titleB")}
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            {t("lounge.lead")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#membership" className="btn-luxury">{t("lounge.becomeMember")}</a>
            <a href="#cigars" className="btn-luxury btn-luxury--ghost">{t("lounge.moreCigars")}</a>
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
            <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("lounge.artKicker")}</p>
            <h2 className="font-display text-5xl lg:text-6xl mt-4 text-gradient-gold">{t("lounge.artTitle")}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{t("lounge.artBody")}</p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              { icon: Cigarette, key: "cuba" },
              { icon: Cigarette, key: "nica" },
              { icon: Cigarette, key: "dom" },
              { icon: Wine, key: "pair" },
            ].map(({ icon: Icon, key }) => {
              const title = t(`lounge.origins.${key}.title`);
              const body = t(`lounge.origins.${key}.body`);
              return (
              <div key={title} className="rounded-xl border border-accent/20 bg-card/40 p-6 hover:border-accent/50 transition">
                <Icon className="text-accent" size={22} />
                <h3 className="font-display text-2xl mt-3 text-bone">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS + FORM */}
      <section id="membership" className="py-24 lg:py-32 border-t border-accent/10 relative">
        <div className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover" }} />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("lounge.clubKicker")}</p>
            <h2 className="font-display text-5xl lg:text-6xl mt-4 text-gradient-gold">{t("lounge.clubTitle")}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{t("lounge.clubLead")}</p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8">
            <TierCard
              tier={tierSolo.tier}
              price={tierSolo.price}
              period={tierSolo.period}
              icon={Users}
              badge={tierSolo.badge}
              perks={tierSolo.perks}
            />
            <TierCard
              tier={tierElite.tier}
              price={tierElite.price}
              period={tierElite.period}
              highlighted
              icon={Crown}
              badge={tierElite.badge}
              perks={tierElite.perks}
            />
          </div>

          <div className="mt-16">
            <MembershipForm tierSolo={tierSolo} tierElite={tierElite} />
          </div>
        </div>
      </section>

      {/* HOURS INFO */}
      <section className="py-16 border-t border-accent/10">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Clock className="mx-auto text-accent" size={22} />
          <p className="mt-4 text-muted-foreground">{t("lounge.hours")}</p>
        </div>
      </section>
    </SiteLayout>
  );
}

function TierCard({ tier, price, period, perks, icon: Icon, highlighted, badge }: {
  tier: string; price: string; period: string; perks: string[]; icon: typeof Users; highlighted?: boolean; badge?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={[
      "relative rounded-2xl p-8 lg:p-10 border transition",
      highlighted
        ? "border-accent bg-accent/5 shadow-2xl shadow-accent/20"
        : "border-accent/20 bg-card/40 hover:border-accent/50",
    ].join(" ")}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-[#0D2517] text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1 rounded-full">
          {t("lounge.recommended")}
        </span>
      )}
      <div className="flex items-start justify-between">
        <Icon className="text-accent" size={26} />
        {badge && (
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-[#0D2517] text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-accent/30">
            {badge}
          </span>
        )}
      </div>
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

function MembershipForm({ tierSolo, tierElite }: { tierSolo: LoungeTier; tierElite: LoungeTier }) {
  const { t } = useTranslation();
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
      setError(t("lounge.form.errRequired"));
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
        <h3 className="font-display text-3xl mt-4 text-bone">{t("lounge.form.welcome")}</h3>
        <p className="mt-3 text-muted-foreground">{t("lounge.form.success")}</p>
        <button onClick={() => setState("idle")} className="btn-luxury btn-luxury--ghost mt-8">{t("lounge.form.another")}</button>
      </div>
    );
  }

  const inputCls = "w-full bg-black/20 border border-accent/20 rounded px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:outline-none focus:border-accent transition";
  const labelCls = "block text-xs tracking-[0.25em] uppercase text-white/60 mb-2";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto rounded-2xl border border-accent/20 bg-card/40 p-8 lg:p-10 space-y-6">
      <h3 className="font-display text-3xl text-bone">{t("lounge.form.title")}</h3>

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
            {t === "standard"
              ? `${tierSolo.tier} · ${tierSolo.price}/J.`
              : `${tierElite.tier} · ${tierElite.price}/J.`}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>{t("lounge.form.firstName")} *</label><input name="first_name" required className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.lastName")} *</label><input name="last_name" required className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.email")} *</label><input name="email" type="email" required className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.phone")}</label><input name="phone" type="tel" className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.birth")}</label><input name="birth_date" type="date" className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.address")}</label><input name="address" className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.zip")}</label><input name="postal_code" className={inputCls} /></div>
        <div><label className={labelCls}>{t("lounge.form.city")}</label><input name="city" className={inputCls} /></div>
      </div>
      <div>
        <label className={labelCls}>{t("lounge.form.messageLabel")}</label>
        <textarea name="message" rows={4} className={inputCls} placeholder={t("lounge.form.messagePh")} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-white/50">{t("lounge.form.note")}</p>
        <button type="submit" disabled={state === "loading"} className="btn-luxury inline-flex items-center gap-2 disabled:opacity-60">
          {state === "loading" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          {t("lounge.form.submit")}
        </button>
      </div>
    </form>
  );
}