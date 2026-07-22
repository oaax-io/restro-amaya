import { useEffect, useRef } from "react";

const RESERVATION_URL = "https://services.gastronovi.com/restaurants/108779/reservation";
const TAKEAWAY_URL = "https://services.gastronovi.com/restaurants/108779/takeaway";
const VOUCHER_URL = "https://services.gastronovi.com/restaurants/108779/voucher";

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function GastronoviReservation() {
  const scriptHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobileViewport()) return;
    const scriptHost = scriptHostRef.current;
    if (!scriptHost) return;

    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    scriptHost.appendChild(script);

    const reservation = document.getElementById("reservation");

    const observer = new MutationObserver(() => {
      if (!reservation) return;

      // Move any injected divs (gastronovi wraps iframe in a div)
      Array.from(scriptHost.children).forEach((child) => {
        if (child.tagName !== "SCRIPT" && child.parentElement !== reservation) {
          reservation.appendChild(child);
        }
      });

      // Also move any loose iframes
      scriptHost.querySelectorAll("iframe").forEach((iframe) => {
        if (iframe.parentElement !== reservation) {
          reservation.appendChild(iframe);
        }
      });
    });

    observer.observe(scriptHost, { childList: true, subtree: true });

    const fixIframeHeight = () => {
      const iframe = document.getElementById("gastronaviReservationWidget-0") as HTMLIFrameElement;
      if (!iframe) return;
      try {
        const contentHeight = iframe.contentDocument?.body?.scrollHeight;
        if (contentHeight && contentHeight > 0) {
          iframe.style.height = contentHeight + "px";
        }
      } catch {}
    };

    const handleMessage = (e: MessageEvent) => {
      const iframe = document.getElementById("gastronaviReservationWidget-0") as HTMLIFrameElement;
      if (!iframe) return;

      if (e.data && typeof e.data === "object" && e.data.height) {
        iframe.style.height = e.data.height + "px";
      }

      if (e.data && typeof e.data === "object" && e.data.type === "resize") {
        iframe.style.height = e.data.height + "px";
      }
    };

    window.addEventListener("message", handleMessage);

    const interval = setInterval(() => {
      const iframe = document.getElementById("gastronaviReservationWidget-0") as HTMLIFrameElement;
      if (iframe) {
        fixIframeHeight();
      }
    }, 500);

    setTimeout(() => clearInterval(interval), 10000);

    return () => {
      observer.disconnect();
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
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

        {/* Desktop / Tablet: eingebettetes Widget */}
        <div className="hidden md:block">
          <div id="reservation" style={{ width: "100%", padding: 0, margin: 0, background: "#0d2517" }} />
          <div id="script" ref={scriptHostRef} style={{ display: "none" }} />
        </div>

        {/* Mobile: Direktlinks, damit keine Third-Party-Cookie-Probleme entstehen
            und Aktionen im gleichen Tab öffnen */}
        <div className="md:hidden px-4">
          <p className="text-center text-white/70 text-sm mb-5 leading-relaxed">
            Reservieren, Abholung bestellen oder Gutschein kaufen — direkt online.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={RESERVATION_URL}
              className="block w-full text-center rounded-full border border-gold/60 bg-gold/10 px-6 py-4 text-gold font-medium tracking-wide uppercase text-sm hover:bg-gold/20 transition"
            >
              Tisch reservieren
            </a>
            <a
              href={TAKEAWAY_URL}
              className="block w-full text-center rounded-full border border-white/20 px-6 py-4 text-white/90 font-medium tracking-wide uppercase text-sm hover:bg-white/5 transition"
            >
              Take Away bestellen
            </a>
            <a
              href={VOUCHER_URL}
              className="block w-full text-center rounded-full border border-white/20 px-6 py-4 text-white/90 font-medium tracking-wide uppercase text-sm hover:bg-white/5 transition"
            >
              Gutschein kaufen
            </a>
          </div>
        </div>
      </div>

      <style>{`
        #gastronaviReservationWidget-0 {
          background-color: #0d2517 !important;
          border: none !important;
          display: block !important;
        }
      `}</style>
    </section>
  );
}