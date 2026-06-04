import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RESTAURANT } from "@/lib/restaurant";
import heroImg from "@/assets/hero.jpg";
import interiorImg from "@/assets/interior.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amaya Restaurant & Bar — Indische Küche in Rothenburg LU" },
      { name: "description", content: "Authentisch indische Küche mit Schweizer Eleganz. Reservieren Sie Ihren Tisch im Amaya Restaurant & Bar in Rothenburg, Luzern." },
      { property: "og:title", content: "Amaya Restaurant & Bar" },
      { property: "og:description", content: "Indische Küche mit Schweizer Eleganz — im Herzen von Luzern." },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/30 to-espresso/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-10 pb-20 lg:pb-28 text-cream">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase text-cream/80"
          >
            {t("hero.kicker")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="editorial-hero text-[12vw] lg:text-[7.5rem] max-w-5xl mt-6"
          >
            {t("hero.title").split(" ").slice(0, -2).join(" ")}{" "}
            <span className="italic-accent text-accent">
              {t("hero.title").split(" ").slice(-2).join(" ")}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-xl text-lg text-cream/85 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/reservation"
              className="inline-flex items-center px-7 py-4 text-xs tracking-[0.3em] uppercase bg-cream text-espresso hover:bg-accent hover:text-cream transition-colors"
            >
              {t("hero.cta")}
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center px-7 py-4 text-xs tracking-[0.3em] uppercase border border-cream/40 text-cream hover:bg-cream hover:text-espresso transition-colors"
            >
              {t("hero.secondary")}
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-6 right-6 lg:right-10 text-cream/60 text-[10px] tracking-[0.3em] uppercase rotate-90 origin-bottom-right hidden md:block">
          scroll
        </div>
      </section>

      {/* STORY */}
      <section className="py-28 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <img src={interiorImg} alt="Amaya interior" className="w-full aspect-[4/5] object-cover" loading="lazy" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 lg:pl-10"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-clay">— {t("story.kicker")}</p>
            <h2 className="font-display text-5xl lg:text-7xl mt-6 leading-[1.05]">
              {t("story.title").split(".")[0]}.
              <span className="italic-accent text-accent block mt-2">
                {t("story.title").split(".")[1] || ""}
              </span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground max-w-xl">
              {t("story.body")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOURS / VISIT */}
      <section className="py-24 bg-sand/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-clay">{t("about.hours")}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {RESTAURANT.hours.map((h) => {
                const parts = [h.lunch, h.dinner].filter(Boolean).join(" · ");
                return (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{t(`days.${h.day}`)}</span>
                    <span>{parts || t("closed")}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-clay">{t("about.address")}</p>
            <p className="mt-6 font-display text-2xl leading-snug">
              {RESTAURANT.street}<br />{RESTAURANT.city}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-clay">{t("about.contact")}</p>
            <a href={`tel:${RESTAURANT.phoneRaw}`} className="mt-6 block font-display text-2xl hover:text-accent">{RESTAURANT.phone}</a>
            <a href={`mailto:${RESTAURANT.email}`} className="block text-sm text-muted-foreground mt-2 hover:text-accent">{RESTAURANT.email}</a>
            <Link to="/reservation" className="mt-6 inline-flex items-center px-6 py-3 text-xs tracking-[0.3em] uppercase bg-foreground text-background hover:bg-accent transition-colors">
              {t("nav.reserve")}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
