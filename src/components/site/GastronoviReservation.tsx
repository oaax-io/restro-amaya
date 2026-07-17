import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const applyStyles = () => {
      const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;
      iframe.style.width = "100%";
      iframe.style.display = "block";
      iframe.style.border = "0";
      iframe.style.backgroundColor = "#0d2517";
      iframe.style.minHeight = "unset";
      iframe.style.maxHeight = "unset";
      iframe.style.margin = "0";
      if (!iframe.style.height || iframe.style.height === "0px") {
        iframe.style.height = "500px";
      }
    };

    const observer = new MutationObserver(applyStyles);
    observer.observe(host, { childList: true, subtree: true });

    let resizeObserver: ResizeObserver | null = null;
    const trySameOriginObserve = () => {
      const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;
      try {
        const doc = iframe.contentDocument;
        if (!doc || !doc.body) return;
        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(() => {
          const h = doc.documentElement.scrollHeight || doc.body.scrollHeight;
          if (h > 0) iframe.style.height = `${h}px`;
        });
        resizeObserver.observe(doc.body);
      } catch {
        // cross-origin — rely on postMessage instead
      }
    };

    const onMessage = (e: MessageEvent) => {
      const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;
      const data = e.data as { height?: number; type?: string } | undefined;
      if (!data) return;
      if (typeof data.height === "number") {
        iframe.style.height = `${data.height}px`;
      }
      if (data.type === "resize" && typeof data.height === "number") {
        iframe.style.height = `${data.height}px`;
      }
    };
    window.addEventListener("message", onMessage);

    // Widget script inserts an iframe BEFORE its own <script> tag,
    // so the script must live inside the styled container.
    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    host.appendChild(script);

    const t1 = window.setTimeout(applyStyles, 600);
    const t2 = window.setTimeout(() => {
      applyStyles();
      trySameOriginObserve();
    }, 1500);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("message", onMessage);
      host.innerHTML = "";
    };
  }, []);

  return (
    <section id="online-reservation" className="relative bg-background py-8 lg:py-12">
      {/* Seamless fade from the slider above */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto max-w-2xl px-6 lg:px-8">
        <div className="text-center mb-5">
          <p className="mono-label text-gold">— Online Reservation —</p>
          <h2 className="display-serif text-3xl lg:text-4xl mt-2 text-gradient-gold">
            Tisch reservieren
          </h2>
          <div className="mx-auto mt-3 h-px w-14 hairline-gold" />
        </div>

        <div
          ref={hostRef}
          id="reservation"
          style={{ backgroundColor: "#0d2517", padding: 0, margin: 0, width: "100%" }}
          className="gastronovi-widget relative w-full [&_iframe]:!block [&_iframe]:!w-full [&_iframe]:!border-0"
        />
      </div>
    </section>
  );
}