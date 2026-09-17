import { useEffect, useRef, useState } from "react";
import { CalendarCheck, ShoppingBag, Gift, ArrowLeft } from "lucide-react";

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

export function GastronoviReservation() {
  const [activeEntry, setActiveEntry] = useState<EntryKey | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Keep the cross-origin iframe height in sync with its content.
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      if (e.data && typeof e.data === "object" && typeof e.data.height === "number") {
        iframe.style.height = e.data.height + "px";
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
                onClick={() => setActiveEntry(key)}
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
            <iframe
              ref={iframeRef}
              id="gastronaviReservationWidget-0"
              src={entryUrl(activeEntry)}
              title="Online Reservation"
              loading="lazy"
              allow="payment"
              style={{
                width: "100%",
                height: 480,
                minHeight: "unset",
                border: "none",
                display: "block",
                background: "transparent",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
