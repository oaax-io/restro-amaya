import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  CalendarCheck,
  UtensilsCrossed,
  Briefcase,
  Mail,
  Image as ImageIcon,
  Users,
  BarChart3,
  Eye,
  Layers,
  ArrowRight,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Sun,
  CloudSun,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const CARD = "bg-white rounded-lg border border-black/10 p-6 shadow-sm";

function weatherIcon(code: number) {
  if (code === 0) return Sun;
  if (code <= 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code >= 45 && code <= 48) return CloudFog;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 95) return CloudLightning;
  if (code >= 51) return CloudRain;
  return Cloud;
}

function weatherLabel(code: number) {
  if (code === 0) return "Klar";
  if (code <= 2) return "Leicht bewölkt";
  if (code === 3) return "Bedeckt";
  if (code >= 45 && code <= 48) return "Nebel";
  if (code >= 71 && code <= 77) return "Schnee";
  if (code >= 95) return "Gewitter";
  if (code >= 51) return "Regen";
  return "Wechselhaft";
}

function GreetingHeader() {
  const [now, setNow] = useState(() => new Date());
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const full = (u.user_metadata?.full_name as string) || "";
      setName(full || (u.email ? u.email.split("@")[0] : ""));
    });
  }, []);

  const weather = useQuery({
    queryKey: ["admin", "weather"],
    staleTime: 15 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=47.3769&longitude=8.5417&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FZurich&forecast_days=1",
      );
      if (!res.ok) throw new Error("weather");
      return (await res.json()) as {
        current: { temperature_2m: number; weather_code: number };
        daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
      };
    },
  });

  const hour = now.getHours();
  const greeting = hour < 5 ? "Gute Nacht" : hour < 11 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  const Icon = weather.data ? weatherIcon(weather.data.current.weather_code) : Cloud;

  return (
    <div className="rounded-2xl bg-[#0D2517] text-white p-6 lg:p-8 shadow-sm overflow-hidden relative">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C8A96A]/15 blur-2xl" aria-hidden />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96A]">Amaya Admin</p>
          <h1 className="font-display text-3xl lg:text-4xl mt-3">
            {greeting}
            {name ? `, ${name}` : ""}.
          </h1>
          <p className="text-white/60 mt-2 capitalize">
            {now.toLocaleDateString("de-CH", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-display text-4xl lg:text-5xl tabular-nums">
              {now.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}
              <span className="text-lg text-[#C8A96A] ml-1">
                {now.toLocaleTimeString("de-CH", { second: "2-digit" }).padStart(2, "0")}
              </span>
            </p>
            <p className="text-xs tracking-[0.25em] uppercase text-white/50 mt-1">Zürich</p>
          </div>
          <div className="h-14 w-px bg-white/15" />
          <div className="flex items-center gap-3">
            <Icon size={38} className="text-[#C8A96A]" />
            <div>
              <p className="font-display text-3xl tabular-nums">
                {weather.data ? `${Math.round(weather.data.current.temperature_2m)}°` : "—"}
              </p>
              <p className="text-xs text-white/60">
                {weather.data ? weatherLabel(weather.data.current.weather_code) : "Wetter lädt…"}
              </p>
              {weather.data && (
                <p className="text-xs text-white/40">
                  {Math.round(weather.data.daily.temperature_2m_min[0])}° / {Math.round(weather.data.daily.temperature_2m_max[0])}°
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  const since = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString();
  }, []);

  const q = useQuery({
    queryKey: ["admin", "dashboard-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_pageviews")
        .select("path, visitor_id, session_id, device_type, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(20000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = q.data ?? [];

  const series = useMemo(() => {
    const map = new Map<string, { date: string; views: number; visitors: Set<string> }>();
    const start = new Date(since);
    const end = new Date();
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
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
      .map((e) => ({ date: e.date.slice(5), views: e.views, visitors: e.visitors.size }));
  }, [rows, since]);

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

  const topPages = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.path, (m.get(r.path) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [rows]);

  const devices = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.device_type, (m.get(r.device_type) ?? 0) + 1));
    return ["mobile", "tablet", "desktop"].map((d) => ({ device: d, count: m.get(d) ?? 0 }));
  }, [rows]);

  const maxTop = topPages[0]?.[1] ?? 1;

  const mini = [
    { label: "Besucher", value: kpis.visitors, icon: Users },
    { label: "Seitenaufrufe", value: kpis.pageviews, icon: Eye },
    { label: "Sitzungen", value: kpis.sessions, icon: Layers },
    { label: "Seiten / Sitzung", value: kpis.perSession, icon: BarChart3 },
  ] as const;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl text-[#0D2517]">Website Analytics</h2>
          <p className="text-black/60 text-sm mt-1">Letzte 14 Tage</p>
        </div>
        <Link to="/admin/analytics" className="inline-flex items-center gap-2 text-sm text-[#0D2517] hover:text-[#C8A96A] transition-colors">
          Detaillierte Statistik <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {mini.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={CARD}>
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.25em] uppercase text-black/60">{m.label}</p>
                <Icon size={18} className="text-[#0D2517]" />
              </div>
              <p className="mt-3 font-display text-3xl text-[#0D2517]">{q.isLoading ? "—" : m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-4">
        <div className={`${CARD} lg:col-span-2`}>
          <p className="text-xs tracking-[0.25em] uppercase text-black/60">Besucherverlauf</p>
          <ChartContainer
            className="mt-4 h-[260px] w-full"
            config={{
              views: { label: "Seitenaufrufe", color: "#0D2517" },
              visitors: { label: "Besucher", color: "#C8A96A" },
            }}
          >
            <AreaChart data={series}>
              <defs>
                <linearGradient id="dashViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D2517" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0D2517" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C8A96A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} width={32} fontSize={12} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="views" stroke="#0D2517" fill="url(#dashViews)" strokeWidth={2} />
              <Area type="monotone" dataKey="visitors" stroke="#C8A96A" fill="url(#dashVisitors)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className={CARD}>
          <p className="text-xs tracking-[0.25em] uppercase text-black/60">Geräte</p>
          <ChartContainer className="mt-4 h-[260px] w-full" config={{ count: { label: "Aufrufe", color: "#0D2517" } }}>
            <BarChart data={devices}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="device" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} width={32} fontSize={12} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="#0D2517" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className={`${CARD} mt-4`}>
        <p className="text-xs tracking-[0.25em] uppercase text-black/60">Top-Seiten</p>
        <div className="mt-4 space-y-3">
          {topPages.length === 0 && <p className="text-sm text-black/50">Noch keine Daten erfasst.</p>}
          {topPages.map(([path, count]) => (
            <div key={path}>
              <div className="flex items-center justify-between text-sm text-[#0D2517]">
                <span className="truncate">{path}</span>
                <span className="tabular-nums text-black/60">{count}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                <div className="h-full rounded-full bg-[#C8A96A]" style={{ width: `${(count / maxTop) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [res, menu, jobs, news, gal] = await Promise.all([
        supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("menu_items").select("*", { count: "exact", head: true }).eq("is_visible", true),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("is_open", true),
        supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("gallery_images").select("*", { count: "exact", head: true }),
      ]);
      return {
        pending: res.count ?? 0,
        menuVisible: menu.count ?? 0,
        openJobs: jobs.count ?? 0,
        subscribers: news.count ?? 0,
        images: gal.count ?? 0,
      };
    },
  });

  const analytics = useQuery({
    queryKey: ["admin", "analytics-summary"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const week = new Date();
      week.setDate(week.getDate() - 7);
      const [todayRes, weekRes] = await Promise.all([
        supabase.from("analytics_pageviews").select("visitor_id").gte("created_at", today.toISOString()).limit(20000),
        supabase.from("analytics_pageviews").select("visitor_id, path").gte("created_at", week.toISOString()).limit(20000),
      ]);
      const todayVisitors = new Set((todayRes.data ?? []).map((r) => r.visitor_id)).size;
      const weekVisitors = new Set((weekRes.data ?? []).map((r) => r.visitor_id)).size;
      const counts = new Map<string, number>();
      (weekRes.data ?? []).forEach((r) => counts.set(r.path, (counts.get(r.path) ?? 0) + 1));
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      return { todayVisitors, weekVisitors, topPath: top?.[0] ?? "—", topCount: top?.[1] ?? 0 };
    },
  });

  const cards = [
    { label: "Offene Reservierungen", value: stats.data?.pending ?? "—", icon: CalendarCheck, to: "/admin/reservations" },
    { label: "Sichtbare Gerichte", value: stats.data?.menuVisible ?? "—", icon: UtensilsCrossed, to: "/admin/menu" },
    { label: "Offene Stellen", value: stats.data?.openJobs ?? "—", icon: Briefcase, to: "/admin/jobs" },
    { label: "Newsletter-Abos", value: stats.data?.subscribers ?? "—", icon: Mail, to: "/admin/newsletter" },
    { label: "Galerie-Bilder", value: stats.data?.images ?? "—", icon: ImageIcon, to: "/admin/gallery" },
  ] as const;

  return (
    <div>
      <GreetingHeader />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        <Link to="/admin/analytics" className="bg-white rounded-lg border border-black/10 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.25em] uppercase text-black/60">Besucher heute</p>
            <Users size={20} className="text-[#0D2517]" />
          </div>
          <p className="mt-4 font-display text-4xl text-[#0D2517]">{analytics.data?.todayVisitors ?? "—"}</p>
          <p className="mt-1 text-sm text-black/50">diese Woche: {analytics.data?.weekVisitors ?? "—"}</p>
        </Link>
        <Link to="/admin/analytics" className="bg-white rounded-lg border border-black/10 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.25em] uppercase text-black/60">Meistbesuchte Seite</p>
            <BarChart3 size={20} className="text-[#0D2517]" />
          </div>
          <p className="mt-4 font-display text-2xl text-[#0D2517] truncate">{analytics.data?.topPath ?? "—"}</p>
          <p className="mt-1 text-sm text-black/50">{analytics.data?.topCount ?? 0} Aufrufe (7 Tage)</p>
        </Link>
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-lg border border-black/10 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.25em] uppercase text-black/60">{c.label}</p>
                <Icon size={20} className="text-[#0D2517]" />
              </div>
              <p className="mt-4 font-display text-4xl text-[#0D2517]">{c.value}</p>
            </div>
          );
        })}
      </div>
      <AnalyticsSection />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl text-[#0D2517]">{title}</h1>
        {subtitle && <p className="text-black/60 mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
