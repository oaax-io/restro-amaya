import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import slideRestaurant from "@/assets/slide-restaurant.jpg";
import slideLounge from "@/assets/slide-lounge.jpg";
import slideBar from "@/assets/slide-bar.jpg";
import slideEvents from "@/assets/slide-events.jpg";

const SLIDES = [
  { key: "restaurant", img: slideRestaurant },
  { key: "lounge", img: slideLounge },
  { key: "bar", img: slideBar },
  { key: "events", img: slideEvents },
] as const;

export function HeroSlider() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 6500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused]);

  const slide = SLIDES[idx];
  const data = t(`hero.slides.${slide.key}`, { returnObjects: true }) as {
    tag: string;
    title: string;
    sub: string;
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-onyx" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Slide images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.key}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/70 to-onyx/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-onyx/40" />
        </motion.div>
      </AnimatePresence>

      {/* Top brand bar */}
      <div className="relative z-10 pt-28 lg:pt-32" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pb-44 lg:pb-56 grid lg:grid-cols-12 gap-12 items-end min-h-[80vh]">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mono-label text-accent">{data.tag}</p>
              <h1 className="display-mega text-[14vw] lg:text-[10rem] mt-6 text-bone glow-neon">
                {data.title}
              </h1>
              <p className="mt-8 max-w-xl text-lg text-foreground/80 leading-relaxed">
                {data.sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slide nav */}
          <div className="mt-12 flex items-center gap-4">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setIdx(i)}
                className="group relative h-px w-16 lg:w-24 bg-foreground/20 overflow-hidden"
                aria-label={`Slide ${i + 1}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 bg-accent transition-all duration-500 ${
                    i === idx ? "w-full" : i < idx ? "w-full opacity-40" : "w-0"
                  }`}
                />
              </button>
            ))}
            <span className="mono-label text-muted-foreground ml-4">
              {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Reservation widget */}
        <div className="lg:col-span-4">
          <ReservationWidget />
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-border bg-onyx/80 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap mono-label py-4 text-foreground/60">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="flex shrink-0 gap-12 pr-12">
              {["RESTAURANT", "★", "CIGAR LOUNGE", "★", "BAR", "★", "EVENTS", "★", "ROTHENBURG LU", "★", "OPEN UNTIL 03:00", "★"].map((w, i) => (
                <span key={`${r}-${i}`} className={w === "★" ? "text-accent" : ""}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReservationWidget() {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<"form" | "details" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [base, setBase] = useState({
    reservation_date: today,
    reservation_time: "19:30",
    party_size: 2,
  });

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBase({
      reservation_date: String(fd.get("reservation_date") || today),
      reservation_time: String(fd.get("reservation_time") || "19:30"),
      party_size: Number(fd.get("party_size") || 2),
    });
    setStep("details");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      ...base,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      notes: String(fd.get("notes") || "").trim() || null,
      status: "pending" as const,
    };
    const { error } = await supabase.from("reservations").insert(payload);
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setStep("done");
  };

  return (
    <motion.div
      id="reserve"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative bg-onyx/90 backdrop-blur-xl border border-accent/30 p-6 lg:p-7 shadow-[0_0_50px_-10px_var(--color-accent)]"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="mono-label text-accent">// {t("reserveWidget.title")}</p>
        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)] animate-pulse" />
      </div>

      {step === "form" && (
        <form onSubmit={next} className="space-y-4">
          <WField label={t("reserveWidget.date")} name="reservation_date" type="date" min={today} defaultValue={base.reservation_date} required />
          <div className="grid grid-cols-2 gap-3">
            <WField label={t("reserveWidget.time")} name="reservation_time" type="time" defaultValue={base.reservation_time} required />
            <WField label={t("reserveWidget.guests")} name="party_size" type="number" min={1} max={20} defaultValue={base.party_size} required />
          </div>
          <button type="submit" className="w-full mt-2 py-3.5 mono-label bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition-colors">
            {t("reserveWidget.cta")} →
          </button>
        </form>
      )}

      {step === "details" && (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-foreground/80">
            <span className="text-accent">{base.reservation_date}</span> · {base.reservation_time} · {base.party_size} {t("reserveWidget.guests")}
          </p>
          <WField label={t("reserve.name")} name="name" required />
          <WField label={t("reserve.email")} name="email" type="email" required />
          <WField label={t("reserve.phone")} name="phone" type="tel" />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep("form")} className="flex-1 py-3 mono-label border border-border text-foreground/70 hover:text-foreground transition">←</button>
            <button type="submit" disabled={loading} className="flex-[3] py-3 mono-label bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition disabled:opacity-50">
              {loading ? "..." : t("reserve.submit")}
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className="py-4">
          <p className="mono-label text-accent">✓ confirmed</p>
          <p className="mt-3 font-display text-2xl leading-tight">{t("reserve.success")}</p>
          <button onClick={() => setStep("form")} className="mt-5 mono-label text-foreground/60 hover:text-accent">
            ↻ neue Anfrage
          </button>
        </div>
      )}

      <p className="mt-5 pt-5 border-t border-border mono-label text-muted-foreground text-center">
        <Link to="/reservation" className="hover:text-accent">Volles Formular →</Link>
      </p>
    </motion.div>
  );
}

function WField({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mono-label text-muted-foreground block mb-1.5">{label}</span>
      <input
        {...rest}
        className="w-full bg-transparent border-b border-border px-0 py-2 text-foreground focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
      />
    </label>
  );
}