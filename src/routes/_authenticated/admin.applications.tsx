import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn } from "@/components/admin/ui";
import { Trash2, Mail, Phone, Download, FileText, Calendar, User } from "lucide-react";

const SIGN_TTL = 60 * 60; // 1h

type Status = "new" | "reviewing" | "interview" | "accepted" | "rejected";

type Application = {
  id: string;
  position: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  cv_path: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
};

const STATUS_META: Record<Status, { label: string; bg: string; fg: string }> = {
  new:        { label: "Neu",         bg: "#E9A580", fg: "#0D2517" },
  reviewing:  { label: "In Prüfung",  bg: "#F5D07A", fg: "#3a2a00" },
  interview:  { label: "Interview",   bg: "#7EC8E3", fg: "#0a2a3a" },
  accepted:   { label: "Angenommen",  bg: "#4ADE80", fg: "#052e16" },
  rejected:   { label: "Abgelehnt",   bg: "#F87171", fg: "#450a0a" },
};

const STATUSES: Status[] = ["new", "reviewing", "interview", "accepted", "rejected"];

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ApplicationsAdmin,
});

function ApplicationsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Application[];
    },
  });

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("job_applications" as never).update({ status } as never).eq("id", id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "applications"] });
  }

  async function updateNotes(id: string, admin_notes: string) {
    const { error } = await supabase.from("job_applications" as never).update({ admin_notes } as never).eq("id", id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "applications"] });
  }

  async function remove(row: Application) {
    if (!confirm(`Bewerbung von ${row.first_name} ${row.last_name} löschen?`)) return;
    if (row.cv_path) {
      await supabase.storage.from("job-applications").remove([row.cv_path]);
    }
    const { error } = await supabase.from("job_applications" as never).delete().eq("id", row.id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "applications"] });
  }

  async function downloadCv(path: string) {
    const { data, error } = await supabase.storage.from("job-applications").createSignedUrl(path, SIGN_TTL);
    if (error) { setError(error.message); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  const items = (q.data ?? []).filter((a) => filter === "all" || a.status === filter);
  const counts: Record<string, number> = { all: q.data?.length ?? 0 };
  for (const s of STATUSES) counts[s] = (q.data ?? []).filter((a) => a.status === s).length;

  return (
    <div>
      <PageHeader title="Bewerbungen" subtitle="Eingehende Bewerbungen einsehen und Status pflegen." />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label={`Alle (${counts.all})`} />
        {STATUSES.map((s) => (
          <FilterBtn
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
            label={`${STATUS_META[s].label} (${counts[s] ?? 0})`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {q.isLoading && <p className="text-black/50 text-center py-12">Lädt…</p>}
        {!q.isLoading && items.length === 0 && (
          <p className="text-black/50 text-center py-12">Keine Bewerbungen in dieser Kategorie.</p>
        )}
        {items.map((a) => {
          const meta = STATUS_META[a.status];
          return (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1 rounded-full"
                      style={{ background: meta.bg, color: meta.fg }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs text-black/60 inline-flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(a.created_at).toLocaleString("de-CH", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <h3 className="font-display text-xl mt-3 flex items-center gap-2 text-[#0D2517]">
                    <User size={18} /> {a.first_name} {a.last_name}
                  </h3>
                  <p className="text-sm text-black/70 mt-1">Position: <span className="font-semibold">{a.position}</span></p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 text-[#0D2517] hover:underline">
                      <Mail size={14} /> {a.email}
                    </a>
                    {a.phone && (
                      <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 text-[#0D2517] hover:underline">
                        <Phone size={14} /> {a.phone}
                      </a>
                    )}
                  </div>

                  {a.message && (
                    <div className="mt-4 rounded border border-black/10 bg-[#F6F1EA] p-3 text-sm text-black/80 whitespace-pre-line">
                      {a.message}
                    </div>
                  )}

                  {a.cv_path && (
                    <button
                      type="button"
                      onClick={() => downloadCv(a.cv_path!)}
                      className="mt-4 inline-flex items-center gap-2 rounded border border-[#0D2517]/25 px-3 py-2 text-xs font-medium text-[#0D2517] hover:bg-[#0D2517] hover:text-[#F3E7D7] transition-colors"
                    >
                      <FileText size={14} /> Lebenslauf ansehen <Download size={12} />
                    </button>
                  )}

                  <div className="mt-4">
                    <label className="block text-[10px] tracking-[0.3em] uppercase text-black/50 mb-1.5">Interne Notiz</label>
                    <textarea
                      defaultValue={a.admin_notes ?? ""}
                      onBlur={(e) => {
                        if (e.target.value !== (a.admin_notes ?? "")) updateNotes(a.id, e.target.value);
                      }}
                      rows={2}
                      placeholder="Notiz für Team…"
                      className="w-full bg-white border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0D2517] resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[180px]">
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-black/50">Status</label>
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value as Status)}
                    className="w-full bg-white border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0D2517]"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                  </select>
                  <Btn variant="danger" onClick={() => remove(a)} className="mt-auto">
                    <span className="inline-flex items-center gap-2"><Trash2 size={14} /> Löschen</span>
                  </Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full text-xs font-medium tracking-wide transition",
        active ? "bg-[#0D2517] text-[#F3E7D7]" : "bg-white border border-black/15 text-[#0D2517] hover:bg-black/5",
      ].join(" ")}
    >
      {label}
    </button>
  );
}