import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

const TABS = [
  { to: "/impressum", label: "Impressum" },
  { to: "/datenschutz", label: "Datenschutz" },
  { to: "/agb", label: "AGB" },
] as const;

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <SiteLayout>
      <section className="relative pt-40 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— Rechtliches</p>
          <h1 className="font-display text-5xl lg:text-6xl mt-4 leading-[0.95] uppercase font-bold text-gradient-gold">
            {title}
          </h1>

          <div className="mt-10 flex flex-wrap gap-2 border-b border-border/50">
            {TABS.map((tab) => {
              const active = pathname === tab.to;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={
                    "px-4 py-2 text-sm tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px " +
                    (active
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground")
                  }
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-foreground/85 legal-prose">
            {children}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-4">
      <h2 className="font-display text-2xl uppercase tracking-wider text-foreground mt-6 mb-3">{title}</h2>
      <div className="space-y-3 whitespace-pre-line">{children}</div>
    </section>
  );
}