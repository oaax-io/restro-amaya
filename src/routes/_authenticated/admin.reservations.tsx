import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn } from "@/components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/reservations")({
  component: ReservationsAdmin,
});

type Status = "pending" | "confirmed" | "declined" | "cancelled" | "completed";
const STATUS_LABEL: Record<Status, string> = {
  pending: "Neu", confirmed: "Bestätigt", declined: "Abgelehnt", cancelled: "Storniert", completed: "Abgeschlossen",
};
const STATUS_COLOR: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-slate-100 text-slate-700",
  completed: "bg-slate-100 text-slate-700",
};

function ReservationsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");

  const q = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reservations")
        .select("*").order("reservation_date", { ascending: false }).order("reservation_time", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function updateStatus(id: string, status: Status) {
    await supabase.from("reservations").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "reservations"] });
    qc.invalidateQueries({ queryKey: ["admin", "stats"] });
  }

  const items = (q.data ?? []).filter((r) => filter === "all" || r.status === filter);

  return (
    <div>
      <PageHeader title="Reservierungen" subtitle="Alle Anfragen bestätigen, ablehnen oder abschließen." />
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all","pending","confirmed","declined","cancelled","completed"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full border ${filter===s ? "bg-[#0D2517] text-[#F3E7D7] border-[#0D2517]" : "bg-white border-black/15"}`}>
            {s === "all" ? "Alle" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      <Card className="mt-6 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-left">
              <tr>
                <th className="p-3">Datum</th><th className="p-3">Zeit</th><th className="p-3">Name</th>
                <th className="p-3">Kontakt</th><th className="p-3">Pers.</th><th className="p-3">Status</th><th className="p-3">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {q.isLoading && <tr><td colSpan={7} className="p-8 text-center text-black/50">Lädt…</td></tr>}
              {!q.isLoading && items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-black/50">Keine Anfragen.</td></tr>}
              {items.map((r) => (
                <tr key={r.id} className="border-t border-black/5 align-top">
                  <td className="p-3 whitespace-nowrap">{r.reservation_date}</td>
                  <td className="p-3 whitespace-nowrap">{r.reservation_time?.slice(0,5)}</td>
                  <td className="p-3">
                    <div className="font-medium">{r.name}</div>
                    {r.notes && <div className="text-xs text-black/60 mt-1 max-w-xs">{r.notes}</div>}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <a href={`mailto:${r.email}`} className="text-[#0D2517] underline">{r.email}</a>
                    {r.phone && <div className="text-xs text-black/60"><a href={`tel:${r.phone}`}>{r.phone}</a></div>}
                  </td>
                  <td className="p-3">{r.party_size}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${STATUS_COLOR[r.status as Status]}`}>
                      {STATUS_LABEL[r.status as Status]}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.status !== "confirmed" && <Btn onClick={() => updateStatus(r.id, "confirmed")} className="px-2 py-1 text-xs">Bestätigen</Btn>}
                      {r.status !== "declined" && <Btn variant="ghost" onClick={() => updateStatus(r.id, "declined")} className="px-2 py-1 text-xs">Ablehnen</Btn>}
                      {r.status !== "completed" && <Btn variant="ghost" onClick={() => updateStatus(r.id, "completed")} className="px-2 py-1 text-xs">Abgeschlossen</Btn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
