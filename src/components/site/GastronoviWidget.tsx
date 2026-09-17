import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export type GastronoviEntryPoint = "reservation" | "pickup" | "voucher";

const SCRIPT_BASE = "https://services.gastronovi.com/restaurants/108779/scripts/reservation/entry";

const scriptUrl = (entryPoint: GastronoviEntryPoint) =>
  `${SCRIPT_BASE}/${entryPoint}?L=de_CH`;

const isGastronoviOrigin = (origin: string) => {
  try {
    return /(^|\.)gastronovi\.com$/.test(new URL(origin).hostname);
  } catch {
    return false;
  }
};

const extractHeight = (data: unknown): number | null => {
  if (typeof data === "number" && data > 0) return data;
  if (typeof data === "string") {
    try {
      const nested = extractHeight(JSON.parse(data));
      if (nested) return nested;
    } catch {
      /* not JSON */
    }
    const m = data.match(/(\d{2,5})(?:px)?\s*$/);
    if (m && /height/i.test(data)) return Number(m[1]);
    return null;
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["height", "iframeHeight", "scrollHeight", "documentHeight"]) {
      const v = o[k];
      if (typeof v === "number" && v > 0) return v;
      if (typeof v === "string" && Number(v) > 0) return Number(v);
    }
  }
  return null;
};

const MIN_HEIGHT = 700;

/**
 * Loads exactly one Gastronovi entry-point script into its own container.
 * Script, injected nodes and listeners are removed again on unmount / entry change,
 * so there is never more than one active Gastronovi widget on the page.
 */
export function GastronoviWidget({ entryPoint }: { entryPoint: GastronoviEntryPoint }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setReady(false);
    host.innerHTML = "";

    const script = document.createElement("script");
    script.src = scriptUrl(entryPoint);
    script.async = true;
    script.dataset.gastronovi = entryPoint;
    host.appendChild(script);

    // Style only the iframe(s) Gastronovi injects inside this container.
    const styleIframes = () => {
      const frames = host.querySelectorAll("iframe");
      frames.forEach((f) => {
        f.style.width = "100%";
        f.style.border = "none";
        f.style.background = "transparent";
        f.style.display = "block";
        if (!f.style.height || parseInt(f.style.height, 10) < MIN_HEIGHT) {
          f.style.height = `${MIN_HEIGHT}px`;
        }
      });
      if (frames.length > 0) setReady(true);
    };

    const observer = new MutationObserver(styleIframes);
    observer.observe(host, { childList: true, subtree: true });
    styleIframes();

    const onMessage = (e: MessageEvent) => {
      if (!isGastronoviOrigin(e.origin)) return;
      const h = extractHeight(e.data);
      if (!h) return;
      const frame = host.querySelector("iframe");
      if (frame instanceof HTMLIFrameElement) {
        frame.style.height = `${Math.max(h + 40, MIN_HEIGHT)}px`;
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      observer.disconnect();
      host.innerHTML = "";
      // Remove any Gastronovi script/style nodes that landed outside our host.
      document
        .querySelectorAll<HTMLElement>(
          'script[src*="services.gastronovi.com"], link[href*="services.gastronovi.com"]',
        )
        .forEach((n) => n.remove());
    };
  }, [entryPoint]);

  return (
    <div className="relative w-full overflow-x-hidden">
      <div ref={hostRef} className="w-full" />
      {!ready && (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-7 w-7 animate-spin text-[#E9A580]/80" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#E9A580]/60">
            Einen Moment …
          </span>
        </div>
      )}
    </div>
  );
}
