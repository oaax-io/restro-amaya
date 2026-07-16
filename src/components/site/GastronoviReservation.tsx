import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Widget script inserts an iframe BEFORE its own <script> tag,
    // so the script must live inside the styled container.
    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    host.appendChild(script);
    return () => {
      host.innerHTML = "";
    };
  }, []);

  return (
    <section id="online-reservation" className="relative bg-background py-14 lg:py-20">
      {/* Seamless fade from the slider above */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="mono-label text-gold">— Online Reservation —</p>
          <h2 className="display-serif text-4xl lg:text-5xl mt-3 text-gradient-gold">
            Tisch reservieren
          </h2>
          <div className="mx-auto mt-4 h-px w-16 hairline-gold" />
        </div>

        <div
          ref={hostRef}
          id="reservation"
          className="gastronovi-widget relative overflow-hidden rounded-xl border border-gold/20 bg-bone shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
        />
      </div>
    </section>
  );
}