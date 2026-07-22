import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/admin/ui";
import {
  DEFAULT_TIER_SOLO,
  DEFAULT_TIER_ELITE,
  type LoungeTier,
} from "@/lib/loungeTiers";

export function LoungeTiersEditor() {
  const q = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const settings = new Map((q.data ?? []).map((s) => [s.key, s.value]));
  const tierSolo = (settings.get("lounge_tier_solo") as LoungeTier | undefined) ?? DEFAULT_TIER_SOLO;
  const tierElite = (settings.get("lounge_tier_elite") as LoungeTier | undefined) ?? DEFAULT_TIER_ELITE;

  if (q.isLoading) return <p className="text-black/50 text-sm">Lädt…</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TierEditor title="Solo Mitgliedschaft" settingKey="lounge_tier_solo" initial={tierSolo} />
      <TierEditor title="Elite Mitgliedschaft" settingKey="lounge_tier_elite" initial={tierElite} />
    </div>
  );
}

export function TierEditor({ title, settingKey, initial }: { title: string; settingKey: string; initial: LoungeTier }) {
  const qc = useQueryClient();
  const [tier, setTier] = useState<LoungeTier>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setTier(initial); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [JSON.stringify(initial)]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: settingKey, value: tier as unknown as never }, { onConflict: "key" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Gespeichert");
    qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    qc.invalidateQueries({ queryKey: ["public", "lounge-tiers"] });
  }

  const input = "w-full bg-white border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0D2517]";
  const label = "block text-[11px] tracking-[0.2em] uppercase text-black/60 mb-1";

  return (
    <Card className="p-6">
      <h3 className="font-medium text-lg">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div><label className={label}>Name</label><input className={input} value={tier.tier} onChange={(e) => setTier({ ...tier, tier: e.target.value })} /></div>
        <div><label className={label}>Badge (optional)</label><input className={input} value={tier.badge ?? ""} onChange={(e) => setTier({ ...tier, badge: e.target.value || undefined })} /></div>
        <div><label className={label}>Preis</label><input className={input} value={tier.price} onChange={(e) => setTier({ ...tier, price: e.target.value })} /></div>
        <div><label className={label}>Periode</label><input className={input} value={tier.period} onChange={(e) => setTier({ ...tier, period: e.target.value })} /></div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className={label}>Vorteile</span>
          <button type="button" onClick={() => setTier({ ...tier, perks: [...tier.perks, ""] })}
            className="inline-flex items-center gap-1 text-xs text-[#0D2517] hover:underline">
            <Plus size={14} /> Hinzufügen
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {tier.perks.map((p: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <input
                className={input}
                value={p}
                onChange={(e) => {
                  const next = [...tier.perks];
                  next[i] = e.target.value;
                  setTier({ ...tier, perks: next });
                }}
              />
              <button
                type="button"
                onClick={() => setTier({ ...tier, perks: tier.perks.filter((_: string, idx: number) => idx !== i) })}
                className="p-2 rounded hover:bg-black/5 text-black/60"
                aria-label="Vorteil entfernen"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

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