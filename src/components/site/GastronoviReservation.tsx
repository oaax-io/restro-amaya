import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarCheck, ShoppingBag, Gift, ArrowLeft, Loader2 } from "lucide-react";

type EntryKey = "reservation" | "pickup" | "voucher";

const GN_BASE = "https://services.gastronovi.com/restaurants/108779";
const EMBED_PARAMS = "embed=1&companyRoute=1&fixedButton=0&iframeId=gastronaviReservationWidget-0";

const entryUrl = (entry: EntryKey) =>
  `${GN_BASE}/reservierung/widget?entry=${entry}&${EMBED_PARAMS}`;

const TILES: { key: EntryKey; label: string; sub: string; Icon: typeof CalendarCheck }[] = [
  { key: "reservation", label: "Reservierung", sub: "Tisch buchen", Icon: CalendarCheck },
  { key: "pickup", label: "Abholung", sub: "Take Away bestellen", Icon: ShoppingBag },
  { key: "voucher", label: "Gutschein kaufen", sub: "Verschenke Genuss", Icon: Gift },
];

/** How long the dark veil stays after the widget reports "loaded" — hides the
 *  white paint of the cross-origin widget document until it has fully rendered. */
const SETTLE_MS = 1400;
/** Short veil re-applied whenever the widget changes its internal height
 *  (i.e. navigates between steps) — covers the white flash of that transition. */
const STEP_MS = 900;

export function GastronoviReservation() {
  const [activeEntry, setActiveEntry] = useState<EntryKey | null>(null);
  const [veiled, setVeiled] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastHeightRef = useRef<number | null>(null);
  const veilTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const showVeil = useCallback((ms: number) => {
    if (veilTimerRef.current) window.clearTimeout(veilTimerRef.current);
    setVeiled(true);
    veilTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) setVeiled(false);
    }, ms);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (veilTimerRef.current) window.clearTimeout(veilTimerRef.current);
    };
  }, []);

  // Keep the cross-origin iframe height in sync with its content. Every height
  // change also re-applies the dark veil so step transitions never flash white.
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      if (e.data && typeof e.data === "object" && typeof e.data.height === "number") {
        const h = e.data.height;
        if (lastHeightRef.current !== null && Math.abs(h - lastHeightRef.current) > 4) {
          showVeil(STEP_MS);
        }
        lastHeightRef.current = h;
        iframe.style.height = h + "px";
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [showVeil]);

  const openEntry = (key: EntryKey) => {
    setActiveEntry(key);
    lastHeightRef.current = null;
    // Cover the iframe from the first paint until the widget has rendered.
    showVeil(SETTLE_MS + 1200);
  };

  const handleIframeLoad = () => {
    // Widget document loaded — keep the veil a moment longer so its own
    // white background never becomes visible mid-render.
    showVeil(SETTLE_MS);
  };

  return (
    <section id="online-reservation" className="relative w-full bg-[#0d2517] py-8 lg:py-12">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-[#0d2517]" />
      <div className="relative mx-auto w-full max-w-3xl px-4">
        <div className="text-center mb-6">
          <p className="mono-label text-gold">— Online Reservation —</p>
          <h2 className="display-serif text-3xl lg:text-4xl mt-2 text-gradient-gold">
            Tisch reservieren
          </h2>
          <div className="mx-auto mt-3 h-px w-14 hairline-gold" />
        </div>

        {/* Own tile row (replaces the widget's 4-tile landing screen, without
            the "Vorbestellung mit Reservierung" tile). Clicking a tile loads
            the corresponding Gastronovi module directly in the iframe. */}
        {!activeEntry && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TILES.map(({ key, label, sub, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => openEntry(key)}
                className="group flex items-center gap-4 rounded-2xl border border-[#E9A580]/25 bg-[#0d2517] px-5 py-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#E9A580]/60 hover:shadow-[0_16px_40px_-16px_rgba(233,165,128,0.35)] sm:flex-col sm:items-center sm:gap-3 sm:px-4 sm:py-7 sm:text-center"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#E9A580]/40 text-[#E9A580] transition-colors group-hover:bg-[#E9A580] group-hover:text-[#0d2517]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base tracking-wide text-[#f3ede4]">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#f3ede4]/50">{sub}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {activeEntry && (
          <div>
            <button
              type="button"
              onClick={() => setActiveEntry(null)}
              className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E9A580]/80 transition-colors hover:text-[#E9A580]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Zurück zur Auswahl
            </button>
            <div className="relative">
              <iframe
                ref={iframeRef}
                id="gastronaviReservationWidget-0"
                src={entryUrl(activeEntry)}
                title="Online Reservation"
                loading="lazy"
                allow="payment"
                onLoad={handleIframeLoad}
                style={{
                  width: "100%",
                  height: 480,
                  minHeight: "unset",
                  border: "none",
                  display: "block",
                  background: "transparent",
                }}
              />
              {/* Dark veil: hides the widget's white background while it loads
                  and during internal step changes. Fades out smoothly. */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0d2517] transition-opacity duration-700 ${
                  veiled ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <Loader2 className="h-7 w-7 animate-spin text-[#E9A580]/80" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#E9A580]/60">
                  Einen Moment …
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
