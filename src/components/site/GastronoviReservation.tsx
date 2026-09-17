import { useState } from "react";
import { CalendarCheck, ShoppingBag, Gift, ArrowLeft } from "lucide-react";
import { GastronoviWidget, type GastronoviEntryPoint } from "./GastronoviWidget";

const TILES: {
  key: GastronoviEntryPoint;
  label: string;
  sub: string;
  cta: string;
  Icon: typeof CalendarCheck;
}[] = [
  {
    key: "reservation",
    label: "Tisch reservieren",
    sub: "Platz sichern im Amaya",
    cta: "Tisch reservieren",
    Icon: CalendarCheck,
  },
  {
    key: "pickup",
    label: "Abholung",
    sub: "Take Away bestellen",
    cta: "Zur Abholung bestellen",
    Icon: ShoppingBag,
  },
  {
    key: "voucher",
    label: "Gutschein kaufen",
    sub: "Verschenke Genuss",
    cta: "Gutschein kaufen",
    Icon: Gift,
  },
];

export function GastronoviReservation() {
  const [activeEntry, setActiveEntry] = useState<GastronoviEntryPoint | null>(null);

  return (
    <section id="online-reservation" className="relative w-full bg-[#0d2517] py-10 lg:py-14">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-[#0d2517]" />
      <div className="relative mx-auto w-full max-w-4xl px-4">
        <div className="mb-8 text-center">
          <p className="mono-label text-gold">— Online Reservation —</p>
          <h2 className="display-serif mt-2 text-3xl lg:text-4xl text-gradient-gold">
            Tisch reservieren
          </h2>
          <div className="mx-auto mt-3 h-px w-14 hairline-gold" />
        </div>

        {!activeEntry ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TILES.map(({ key, label, sub, cta, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveEntry(key)}
                className="group flex w-full flex-col items-center gap-4 rounded-2xl border border-[#E9A580]/25 bg-[#0d2517] px-5 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#E9A580]/60 hover:shadow-[0_16px_40px_-16px_rgba(233,165,128,0.35)]"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#E9A580]/40 text-[#E9A580] transition-colors group-hover:bg-[#E9A580] group-hover:text-[#0d2517]">
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display text-lg tracking-wide text-[#f3ede4]">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs text-[#f3ede4]/50">{sub}</span>
                </span>
                <span className="mt-2 inline-flex items-center rounded-full border border-[#E9A580]/50 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E9A580] transition-colors group-hover:bg-[#E9A580] group-hover:text-[#0d2517]">
                  {cta}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setActiveEntry(null)}
              className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E9A580]/80 transition-colors hover:text-[#E9A580]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Zurück zur Auswahl
            </button>
            <GastronoviWidget key={activeEntry} entryPoint={activeEntry} />
          </div>
        )}
      </div>
    </section>
  );
}
