import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "Speisekarte — Amaya Restaurant" }] }),
  component: () => {
    const { t } = useTranslation();
    return <ComingSoon kicker={t("menu.kicker")} title={t("menu.title")} />;
  },
});