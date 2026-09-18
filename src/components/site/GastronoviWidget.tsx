import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export type GastronoviEntryPoint = "reservation" | "pickup" | "voucher";

const IFRAME_BASE = "https://services.gastronovi.com/restaurants/108779/reservation/widget/entry";

/**
 * Direct inline embed URL per entry point. `embed=1` + `fixedButton=0` force
 * Gastronovi to render the module inline — without them the script falls back
 * to a button that opens a new browser window (especially on mobile).
 */
const iframeUrl = (entryPoint: GastronoviEntryPoint) =>
  `${IFRAME_BASE}/${entryPoint}/referral?embed=1&companyRoute=1&resetlang=1&fixedButton=0&L=de_CH&iframeId=${SCRIPT_ID}`;

const isGastronoviOrigin = (origin: string) => {
  try {
    return /(^|\.)gastronovi\.com$/.test(new URL(origin).hostname);
  } catch {
    return false;
  }
};

const extractHeight = (data: unknown): number | null => {
  // Gastronovi's official embed sends [iframeId, "setHeight", height].
  if (Array.isArray(data)) {
    if (data[0] !== SCRIPT_ID || data[1] !== "setHeight") return null;
    const value = data[2];
    if (typeof value === "number" && value > 0) return value;
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
  }
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
  minHeight = MIN_HEIGHT,
}: {
  entryPoint: GastronoviEntryPoint;
  /** Fill the parent's height and let the module scroll inside itself. */
  fill?: boolean;
  /** Minimum iframe height in grow mode (the iframe grows with its content). */
  minHeight?: number;
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
      frame.style.height = `${minHeight}px`;
      frame.style.overflow = "hidden";
      frame.setAttribute("scrolling", "no");
      frame.setAttribute("allow", "payment");
      frame.setAttribute("loading", "eager");
      frame.addEventListener("load", () => setReady(true));
      host.appendChild(frame);
    });

    const onMessage = (e: MessageEvent) => {
      if (!isGastronoviOrigin(e.origin)) return;
      const frame = host.querySelector("iframe");
      if (!(frame instanceof HTMLIFrameElement) || e.source !== frame.contentWindow) return;
      const h = extractHeight(e.data);
      if (!h) return;
      // Always grow to Gastronovi's full reported document height. The parent
      // chat owns scrolling, preventing the bottom action bar being clipped.
      frame.style.height = `${Math.max(Math.ceil(h) + 24, minHeight)}px`;
      setReady(true);
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
  }, [entryPoint, fill, minHeight]);

  return (
    <div
      className={
        fill
          ? "relative flex min-h-0 w-full flex-col overflow-x-hidden"
          : "relative w-full overflow-x-hidden"
      }
    >
      <div
        id={WIDGET_HOST_ID}
        ref={hostRef}
        className="w-full"
      />
      {!ready && (
        <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-7 w-7 animate-spin text-[#E9A580]/80" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#E9A580]/60">
            Einen Moment …
          </span>
        </div>
      )}
    </div>
  );
}
