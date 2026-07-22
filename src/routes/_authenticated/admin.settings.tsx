import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card } from "@/components/admin/ui";
import { LoungeTiersEditor } from "@/components/admin/TierEditor";

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
        <div className="mt-8">
          <LoungeTiersEditor />
        </div>
      )}
    </div>
  );
}
