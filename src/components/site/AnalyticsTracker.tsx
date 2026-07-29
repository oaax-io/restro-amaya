import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "amaya_visitor_id";
const SESSION_KEY = "amaya_session_id";
const SESSION_START_KEY = "amaya_session_started";

function uuid() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function getVisitorId() {
  let v = localStorage.getItem(VISITOR_KEY);
  if (!v) {
    v = uuid();
    localStorage.setItem(VISITOR_KEY, v);
  }
  return v;
}

function getSessionId() {
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s = uuid();
    sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

function deviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function browserName() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

function isTracked(pathname: string) {
  return !pathname.startsWith("/admin") && !pathname.startsWith("/auth");
}

function trackingDisabled() {
  if (typeof navigator === "undefined") return true;
  const dnt =
    navigator.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

export function AnalyticsTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastPath = useRef<string | null>(null);
  const lastClick = useRef(0);

  // Pageviews
  useEffect(() => {
    if (typeof window === "undefined" || trackingDisabled()) return;
    if (!isTracked(pathname) || lastPath.current === pathname) return;
    lastPath.current = pathname;

    const firstOfSession = !sessionStorage.getItem(SESSION_START_KEY);
    if (firstOfSession) sessionStorage.setItem(SESSION_START_KEY, "1");

    void supabase
      .from("analytics_pageviews")
      .insert({
        path: pathname.slice(0, 500),
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        referrer: firstOfSession && document.referrer ? document.referrer.slice(0, 500) : null,
        device_type: deviceType(),
        browser: browserName(),
      })
      .then(() => undefined, () => undefined);
  }, [pathname]);

  // Clicks
  useEffect(() => {
    if (typeof window === "undefined" || trackingDisabled()) return;

    function onClick(e: MouseEvent) {
      const path = window.location.pathname;
      if (!isTracked(path)) return;
      const now = Date.now();
      if (now - lastClick.current < 250) return;
      lastClick.current = now;

      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-analytics-ignore]")) return;

      const docEl = document.documentElement;
      const width = docEl.clientWidth || 1;
      const height = docEl.scrollHeight || 1;
      const x = Math.min(100, Math.max(0, (e.clientX / width) * 100));
      const y = Math.min(100, Math.max(0, ((window.scrollY + e.clientY) / height) * 100));

      void supabase
        .from("analytics_clicks")
        .insert({
          path: path.slice(0, 500),
          session_id: getSessionId(),
          x_percent: Number(x.toFixed(2)),
          y_percent: Number(y.toFixed(2)),
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        })
        .then(() => undefined, () => undefined);
    }

    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
