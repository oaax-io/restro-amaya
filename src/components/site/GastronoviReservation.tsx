import { useEffect, useRef } from "react";

export function GastronoviReservation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const styleIframes = () => {
      host.querySelectorAll("iframe").forEach((iframe) => {
        const el = iframe as HTMLIFrameElement;
        el.style.border = "none";
        el.style.background = "transparent";
        el.style.backgroundColor = "#0d2517";
        el.style.display = "block";
        el.style.width = "100%";
        el.style.minHeight = "unset";
      });
    };

    const observer = new MutationObserver(styleIframes);
    observer.observe(host, { childList: true, subtree: true });

    const onMessage = (e: MessageEvent) => {
      const data = e.data as { height?: number } | undefined;
      if (data && typeof data.height === "number") {
        host.querySelectorAll("iframe").forEach((iframe) => {
          (iframe as HTMLIFrameElement).style.height = `${data.height}px`;
        });
      }
    };
    window.addEventListener("message", onMessage);

    // Widget script inserts the iframe BEFORE its own <script> tag,
    // so the script must live inside the styled container.
    const script = document.createElement("script");
    script.src = "https://services.gastronovi.com/restaurants/108779/scripts/reservation";
    script.type = "text/javascript";
    script.async = true;
    host.appendChild(script);

    const timer = window.setTimeout(styleIframes, 1000);

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
          style={{ background: "#0d2517", width: "100%", padding: 0, margin: 0 }}
          className="gastronovi-widget relative"
        />
      </div>
    </section>
  );
}