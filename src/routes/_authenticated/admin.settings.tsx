import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card } from "@/components/admin/ui";
import { Plus, Trash2 } from "lucide-react";
import {
  DEFAULT_TIER_SOLO,
  DEFAULT_TIER_ELITE,
  type LoungeTier,
} from "@/lib/loungeTiers";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const settings = new Map((q.data ?? []).map((s) => [s.key, s.value]));
  const showReservation = (settings.get("show_hero_reservation_card") ?? true) === true;
  const tierSolo = (settings.get("lounge_tier_solo") as LoungeTier | undefined) ?? DEFAULT_TIER_SOLO;
  const tierElite = (settings.get("lounge_tier_elite") as LoungeTier | undefined) ?? DEFAULT_TIER_ELITE;

  async function setFlag(key: string, value: boolean) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value: value as unknown as never }, { onConflict: "key" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Gespeichert");
    qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  }

  return (
    <div>
      <PageHeader title="Einstellungen" subtitle="Globale Sichtbarkeit von Seiten-Elementen steuern." />
      <Card className="mt-6 p-6">
        {q.isLoading ? (
          <p className="text-black/50 text-sm">Lädt…</p>
        ) : (
          <div className="flex items-center justify-between gap-6 py-2">
            <div>
              <div className="font-medium">Reservationsformular auf Startseite</div>
              <div className="text-xs text-black/60 mt-1">
                Zeigt oder versteckt das Buchungs-Formular über dem Hero-Slider.
              </div>
            </div>
            <label className="inline-flex items-center gap-3 cursor-pointer select-none">
              <span className="text-xs uppercase tracking-wider text-black/60">
                {showReservation ? "Sichtbar" : "Versteckt"}
              </span>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showReservation}
                onChange={(e) => setFlag("show_hero_reservation_card", e.target.checked)}
              />
              <span className="w-12 h-7 rounded-full bg-black/20 peer-checked:bg-[#0D2517] relative transition">
                <span
                  className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
                  style={{ transform: showReservation ? "translateX(20px)" : "translateX(0)" }}
                />
              </span>
            </label>
          </div>
        )}
      </Card>

      {!q.isLoading && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TierEditor
            title="Solo Mitgliedschaft"
            settingKey="lounge_tier_solo"
            initial={tierSolo}
          />
          <TierEditor
            title="Elite Mitgliedschaft"
            settingKey="lounge_tier_elite"
            initial={tierElite}
          />
        </div>
      )}
    </div>
  );
}

function TierEditor({ title, settingKey, initial }: { title: string; settingKey: string; initial: LoungeTier }) {
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
          {tier.perks.map((p, i) => (
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
                onClick={() => setTier({ ...tier, perks: tier.perks.filter((_, idx) => idx !== i) })}
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
