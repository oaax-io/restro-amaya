import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/admin/ui";
import {
  DEFAULT_CORPORATE_MEMBERSHIP,
  type CorporateMembershipData,
  type CorporatePlan,
} from "@/lib/corporateMembership";

const input =
  "w-full bg-white border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0D2517]";
const label = "block text-[11px] tracking-[0.2em] uppercase text-black/60 mb-1";

const PLAN_FIELDS: { key: keyof CorporatePlan; label: string }[] = [
  { key: "plan", label: "Plan" },
  { key: "cards", label: "Mitgliedskarten" },
  { key: "fee", label: "Jahresgebühr" },
  { key: "credit", label: "Konsum-Guthaben" },
  { key: "discount", label: "Rabatt" },
];

export function CorporateMembershipEditor() {
  const q = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const settings = new Map((q.data ?? []).map((s) => [s.key, s.value]));
  const initial =
    (settings.get("corporate_membership") as CorporateMembershipData | undefined) ??
    DEFAULT_CORPORATE_MEMBERSHIP;

  if (q.isLoading) return <p className="text-black/50 text-sm">Lädt…</p>;

  return <Editor initial={initial} />;
}

function Editor({ initial }: { initial: CorporateMembershipData }) {
  const qc = useQueryClient();
  const [data, setData] = useState<CorporateMembershipData>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(initial);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [JSON.stringify(initial)]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "corporate_membership", value: data as unknown as never }, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Gespeichert");
    qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    qc.invalidateQueries({ queryKey: ["public", "corporate-membership"] });
  }

  function updatePlan(i: number, key: keyof CorporatePlan, value: string) {
    const plans = [...data.plans];
    plans[i] = { ...plans[i], [key]: value };
    setData({ ...data, plans });
  }

  function ListEditor({
    title,
    field,
  }: {
    title: string;
    field: "benefits" | "terms";
  }) {
    const items = data[field];
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className={label}>{title}</span>
          <button
            type="button"
            onClick={() => setData({ ...data, [field]: [...items, ""] })}
            className="inline-flex items-center gap-1 text-xs text-[#0D2517] hover:underline"
          >
            <Plus size={14} /> Hinzufügen
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                className={input}
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  setData({ ...data, [field]: next });
                }}
              />
              <button
                type="button"
                onClick={() => setData({ ...data, [field]: items.filter((_, idx) => idx !== i) })}
                className="p-2 rounded hover:bg-black/5 text-black/60"
                aria-label="Eintrag entfernen"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-medium text-lg">Corporate Mitgliedschaft</h3>

      <div className="mt-4 grid gap-3">
        <div>
          <label className={label}>Titel</label>
          <input className={input} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </div>
        <div>
          <label className={label}>Einleitungstext</label>
          <textarea
            className={`${input} min-h-[90px]`}
            value={data.lead}
            onChange={(e) => setData({ ...data, lead: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className={label}>Pläne</span>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                plans: [...data.plans, { plan: "", cards: "", fee: "", credit: "", discount: "" }],
              })
            }
            className="inline-flex items-center gap-1 text-xs text-[#0D2517] hover:underline"
          >
            <Plus size={14} /> Zeile hinzufügen
          </button>
        </div>

        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr>
                {PLAN_FIELDS.map((f) => (
                  <th key={f.key} className="text-left pb-2 text-[11px] tracking-[0.2em] uppercase text-black/50 font-medium">
                    {f.label}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {data.plans.map((p, i) => (
                <tr key={i}>
                  {PLAN_FIELDS.map((f) => (
                    <td key={f.key} className="pr-2 pb-2">
                      <input className={input} value={p[f.key]} onChange={(e) => updatePlan(i, f.key, e.target.value)} />
                    </td>
                  ))}
                  <td className="pb-2">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, plans: data.plans.filter((_, idx) => idx !== i) })}
                      className="p-2 rounded hover:bg-black/5 text-black/60"
                      aria-label="Zeile entfernen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ListEditor title="Mitgliedschaftsvorteile" field="benefits" />
      <ListEditor title="Bedingungen" field="terms" />

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded bg-[#0D2517] text-white text-sm hover:bg-[#0D2517]/90 disabled:opacity-50"
        >
          {saving ? "Speichert…" : "Speichern"}
        </button>
      </div>
    </Card>
  );
}
