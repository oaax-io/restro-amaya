import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card } from "@/components/admin/ui";

const DAYS = [
  { n: 1, label: "Montag" }, { n: 2, label: "Dienstag" }, { n: 3, label: "Mittwoch" },
  { n: 4, label: "Donnerstag" }, { n: 5, label: "Freitag" }, { n: 6, label: "Samstag" }, { n: 0, label: "Sonntag" },
];
const SLOTS: { key: "lunch"|"dinner"|"bar"; label: string }[] = [
  { key: "lunch", label: "Mittag" }, { key: "dinner", label: "Abend" }, { key: "bar", label: "Bar" },
];

export const Route = createFileRoute("/_authenticated/admin/hours")({
  component: HoursAdmin,
});

function HoursAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin","hours"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opening_hours").select("*");
      if (error) throw error;
      return data;
    },
  });

  async function save(day: number, slot: string, patch: { opens?: string | null; closes?: string | null; is_closed?: boolean }) {
    const existing = (q.data ?? []).find((h) => h.day_of_week === day && h.slot === slot);
    if (existing) {
      await supabase.from("opening_hours").update(patch).eq("id", existing.id);
    } else {
      await supabase.from("opening_hours").insert({ day_of_week: day, slot, ...patch });
    }
    qc.invalidateQueries({ queryKey: ["admin","hours"] });
    qc.invalidateQueries({ queryKey: ["public","hours"] });
  }

  const get = (day: number, slot: string) => (q.data ?? []).find((h) => h.day_of_week === day && h.slot === slot);

  return (
    <div>
      <PageHeader title="Öffnungszeiten" subtitle="Zeiten pro Wochentag & Slot bearbeiten. Änderungen werden sofort auf der Website übernommen." />
      <Card className="mt-8 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-left">
              <tr>
                <th className="p-3">Tag</th>
                {SLOTS.map((s) => <th key={s.key} className="p-3">{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d) => (
                <tr key={d.n} className="border-t border-black/5">
                  <td className="p-3 font-medium">{d.label}</td>
                  {SLOTS.map((s) => {
                    const entry = get(d.n, s.key);
                    const closed = entry?.is_closed ?? true;
                    return (
                      <td key={s.key} className="p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs">
                            <input type="checkbox" checked={!closed}
                              onChange={(e) => save(d.n, s.key, { is_closed: !e.target.checked })} />
                            Offen
                          </label>
                          {!closed && (
                            <>
                              <input type="time" defaultValue={entry?.opens ?? ""}
                                onBlur={(e) => save(d.n, s.key, { opens: e.target.value || null })}
                                className="border border-black/15 rounded px-2 py-1 text-xs" />
                              <span className="text-black/40">–</span>
                              <input type="time" defaultValue={entry?.closes ?? ""}
                                onBlur={(e) => save(d.n, s.key, { closes: e.target.value || null })}
                                className="border border-black/15 rounded px-2 py-1 text-xs" />
                            </>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
