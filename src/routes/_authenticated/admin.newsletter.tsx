import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn } from "@/components/admin/ui";
import { Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/newsletter")({
  component: NewsletterAdmin,
});

function NewsletterAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin","newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function unsub(id: string) {
    await supabase.from("newsletter_subscribers").update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","newsletter"] });
    qc.invalidateQueries({ queryKey: ["admin","stats"] });
  }
  async function remove(id: string) {
    if (!confirm("Eintrag endgültig löschen?")) return;
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","newsletter"] });
  }
  function exportCsv() {
    const rows = q.data ?? [];
    const csv = ["email,status,subscribed_at,source", ...rows.map((r) => [r.email, r.status, r.subscribed_at, r.source ?? ""].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `newsletter-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader title="Newsletter" subtitle="Alle Anmeldungen aus der Website."
        action={<Btn onClick={exportCsv} disabled={!q.data?.length}><span className="inline-flex items-center gap-2"><Download size={16} />CSV Export</span></Btn>}
      />
      <Card className="mt-6 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-left">
              <tr><th className="p-3">E-Mail</th><th className="p-3">Status</th><th className="p-3">Angemeldet</th><th className="p-3">Quelle</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {(q.data ?? []).map((r) => (
                <tr key={r.id} className="border-t border-black/5">
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${r.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                      {r.status === "active" ? "Aktiv" : "Abgemeldet"}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{new Date(r.subscribed_at).toLocaleDateString("de-CH")}</td>
                  <td className="p-3 text-xs text-black/60">{r.source ?? "—"}</td>
                  <td className="p-3 text-right space-x-2">
                    {r.status === "active" && <Btn variant="ghost" onClick={() => unsub(r.id)} className="px-2 py-1 text-xs">Abmelden</Btn>}
                    <Btn variant="danger" onClick={() => remove(r.id)} className="p-2"><Trash2 size={14} /></Btn>
                  </td>
                </tr>
              ))}
              {q.data?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-black/50">Noch keine Anmeldungen.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
