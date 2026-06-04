import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RESTAURANT } from "@/lib/restaurant";

export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/menu", label: t("nav.menu") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/about", label: t("nav.about") },
    { to: "/jobs", label: t("nav.jobs") },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight">
          {RESTAURANT.name.split(" ")[0]}
          <span className="italic-accent text-muted-foreground text-base ml-2">restaurant</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10 text-sm tracking-[0.18em] uppercase">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <Link
            to="/reservation"
            className="hidden sm:inline-flex items-center px-5 py-2.5 text-xs tracking-[0.2em] uppercase bg-foreground text-background hover:bg-accent transition-colors"
          >
            {t("nav.reserve")}
          </Link>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className="block w-6 h-px bg-current mb-1.5" />
            <span className="block w-6 h-px bg-current mb-1.5" />
            <span className="block w-4 h-px bg-current ml-auto" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-6 py-6 flex flex-col gap-4 text-sm tracking-[0.18em] uppercase">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-1">
                {l.label}
              </Link>
            ))}
            <Link
              to="/reservation"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center py-3 bg-foreground text-background"
            >
              {t("nav.reserve")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}