import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

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
  const [lightbox, setLightbox] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["public","gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const images = q.data ?? [];

  return (
    <SiteLayout>
      <section className="pt-32 lg:pt-40 pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("gallery.kicker")}</p>
          <h1 className="font-display text-6xl lg:text-7xl mt-6 leading-[1.0]">{t("gallery.title")}.</h1>

          {images.length === 0 ? (
            <p className="mt-16 text-muted-foreground">{t("menu.empty")}</p>
          ) : (
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {images.map((img) => (
                <button key={img.id} onClick={() => setLightbox(img.image_url)}
                  className="group relative overflow-hidden bg-card aspect-[4/5]">
                  <img src={img.image_url} alt={(lang === "de" ? img.caption_de : img.caption_en) ?? ""}
                    loading="lazy" className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white p-2" onClick={() => setLightbox(null)} aria-label="Schließen"><X size={28} /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </SiteLayout>
  );
}