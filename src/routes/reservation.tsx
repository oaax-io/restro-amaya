import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "motion/react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { RESTAURANT } from "@/lib/restaurant";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Tisch reservieren — Amaya Restaurant & Bar" },
      { name: "description", content: "Reservieren Sie online einen Tisch im Amaya Restaurant & Bar in Rothenburg. Wir bestätigen Ihre Anfrage per E-Mail." },
      { property: "og:title", content: "Tisch reservieren — Amaya" },
      { property: "og:description", content: "Online-Reservierung mit E-Mail-Bestätigung." },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      party_size: Number(fd.get("party_size") || 2),
      reservation_date: String(fd.get("reservation_date") || ""),
      reservation_time: String(fd.get("reservation_time") || ""),
      notes: String(fd.get("notes") || "").trim() || null,
      status: "pending" as const,
    };
    const { error } = await supabase.from("reservations").insert(payload);
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("success");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <SiteLayout>
      <section className="pt-32 lg:pt-40 pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-12 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("reserve.kicker")}</p>
            <h1 className="font-display text-6xl lg:text-7xl mt-6 leading-[1.0]">
              {t("reserve.title")}.
            </h1>
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-md">
              {t("hero.subtitle")}
            </p>

            <div className="mt-12 space-y-6 text-sm">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-1">{t("about.contact")}</p>
                <a href={`tel:${RESTAURANT.phoneRaw}`} className="font-display text-2xl hover:text-accent">{RESTAURANT.phone}</a>
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-1">{t("about.address")}</p>
                <p>{RESTAURANT.street}, {RESTAURANT.city}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7"
          >
            {status === "success" ? (
              <div className="border border-border bg-card p-10 lg:p-14">
                <p className="text-xs tracking-[0.3em] uppercase text-accent">✓ Confirmed</p>
                <h2 className="font-display text-4xl mt-4">{t("reserve.success")}</h2>
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 text-xs tracking-[0.3em] uppercase border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Neue Anfrage
                  </button>
                  <Link to="/" className="px-6 py-3 text-xs tracking-[0.3em] uppercase bg-foreground text-background hover:bg-accent transition-colors">
                    {t("nav.home")}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="border border-border bg-card p-8 lg:p-12 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label={t("reserve.name")} name="name" required />
                  <Field label={t("reserve.email")} name="email" type="email" required />
                  <Field label={t("reserve.phone")} name="phone" type="tel" />
                  <Field label={t("reserve.party")} name="party_size" type="number" min={1} max={20} defaultValue={2} required />
                  <Field label={t("reserve.date")} name="reservation_date" type="date" min={today} required />
                  <Field label={t("reserve.time")} name="reservation_time" type="time" defaultValue="19:00" required />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
                    {t("reserve.notes")}
                  </label>
                  <textarea
                    name="notes"
                    rows={4}
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive">{errorMsg || t("reserve.error")}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 text-xs tracking-[0.3em] uppercase bg-foreground text-background hover:bg-accent transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? "..." : t("reserve.submit")}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{label}</label>
      <input
        {...rest}
        className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}