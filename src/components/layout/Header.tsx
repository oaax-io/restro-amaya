import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
    { to: "/", label: t("nav.home") },
    { to: "/menu", label: t("nav.menu") },
    { to: "/about", label: t("nav.lounge") },
    { to: "/about", label: t("nav.events") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/jobs", label: t("nav.jobs") },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_15px_var(--color-accent)] group-hover:scale-150 transition-transform" />
          <span className="font-display text-2xl font-bold tracking-tighter uppercase">
            Amaya
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 mono-label">
          {links.map((l, i) => (
            <Link
              key={`${l.to}-${i}`}
              to={l.to}
              className="text-foreground/70 hover:text-accent transition-colors relative"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          <a
            href="#reserve"
            className="hidden sm:inline-flex items-center px-5 py-2.5 mono-label bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            {t("nav.reserve")}
          </a>
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
          <div className="px-6 py-6 flex flex-col gap-4 mono-label">
            {links.map((l, i) => (
              <Link key={`${l.to}-${i}`} to={l.to} onClick={() => setOpen(false)} className="py-1">
                {l.label}
              </Link>
            ))}
            <a
              href="#reserve"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center py-3 bg-accent text-accent-foreground"
            >
              {t("nav.reserve")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}