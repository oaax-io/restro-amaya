import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarCheck, ShoppingBag, Gift, ArrowLeft, X } from "lucide-react";
import { GastronoviWidget, type GastronoviEntryPoint } from "./GastronoviWidget";

const TILES: {
  key: GastronoviEntryPoint;
  label: string;
  sub: string;
  Icon: typeof CalendarCheck;
}[] = [
  {
    key: "reservation",
    label: "Tisch reservieren",
    sub: "Platz sichern im Amaya",
    Icon: CalendarCheck,
  },
  {
    key: "pickup",
    label: "Abholung",
    sub: "Take Away bestellen",
    Icon: ShoppingBag,
  },
  {
    key: "voucher",
    label: "Gutschein kaufen",
    sub: "Verschenke Genuss",
    Icon: Gift,
  },
];

/**
 * Chat-style floating reservation widget:
 * a gold bubble at the bottom right opens a chat panel that hosts
 * the three entry tiles and the Gastronovi module itself.
 */
export function ReservationChat() {
  const [open, setOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState<GastronoviEntryPoint | null>(null);

  // External open requests (e.g. from the header/sidebar "Reservieren" button)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("amaya:open-reservation-chat", onOpen);
    return () => window.removeEventListener("amaya:open-reservation-chat", onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    // Reset after the exit animation so the widget/script is fully removed.
    setTimeout(() => setActiveEntry(null), 350);
  };

  return (
    <>
      {/* Floating chat bubble */}
      <div
        className="fixed z-50 group"
        style={{
          bottom: "calc(10.5rem + env(safe-area-inset-bottom))",
          right: "calc(1.5rem + env(safe-area-inset-right))",
        }}
      >
        <button
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label="Reservation öffnen"
          aria-expanded={open}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarCheck className="w-6 h-6" aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E9A580] opacity-60" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-[#E9A580]" />
            </span>
          )}
        </button>

        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background text-foreground text-sm rounded-lg shadow-md border border-gold/20 whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Reservieren · Abholen · Gutschein
        </span>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="reservation-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
            style={{
              bottom: "calc(15.5rem + env(safe-area-inset-bottom))",
              right: "calc(1rem + env(safe-area-inset-right))",
              width: "min(26rem, calc(100vw - 2rem))",
              height: "min(40rem, calc(100dvh - 18rem))",
              minHeight: "24rem",
            }}
            role="dialog"
            aria-label="Online Reservation"
          >
            {/* Chat header */}
            <div className="relative shrink-0 border-b border-gold/25 bg-white px-4 py-3">
              <div className="flex items-center gap-3 pr-8">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="mono-label text-gold">Online Reservation</p>
                  <p className="mt-0.5 truncate font-display text-sm tracking-wide text-neutral-900">
                    Amaya Restaurant &amp; Bar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Schliessen"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-gold/10 hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat body */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {!activeEntry ? (
                <div className="flex flex-col gap-3 p-4">
                  <p className="text-xs leading-relaxed text-neutral-500">
                    Herzlich willkommen! Wie können wir Ihnen weiterhelfen?
                  </p>
                  {TILES.map(({ key, label, sub, Icon }, i) => (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => setActiveEntry(key)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * (i + 1), duration: 0.3 }}
                      className="group flex w-full items-center gap-3 rounded-xl border border-gold/25 bg-white px-4 py-3.5 text-left transition-all duration-300 hover:border-gold/60 hover:shadow-[0_12px_30px_-12px_rgba(233,165,128,0.45)]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-sm tracking-wide text-neutral-900">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500">{sub}</span>
                      </span>
                      <ArrowLeft className="h-4 w-4 shrink-0 rotate-180 text-gold/60 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </motion.button>
                  ))}
                  <p className="mono-label mt-2 text-center text-neutral-400">
                    Jederzeit verfügbar
                  </p>
                </div>
              ) : (
                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => setActiveEntry(null)}
                    className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold/80 transition-colors hover:text-gold"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Andere Auswahl
                  </button>
                  <GastronoviWidget key={activeEntry} entryPoint={activeEntry} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
