import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ReservationCard } from "@/components/site/ReservationCard";

import jungleTex from "@/assets/jungle-texture.jpg";
import slideRestaurant from "@/assets/slide-restaurant.jpg";
import slideLounge from "@/assets/slide-lounge.jpg";
import slideBar from "@/assets/slide-bar.jpg";
import slideEvents from "@/assets/slide-events.jpg";
import jungleVideo from "@/assets/jungle-loop.mp4.asset.json";
import jungleAudio from "@/assets/jungle-ambience.mp3.asset.json";
import amayaFirst from "@/assets/amaya-first.jpg.asset.json";
import amayaSecond from "@/assets/amaya-second.jpg.asset.json";
import amayaThird from "@/assets/amaya-third.jpg.asset.json";
import amayaFourth from "@/assets/amaya-fourth.jpg.asset.json";
import heroSlideRestaurant from "@/assets/LUPSTUDIOS-8-2.png.asset.json";
import amayaEight from "@/assets/amaya-eight.jpg.asset.json";
import amayaNine from "@/assets/amaya-nine.jpg.asset.json";
import restoSlide1 from "@/assets/resto-slide-1.jpg.asset.json";
import restoSlide2 from "@/assets/resto-slide-2.jpg.asset.json";
import restoSlide3 from "@/assets/resto-slide-3.jpg.asset.json";
import eventSlide1 from "@/assets/LuzPalokaj_Photography--20.jpg.asset.json";
import eventSlide2 from "@/assets/LuzPalokaj_Photography-09855.jpg.asset.json";
import eventSlide3 from "@/assets/LUPSTUDIOS-19.jpg.asset.json";
import eventSlide4 from "@/assets/LuzPalokaj_Photography--21.jpg.asset.json";
import eventSlide5 from "@/assets/LuzPalokaj_Photography-07561.jpg.asset.json";
import eventSlide6 from "@/assets/LuzPalokaj_Photography-07520.jpg.asset.json";
import restoSlide4 from "@/assets/LUP03221.jpg.asset.json";
import restoSlide5 from "@/assets/LUP02890.jpg.asset.json";
import restoSlide6 from "@/assets/LUP02999.jpg.asset.json";
import loungeSlide1 from "@/assets/LuzPalokaj_Photography--14.jpg.asset.json";
import loungeSlide2 from "@/assets/LuzPalokaj_Photography--36.jpg.asset.json";
import loungeSlide3 from "@/assets/LuzPalokaj_Photography--34.jpg.asset.json";
import loungeSlide4 from "@/assets/LuzPalokaj_Photography--35.jpg.asset.json";
import barSlide1 from "@/assets/LuzPalokaj_Photography--33.jpg.asset.json";
import barSlide2 from "@/assets/LUP06271-Verbessert-RR.jpg.asset.json";
import barSlide3 from "@/assets/DSC06702-Verbessert-RR.jpg.asset.json";
import barSlide4 from "@/assets/DSC06674-Verbessert-RR.jpg.asset.json";
import barSlide5 from "@/assets/DSC06639-Verbessert-RR.jpg.asset.json";
import barSlide6 from "@/assets/LUPSTUDIOS-11.jpg.asset.json";

function ConceptImages({ images, alt }: { images: readonly string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);
  return (
    <>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1400ms] group-hover:scale-110"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
    </>
  );
}

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

  const { data: showReservation = true } = useQuery({
    queryKey: ["site_settings", "show_hero_reservation_card"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "show_hero_reservation_card")
        .maybeSingle();
      return data?.value !== false;
    },
  });

  const concepts = [
    { key: "restaurant", img: restoSlide1.url, images: [restoSlide1.url, restoSlide2.url, restoSlide3.url, restoSlide4.url, restoSlide5.url, restoSlide6.url], label: "01" },
    { key: "lounge", img: loungeSlide1.url, images: [loungeSlide1.url, loungeSlide2.url, loungeSlide3.url, loungeSlide4.url], label: "02" },
    { key: "bar", img: barSlide1.url, images: [barSlide1.url, barSlide2.url, barSlide3.url, barSlide4.url, barSlide5.url, barSlide6.url], label: "03" },
    { key: "events", img: eventSlide1.url, images: [eventSlide1.url, eventSlide2.url, eventSlide3.url, eventSlide4.url, eventSlide5.url, eventSlide6.url], label: "04" },
  ] as const;

  const heroSlides = [
    {
      image: amayaNine.url,
      eyebrow: "00 — Welcome to Amaya",
      title: "Mitten im Dschungel.",
      subtitle: "Lebendes Blätterdach, warmes Licht, Fischgrät-Parkett — eine grüne Oase mitten in Rothenburg.",
    },
    {
      image: heroSlideRestaurant.url,
      eyebrow: "01 — Restaurant",
      title: "Wild gewachsene Küche.",
      subtitle: "Modernste Küche unter handgeflochtenen Lampen und dichtem Blätterhimmel — kompromisslos und aromenstark.",
    },
    {
      image: amayaThird.url,
      eyebrow: "02 — Cigar Lounge",
      title: "Rauch & Samt.",
      subtitle: "Gedämpftes Licht, samtige Sessel und gereifte Spirituosen — ein Refugium für Kenner.",
    },
    {
      image: amayaEight.url,
      eyebrow: "03 — Bar",
      title: "Liquid Jungle.",
      subtitle: "Signature Cocktails vor lebender Pflanzenwand — handcrafted hinter der Amaya-Bar.",
    },
    {
      image: amayaFirst.url,
      eyebrow: "04 — Signature Drinks",
      title: "Botanische Alchemie.",
      subtitle: "Hand-gravierte Eiswürfel, Rosmarinrauch und seltene Spirits — jedes Glas ein kleines Ritual.",
    },
    {
      image: amayaSecond.url,
      eyebrow: "05 — Bar Garden",
      title: "Grüner Aperitivo.",
      subtitle: "Frisch gepresst, botanisch infundiert, serviert vor dichtem Blätterwerk.",
    },
    {
      image: amayaFourth.url,
      eyebrow: "06 — Events & Nights",
      title: "Nächte ohne Regeln.",
      subtitle: "Private Events, DJ-Nights, Geburtstage — wir verwandeln den Raum in deine Bühne.",
    },
  ];

  return (
    <SiteLayout>
      <HeroSlider
        slides={heroSlides}
        videoSrc={jungleVideo.url}
        audioSrc={jungleAudio.url}
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
              const imgs = c.images as readonly string[];
              return (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className={`group relative overflow-hidden aspect-[4/5] lg:aspect-[5/6] ${i % 2 === 1 ? "md:translate-y-12" : ""}`}
                >
                  <ConceptImages images={imgs} alt={d.title} />
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

    </SiteLayout>
  );
}
