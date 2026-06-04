import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RESTAURANT } from "@/lib/restaurant";

export function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";

  return (
    <footer className="bg-espresso text-cream mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-14 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.3em] uppercase text-cream/60">Amaya</p>
          <h3 className="font-display text-4xl mt-3 leading-tight">
            {lang === "de" ? "Indische Küche, Schweizer Eleganz." : "Indian cuisine, Swiss elegance."}
          </h3>
          <p className="mt-6 text-cream/70 max-w-md text-sm leading-relaxed">
            {lang === "de"
              ? "Wir freuen uns auf Ihren Besuch in Rothenburg. Reservieren Sie Ihren Tisch online oder telefonisch."
              : "We look forward to welcoming you in Rothenburg. Reserve your table online or by phone."}
          </p>
        </div>

        <div className="text-sm leading-relaxed">
          <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-3">{t("about.contact")}</p>
          <p>{RESTAURANT.street}</p>
          <p>{RESTAURANT.city}</p>
          <a href={`tel:${RESTAURANT.phoneRaw}`} className="block mt-3 hover:text-accent">{RESTAURANT.phone}</a>
          <a href={`mailto:${RESTAURANT.email}`} className="block hover:text-accent">{RESTAURANT.email}</a>
        </div>

        <div className="text-sm">
          <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-3">{t("about.hours")}</p>
          <ul className="space-y-1.5">
            {RESTAURANT.hours.map((h) => {
              const parts = [h.lunch, h.dinner].filter(Boolean).join(" · ");
              return (
                <li key={h.day} className="flex justify-between gap-4">
                  <span className="text-cream/70">{t(`days.${h.day}`)}</span>
                  <span>{parts || t("closed")}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} {RESTAURANT.company}. {t("footer.rights")}.</p>
          <Link to="/admin" className="hover:text-cream">{t("footer.admin")}</Link>
        </div>
      </div>
    </footer>
  );
}