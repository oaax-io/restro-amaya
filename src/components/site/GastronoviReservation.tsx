import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const scriptHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = scriptHostRef.current;
    if (!host) return;
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
    <section id="online-reservation" className="relative py-24 lg:py-32 bg-onyx">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.5), transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.35), transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="mono-label text-gold">— Online Reservation —</p>
          <h2 className="display-serif text-5xl lg:text-7xl mt-4 text-gradient-gold">
            Tisch reservieren.
          </h2>
          <div className="mx-auto mt-6 h-px w-24 hairline-gold" />
          <p className="mt-6 text-foreground/70 max-w-xl mx-auto">
            Wähle Datum, Uhrzeit und Personenzahl — wir bestätigen dir deinen Tisch direkt online.
          </p>
        </div>

        <div className="relative rounded-2xl border border-gold/25 bg-bone/95 backdrop-blur-sm shadow-2xl p-4 sm:p-8">
          <div id="reservation" className="gastronovi-widget" />
          <div ref={scriptHostRef} id="script" aria-hidden />
        </div>
      </div>
    </section>
  );
}