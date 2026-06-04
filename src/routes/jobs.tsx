import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Karriere — Amaya Restaurant" }] }),
  component: () => {
    const { t } = useTranslation();
    return <ComingSoon kicker={t("jobs.kicker")} title={t("jobs.title")} />;
  },
});