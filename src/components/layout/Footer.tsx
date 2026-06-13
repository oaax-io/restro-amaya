import { useTranslation } from "react-i18next";
import { RESTAURANT } from "@/lib/restaurant";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Send } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/amaya-footer-logo.svg.asset.json";

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
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-14 lg:grid-cols-12">
        {/* Logo + claim */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
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

        {/* Contact */}
        <div className="lg:col-span-3 text-sm leading-relaxed">
          <p className="mono-label text-accent mb-4">{t("about.contact")}</p>
          <p>{RESTAURANT.street}</p>
          <p>{RESTAURANT.city}</p>
          <a href={`tel:${RESTAURANT.phoneRaw}`} className="block mt-4 hover:text-accent transition-colors">{RESTAURANT.phone}</a>
          <a href={`mailto:${RESTAURANT.email}`} className="block hover:text-accent transition-colors">{RESTAURANT.email}</a>
        </div>

        {/* Navigation */}
        <div className="lg:col-span-2 text-sm">
          <p className="mono-label text-accent mb-4">Navigation</p>
          <ul className="space-y-2">
            <li><Link to="/menu" className="hover:text-accent transition-colors">{t("nav.menu")}</Link></li>
            <li><Link to="/lounge" className="hover:text-accent transition-colors">{t("nav.lounge")}</Link></li>
            <li><Link to="/events" className="hover:text-accent transition-colors">{t("nav.events")}</Link></li>
            <li><Link to="/gallery" className="hover:text-accent transition-colors">{t("nav.gallery")}</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">{t("nav.about")}</Link></li>
            <li><Link to="/reservation" className="hover:text-accent transition-colors">{t("nav.reserve")}</Link></li>
          </ul>
        </div>

        {/* Hours */}
        <div className="lg:col-span-3 text-sm">
          <p className="mono-label text-accent mb-4">{t("about.hours")}</p>
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