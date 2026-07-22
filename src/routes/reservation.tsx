import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { GastronoviReservation } from "@/components/site/GastronoviReservation";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Tisch reservieren — Amaya Restaurant & Bar" },
      { name: "description", content: "Reservieren Sie online einen Tisch im Amaya Restaurant & Bar in Rothenburg. Direkt über unser Gastronovi-Reservierungswidget." },
      { property: "og:title", content: "Tisch reservieren — Amaya" },
      { property: "og:description", content: "Online-Reservierung über das Gastronovi-Widget." },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
  const { t } = useTranslation();

  return (
    <SiteLayout>
      <section className="pt-32 lg:pt-40 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold">— {t("reserve.kicker")} —</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 text-gradient-gold">
              {t("reserve.title")}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Reserviere direkt online über unser Widget — schnell, unkompliziert und jederzeit verfügbar.
            </p>
          </motion.div>
        </div>
      </section>

      <GastronoviReservation />
    </SiteLayout>
  );
}
