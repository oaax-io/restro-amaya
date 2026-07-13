import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card, Btn, Input, Textarea, Field } from "@/components/admin/ui";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: MenuAdmin,
});

type CatDraft = { slug: string; name_de: string; name_en: string; sort_order: number };
type ItemDraft = { category_id: string; name_de: string; name_en: string; description_de: string; description_en: string; price: number; is_visible: boolean; sort_order: number };

function MenuAdmin() {
  const qc = useQueryClient();
  const [newCat, setNewCat] = useState<CatDraft | null>(null);
  const [newItem, setNewItem] = useState<ItemDraft | null>(null);

  const cats = useQuery({
    queryKey: ["admin","menu","cats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_categories").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });
  const items = useQuery({
    queryKey: ["admin","menu","items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["admin","menu","cats"] });
    qc.invalidateQueries({ queryKey: ["admin","menu","items"] });
    qc.invalidateQueries({ queryKey: ["admin","stats"] });
  }

  async function addCat() {
    if (!newCat) return;
    await supabase.from("menu_categories").insert(newCat);
    setNewCat(null); invalidate();
  }
  async function delCat(id: string) {
    if (!confirm("Kategorie und alle darin enthaltenen Gerichte löschen?")) return;
    await supabase.from("menu_items").delete().eq("category_id", id);
    await supabase.from("menu_categories").delete().eq("id", id);
    invalidate();
  }
  async function updateCat(id: string, patch: Partial<CatDraft>) {
    await supabase.from("menu_categories").update(patch).eq("id", id); invalidate();
  }
  async function addItem() {
    if (!newItem || !newItem.category_id) return;
    await supabase.from("menu_items").insert(newItem);
    setNewItem(null); invalidate();
  }
  async function delItem(id: string) {
    if (!confirm("Gericht löschen?")) return;
    await supabase.from("menu_items").delete().eq("id", id); invalidate();
  }
  async function updateItem(id: string, patch: Partial<ItemDraft>) {
    await supabase.from("menu_items").update(patch).eq("id", id); invalidate();
  }

  return (
    <div>
      <PageHeader title="Speisekarte" subtitle="Kategorien und Gerichte verwalten." />

      <div className="mt-8 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Kategorien</h2>
            <Btn onClick={() => setNewCat({ slug: "", name_de: "", name_en: "", sort_order: (cats.data?.length ?? 0) * 10 + 10 })}>
              <span className="inline-flex items-center gap-2"><Plus size={16} />Neue Kategorie</span>
            </Btn>
          </div>
          {newCat && (
            <Card className="mb-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Slug"><Input value={newCat.slug} onChange={(e) => setNewCat({...newCat, slug: e.target.value})} /></Field>
                <Field label="Name DE"><Input value={newCat.name_de} onChange={(e) => setNewCat({...newCat, name_de: e.target.value})} /></Field>
                <Field label="Name EN"><Input value={newCat.name_en} onChange={(e) => setNewCat({...newCat, name_en: e.target.value})} /></Field>
                <Field label="Reihenfolge"><Input type="number" value={newCat.sort_order} onChange={(e) => setNewCat({...newCat, sort_order: Number(e.target.value)})} /></Field>
              </div>
              <div className="mt-3 flex gap-2"><Btn onClick={addCat}>Anlegen</Btn><Btn variant="ghost" onClick={() => setNewCat(null)}>Abbrechen</Btn></div>
            </Card>
          )}
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/5 text-left"><tr><th className="p-3">Slug</th><th className="p-3">Name DE</th><th className="p-3">Name EN</th><th className="p-3 w-24">Sort</th><th className="p-3"></th></tr></thead>
              <tbody>
                {(cats.data ?? []).map((c) => (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="p-2"><Input defaultValue={c.slug} onBlur={(e) => updateCat(c.id, { slug: e.target.value })} /></td>
                    <td className="p-2"><Input defaultValue={c.name_de} onBlur={(e) => updateCat(c.id, { name_de: e.target.value })} /></td>
                    <td className="p-2"><Input defaultValue={c.name_en} onBlur={(e) => updateCat(c.id, { name_en: e.target.value })} /></td>
                    <td className="p-2"><Input type="number" defaultValue={c.sort_order} onBlur={(e) => updateCat(c.id, { sort_order: Number(e.target.value) })} /></td>
                    <td className="p-2 text-right"><Btn variant="danger" onClick={() => delCat(c.id)} className="p-2"><Trash2 size={14} /></Btn></td>
                  </tr>
                ))}
                {cats.data?.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-black/50">Noch keine Kategorien.</td></tr>}
              </tbody>
            </table>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Gerichte</h2>
            <Btn disabled={!cats.data?.length} onClick={() => setNewItem({ category_id: cats.data?.[0]?.id ?? "", name_de: "", name_en: "", description_de: "", description_en: "", price: 0, is_visible: true, sort_order: 10 })}>
              <span className="inline-flex items-center gap-2"><Plus size={16} />Neues Gericht</span>
            </Btn>
          </div>
          {newItem && (
            <Card className="mb-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Kategorie">
                  <select className="w-full border border-black/15 rounded px-3 py-2 text-sm" value={newItem.category_id} onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}>
                    {(cats.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name_de}</option>)}
                  </select>
                </Field>
                <Field label="Preis (CHF)"><Input type="number" step="0.5" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})} /></Field>
                <Field label="Name DE"><Input value={newItem.name_de} onChange={(e) => setNewItem({...newItem, name_de: e.target.value})} /></Field>
                <Field label="Name EN"><Input value={newItem.name_en} onChange={(e) => setNewItem({...newItem, name_en: e.target.value})} /></Field>
                <Field label="Beschreibung DE"><Textarea rows={3} value={newItem.description_de} onChange={(e) => setNewItem({...newItem, description_de: e.target.value})} /></Field>
                <Field label="Description EN"><Textarea rows={3} value={newItem.description_en} onChange={(e) => setNewItem({...newItem, description_en: e.target.value})} /></Field>
              </div>
              <div className="mt-3 flex gap-2"><Btn onClick={addItem}>Anlegen</Btn><Btn variant="ghost" onClick={() => setNewItem(null)}>Abbrechen</Btn></div>
            </Card>
          )}
          {(cats.data ?? []).map((cat) => {
            const rows = (items.data ?? []).filter((i) => i.category_id === cat.id);
            if (rows.length === 0) return null;
            return (
              <div key={cat.id} className="mb-6">
                <h3 className="font-display text-lg mb-2">{cat.name_de}</h3>
                <Card className="p-0 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-black/5 text-left"><tr><th className="p-3">Name DE</th><th className="p-3">Preis</th><th className="p-3 w-24">Sort</th><th className="p-3 w-24">Sichtbar</th><th className="p-3"></th></tr></thead>
                    <tbody>
                      {rows.map((it) => (
                        <tr key={it.id} className="border-t border-black/5">
                          <td className="p-2"><Input defaultValue={it.name_de} onBlur={(e) => updateItem(it.id, { name_de: e.target.value })} /></td>
                          <td className="p-2 w-28"><Input type="number" step="0.5" defaultValue={String(it.price)} onBlur={(e) => updateItem(it.id, { price: Number(e.target.value) })} /></td>
                          <td className="p-2"><Input type="number" defaultValue={it.sort_order} onBlur={(e) => updateItem(it.id, { sort_order: Number(e.target.value) })} /></td>
                          <td className="p-2 text-center"><input type="checkbox" checked={it.is_visible} onChange={(e) => updateItem(it.id, { is_visible: e.target.checked })} /></td>
                          <td className="p-2 text-right"><Btn variant="danger" onClick={() => delItem(it.id)} className="p-2"><Trash2 size={14} /></Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            );
          })}
          {(items.data?.length ?? 0) === 0 && <p className="text-black/50 text-center py-12">Noch keine Gerichte.</p>}
        </section>
      </div>
    </div>
  );
}
