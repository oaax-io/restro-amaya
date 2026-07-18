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

    // Watch #reservation for injected content and fix backgrounds
    const reservation = document.getElementById("reservation");

    const fixStyles = () => {
      if (!reservation) return;

      // Move any iframe injected into the hidden script host into #reservation
      const orphanIframes = scriptHost.querySelectorAll("iframe");
      orphanIframes.forEach((iframe, idx) => {
        if (idx === 0 && !reservation.contains(iframe)) {
          (iframe as HTMLIFrameElement).style.width = "100%";
          (iframe as HTMLIFrameElement).style.border = "0";
          (iframe as HTMLIFrameElement).style.background = "#0d2517";
          reservation.appendChild(iframe);
        } else if (idx > 0) {
          (iframe as HTMLIFrameElement).style.display = "none";
        }
      });

      // Hide any secondary iframes inside #reservation too
      const innerIframes = reservation.querySelectorAll("iframe");
      innerIframes.forEach((iframe, idx) => {
        if (idx > 0) (iframe as HTMLIFrameElement).style.display = "none";
      });

      // Fix section-full background
      const sectionFull = reservation.querySelector("#section-full") as HTMLElement;
      if (sectionFull) {
        sectionFull.style.background = "#0d2517";
        sectionFull.style.backgroundColor = "#0d2517";
      }
      // Hide section-bottom (the white empty area)
      const sectionBottom = reservation.querySelector("#section-bottom") as HTMLElement;
      if (sectionBottom) {
        sectionBottom.style.display = "none";
        sectionBottom.style.height = "0";
        sectionBottom.style.overflow = "hidden";
      }
      // Hide clearer divs
      reservation.querySelectorAll(".clearer").forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
      // Fix all step_control backgrounds
      reservation.querySelectorAll(".step_control").forEach((el) => {
        (el as HTMLElement).style.backgroundColor = "#0d2517";
      });
    };

    const observer = new MutationObserver(() => {
      fixStyles();
    });
    if (reservation) {
      observer.observe(reservation, { childList: true, subtree: true });
    }
    observer.observe(scriptHost, { childList: true, subtree: true });

    // Handle iframe resize messages from Gastronovi
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data) return;
      const height =
        typeof data === "number"
          ? data
          : typeof data === "string" && /^\d+$/.test(data)
          ? parseInt(data, 10)
          : typeof data === "object" && typeof data.height === "number"
          ? data.height
          : null;
      if (!height || !reservation) return;
      const iframe = reservation.querySelector("iframe") as HTMLIFrameElement | null;
      if (iframe) iframe.style.height = `${height}px`;
    };
    window.addEventListener("message", onMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
      scriptHost.innerHTML = "";
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

        <div
          id="reservation"
          style={{ background: "#0d2517", width: "100%", padding: 0, margin: 0 }}
        />
        <div id="script" ref={scriptHostRef} style={{ display: "none" }} />
      </div>

      <style>{`
        #reservation { background-color: #0d2517 !important; }
        #reservation * { box-sizing: border-box; }
        #section-full { background-color: #0d2517 !important; }
        #section-bottom { display: none !important; height: 0 !important; }
        #reservation .clearer { display: none !important; }
        #reservation .step_control { background-color: #0d2517 !important; }
      `}</style>
    </section>
  );
}
