import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./admin.index";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Users, Eye, MousePointerClick, Layers } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

const RANGES = [
  { key: "1", label: "Heute", days: 1 },
  { key: "7", label: "7 Tage", days: 7 },
  { key: "30", label: "30 Tage", days: 30 },
  { key: "90", label: "90 Tage", days: 90 },
] as const;

function sinceIso(days: number) {
  const d = new Date();
  if (days === 1) d.setHours(0, 0, 0, 0);
  else d.setDate(d.getDate() - days);
  return d.toISOString();
}

const CARD = "bg-white rounded-lg border border-black/10 p-6 shadow-sm";

function AnalyticsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("7");
  const days = RANGES.find((r) => r.key === range)!.days;
  const since = useMemo(() => sinceIso(days), [days]);

  const views = useQuery({
    queryKey: ["analytics", "pageviews", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_pageviews")
        .select("path, visitor_id, session_id, referrer, device_type, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(20000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = views.data ?? [];

  const kpis = useMemo(() => {
    const visitors = new Set(rows.map((r) => r.visitor_id)).size;
    const sessions = new Set(rows.map((r) => r.session_id)).size;
    return {
      visitors,
      pageviews: rows.length,
      sessions,
      perSession: sessions ? (rows.length / sessions).toFixed(1) : "0",
    };
  }, [rows]);

  const series = useMemo(() => {
    const map = new Map<string, { date: string; views: number; visitors: Set<string> }>();
    const start = new Date(since);
    const end = new Date();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key, views: 0, visitors: new Set() });
    }
    for (const r of rows) {
      const key = String(r.created_at).slice(0, 10);
      const e = map.get(key) ?? { date: key, views: 0, visitors: new Set<string>() };
      e.views += 1;
      e.visitors.add(r.visitor_id);
      map.set(key, e);
    }
    return [...map.values()]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: e.date.slice(5),
        views: e.views,
        visitors: e.visitors.size,
      }));
  }, [rows, since]);

  const topPages = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.path, (m.get(r.path) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [rows]);

  const devices = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.device_type, (m.get(r.device_type) ?? 0) + 1));
    return ["mobile", "tablet", "desktop"].map((d) => ({ device: d, count: m.get(d) ?? 0 }));
  }, [rows]);

  const referrers = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      let key = "Direkt / Intern";
      if (r.referrer) {
        try {
          key = new URL(r.referrer).hostname || r.referrer;
        } catch {
          key = r.referrer;
        }
      }
      m.set(key, (m.get(key) ?? 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [rows]);

  const cards = [
    { label: "Besucher", value: kpis.visitors, icon: Users },
    { label: "Seitenaufrufe", value: kpis.pageviews, icon: Eye },
    { label: "Sitzungen", value: kpis.sessions, icon: Layers },
    { label: "Ø Seiten / Sitzung", value: kpis.perSession, icon: MousePointerClick },
  ];

  return (
    <div>
      <PageHeader title="Statistik" subtitle="Eigene Website-Auswertung — keine externen Dienste." />

      <div className="mt-6 inline-flex rounded-lg border border-black/10 bg-white p-1 shadow-sm">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              range === r.key ? "bg-[#0D2517] text-[#F3E7D7]" : "text-black/60 hover:text-black"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={CARD}>
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.25em] uppercase text-black/60">{c.label}</p>
                <Icon size={20} className="text-[#0D2517]" />
              </div>
              <p className="mt-4 font-display text-4xl text-[#0D2517]">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className={`${CARD} mt-6`}>
        <h2 className="font-display text-xl text-[#0D2517] mb-4">Besucherverlauf</h2>
        <ChartContainer
          className="h-[280px] w-full"
          config={{
            views: { label: "Seitenaufrufe", color: "#0D2517" },
            visitors: { label: "Besucher", color: "#E9A580" },
          }}
        >
          <AreaChart data={series}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="views" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.15} />
            <Area type="monotone" dataKey="visitors" stroke="var(--color-visitors)" fill="var(--color-visitors)" fillOpacity={0.2} />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <div className={CARD}>
          <h2 className="font-display text-xl text-[#0D2517] mb-4">Top-Seiten</h2>
          <Table rows={topPages} emptyLabel="Noch keine Daten." />
        </div>
        <div className={CARD}>
          <h2 className="font-display text-xl text-[#0D2517] mb-4">Geräte</h2>
          <ChartContainer className="h-[240px] w-full" config={{ count: { label: "Aufrufe", color: "#0D2517" } }}>
            <BarChart data={devices}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="device" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className={`${CARD} mt-6`}>
        <h2 className="font-display text-xl text-[#0D2517] mb-4">Top-Referrer</h2>
        <Table rows={referrers} emptyLabel="Noch keine Daten." />
      </div>

      <Heatmap since={since} rangeKey={range} />
    </div>
  );
}

