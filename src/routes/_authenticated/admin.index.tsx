import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCheck, UtensilsCrossed, Briefcase, Mail, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

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

  const cards = [
    { label: "Offene Reservierungen", value: stats.data?.pending ?? "—", icon: CalendarCheck, to: "/admin/reservations" },
    { label: "Sichtbare Gerichte", value: stats.data?.menuVisible ?? "—", icon: UtensilsCrossed, to: "/admin/menu" },
    { label: "Offene Stellen", value: stats.data?.openJobs ?? "—", icon: Briefcase, to: "/admin/jobs" },
    { label: "Newsletter-Abos", value: stats.data?.subscribers ?? "—", icon: Mail, to: "/admin/newsletter" },
    { label: "Galerie-Bilder", value: stats.data?.images ?? "—", icon: ImageIcon, to: "/admin/gallery" },
  ] as const;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Willkommen zurück im Amaya Admin-Bereich." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
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
