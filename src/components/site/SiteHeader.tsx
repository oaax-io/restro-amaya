import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Instagram, Facebook, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import logoAsset from "@/assets/amaya-logo.svg.asset.json";

export function SiteHeader() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t("nav.home"), exact: true },
    { to: "/menu", label: t("nav.menu") },
    { to: "/lounge", label: t("nav.lounge") },
    { to: "/events", label: t("nav.events") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/jobs", label: t("nav.jobs") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-gold/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 flex items-center justify-between gap-6 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Amaya"
            className={`w-auto transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm tracking-widest uppercase">
          {navLinks.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              className="hover:text-gold transition-colors"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href="https://www.instagram.com/amaya.switzerland/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/amaya.switzerland"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition"
            >
              <Facebook size={18} />
            </a>
          </div>
          <a
            href="#reserve"
            className="hidden sm:inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium uppercase tracking-widest text-gold-foreground hover:opacity-90 transition"
          >
            {t("nav.reserve")}
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition"
                aria-label="Menü öffnen"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-l border-gold/20 p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <img src={logoAsset.url} alt="Amaya" className="h-8 w-auto" />
                  <SheetClose asChild>
                    <button className="p-2 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition" aria-label="Menü schliessen">
                      <X size={24} />
                    </button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-3 text-sm tracking-widest uppercase">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to + l.label}
                      to={l.to}
                      activeOptions={l.exact ? { exact: true } : undefined}
                      onClick={() => setOpen(false)}
                      className="py-2 hover:text-gold transition-colors"
                      activeProps={{ className: "text-gold py-2" }}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <a
                    href="#reserve"
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold uppercase tracking-widest text-gold-foreground hover:opacity-90 transition shadow-lg"
                  >
                    {t("nav.reserve")}
                  </a>
                </nav>
                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-gold/10">
                  <LanguageSwitcher />
                  <a href="https://www.instagram.com/amaya.switzerland/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.facebook.com/amaya.switzerland" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}