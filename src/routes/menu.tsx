import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  WEEKLY_MENU,
  LUNCH_MENU,
  AMAYA_MESA,
  SUSHI_SHARING,
  WINE_MENU,
  type MenuItem,
  type MenuSection,
  type WineItem,
  type WineMenuSection,
} from "@/data/menu";
import { Leaf, Flame, Sparkles, ArrowRight, Wine } from "lucide-react";
import { Download } from "lucide-react";
import junglePattern from "@/assets/jungle-pattern.svg.asset.json";
import jungleTex from "@/assets/jungle-texture.jpg";
import lunchPdf from "@/assets/lunch-menu-pdf.asset.json";
import mesaPdf from "@/assets/mesa-menu-pdf.asset.json";
import sushiPdf from "@/assets/sushi-menu-pdf.asset.json";
import winePdf from "@/assets/wine-menu-pdf.asset.json";

type Lang = "de" | "en";
type TabKey = "weekly" | "lunch" | "amaya-mesa" | "sushi-sharing" | "wine";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Speisekarte — Wochen-, Lunch-, Amaya Mesa, Sushi & Wein | Amaya Restaurant" },
      {
        name: "description",
        content:
          "Entdecken Sie die Amaya Speisekarte: Wochenmenü, Lunch Karte, Amaya Mesa, Sushi Sharing und Wein Karte in Rothenburg LU.",
      },
      { property: "og:title", content: "Speisekarte — Amaya Restaurant" },
      {
        property: "og:description",
        content: "Wochenmenü, Lunch, Amaya Mesa, Sushi Sharing und Wein Karte — Küche zwischen Dschungel und Stadt.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith("en") ? "en" : "de";
  const [tab, setTab] = useState<TabKey>("weekly");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "weekly", label: t("menu.tabs.weekly") },
    { key: "lunch", label: t("menu.tabs.lunch") },
    { key: "amaya-mesa", label: t("menu.tabs.amayaMesa") },
    { key: "sushi-sharing", label: t("menu.tabs.sushiSharing") },
    { key: "wine", label: t("menu.tabs.wine") },
  ];

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
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("menu.kicker")}</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold text-gradient-gold">
            {t("menu.title")}.
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            {t("menu.intro")}
          </p>
        </div>
      </section>

      {/* Tab bar (sticky) */}
      <div className="sticky top-20 z-30 bg-background/85 backdrop-blur border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tb) => {
              const active = tab === tb.key;
              return (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={[
                    "relative py-5 text-sm uppercase tracking-[0.25em] whitespace-nowrap transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tb.label}
                  <span
                    className={[
                      "absolute left-0 right-0 -bottom-px h-px transition-all",
                      active ? "bg-accent" : "bg-transparent",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {tab === "weekly" && <WeeklyView lang={lang} />}
          {tab === "lunch" && (
            <LunchView lang={lang} />
          )}
          {tab === "amaya-mesa" && (
            <MesaView lang={lang} />
          )}
          {tab === "sushi-sharing" && (
            <SushiView lang={lang} />
          )}
          {tab === "wine" && <WineView lang={lang} />}

          {/* Allergen note + CTA */}
          <div className="mt-24 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center border-t border-border/60 pt-10">
            <p className="text-sm text-muted-foreground max-w-xl">{t("menu.allergens")}</p>
            <Link
              to="/reservation"
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded-full px-7 py-3.5 text-sm font-medium uppercase tracking-wider"
            >
              {t("menu.cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function WeeklyView({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  return (
    <div>
      <Header title={t("menu.weekly.title")} lead={t("menu.weekly.lead")} />

      {/* Pricing strip */}
      <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-3 rounded-full border border-border/70 px-5 py-2.5">
          <span className="mono-label text-accent">{t("menu.weekly.twoCourse")}</span>
          <span className="font-display text-lg">{WEEKLY_MENU.priceTwo}</span>
        </span>
        <span className="inline-flex items-center gap-3 rounded-full border border-border/70 px-5 py-2.5">
          <span className="mono-label text-accent">{t("menu.weekly.threeCourse")}</span>
          <span className="font-display text-lg">{WEEKLY_MENU.priceThree}</span>
        </span>
        <span className="text-muted-foreground">{WEEKLY_MENU.note[lang]}</span>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {WEEKLY_MENU.days.map((d) => (
          <article
            key={d.day}
            className="group relative border border-border/60 rounded-2xl p-7 hover:border-accent/60 transition-colors bg-card/40"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl uppercase tracking-wide font-bold">
                {t(`days.${d.day}`)}
              </h3>
              <span className="mono-label text-accent">{indexLabel(d.day)}</span>
            </div>
            <ul className="mt-6 space-y-5">
              <CourseLine label={t("menu.weekly.starter")} text={d.starter[lang]} />
              <CourseLine label={t("menu.weekly.main")} text={d.main[lang]} />
              <CourseLine label={t("menu.weekly.dessert")} text={d.dessert[lang]} />
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function indexLabel(day: WeeklyDayKey): string {
  const map: Record<WeeklyDayKey, string> = { mon: "01", tue: "02", wed: "03", thu: "04", fri: "05" };
  return map[day];
}
type WeeklyDayKey = "mon" | "tue" | "wed" | "thu" | "fri";

function CourseLine({ label, text }: { label: string; text: string }) {
  return (
    <li>
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1.5 leading-snug">{text}</p>
    </li>
  );
}

function SectionsView({
  lang,
  title,
  lead,
  sections,
}: {
  lang: Lang;
  title: string;
  lead: string;
  sections: MenuSection[];
}) {
  return (
    <div>
      <Header title={title} lead={lead} />
      <div className="mt-16 space-y-20">
        {sections.map((s) => (
          <SectionBlock key={s.id} lang={lang} section={s} />
        ))}
      </div>
    </div>
  );
}

function SectionBlock({ lang, section }: { lang: Lang; section: MenuSection }) {
  return (
    <section>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-16 mb-8">
        <div>
          <h2 className="font-display text-3xl lg:text-4xl uppercase font-bold leading-tight">
            {section.title[lang]}
          </h2>
          {section.subtitle && (
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {section.subtitle[lang]}
            </p>
          )}
        </div>
        <div className="hidden lg:block border-t border-border/60 mt-6" />
      </div>

      <ul className="divide-y divide-border/50">
        {section.items.map((item, i) => (
          <ItemRow key={`${section.id}-${i}`} item={item} lang={lang} />
        ))}
      </ul>
    </section>
  );
}

function ItemRow({ item, lang }: { item: MenuItem; lang: Lang }) {
  return (
    <li className="grid grid-cols-[1fr_auto] gap-6 py-6 items-baseline">
      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display text-xl lg:text-2xl uppercase tracking-wide font-semibold">
            {item.name[lang]}
          </h3>
          {item.tags?.map((tag) => <Tag key={tag} tag={tag} />)}
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {item.desc[lang]}
        </p>
      </div>
      <div className="font-display text-xl lg:text-2xl tabular-nums text-accent whitespace-nowrap">
        {item.price}
      </div>
    </li>
  );
}

function Tag({ tag }: { tag: NonNullable<MenuItem["tags"]>[number] }) {
  const { t } = useTranslation();
  const styles: Record<string, string> = {
    v: "border-emerald-500/40 text-emerald-400",
    vg: "border-emerald-500/40 text-emerald-400",
    gf: "border-amber-500/40 text-amber-300",
    spicy: "border-red-500/40 text-red-400",
    signature: "border-accent/60 text-accent",
  };
  const icon =
    tag === "spicy" ? <Flame className="size-3" /> :
    tag === "signature" ? <Sparkles className="size-3" /> :
    <Leaf className="size-3" />;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase border rounded-full px-2 py-0.5",
        styles[tag],
      ].join(" ")}
    >
      {icon}
      {t(`menu.tags.${tag}`)}
    </span>
  );
}

function WineView({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <Header title={t("menu.wine.title")} lead={t("menu.wine.lead")} />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={winePdf.url}
          download="Amaya-Wein-Karte.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#E9A580] text-[#0D2517] hover:bg-[#f1b596] transition-colors px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          <Download className="size-4" />
          {lang === "de" ? "Wein-Karte als PDF" : "Wine list as PDF"}
        </a>
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {lang === "de" ? "Sommelier-Auswahl" : "Sommelier selection"}
        </span>
      </div>

      <div
        className="relative mt-12 overflow-hidden rounded-3xl border border-[#E9A580]/40 shadow-2xl"
        style={{ backgroundColor: "#F3E7D7", color: "#0D2517" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${junglePattern.url})`,
            backgroundRepeat: "repeat",
            backgroundSize: "420px",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="absolute inset-3 rounded-2xl border border-[#E9A580]/45 pointer-events-none" />

        <div className="relative px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              Amaya Restaurant & Bar
            </p>
            <h3
              className="mt-4 italic font-light text-4xl sm:text-5xl flex items-center justify-center gap-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              <Wine className="size-8" />
              Wein-Karte
            </h3>
            <div className="mx-auto mt-5 h-px w-24 bg-[#E9A580]/60" />
          </div>

          <div className="mt-14 space-y-14">
            {WINE_MENU.map((s) => (
              <WineSheetSection key={s.id} lang={lang} section={s} />
            ))}
          </div>

          <p className="mt-14 text-center text-[11px] text-[#0D2517]/60 italic">
            {lang === "de"
              ? "Alle Preise in Schweizer Franken inkl. 8.1% MWST · Jahrgangs- und Verfügbarkeitsänderungen vorbehalten."
              : "All prices in Swiss Francs incl. 8.1% VAT · Vintages and availability subject to change."}
          </p>
        </div>
      </div>
    </div>
  );
}

function WineSheetSection({ lang, section }: { lang: Lang; section: WineMenuSection }) {
  const hasGlass = section.items.some((i) => i.glass);
  return (
    <section>
      <div className="text-center">
        <h4
          className="italic font-light text-2xl sm:text-3xl"
          style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
        >
          {section.title[lang]}
        </h4>
        {section.subtitle && (
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#0D2517]/60">
            {section.subtitle[lang]}
          </p>
        )}
        <div className="mx-auto mt-3 mb-6 h-px w-12 bg-[#E9A580]/50" />
      </div>

      {hasGlass && (
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-x-8 pb-2 mb-3 border-b border-[#0D2517]/15 text-[10px] tracking-[0.25em] uppercase text-[#0D2517]/50">
          <span />
          <span className="text-right w-20">Glas</span>
          <span className="text-right w-24">Flasche</span>
        </div>
      )}

      <ul className="divide-y divide-[#0D2517]/10">
        {section.items.map((item, i) => (
          <WineSheetItem key={`${section.id}-${i}`} item={item} lang={lang} showGlassCol={hasGlass} />
        ))}
      </ul>
    </section>
  );
}

function WineSheetItem({
  item,
  lang,
  showGlassCol,
}: {
  item: WineItem;
  lang: Lang;
  showGlassCol: boolean;
}) {
  return (
    <li
      className={[
        "grid gap-x-6 gap-y-1 py-4 items-baseline",
        showGlassCol
          ? "grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto]"
          : "grid-cols-[1fr_auto]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <h5 className="uppercase tracking-[0.14em] text-sm sm:text-base font-semibold text-[#0D2517]">
          {item.name[lang]}
        </h5>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs sm:text-sm text-[#0D2517]/70 leading-snug">
          {item.desc && <span>{item.desc[lang]}</span>}
          {item.origin && <span className="italic text-[#E9A580]">{item.origin[lang]}</span>}
        </div>
      </div>
      {showGlassCol && (
        <div className="hidden sm:block text-right tabular-nums text-[#0D2517] w-20">
          {item.glass ? item.glass : <span className="text-[#0D2517]/25">—</span>}
        </div>
      )}
      <div className="text-right tabular-nums text-[#0D2517] font-semibold w-24">
        {item.bottle}
      </div>
    </li>
  );
}

function Header({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-4xl lg:text-5xl uppercase font-bold leading-[1]">{title}</h2>
      <p className="mt-5 text-muted-foreground leading-relaxed">{lead}</p>
    </div>
  );
}

/* ---------- Lunch Karte — editorial print-style ---------- */

function LunchView({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <Header title={t("menu.lunch.title")} lead={t("menu.lunch.lead")} />

      {/* Download CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={lunchPdf.url}
          download="Amaya-Lunch-Menu.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#E9A580] text-[#0D2517] hover:bg-[#f1b596] transition-colors px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          <Download className="size-4" />
          {lang === "de" ? "Lunch-Karte als PDF" : "Lunch menu as PDF"}
        </a>
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Mo – Fr · 11:30 – 14:00
        </span>
      </div>

      {/* Editorial paper sheet */}
      <div
        className="relative mt-12 overflow-hidden rounded-3xl border border-[#E9A580]/40 shadow-2xl"
        style={{ backgroundColor: "#F3E7D7", color: "#0D2517" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${junglePattern.url})`,
            backgroundRepeat: "repeat",
            backgroundSize: "420px",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-3 rounded-2xl border border-[#E9A580]/45 pointer-events-none"
        />

        <div className="relative px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              Amaya Restaurant & Bar
            </p>
            <h3
              className="mt-4 italic font-light text-4xl sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              Lunch Menu
            </h3>
            <div className="mx-auto mt-5 h-px w-24 bg-[#E9A580]/60" />
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-x-20">
            {LUNCH_MENU.map((section) => (
              <LunchSection key={section.id} section={section} lang={lang} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-16 pt-8 border-t border-[#0D2517]/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.25em] text-[#0D2517]/70">
            <span className="inline-flex items-center gap-2">
              <Leaf className="size-3.5 text-emerald-700" /> Vegetarian
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="size-3.5 text-emerald-600" /> Vegan
            </span>
            <span className="inline-flex items-center gap-2">
              <Flame className="size-3.5 text-red-600" /> Spicy
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-3.5 text-[#E9A580]" /> Signature
            </span>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#0D2517]/60 italic">
            {lang === "de"
              ? "Alle Preise in Schweizer Franken inkl. 8.1% MWST · Informationen zu Allergenen sind beim Service erhältlich."
              : "All prices in Swiss Francs incl. 8.1% VAT · Allergen information available on request."}
          </p>
        </div>
      </div>
    </div>
  );
}

function LunchSection({ section, lang }: { section: MenuSection; lang: Lang }) {
  const highlights = section.items.filter((i) => i.highlight);
  const regular = section.items.filter((i) => !i.highlight);
  return (
    <section>
      <h4
        className="text-center italic font-light text-2xl sm:text-3xl"
        style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
      >
        {section.title[lang]}
      </h4>
      <div className="mx-auto mt-3 mb-8 h-px w-12 bg-[#E9A580]/50" />

      <ul className="space-y-7">
        {regular.map((item, i) => (
          <LunchItem key={i} item={item} lang={lang} />
        ))}
      </ul>

      {highlights.length > 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#E9A580]/60 px-5 py-6 bg-[#0D2517]/[0.03]">
          <p className="text-center italic font-light text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}>
            {lang === "de" ? "Highlights" : "Highlights"}
          </p>
          <ul className="mt-5 space-y-6">
            {highlights.map((item, i) => (
              <LunchItem key={`h-${i}`} item={item} lang={lang} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function LunchItem({ item, lang }: { item: MenuItem; lang: Lang }) {
  return (
    <li className="text-center">
      {item.allergens && (
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#0D2517]/40">
          {item.allergens}
        </p>
      )}
      <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
        <h5 className="uppercase tracking-[0.18em] text-sm sm:text-base font-semibold text-[#0D2517]">
          {item.name[lang]}
        </h5>
        {item.tags?.includes("vg") && <Leaf className="size-3.5 text-emerald-600" />}
        {item.tags?.includes("v") && <Leaf className="size-3.5 text-emerald-700" />}
        {item.tags?.includes("spicy") && <Flame className="size-3.5 text-red-600" />}
        {item.tags?.includes("signature") && <Sparkles className="size-3.5 text-[#E9A580]" />}
      </div>
      {item.desc[lang] && (
        <p className="mt-1.5 text-sm text-[#0D2517]/70 leading-snug max-w-md mx-auto">
          {item.desc[lang]}
        </p>
      )}
      <p className="mt-2 tabular-nums text-[#0D2517] text-base">
        {item.price}
      </p>
    </li>
  );
}

/* ---------- Amaya Mesa — editorial print-style + sharing concept ---------- */

function MesaView({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <Header title={t("menu.amayaMesa.title")} lead={t("menu.amayaMesa.lead")} />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={mesaPdf.url}
          download="Amaya-Mesa-Menu.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#E9A580] text-[#0D2517] hover:bg-[#f1b596] transition-colors px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          <Download className="size-4" />
          {lang === "de" ? "Mesa-Karte als PDF" : "Mesa menu as PDF"}
        </a>
      </div>

      {/* Mesa Sharing concept */}
      <div
        className="relative mt-12 overflow-hidden rounded-3xl border border-[#E9A580]/50 shadow-2xl"
        style={{ backgroundColor: "#0D2517", color: "#F3E7D7" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${junglePattern.url})`,
            backgroundRepeat: "repeat",
            backgroundSize: "420px",
            opacity: 0.18,
            mixBlendMode: "screen",
          }}
        />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 px-6 py-12 sm:px-12 lg:px-16 lg:py-14">
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              {lang === "de" ? "Sharing-Erlebnis" : "Sharing experience"}
            </p>
            <h3
              className="mt-4 italic font-light text-4xl sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              Mesa AMAYA
            </h3>
            <p className="mt-5 text-[#F3E7D7]/85 leading-relaxed max-w-xl">
              {lang === "de"
                ? "Das perfekte Erlebnis für Gruppen ab 2 Personen (ab 11 Personen auf Vorbestellung). Teilen Sie besondere Momente und geniessen Sie ein Mesa AMAYA zusammengestelltes Sharing-Menu, das alle Sinne anspricht."
                : "The perfect experience for groups from 2 people (from 11 people by reservation). Share special moments and enjoy a Mesa AMAYA sharing menu that engages all the senses."}
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-6 text-sm">
              <MesaStep
                label={lang === "de" ? "Vorspeisen" : "Starters"}
                value={lang === "de" ? "1½ pro Person · max. 6 Sorten" : "1½ per person · max. 6 kinds"}
              />
              <MesaStep
                label={lang === "de" ? "Hauptgang" : "Main"}
                value={lang === "de" ? "1 zur Auswahl pro Person" : "1 of your choice p.p."}
              />
              <MesaStep
                label={lang === "de" ? "Dessert" : "Dessert"}
                value={lang === "de" ? "1 zur Auswahl pro Person" : "1 of your choice p.p."}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-[#E9A580]/40 bg-[#0D2517]/40 px-8 py-10">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              {lang === "de" ? "Preis pro Person" : "Price per person"}
            </p>
            <p
              className="mt-3 text-6xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              CHF 89
            </p>
            <p className="mt-2 text-xs text-[#F3E7D7]/60 italic">
              {lang === "de" ? "exklusive Getränke" : "drinks not included"}
            </p>
            <Link
              to="/reservation"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E9A580] text-[#0D2517] hover:bg-[#f1b596] transition-colors px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              {lang === "de" ? "Tisch reservieren" : "Book a table"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* À la carte editorial sheet */}
      <div
        className="relative mt-14 overflow-hidden rounded-3xl border border-[#E9A580]/40 shadow-2xl"
        style={{ backgroundColor: "#F3E7D7", color: "#0D2517" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${junglePattern.url})`,
            backgroundRepeat: "repeat",
            backgroundSize: "420px",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="absolute inset-3 rounded-2xl border border-[#E9A580]/45 pointer-events-none" />

        <div className="relative px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              Amaya Restaurant & Bar
            </p>
            <h3
              className="mt-4 italic font-light text-4xl sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              À la carte
            </h3>
            <div className="mx-auto mt-5 h-px w-24 bg-[#E9A580]/60" />
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-x-20">
            {AMAYA_MESA.map((section) => (
              <LunchSection key={section.id} section={section} lang={lang} />
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#0D2517]/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.25em] text-[#0D2517]/70">
            <span className="inline-flex items-center gap-2">
              <Leaf className="size-3.5 text-emerald-700" /> Vegetarian
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="size-3.5 text-emerald-600" /> Vegan
            </span>
            <span className="inline-flex items-center gap-2">
              <Flame className="size-3.5 text-red-600" /> Spicy
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-3.5 text-[#E9A580]" /> Signature
            </span>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#0D2517]/60 italic">
            {lang === "de"
              ? "Alle Preise in Schweizer Franken inkl. 8.1% MWST · Informationen zu Allergenen sind beim Service erhältlich."
              : "All prices in Swiss Francs incl. 8.1% VAT · Allergen information available on request."}
          </p>
        </div>
      </div>
    </div>
  );
}

function MesaStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E9A580]/30 px-4 py-4">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#E9A580]">{label}</p>
      <p className="mt-2 text-sm text-[#F3E7D7]/85 leading-snug">{value}</p>
    </div>
  );
}

/* ---------- Sushi Sharing — editorial sheet + Amaya Asian Fusion ---------- */

function SushiView({ lang }: { lang: Lang }) {
  const { t } = useTranslation();

  const fusionItems: { qty: string; name: string; desc?: string }[] = lang === "de"
    ? [
        { qty: "2 Stk.", name: "Lachs-Avocado Rolls", desc: "Avocado-Tatar & Tomaten-Chutney" },
        { qty: "2 Stk.", name: "Uramaki mit Feige & Nori", desc: "Getrocknetes Tomaten-Tatar & Federkohl" },
        { qty: "2 Stk.", name: "Spicy Tuna Maki" },
        { qty: "1 Stk.", name: "Flambierte Wagyu Nigiri", desc: "Geräucherte Paprika-Emulsion" },
        { qty: "1 Stk.", name: "Wagyu Rolls", desc: "Feine Reduktion" },
        { qty: "2 Stk.", name: "Gyozas Pulled Pork" },
        { qty: "2 Stk.", name: "Nikkei Thunfisch-Sashimi", desc: "Zitrusmarinade & pikante Akzente" },
        { qty: "3 Stk.", name: "Black Tiger Crevetten", desc: "Papaya-Salat, Ahornlack, Hibiskusgel & Petersilienemulsion" },
      ]
    : [
        { qty: "2 pcs", name: "Salmon-Avocado Rolls", desc: "Avocado tartare & tomato chutney" },
        { qty: "2 pcs", name: "Uramaki with Fig & Nori", desc: "Dried tomato tartare & kale" },
        { qty: "2 pcs", name: "Spicy Tuna Maki" },
        { qty: "1 pc", name: "Flambéed Wagyu Nigiri", desc: "Smoked pepper emulsion" },
        { qty: "1 pc", name: "Wagyu Rolls", desc: "Fine reduction" },
        { qty: "2 pcs", name: "Pulled Pork Gyoza" },
        { qty: "2 pcs", name: "Nikkei Tuna Sashimi", desc: "Citrus marinade & spicy accents" },
        { qty: "3 pcs", name: "Black Tiger Prawns", desc: "Papaya salad, maple glaze, hibiscus gel & parsley emulsion" },
      ];

  return (
    <div className="relative">
      <Header title={t("menu.sushiSharing.title")} lead={t("menu.sushiSharing.lead")} />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={sushiPdf.url}
          download="Amaya-Sushi-Menu.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#E9A580] text-[#0D2517] hover:bg-[#f1b596] transition-colors px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          <Download className="size-4" />
          {lang === "de" ? "Sushi-Karte als PDF" : "Sushi menu as PDF"}
        </a>
      </div>

      {/* Amaya Asian Fusion — sharing hero (dark) */}
      <div
        className="relative mt-12 overflow-hidden rounded-3xl border border-[#E9A580]/50 shadow-2xl"
        style={{ backgroundColor: "#0D2517", color: "#F3E7D7" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${junglePattern.url})`,
            backgroundRepeat: "repeat",
            backgroundSize: "420px",
            opacity: 0.18,
            mixBlendMode: "screen",
          }}
        />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 px-6 py-12 sm:px-12 lg:px-16 lg:py-14">
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              {lang === "de" ? "Sushi Sharing Experience" : "Sushi sharing experience"}
            </p>
            <h3
              className="mt-4 italic font-light text-4xl sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              Amaya Asian Fusion
            </h3>
            <p className="mt-5 text-[#F3E7D7]/85 leading-relaxed max-w-xl">
              {lang === "de"
                ? "Eine kuratierte Auswahl unserer Signature-Gerichte — Fusion aus Nikkei und asiatischen Einflüssen, perfekt zum Teilen als kulinarische Reise."
                : "A curated selection of our signature dishes — fusion of Nikkei and Asian influences, perfect to share as a culinary journey."}
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {fusionItems.map((it, i) => (
                <li key={i} className="flex gap-3 border-b border-[#E9A580]/15 pb-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#E9A580] pt-1 shrink-0 w-12">
                    {it.qty}
                  </span>
                  <div>
                    <p className="text-sm uppercase tracking-[0.15em] font-medium text-[#F3E7D7]">
                      {it.name}
                    </p>
                    {it.desc && (
                      <p className="mt-0.5 text-xs text-[#F3E7D7]/65 leading-snug">{it.desc}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-[#E9A580]/40 bg-[#0D2517]/40 px-8 py-10">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              {lang === "de" ? "15 Stück" : "15 pieces"}
            </p>
            <p
              className="mt-3 text-6xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              CHF 69
            </p>
            <p className="mt-2 text-xs text-[#F3E7D7]/60 italic">
              {lang === "de" ? "exklusive Getränke" : "drinks not included"}
            </p>
            <Link
              to="/reservation"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E9A580] text-[#0D2517] hover:bg-[#f1b596] transition-colors px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              {lang === "de" ? "Tisch reservieren" : "Book a table"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* À la carte sushi editorial sheet */}
      <div
        className="relative mt-14 overflow-hidden rounded-3xl border border-[#E9A580]/40 shadow-2xl"
        style={{ backgroundColor: "#F3E7D7", color: "#0D2517" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${junglePattern.url})`,
            backgroundRepeat: "repeat",
            backgroundSize: "420px",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="absolute inset-3 rounded-2xl border border-[#E9A580]/45 pointer-events-none" />

        <div className="relative px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#E9A580]">
              Amaya Restaurant & Bar
            </p>
            <h3
              className="mt-4 italic font-light text-4xl sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif", color: "#E9A580" }}
            >
              Sushi à la carte
            </h3>
            <div className="mx-auto mt-5 h-px w-24 bg-[#E9A580]/60" />
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-x-20">
            {SUSHI_SHARING.map((section) => (
              <LunchSection key={section.id} section={section} lang={lang} />
            ))}
          </div>

          <p className="mt-12 text-center text-[11px] text-[#0D2517]/60 italic">
            {lang === "de"
              ? "Alle Preise in Schweizer Franken inkl. 8.1% MWST · Informationen zu Allergenen sind beim Service erhältlich."
              : "All prices in Swiss Francs incl. 8.1% VAT · Allergen information available on request."}
          </p>
        </div>
      </div>
    </div>
  );
}
