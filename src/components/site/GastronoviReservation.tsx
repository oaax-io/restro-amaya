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

    // Gastronovi's script inserts the iframe as previousSibling of the <script> tag.
    // Since #script is display:none, move any injected iframe into #reservation.
    const reservation = document.getElementById("reservation");
    const observer = new MutationObserver(() => {
      // Move any injected iframe from the hidden script host into #reservation.
      scriptHost.querySelectorAll("iframe").forEach((iframe) => {
        if (reservation && iframe.parentElement !== reservation) {
          const src = iframe.getAttribute("src") || "";
          if (src === "" || src === "about:blank") {
            iframe.style.display = "none";
            iframe.style.height = "0";
            iframe.style.width = "0";
          } else {
            reservation.appendChild(iframe);
          }
        }
      });

      // Hide every iframe after the main reservation iframe (the empty white one below).
      const allIframes = reservation ? reservation.querySelectorAll("iframe") : [];
      allIframes.forEach((iframe, index) => {
        if (index > 0) {
          iframe.style.display = "none";
          iframe.style.height = "0";
          iframe.style.width = "0";
          iframe.style.position = "absolute";
          iframe.style.visibility = "hidden";
        }
      });
    });
    observer.observe(scriptHost, { childList: true, subtree: true });

    // Hide any blank iframes inside reservation.
    document.querySelectorAll("#reservation iframe").forEach((el) => {
      const iframe = el as HTMLIFrameElement;
      if (!iframe.src || iframe.src === "about:blank") {
        iframe.style.display = "none";
        iframe.style.height = "0";
      }
    });

    return () => {
      observer.disconnect();
      scriptHost.innerHTML = "";
      const reservation = document.getElementById("reservation");
      if (reservation) reservation.innerHTML = "";
    };
  }, []);

  return (
    <section id="online-reservation" className="relative w-full bg-[#0d2517] py-8 lg:py-12">
      {/* Seamless fade from the slider above */}
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
          style={{ backgroundColor: "#0d2517", width: "100%", padding: 0, margin: 0, overflow: "hidden" }}
        />
        <div id="script" ref={scriptHostRef} style={{ display: "none" }} />
      </div>

      <style>{`
        #reservation { background-color: #0d2517; }
        #reservation iframe { background-color: #0d2517 !important; }
      `}</style>
    </section>
  );
}