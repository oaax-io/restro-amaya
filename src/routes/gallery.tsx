import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import jungleTex from "@/assets/jungle-texture.jpg";

type CatKey = "all" | "kulinarisches" | "restaurant" | "anlaesse";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerie — Amaya Restaurant & Bar" },
      { name: "description", content: "Eindrücke aus dem Amaya Restaurant & Bar in Rothenburg." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [cat, setCat] = useState<CatKey>("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cat]);

  const q = useQuery({
    queryKey: ["public","gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const allImages = (q.data ?? []) as Array<{
    id: string; image_url: string; sort_order: number;
    caption_de: string | null; caption_en: string | null;
    category?: string | null;
  }>;
  const images = useMemo(
    () => cat === "all" ? allImages : allImages.filter((i) => (i.category ?? "restaurant") === cat),
    [allImages, cat]
  );
  const highlights = allImages.slice(0, Math.min(5, allImages.length));

  const tabs: { key: CatKey; label: string }[] = [
    { key: "all", label: t("gallery.categories.all") },
    { key: "kulinarisches", label: t("gallery.categories.kulinarisches") },
    { key: "restaurant", label: t("gallery.categories.restaurant") },
    { key: "anlaesse", label: t("gallery.categories.anlaesse") },
  ];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(
    () => setLightboxIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIdx((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, closeLightbox, prev, next]);

  useEffect(() => {
    if (highlights.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % highlights.length), 5500);
    return () => clearInterval(t);
  }, [highlights.length]);

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
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("gallery.kicker")}</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold text-gradient-gold">
            {t("gallery.title")}.
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            {t("gallery.intro")}
          </p>
        </div>
      </section>

      {/* Category tabs (sticky) — same pill style as menu */}
      <div className="sticky top-20 z-30 py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="sm:hidden">
            <div className="relative mx-auto max-w-xs rounded-full bg-[#0D2517]/80 backdrop-blur-xl border border-[#E9A580]/30 shadow-lg shadow-black/30">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as CatKey)}
                aria-label="Kategorie auswählen"
                className="appearance-none w-full bg-transparent text-[#E9A580] font-semibold uppercase tracking-[0.2em] text-sm px-6 py-3 pr-12 focus:outline-none"
              >
                {tabs.map((tb) => (
                  <option key={tb.key} value={tb.key} className="bg-[#0D2517] text-[#F3E7D7]">{tb.label}</option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 size-4 text-[#E9A580]" fill="currentColor">
                <path d="M5.5 7.5L10 12l4.5-4.5z" />
              </svg>
            </div>
          </div>
          <div className="hidden sm:flex justify-center">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar rounded-full bg-[#0D2517]/70 backdrop-blur-xl border border-[#E9A580]/20 px-2 py-2 shadow-lg shadow-black/20">
              {tabs.map((tb) => {
                const active = cat === tb.key;
                return (
                  <button
                    key={tb.key}
                    onClick={() => setCat(tb.key)}
                    className={[
                      "relative rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm uppercase tracking-[0.2em] whitespace-nowrap transition-all",
                      active
                        ? "bg-[#E9A580] text-[#0D2517] font-semibold shadow-md"
                        : "text-[#F3E7D7]/80 hover:text-[#F3E7D7] hover:bg-[#E9A580]/10",
                    ].join(" ")}
                  >
                    {tb.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {allImages.length === 0 ? (
            <p className="text-muted-foreground">{t("menu.empty")}</p>
          ) : (
            <>
            {highlights.length > 0 && cat === "all" && (
              <div className="relative overflow-hidden rounded-lg bg-card aspect-[16/9] md:aspect-[21/9]">
                {highlights.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightboxIdx(images.findIndex((x) => x.id === img.id))}
                    className="absolute inset-0 transition-opacity duration-[1200ms]"
                    style={{ opacity: i === heroIdx ? 1 : 0, pointerEvents: i === heroIdx ? "auto" : "none" }}
                    aria-hidden={i !== heroIdx}
                  >
                    <img
                      src={img.image_url}
                      alt={(lang === "de" ? img.caption_de : img.caption_en) ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {(img.caption_de || img.caption_en) && (
                      <div className="absolute bottom-6 left-6 right-6 text-left text-white/95 text-sm md:text-base">
                        {(lang === "de" ? img.caption_de : img.caption_en) ?? ""}
                      </div>
                    )}
                  </button>
                ))}
                {highlights.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setHeroIdx((i) => (i - 1 + highlights.length) % highlights.length)}
                      aria-label="Vorheriges Highlight"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 inline-flex items-center justify-center"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroIdx((i) => (i + 1) % highlights.length)}
                      aria-label="Nächstes Highlight"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 inline-flex items-center justify-center"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {highlights.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setHeroIdx(i)}
                          aria-label={`Highlight ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all ${i === heroIdx ? "w-6 bg-accent" : "w-2 bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className={`${highlights.length > 0 && cat === "all" ? "mt-10" : ""} grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4`}>
              {images.map((img, idx) => (
                <button key={img.id} onClick={() => setLightboxIdx(idx)}
                  className="group relative overflow-hidden bg-card aspect-[4/5]">
                  <img src={img.image_url} alt={(lang === "de" ? img.caption_de : img.caption_en) ?? ""}
                    loading="lazy" className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </button>
              ))}
            </div>
            {images.length === 0 && (
              <p className="mt-12 text-center text-muted-foreground">{t("menu.empty")}</p>
            )}
            </>
          )}
        </div>
      </section>

      {lightboxIdx !== null && images[lightboxIdx] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white p-2 hover:text-accent" onClick={closeLightbox} aria-label="Schließen">
            <X size={28} />
          </button>
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Nächstes Bild"
          >
            <ChevronRight size={28} />
          </button>
          <figure className="max-w-full max-h-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIdx].image_url}
              alt={(lang === "de" ? images[lightboxIdx].caption_de : images[lightboxIdx].caption_en) ?? ""}
              className="max-w-[92vw] max-h-[80vh] object-contain"
            />
            <figcaption className="text-white/80 text-sm text-center">
              <span className="opacity-70 mr-3">{lightboxIdx + 1} / {images.length}</span>
              {(lang === "de" ? images[lightboxIdx].caption_de : images[lightboxIdx].caption_en) ?? ""}
            </figcaption>
          </figure>
        </div>
      )}
    </SiteLayout>
  );
}