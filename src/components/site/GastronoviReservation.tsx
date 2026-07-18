import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const scriptHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptHost = scriptHostRef.current;
    const reservation = document.getElementById("reservation");
    if (!scriptHost) return;

    const showMainWidget = () => {
      const iframe = document.getElementById("gastronaviReservationWidget-0") as HTMLIFrameElement | null;
      if (!iframe) return;

      if (reservation && iframe.parentElement !== reservation) {
        reservation.appendChild(iframe);
      }

      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.minHeight = "320px";
      iframe.style.backgroundColor = "#0d2517";
      iframe.style.border = "0";
      iframe.style.display = "block";
      iframe.style.visibility = "visible";
    };

    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    scriptHost.appendChild(script);

    const fixIframeHeight = () => {
      const iframe = document.getElementById("gastronaviReservationWidget-0") as HTMLIFrameElement | null;
      if (!iframe) return;
      showMainWidget();
      try {
        const contentHeight = iframe.contentDocument?.body?.scrollHeight;
        if (contentHeight && contentHeight > 0) {
          iframe.style.height = contentHeight + "px";
          return;
        }
      } catch {}
      if (!iframe.style.height || iframe.style.height === "0px") {
        iframe.style.height = "320px";
      }
    };

    const handleMessage = (e: MessageEvent) => {
      const iframe = document.getElementById("gastronaviReservationWidget-0") as HTMLIFrameElement | null;
      if (!iframe) return;
      if (e.data && typeof e.data === "object" && (e.data as any).height) {
        iframe.style.height = (e.data as any).height + "px";
      }
      if (e.data && typeof e.data === "object" && (e.data as any).type === "resize") {
        iframe.style.height = (e.data as any).height + "px";
      }
    };

    window.addEventListener("message", handleMessage);

    const observer = new MutationObserver(() => showMainWidget());
    observer.observe(document.body, { childList: true, subtree: true });

    const interval = setInterval(() => {
      const iframe = document.getElementById("gastronaviReservationWidget-0");
      if (iframe) {
        fixIframeHeight();
      }
    }, 500);

    const stopTimeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      window.removeEventListener("message", handleMessage);
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(stopTimeout);
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

        <div id="reservation" style={{ width: "100%", padding: 0, margin: 0, background: "#0d2517" }} />
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