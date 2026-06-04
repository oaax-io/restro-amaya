import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Galerie — Amaya Restaurant" }] }),
  component: () => {
    const { t } = useTranslation();
    return <ComingSoon kicker={t("gallery.kicker")} title={t("gallery.title")} />;
  },
});