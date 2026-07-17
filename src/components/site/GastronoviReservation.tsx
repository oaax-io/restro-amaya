import { useEffect, useRef, useState } from "react";

// Visible height in the picker (three tiles) state.
const COLLAPSED_HEIGHT = 260;
// Height used once the user opens the reservation flow.
const EXPANDED_HEIGHT = 900;

export function GastronoviReservation() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const applyIframeStyles = () => {
      const iframe = host.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;
      iframe.style.width = "100%";
      iframe.style.display = "block";
      iframe.style.border = "0";
      iframe.style.margin = "0";
      // Iframe itself is tall so all internal flows fit; the wrapper crops it.
      iframe.style.height = `${EXPANDED_HEIGHT}px`;
      iframe.style.minHeight = "unset";
      iframe.style.maxHeight = "unset";
    };

    const observer = new MutationObserver(applyIframeStyles);
    observer.observe(host, { childList: true, subtree: true });

    // Widget script inserts an iframe BEFORE its own <script> tag,
    // so the script must live inside the styled container.
    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    host.appendChild(script);

    const timer = window.setTimeout(applyIframeStyles, 1000);

    // When the user clicks inside the iframe area, expand the visible window
    // so any opened form/flow isn't cut off.
    const onBlur = () => {
      if (document.activeElement && document.activeElement.tagName === "IFRAME") {
        setExpanded(true);
      }
    };
    window.addEventListener("blur", onBlur);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("blur", onBlur);
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
          style={{
            height: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
            transition: "height 300ms ease",
          }}
          className="gastronovi-widget relative w-full overflow-hidden"
        />
      </div>
    </section>
  );
}