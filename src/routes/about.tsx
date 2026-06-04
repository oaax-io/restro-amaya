import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Über uns — Amaya Restaurant" }] }),
  component: () => {
    const { t } = useTranslation();
    return <ComingSoon kicker={t("about.kicker")} title={t("about.title")} />;
  },
});