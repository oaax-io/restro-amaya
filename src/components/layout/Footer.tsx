import { useTranslation } from "react-i18next";
import { RESTAURANT } from "@/lib/restaurant";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Send, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/amaya-footer-logo.svg.asset.json";
import plantsImg from "@/assets/footer-plants.png";

export function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative mt-32 bg-onyx overflow-hidden">
      {/* Newsletter CTA */}
      <div className="relative border-y border-border/60 bg-gradient-to-b from-transparent via-accent/[0.04] to-transparent">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 py-16 lg:py-20 text-center">
          <p className="mono-label text-accent">/ Newsletter</p>
          <h3 className="font-display text-4xl lg:text-5xl mt-4 leading-[0.95] uppercase font-bold">
            {lang === "de" ? "Bleib im Dschungel." : "Stay in the jungle."}
          </h3>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {lang === "de"
              ? "Events, neue Karten und private Sessions — exklusive News direkt in dein Postfach."
              : "Events, new menus and private sessions — exclusive news straight to your inbox."}
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) { setSubscribed(true); setEmail(""); } }}
            className="mt-8 mx-auto max-w-md flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === "de" ? "Deine E-Mail" : "Your email"}
              className="flex-1 bg-background/40 border border-border rounded-full px-5 py-3 text-sm outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded-full px-6 py-3 text-sm font-medium uppercase tracking-wider"
            >
              {lang === "de" ? "Abonnieren" : "Subscribe"}
              <Send className="size-4" />
            </button>
          </form>
          {subscribed && (
            <p className="mt-4 text-sm text-accent">
              {lang === "de" ? "Danke! Willkommen im Amaya-Kreis." : "Thanks! Welcome to the Amaya circle."}
            </p>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        {/* Contact + Plants + Hours — top */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
          {/* Contact */}
          <div className="lg:col-span-5">
            <p className="mono-label text-accent mb-6">{t("about.contact")}</p>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-medium">{RESTAURANT.street}</p>
                <p className="text-lg font-medium">{RESTAURANT.city}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {lang === "de" ? "Mit Lift im 5. OG" : "5th floor, elevator access"}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${RESTAURANT.street}, ${RESTAURANT.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm hover:text-accent transition-colors"
              >
                <span className="inline-flex items-center justify-center size-10 rounded-full border border-border">
                  <MapPin className="size-4" />
                </span>
                {lang === "de" ? "Auf Google Maps anzeigen" : "View on Google Maps"}
              </a>
              <a
                href={`tel:${RESTAURANT.phoneRaw}`}
                className="inline-flex items-center gap-3 text-2xl font-display font-bold uppercase tracking-wide hover:text-accent transition-colors"
              >
                <span className="inline-flex items-center justify-center size-10 rounded-full border border-border">
                  <Phone className="size-4" />
                </span>
                {RESTAURANT.phone}
              </a>
              <a
                href={`mailto:${RESTAURANT.email}`}
                className="inline-flex items-center gap-3 text-base hover:text-accent transition-colors"
              >
                <span className="inline-flex items-center justify-center size-10 rounded-full border border-border">
                  <Mail className="size-4" />
                </span>
                {RESTAURANT.email}
              </a>
            </div>
          </div>

          {/* Plants — decorative divider */}
          <div className="hidden lg:flex lg:col-span-2 justify-center self-stretch -mb-20 relative z-10 pointer-events-none">
            <img
              src={plantsImg}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={512}
              height={1024}
              className="h-full w-auto object-contain object-bottom opacity-90 pointer-events-none select-none"
            />
          </div>

          {/* Hours */}
          <div className="text-sm sm:col-span-2 lg:col-span-5">
            <p className="mono-label text-accent mb-4">{t("about.hours")}</p>
            <ul className="divide-y divide-border/60 border-y border-border/60">
              {RESTAURANT.hours.map((h) => {
                const dayLabel = t(`days.${h.day}`, { defaultValue: h.day });
                const closed = lang === "de" ? "Geschlossen" : "Closed";
                const times = [h.lunch, h.dinner].filter(Boolean).join(" · ") || closed;
                return (
                  <li key={h.day} className="flex items-center justify-between gap-4 py-2.5">
                    <span className="text-muted-foreground uppercase tracking-wider text-xs">{dayLabel}</span>
                    <span className="text-right tabular-nums">{times}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Logo + claim + social — bottom, centered */}
        <div className="mt-20 pt-12 border-t border-border/60 flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="Amaya" className="h-16 w-auto" />
          <h3 className="font-display text-3xl mt-6 leading-[0.95] uppercase font-bold whitespace-pre-line">
            {lang === "de" ? "Vier Welten,\nein Ort." : "Four worlds,\none place."}
          </h3>
          <p className="mt-5 text-muted-foreground max-w-sm leading-relaxed text-sm">
            {lang === "de"
              ? "Restaurant · Cigar Lounge · Bar · Events. Mitten in Rothenburg, Luzern."
              : "Restaurant · Cigar Lounge · Bar · Events. Right in Rothenburg, Lucerne."}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
              className="size-10 inline-flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-colors">
              <Instagram className="size-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
              className="size-10 inline-flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-colors">
              <Facebook className="size-4" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"
              className="size-10 inline-flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.17c.27 0 .53.04.78.12V9.69a5.7 5.7 0 0 0-.78-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.29 1.37V7.29a4.28 4.28 0 0 1-3.24-1.47Z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"
              className="size-10 inline-flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-colors">
              <Youtube className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 mono-label text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {RESTAURANT.company}. {t("footer.rights")}.</p>
          <ul className="flex items-center gap-6">
            <li><Link to="/impressum" className="hover:text-accent transition-colors">{lang === "de" ? "Impressum" : "Imprint"}</Link></li>
            <li><Link to="/datenschutz" className="hover:text-accent transition-colors">{lang === "de" ? "Datenschutz" : "Privacy"}</Link></li>
            <li><Link to="/agb" className="hover:text-accent transition-colors">{lang === "de" ? "AGB" : "Terms"}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
