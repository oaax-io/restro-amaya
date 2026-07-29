import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card } from "@/components/admin/ui";
import { MemberRequests } from "@/components/admin/MemberRequests";
import { Crown, CalendarCheck, Briefcase, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/inquiries")({
  component: InquiriesAdmin,
});

type Category = "members" | "reservations" | "applications" | "newsletter";

function InquiriesAdmin() {
  const [tab, setTab] = useState<Category>("members");

  const counts = useQuery({
    queryKey: ["admin", "inquiry-counts"],
    queryFn: async () => {
      const [members, reservations, applications, newsletter] = await Promise.all([
        supabase.from("lounge_members" as never).select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);
      return {
        members: members.count ?? 0,
        reservations: reservations.count ?? 0,
        applications: applications.count ?? 0,
        newsletter: newsletter.count ?? 0,
      };
    },
  });

  const TABS: { key: Category; label: string; icon: typeof Crown }[] = [
    { key: "members", label: "Mitgliederanträge", icon: Crown },
    { key: "reservations", label: "Reservierungen", icon: CalendarCheck },
    { key: "applications", label: "Bewerbungen", icon: Briefcase },
    { key: "newsletter", label: "Newsletter", icon: Mail },
  ];

  return (
    <div>
      <PageHeader title="Anfragen" subtitle="Alle eingehenden Anfragen — nach Kategorie sortiert." />

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          const n = counts.data?.[t.key];
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest transition"
              style={{
                background: active ? "#0D2517" : "transparent",
                color: active ? "#F3E7D7" : "#0D2517",
                border: "1px solid rgba(13,37,23,0.2)",
              }}
            >
              <Icon size={13} />
              {t.label}
              {typeof n === "number" && n > 0 && (
                <span
                  className="ml-1 px-1.5 rounded-full text-[10px]"
                  style={{ background: active ? "#E9A580" : "rgba(13,37,23,0.1)", color: "#0D2517" }}
                >
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "members" && <MemberRequests />}
        {tab === "reservations" && (
          <Shortcut
            to="/admin/reservations"
            title="Reservierungsanfragen"
            count={counts.data?.reservations}
            text="Offene Tischreservierungen bestätigen, ablehnen oder anpassen."
          />
        )}
        {tab === "applications" && (
          <Shortcut
            to="/admin/applications"
            title="Stellenbewerbungen"
            count={counts.data?.applications}
            text="Neue Bewerbungen inkl. Lebenslauf einsehen und Status setzen."
          />
        )}
        {tab === "newsletter" && (
          <Shortcut
            to="/admin/newsletter"
            title="Newsletter-Anmeldungen"
            count={counts.data?.newsletter}
            text="Alle aktiven Abonnentinnen und Abonnenten verwalten."
          />
        )}
      </div>
    </div>
  );
}

function Shortcut({ to, title, text, count }: { to: string; title: string; text: string; count?: number }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display text-2xl text-[#0D2517]">{title}</h3>
          <p className="text-sm text-black/60 mt-2">{text}</p>
          <p className="text-sm text-black/50 mt-1">Offen: {count ?? "—"}</p>
        </div>
        <Link
          to={to}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#0D2517] text-white text-sm hover:bg-[#0D2517]/90"
        >
          Öffnen <ArrowRight size={15} />
        </Link>
      </div>
    </Card>
  );
}
