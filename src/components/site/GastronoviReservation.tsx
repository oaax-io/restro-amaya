import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const scriptHostRef = useRef<HTMLDivElement>(null);
  const patchRef = useRef<HTMLDivElement>(null);

  // The widget runs in a cross-origin iframe, so its content cannot be styled
  // directly. We cover the "Vorbestellung mit Reservierung" tile with a patch
  // matching the section background. Geometry mirrors the widget's own CSS
  // (3-column grid above 500px iframe width, stacked list below).
  useEffect(() => {
    const host = document.getElementById("reservation");
    const patch = patchRef.current;
    if (!host || !patch) return;

    const position = () => {
      const w = host.clientWidth;
      if (w <= 500) {
        patch.style.left = "8px";
        patch.style.width = `${w - 16}px`;
        patch.style.top = "103px";
        patch.style.height = "85px";
      } else {
        const col = (w - 40) / 3;
        patch.style.left = `${20 + col}px`;
        patch.style.width = `${col}px`;
        patch.style.top = "21px";
        patch.style.height = "150px";
      }
    };

    position();
    const ro = new ResizeObserver(position);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
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

        <div id="reservation" className="relative" style={{ width: "100%", padding: 0, margin: 0, background: "#0d2517" }}>
          <div
            ref={patchRef}
            aria-hidden="true"
            className="absolute z-10"
            style={{ backgroundColor: "#0d2517", borderRadius: 12 }}
          />
        </div>
        <div id="script" ref={scriptHostRef} style={{ display: "none" }} />
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
