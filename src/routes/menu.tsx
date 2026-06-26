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
      <section className="pt-40 pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("menu.kicker")}</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold">
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
            <SectionsView
              lang={lang}
              title={t("menu.lunch.title")}
              lead={t("menu.lunch.lead")}
              sections={LUNCH_MENU}
            />
          )}
          {tab === "amaya-mesa" && (
            <SectionsView
              lang={lang}
              title={t("menu.amayaMesa.title")}
              lead={t("menu.amayaMesa.lead")}
              sections={AMAYA_MESA}
            />
          )}
          {tab === "sushi-sharing" && (
            <SectionsView
              lang={lang}
              title={t("menu.sushiSharing.title")}
              lead={t("menu.sushiSharing.lead")}
              sections={SUSHI_SHARING}
            />
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
    <div>
      <Header title={t("menu.wine.title")} lead={t("menu.wine.lead")} />
      <div className="mt-16 space-y-20">
        {WINE_MENU.map((s) => (
          <WineSectionBlock key={s.id} lang={lang} section={s} />
        ))}
      </div>
    </div>
  );
}

function WineSectionBlock({ lang, section }: { lang: Lang; section: WineMenuSection }) {
  return (
    <section>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-16 mb-8">
        <div>
          <h2 className="font-display text-3xl lg:text-4xl uppercase font-bold leading-tight flex items-center gap-3">
            <Wine className="size-6 text-accent" />
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
          <WineItemRow key={`${section.id}-${i}`} item={item} lang={lang} />
        ))}
      </ul>
    </section>
  );
}

function WineItemRow({ item, lang }: { item: WineItem; lang: Lang }) {
  return (
    <li className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto] gap-6 py-6 items-baseline">
      <div className="min-w-0">
        <h3 className="font-display text-xl lg:text-2xl uppercase tracking-wide font-semibold">
          {item.name[lang]}
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {item.desc && <span>{item.desc[lang]}</span>}
          {item.origin && <span className="text-accent">{item.origin[lang]}</span>}
        </div>
      </div>
      {item.glass && (
        <div className="hidden lg:flex flex-col items-end min-w-[7rem]">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Glas</span>
          <span className="font-display text-xl tabular-nums text-accent">CHF {item.glass}</span>
        </div>
      )}
      <div className="flex flex-col items-end min-w-[7rem]">
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Flasche</span>
        <span className="font-display text-xl lg:text-2xl tabular-nums text-accent">CHF {item.bottle}</span>
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
