import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const styleIframe = () => {
      const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;
      iframe.style.width = "100%";
      iframe.style.display = "block";
      iframe.style.border = "0";
      iframe.style.background = "transparent";
      iframe.style.minHeight = "900px";
      iframe.style.margin = "0";
    };

    const observer = new MutationObserver(styleIframe);
    observer.observe(host, { childList: true, subtree: true });

    const onMessage = (e: MessageEvent) => {
      const data = e.data as { height?: number } | undefined;
      if (data && typeof data.height === "number") {
        const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
        if (iframe) iframe.style.height = `${data.height}px`;
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
    const timer = window.setTimeout(styleIframe, 1200);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
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
          style={{ background: "transparent", padding: 0, margin: 0, width: "100%" }}
          className="gastronovi-widget relative w-full [&_iframe]:!block [&_iframe]:!w-full [&_iframe]:!min-h-[900px] [&_iframe]:!border-0 [&_iframe]:!bg-transparent"
        />
      </div>
    </section>
  );
}