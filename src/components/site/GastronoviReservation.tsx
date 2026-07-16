import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const CROP_TOP = 24;
    const CROP_BOTTOM = 28;
    const VISIBLE_HEIGHT = 300;

    const compactWidget = () => {
      const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;
      iframe.style.width = "100%";
      iframe.style.display = "block";
      iframe.style.border = "0";
      // Make iframe taller than visible area, then shift up to crop
      // the empty whitespace inside the cross-origin document.
      iframe.style.height = `${VISIBLE_HEIGHT + CROP_TOP + CROP_BOTTOM}px`;
      iframe.style.minHeight = `${VISIBLE_HEIGHT + CROP_TOP + CROP_BOTTOM}px`;
      iframe.style.marginTop = `-${CROP_TOP}px`;
      iframe.style.marginBottom = `-${CROP_BOTTOM}px`;
    };

    const observer = new MutationObserver(compactWidget);
    observer.observe(host, { childList: true, subtree: true });

    // Widget script inserts an iframe BEFORE its own <script> tag,
    // so the script must live inside the styled container.
    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    host.appendChild(script);
    const timer = window.setTimeout(compactWidget, 1200);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
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
          style={{ height: 300 }}
          className="gastronovi-widget relative overflow-hidden rounded-lg border border-gold/25 bg-bone shadow-[0_18px_48px_-24px_rgba(0,0,0,0.75)] [&_iframe]:!block [&_iframe]:!w-full [&_iframe]:!border-0"
        />
      </div>
    </section>
  );
}