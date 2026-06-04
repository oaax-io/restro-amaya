import { useTranslation } from "react-i18next";
import { SiteLayout } from "./SiteLayout";

export function ComingSoon({ kicker, title }: { kicker: string; title: string }) {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <section className="pt-40 pb-32 min-h-[70vh]">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {kicker}</p>
          <h1 className="font-display text-7xl lg:text-8xl mt-6 leading-[0.95]">
            {title}.
          </h1>
          <p className="mt-10 text-muted-foreground max-w-md">{t("menu.empty")}</p>
        </div>
      </section>
    </SiteLayout>
  );
}