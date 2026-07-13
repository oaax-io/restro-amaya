import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

  const q = useQuery({
    queryKey: ["public","gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const images = q.data ?? [];
  const highlights = images.slice(0, Math.min(5, images.length));

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
      <section className="pt-32 lg:pt-40 pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("gallery.kicker")}</p>
          <h1 className="font-display text-6xl lg:text-7xl mt-6 leading-[1.0]">{t("gallery.title")}.</h1>

          {images.length === 0 ? (
            <p className="mt-16 text-muted-foreground">{t("menu.empty")}</p>
          ) : (
            <>
            {highlights.length > 0 && (
              <div className="mt-14 relative overflow-hidden rounded-lg bg-card aspect-[16/9] md:aspect-[21/9]">
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
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <button key={img.id} onClick={() => setLightboxIdx(idx)}
                  className="group relative overflow-hidden bg-card aspect-[4/5]">
                  <img src={img.image_url} alt={(lang === "de" ? img.caption_de : img.caption_en) ?? ""}
                    loading="lazy" className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </button>
              ))}
            </div>
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