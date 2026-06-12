import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ReservationCard } from "@/components/site/ReservationCard";
import { RESTAURANT } from "@/lib/restaurant";
import jungleTex from "@/assets/jungle-texture.jpg";
import slideRestaurant from "@/assets/slide-restaurant.jpg";
import slideLounge from "@/assets/slide-lounge.jpg";
import slideBar from "@/assets/slide-bar.jpg";
import slideEvents from "@/assets/slide-events.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amaya — Restaurant · Cigar Lounge · Events · Rothenburg LU" },
      { name: "description", content: "Restaurant, Cigar Lounge, Bar und Events unter einem Dach. Modernste Küche und Nightlife im Jungle-Ambiente — mitten in Rothenburg, Luzern." },
      { property: "og:title", content: "Amaya Restaurant & Bar" },
      { property: "og:description", content: "Restaurant · Cigar Lounge · Bar · Events — im Jungle-Ambiente." },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();

  const concepts = [
    { key: "restaurant", img: slideRestaurant, label: "01" },
    { key: "lounge", img: slideLounge, label: "02" },
    { key: "bar", img: slideBar, label: "03" },
    { key: "events", img: slideEvents, label: "04" },
  ] as const;

  return (
    <SiteLayout>
      <HeroSlider
        images={[slideRestaurant, slideLounge, slideBar, slideEvents]}
        eyebrow="Restaurant · Cigar Lounge · Bar · Events"
        title="Amaya — Eine Nacht, vier Welten."
        subtitle="Modernste Küche, Cigar Lounge, Cocktailbar und Events unter einem Dach. Mitten in Rothenburg, Luzern."
      >
        <ReservationCard variant="overlay" />
      </HeroSlider>

      {/* STORY / INTRO */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <p className="mono-label text-gold">— {t("story.kicker")}</p>
            <h2 className="display-serif text-6xl lg:text-8xl mt-6 text-gradient-gold">
              {t("story.title")}
            </h2>
            <div className="mt-6 h-px w-32 hairline-gold" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 lg:pl-16"
          >
            <p className="text-xl leading-relaxed text-foreground/80 max-w-2xl">
              {t("story.body")}
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { n: "04", l: "Konzepte" },
                { n: "120", l: "Sitzplätze" },
                { n: "03:00", l: "Open until" },
              ].map((s) => (
                <div key={s.l} className="border-l border-gold/40 pl-4">
                  <p className="display-serif text-4xl lg:text-5xl text-gradient-gold">{s.n}</p>
                  <p className="mono-label text-muted-foreground mt-2">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONCEPTS GRID */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <p className="mono-label text-gold">— Konzepte —</p>
              <h2 className="display-serif text-5xl lg:text-7xl mt-4 text-gradient-gold">Vier Räume.<br/>Eine Nacht.</h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Von Dinner zu Drinks, von Lounge zu Dancefloor — bei uns geht der Abend nahtlos weiter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {concepts.map((c, i) => {
              const d = t(`hero.slides.${c.key}`, { returnObjects: true }) as { tag: string; title: string; sub: string };
              return (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className={`group relative overflow-hidden aspect-[4/5] lg:aspect-[5/6] ${i % 2 === 1 ? "md:translate-y-12" : ""}`}
                >
                  <img
                    src={c.img}
                    alt={d.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
                  <div className="absolute inset-0 ring-0 ring-gold/0 group-hover:ring-1 group-hover:ring-gold/70 transition-all duration-500" />
                  <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-between">
                    <p className="mono-label text-gold">— {d.tag}</p>
                    <div>
                      <h3 className="display-serif text-5xl lg:text-7xl text-bone">{d.title}</h3>
                      <p className="mt-4 text-foreground/70 max-w-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        {d.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section className="relative py-24 lg:py-32 border-t border-border bg-onyx">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <p className="mono-label text-gold">— {t("about.hours")}</p>
            <ul className="mt-6 space-y-2">
              {RESTAURANT.hours.map((h) => {
                const parts = [h.lunch, h.dinner].filter(Boolean).join(" · ");
                return (
                  <li key={h.day} className="flex justify-between gap-4 border-b border-border py-2">
                    <span className="text-muted-foreground">{t(`days.${h.day}`)}</span>
                    <span className="text-foreground">{parts || <span className="text-muted-foreground">{t("closed")}</span>}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className="mono-label text-gold">— {t("about.address")}</p>
            <p className="mt-6 display-serif text-4xl leading-snug">
              {RESTAURANT.street}<br />{RESTAURANT.city}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT.street + " " + RESTAURANT.city)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block mono-label text-gold hover:underline"
            >
              → Google Maps
            </a>
          </div>
          <div>
            <p className="mono-label text-gold">— {t("about.contact")}</p>
            <a href={`tel:${RESTAURANT.phoneRaw}`} className="mt-6 block display-serif text-4xl hover:text-gold transition-colors">{RESTAURANT.phone}</a>
            <a href={`mailto:${RESTAURANT.email}`} className="block text-muted-foreground mt-2 hover:text-gold transition-colors">{RESTAURANT.email}</a>
            <a href="#reserve" className="btn-luxury mt-6">
              {t("nav.reserve")}
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
