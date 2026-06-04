import { useTranslation } from "react-i18next";
import { RESTAURANT } from "@/lib/restaurant";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";

  return (
    <footer className="relative border-t border-border mt-32 bg-onyx">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-14 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="mono-label text-accent">/ Amaya</p>
          <h3 className="font-display text-5xl mt-4 leading-[0.95] uppercase font-bold">
            {lang === "de" ? "Vier Welten,\nein Ort." : "Four worlds,\none place."}
          </h3>
          <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
            {lang === "de"
              ? "Restaurant · Cigar Lounge · Bar · Events. Mitten in Rothenburg, Luzern."
              : "Restaurant · Cigar Lounge · Bar · Events. Right in Rothenburg, Lucerne."}
          </p>
        </div>

        <div className="text-sm leading-relaxed">
          <p className="mono-label text-muted-foreground mb-4">{t("about.contact")}</p>
          <p>{RESTAURANT.street}</p>
          <p>{RESTAURANT.city}</p>
          <a href={`tel:${RESTAURANT.phoneRaw}`} className="block mt-4 hover:text-accent transition-colors">{RESTAURANT.phone}</a>
          <a href={`mailto:${RESTAURANT.email}`} className="block hover:text-accent transition-colors">{RESTAURANT.email}</a>
        </div>

        <div className="text-sm">
          <p className="mono-label text-muted-foreground mb-4">{t("about.hours")}</p>
          <ul className="space-y-1.5">
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
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 mono-label text-muted-foreground">
          <p>© {new Date().getFullYear()} {RESTAURANT.company}. {t("footer.rights")}.</p>
          <Link to="/admin" className="hover:text-accent transition-colors">{t("footer.admin")}</Link>
        </div>
      </div>
    </footer>
  );
}