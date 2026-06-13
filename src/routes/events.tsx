import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — Amaya Restaurant" }] }),
  component: () => {
    const { t } = useTranslation();
    return <ComingSoon kicker={t("hero.slides.events.tag")} title={t("hero.slides.events.title")} />;
  },
});
