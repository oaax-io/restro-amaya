import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Textarea, Field } from "@/components/admin/ui";
import { Trash2, Mail, Phone, Crown, Users, Calendar, MapPin, CreditCard } from "lucide-react";
import { LoungeTiersEditor } from "@/components/admin/TierEditor";

type Status = "pending" | "active" | "rejected" | "expired";
type Payment = "unpaid" | "paid" | "refunded";

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  membership_type: string;
  message: string | null;
  status: Status;
  payment_status: Payment;
  member_number: string | null;
  admin_notes: string | null;
  created_at: string;
};

const STATUS_META: Record<Status, { label: string; bg: string; fg: string }> = {
  pending:  { label: "Anfrage",    bg: "#F5D07A", fg: "#3a2a00" },
  active:   { label: "Aktiv",      bg: "#4ADE80", fg: "#052e16" },
  rejected: { label: "Abgelehnt",  bg: "#F87171", fg: "#450a0a" },
  expired:  { label: "Abgelaufen", bg: "#94A3B8", fg: "#0f172a" },
};
const PAYMENT_META: Record<Payment, { label: string; bg: string }> = {
  unpaid:   { label: "Offen",     bg: "#F5D07A" },
  paid:     { label: "Bezahlt",   bg: "#4ADE80" },
  refunded: { label: "Rückerst.", bg: "#94A3B8" },
};

const STATUSES: Status[] = ["pending", "active", "rejected", "expired"];

export const Route = createFileRoute("/_authenticated/admin/members")({
  component: MembersAdmin,
});

function MembersAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin", "lounge-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lounge_members" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Member[];
    },
  });

  async function patch(id: string, patch: Partial<Member>) {
    const { error } = await supabase.from("lounge_members" as never).update(patch as never).eq("id", id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "lounge-members"] });
  }

  async function remove(m: Member) {
    if (!confirm(`Mitgliedschaft von ${m.first_name} ${m.last_name} löschen?`)) return;
    const { error } = await supabase.from("lounge_members" as never).delete().eq("id", m.id);
    if (error) { setError(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "lounge-members"] });
  }

  const items = (q.data ?? []).filter((a) => filter === "all" || a.status === filter);
  const counts: Record<string, number> = { all: q.data?.length ?? 0 };
  for (const s of STATUSES) counts[s] = (q.data ?? []).filter((a) => a.status === s).length;

  return (
    <div>
      <PageHeader title="Cigar Lounge Members" subtitle="Eingehende Mitgliedschaftsanträge einsehen und verwalten." />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8">
        <h2 className="font-display text-2xl text-[#0D2517] mb-4">Mitgliedschaften konfigurieren</h2>
        <p className="text-sm text-black/60 mb-4">Name, Preis, Badge und Vorteile für Solo &amp; Elite jederzeit anpassen.</p>
        <LoungeTiersEditor />
      </div>

      <div className="mt-10 mb-4 border-t border-black/10 pt-8">
        <h2 className="font-display text-2xl text-[#0D2517]">Mitgliederanträge</h2>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label={`Alle (${counts.all})`} />
        {STATUSES.map((s) => (
          <FilterBtn key={s} active={filter === s} onClick={() => setFilter(s)} label={`${STATUS_META[s].label} (${counts[s] ?? 0})`} />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {items.length === 0 && <Card><p className="text-sm text-black/60">Keine Anträge vorhanden.</p></Card>}
        {items.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-display text-2xl text-[#0D2517]">{m.first_name} {m.last_name}</h3>
                  {m.membership_type === "premium" ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#E9A580] text-[#0D2517] uppercase tracking-widest">
                      <Crown size={12} /> Elite
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/10 text-black/70 uppercase tracking-widest">
                      <Users size={12} /> Solo
                    </span>
                  )}
                  <span className="text-xs px-2 py-1 rounded-full uppercase tracking-widest" style={{ background: STATUS_META[m.status].bg, color: STATUS_META[m.status].fg }}>
                    {STATUS_META[m.status].label}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full text-[#0D2517]" style={{ background: PAYMENT_META[m.payment_status].bg }}>
                    <CreditCard size={11} className="inline mr-1" />{PAYMENT_META[m.payment_status].label}
                  </span>
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-black/70">
                  <span className="inline-flex items-center gap-2"><Mail size={13} /> <a href={`mailto:${m.email}`} className="hover:underline">{m.email}</a></span>
                  {m.phone && <span className="inline-flex items-center gap-2"><Phone size={13} /> <a href={`tel:${m.phone}`} className="hover:underline">{m.phone}</a></span>}
                  {m.birth_date && <span className="inline-flex items-center gap-2"><Calendar size={13} /> {new Date(m.birth_date).toLocaleDateString("de-CH")}</span>}
                  {(m.address || m.city) && (
                    <span className="inline-flex items-center gap-2"><MapPin size={13} /> {[m.address, [m.postal_code, m.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</span>
                  )}
                </div>
                <p className="text-xs text-black/40 mt-2">Antrag: {new Date(m.created_at).toLocaleString("de-CH")}</p>
              </div>
              <Btn variant="danger" onClick={() => remove(m)}><Trash2 size={14} /></Btn>
            </div>

            {m.message && (
              <div className="mt-4 p-3 rounded bg-black/5 text-sm text-black/70">
                <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Nachricht</p>
                {m.message}
              </div>
            )}

            <div className="mt-4 grid md:grid-cols-4 gap-3">
              <Field label="Status">
                <select value={m.status} onChange={(e) => patch(m.id, { status: e.target.value as Status })}
                  className="w-full bg-white border border-black/15 rounded px-3 py-2 text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                </select>
              </Field>
              <Field label="Zahlung">
                <select value={m.payment_status} onChange={(e) => patch(m.id, { payment_status: e.target.value as Payment })}
                  className="w-full bg-white border border-black/15 rounded px-3 py-2 text-sm">
                  {(["unpaid","paid","refunded"] as Payment[]).map((s) => <option key={s} value={s}>{PAYMENT_META[s].label}</option>)}
                </select>
              </Field>
              <Field label="Typ">
                <select value={m.membership_type} onChange={(e) => patch(m.id, { membership_type: e.target.value })}
                  className="w-full bg-white border border-black/15 rounded px-3 py-2 text-sm">
                  <option value="standard">Solo</option>
                  <option value="premium">Elite</option>
                </select>
              </Field>
              <Field label="Mitgliedsnr.">
                <Input defaultValue={m.member_number ?? ""} onBlur={(e) => { if (e.currentTarget.value !== (m.member_number ?? "")) patch(m.id, { member_number: e.currentTarget.value || null }); }} placeholder="z. B. AMY-0042" />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Interne Notizen">
                <Textarea defaultValue={m.admin_notes ?? ""} rows={2} onBlur={(e) => { if (e.currentTarget.value !== (m.admin_notes ?? "")) patch(m.id, { admin_notes: e.currentTarget.value || null }); }} />
              </Field>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs uppercase tracking-widest transition"
      style={{ background: active ? "#0D2517" : "transparent", color: active ? "#F3E7D7" : "#0D2517", border: "1px solid rgba(13,37,23,0.2)" }}>
      {label}
    </button>
  );
}