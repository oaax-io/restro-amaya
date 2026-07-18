import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const scriptHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptHost = scriptHostRef.current;
    if (!scriptHost) return;

    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    scriptHost.appendChild(script);

    return () => {
      scriptHost.innerHTML = "";
      const reservation = document.getElementById("reservation");
      if (reservation) reservation.innerHTML = "";
    };
  }, []);

  return (
    <section id="online-reservation" className="relative w-full bg-[#0d2517] py-8 lg:py-12">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-[#0d2517]" />
      <div className="relative mx-auto w-full max-w-3xl">
        <div className="text-center mb-5">
          <p className="mono-label text-gold">— Online Reservation —</p>
          <h2 className="display-serif text-3xl lg:text-4xl mt-2 text-gradient-gold">
            Tisch reservieren
          </h2>
          <div className="mx-auto mt-3 h-px w-14 hairline-gold" />
        </div>

        <div id="reservation" style={{ width: "100%", padding: 0, margin: 0 }} />
        <div id="script" ref={scriptHostRef} style={{ display: "none" }} />
      </div>

      <style>{`
        #section-full { background-color: #0d2517 !important; }
        #section-bottom {
          background-color: #0d2517 !important;
          border: none !important;
          box-shadow: none !important;
        }
        #section-bottom * {
          background-color: #0d2517 !important;
          border: none !important;
        }
        .clearer { display: none !important; }
        .step_control { background-color: #0d2517 !important; }
        .step_control * { background-color: #0d2517 !important; }
      `}</style>
    </section>
  );
}