function Table({ rows, emptyLabel }: { rows: [string, number][]; emptyLabel: string }) {
  if (!rows.length) return <p className="text-sm text-black/50">{emptyLabel}</p>;
  return (
    <div className="divide-y divide-black/5">
      {rows.map(([key, count]) => (
        <div key={key} className="flex items-center justify-between py-2 gap-4">
          <span className="text-sm text-black/80 truncate">{key}</span>
          <span className="text-sm font-medium text-[#0D2517]">{count}</span>
        </div>
      ))}
    </div>
  );
}

function Heatmap({ since, rangeKey }: { since: string; rangeKey: string }) {
  const [path, setPath] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 900 });

  const clicks = useQuery({
    queryKey: ["analytics", "clicks", rangeKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_clicks")
        .select("path, x_percent, y_percent")
        .gte("created_at", since)
        .limit(20000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const paths = useMemo(() => {
    const m = new Map<string, number>();
    (clicks.data ?? []).forEach((c) => m.set(c.path, (m.get(c.path) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [clicks.data]);

  useEffect(() => {
    if (!path && paths.length) setPath(paths[0][0]);
  }, [paths, path]);

  useEffect(() => {
    function measure() {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: 900 });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const points = useMemo(
    () => (clicks.data ?? []).filter((c) => c.path === path),
    [clicks.data, path],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w) return;
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // intensity layer
    const radius = 32;
    ctx.globalAlpha = 0.35;
    for (const p of points) {
      const x = (Number(p.x_percent) / 100) * canvas.width;
      const y = (Number(p.y_percent) / 100) * canvas.height;
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // colorize by alpha
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (!a) continue;
      const t = Math.min(1, a / 200);
      let r = 0;
      let g = 0;
      let b = 0;
      if (t < 0.35) {
        r = 0; g = 200; b = Math.round(255 * (1 - t / 0.35));
      } else if (t < 0.7) {
        const k = (t - 0.35) / 0.35;
        r = Math.round(255 * k); g = 220; b = 0;
      } else {
        const k = (t - 0.7) / 0.3;
        r = 255; g = Math.round(200 * (1 - k)); b = 0;
      }
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = Math.min(220, a * 2);
    }
    ctx.putImageData(img, 0, 0);
  }, [points, size]);

  return (
    <div className={`${CARD} mt-6`}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="font-display text-xl text-[#0D2517]">Klick-Heatmap</h2>
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="border border-black/15 rounded-md px-3 py-2 text-sm bg-white"
        >
          {paths.length === 0 && <option value="">Keine Klickdaten</option>}
          {paths.map(([p, n]) => (
            <option key={p} value={p}>
              {p} ({n})
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-black/55 mb-4">
        Die Heatmap ist eine Annäherung: Sie basiert auf den geloggten Klick-Koordinaten in Prozent
        der Dokumentbreite/-höhe und wird auf die Vorschaugrösse skaliert. Abweichungen durch andere
        Bildschirmgrössen der Besucher sind möglich. Rot = viele Klicks, Gelb/Grün = wenige.
      </p>

      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-md border border-black/10" style={{ height: size.h }}>
        {path ? (
          <>
            <iframe
              key={path}
              src={path}
              title={`Heatmap ${path}`}
              className="w-full h-full border-0"
              scrolling="no"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ width: "100%", height: "100%" }}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/50">
            Noch keine Klickdaten vorhanden.
          </div>
        )}
      </div>
    </div>
  );
}
