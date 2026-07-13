import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Textarea, Field } from "@/components/admin/ui";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/jobs")({
  component: JobsAdmin,
});

type Draft = { title_de: string; title_en: string; summary_de: string; summary_en: string; body_de: string; body_en: string; is_open: boolean };
const empty: Draft = { title_de: "", title_en: "", summary_de: "", summary_en: "", body_de: "", body_en: "", is_open: true };

function JobsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const q = useQuery({
    queryKey: ["admin","jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function create() {
    if (!draft) return;
    await supabase.from("jobs").insert(draft);
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin","jobs"] });
    qc.invalidateQueries({ queryKey: ["admin","stats"] });
  }
  async function toggleOpen(id: string, v: boolean) {
    await supabase.from("jobs").update({ is_open: v }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","jobs"] });
    qc.invalidateQueries({ queryKey: ["admin","stats"] });
  }
  async function remove(id: string) {
    if (!confirm("Stelle löschen?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","jobs"] });
  }
  async function updateField(id: string, patch: Partial<Draft>) {
    await supabase.from("jobs").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","jobs"] });
  }

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Offene Stellen verwalten."
        action={<Btn onClick={() => setDraft(empty)}><span className="inline-flex items-center gap-2"><Plus size={16} />Neue Stelle</span></Btn>}
      />

      {draft && (
        <Card className="mt-6">
          <h3 className="font-display text-xl mb-4">Neue Stelle</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Titel (DE)"><Input value={draft.title_de} onChange={(e) => setDraft({...draft, title_de: e.target.value})} /></Field>
            <Field label="Titel (EN)"><Input value={draft.title_en} onChange={(e) => setDraft({...draft, title_en: e.target.value})} /></Field>
            <Field label="Kurzbeschreibung (DE)"><Input value={draft.summary_de} onChange={(e) => setDraft({...draft, summary_de: e.target.value})} /></Field>
            <Field label="Summary (EN)"><Input value={draft.summary_en} onChange={(e) => setDraft({...draft, summary_en: e.target.value})} /></Field>
            <Field label="Beschreibung (DE)"><Textarea rows={5} value={draft.body_de} onChange={(e) => setDraft({...draft, body_de: e.target.value})} /></Field>
            <Field label="Body (EN)"><Textarea rows={5} value={draft.body_en} onChange={(e) => setDraft({...draft, body_en: e.target.value})} /></Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={create} disabled={!draft.title_de}>Speichern</Btn>
            <Btn variant="ghost" onClick={() => setDraft(null)}>Abbrechen</Btn>
          </div>
        </Card>
      )}

      <div className="mt-8 space-y-4">
        {(q.data ?? []).map((j) => (
          <Card key={j.id}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <Input defaultValue={j.title_de} onBlur={(e) => updateField(j.id, { title_de: e.target.value })} className="font-semibold text-lg" />
                <Input defaultValue={j.title_en} onBlur={(e) => updateField(j.id, { title_en: e.target.value })} className="mt-2 text-sm" />
                <Textarea defaultValue={j.body_de ?? ""} rows={3} onBlur={(e) => updateField(j.id, { body_de: e.target.value })} className="mt-2" placeholder="Beschreibung DE" />
                <Textarea defaultValue={j.body_en ?? ""} rows={3} onBlur={(e) => updateField(j.id, { body_en: e.target.value })} className="mt-2" placeholder="Body EN" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={j.is_open} onChange={(e) => toggleOpen(j.id, e.target.checked)} />
                  {j.is_open ? "Offen" : "Geschlossen"}
                </label>
                <Btn variant="danger" onClick={() => remove(j.id)} className="p-2"><Trash2 size={14} /></Btn>
              </div>
            </div>
          </Card>
        ))}
        {q.data?.length === 0 && <p className="text-black/50 text-center py-12">Noch keine Stellen.</p>}
      </div>
    </div>
  );
}
