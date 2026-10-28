import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatChf, parseTicketOptions, hasBookablePrice } from "@/lib/event-pricing";

type PromoEvent = {
  id: string;
  flyer_url: string | null;
  kicker: string | null;
  title: string;
  event_date: string | null;
  is_recurring: boolean;
  recurrence: string | null;
  is_paid: boolean;
  price_chf: number | null;
  price_text: string | null;
  ticket_options: unknown;
};

function promoDate(row: PromoEvent, locale: string): string {
  if (row.is_recurring) return row.recurrence ?? "";
  if (!row.event_date) return "";
  try {
    return new Date(row.event_date).toLocaleDateString(locale, {
      weekday: "short", day: "2-digit", month: "short",
    });
  } catch { return row.event_date; }
}

function promoPrice(row: PromoEvent): string | null {
  if (!row.is_paid) return null;
  const options = parseTicketOptions(row.ticket_options).filter((o) => o.kind === "ticket");
  const min = options.length > 0 ? Math.min(...options.map((o) => o.price_chf)) : row.price_chf;
  if (!hasBookablePrice(row.price_chf, options)) return row.price_text ?? null;
  return min != null ? `ab CHF ${formatChf(min)}` : null;
}

/**
 * Event promo slider shown on the start view of the reservation chat.
 * Auto-rotates through upcoming published events and links to /events.
 */
export function EventPromoSlider({ onLeave }: { onLeave: () => void }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const { data: events = [] } = useQuery({
    queryKey: ["public", "events", "promo"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events" as never)
        .select("id, flyer_url, kicker, title, event_date, is_recurring, recurrence, is_paid, price_chf, price_text, ticket_options")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("event_date", { ascending: true });
      if (error) throw error;
      const today = new Date().toISOString().slice(0, 10);
      return (data ?? [] as unknown[]).filter((e) => {
        const r = e as PromoEvent;
        return r.is_recurring || !r.event_date || r.event_date >= today;
      }) as PromoEvent[];
    },
  });

  const promo = useMemo(() => events.slice(0, 5), [events]);

  useEffect(() => {
    if (promo.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % promo.length), 6000);
    return () => window.clearInterval(id);
  }, [promo.length]);

  useEffect(() => {
    if (index >= promo.length) setIndex(0);
  }, [index, promo.length]);

  if (promo.length === 0) return null;
  const current = promo[Math.min(index, promo.length - 1)];
  const locale = i18n.language?.startsWith("en") ? "en-CH" : "de-CH";

  const go = () => {
    onLeave();
    navigate({ to: "/events" });
  };

  const price = promoPrice(current);
  const date = promoDate(current, locale);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
        <span className="mono-label text-[0.65rem] uppercase tracking-[0.2em] text-gold">
          {t("events.promo.eyebrow")}
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={go}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") go(); }}
        aria-label={`${current.title} — ${t("events.promo.seeAll")}`}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-gold/30 bg-background text-left shadow-[0_10px_28px_-14px_rgba(13,37,23,0.55)] transition-all duration-300 hover:border-gold/70 hover:shadow-[0_14px_34px_-12px_rgba(233,165,128,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        {/* Slide area */}
        <div className="relative h-36 w-full overflow-hidden">
          {current.flyer_url ? (
            <img
              src={current.flyer_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: "linear-gradient(135deg, #0d2517 0%, #14382a 55%, #1d4a33 100%)" }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />

          {/* Slide dots + arrows */}
          {promo.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + promo.length) % promo.length); }}
                aria-label={t("events.promo.prev")}
                className="absolute left-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-gold hover:text-background"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % promo.length); }}
                aria-label={t("events.promo.next")}
                className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-gold hover:text-background"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {promo.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-4 bg-gold" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3"
            >
              <div className="min-w-0">
                {current.kicker && (
                  <p className="mono-label truncate text-[0.6rem] uppercase tracking-[0.2em] text-gold/90">
                    {current.kicker}
                  </p>
                )}
                <p className="truncate font-display text-sm tracking-wide text-white">{current.title}</p>
                <p className="mt-0.5 text-[0.7rem] text-white/70">
                  {[date, current.is_paid ? t("events.ticket") : t("events.freeEntry")].filter(Boolean).join(" · ")}
                </p>
              </div>
              {price && (
                <span className="shrink-0 rounded-full border border-gold/50 bg-background/80 px-2.5 py-1 text-[0.7rem] font-medium text-gold">
                  {price}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between gap-2 border-t border-gold/25 bg-background px-3 py-2.5">
          <span className="text-[0.78rem] leading-tight text-white/85">
            <span className="block font-medium text-gold">{t("events.promo.cta")}</span>
            <span className="text-white/60">{t("events.promo.click")}</span>
          </span>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-background">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={go}
        className="mt-1.5 w-full text-center text-[0.7rem] uppercase tracking-[0.15em] text-neutral-400 transition-colors hover:text-gold"
      >
        {t("events.promo.seeAll")}
      </button>
    </div>
  );
}
