import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export type GastronoviEntryPoint = "reservation" | "pickup" | "voucher";

const IFRAME_BASE = "https://services.gastronovi.com/restaurants/108779/reservierung/widget";

/**
 * Direct inline embed URL per entry point. `embed=1` + `fixedButton=0` force
 * Gastronovi to render the module inline — without them the script falls back
 * to a button that opens a new browser window (especially on mobile).
 */
const iframeUrl = (entryPoint: GastronoviEntryPoint) =>
  `${IFRAME_BASE}?entry=${entryPoint}&embed=1&companyRoute=1&fixedButton=0&L=de_CH&iframeId=${SCRIPT_ID}`;

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
const SCRIPT_ID = "amaya-gastronovi-entry-script";
const WIDGET_HOST_ID = "amaya-gastronovi-widget-host";

const removeExistingWidget = () => {
  document.getElementById(SCRIPT_ID)?.remove();
  document
    .querySelectorAll<HTMLElement>(`[data-amaya-gastronovi-widget]:not(#${WIDGET_HOST_ID})`)
    .forEach((node) => node.remove());
};

/**
 * Embeds exactly one Gastronovi entry point as a direct inline iframe.
 * iframe + listeners are removed again on unmount / entry change, so there
 * is never more than one active Gastronovi widget on the page.
 */
export function GastronoviWidget({
  entryPoint,
  fill = false,
}: {
  entryPoint: GastronoviEntryPoint;
  /** Fill the parent's height and let the module scroll inside itself
   *  (used in the chat panel, where outer growth would clip the content). */
  fill?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    setReady(false);
    removeExistingWidget();
    host.replaceChildren();
    host.dataset.amayaGastronoviWidget = entryPoint;

    // Delay one frame so React's development remount cannot build the
    // widget twice. The stable ID is an additional singleton guard.
    const loadFrame = window.requestAnimationFrame(() => {
      if (disposed || !host.isConnected) return;
      const frame = document.createElement("iframe");
      frame.id = SCRIPT_ID;
      frame.src = iframeUrl(entryPoint);
      frame.title = "Gastronovi";
      frame.style.width = "100%";
      frame.style.border = "none";
      frame.style.background = "transparent";
      frame.style.display = "block";
      frame.style.height = `${MIN_HEIGHT}px`;
      frame.setAttribute("loading", "eager");
      frame.addEventListener("load", () => setReady(true));
      host.appendChild(frame);
    });

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
      disposed = true;
      window.cancelAnimationFrame(loadFrame);
      window.removeEventListener("message", onMessage);
      host.replaceChildren();
      delete host.dataset.amayaGastronoviWidget;
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
      <div id={WIDGET_HOST_ID} ref={hostRef} className="w-full" />
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
