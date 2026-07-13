import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  WEEKLY_MENU as WEEKLY_FALLBACK,
  LUNCH_MENU as LUNCH_FALLBACK,
  AMAYA_MESA as MESA_FALLBACK,
  SUSHI_SHARING as SUSHI_FALLBACK,
  WINE_MENU as WINE_FALLBACK,
  type MenuItem,
  type MenuSection,
  type WineItem,
  type WineMenuSection,
} from "@/data/menu";

export type MenuType = "weekly" | "lunch" | "mesa" | "sushi" | "wine";

type DbCategory = {
  id: string;
  menu_type: string;
  slug: string;
  name_de: string;
  name_en: string;
  subtitle_de: string | null;
  subtitle_en: string | null;
  sort_order: number;
};
type DbItem = {
  id: string;
  category_id: string;
  name_de: string;
  name_en: string;
  description_de: string | null;
  description_en: string | null;
  price_text: string | null;
  price: number | null;
  allergens: string[] | null;
  tags: string[] | null;
  highlight: boolean;
  origin_de: string | null;
  origin_en: string | null;
  glass_price: string | null;
  bottle_price: string | null;
  is_visible: boolean;
  sort_order: number;
};

async function fetchType(menu_type: MenuType) {
  const [cats, meta] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("menu_type", menu_type).order("sort_order"),
    supabase.from("menu_meta").select("*").eq("menu_type", menu_type).maybeSingle(),
  ]);
  if (cats.error) throw cats.error;
  const catRows = (cats.data ?? []) as DbCategory[];
  const ids = catRows.map((c) => c.id);
  let items: DbItem[] = [];
  if (ids.length) {
    const { data, error } = await supabase.from("menu_items").select("*").in("category_id", ids).eq("is_visible", true).order("sort_order");
    if (error) throw error;
    items = (data ?? []) as DbItem[];
  }
  return { cats: catRows, items, meta: meta.data as any };
}

function priceOf(it: DbItem): string {
  if (it.price_text) return it.price_text;
  if (it.price != null) return String(it.price);
  return "";
}

function toMenuItem(it: DbItem): MenuItem {
  return {
    name: { de: it.name_de, en: it.name_en },
    desc: { de: it.description_de ?? "", en: it.description_en ?? "" },
    price: priceOf(it),
    tags: (it.tags ?? undefined) as MenuItem["tags"],
    allergens: it.allergens?.join(", "),
    highlight: it.highlight || undefined,
  };
}
function toWineItem(it: DbItem): WineItem {
  return {
    name: { de: it.name_de, en: it.name_en },
    desc: it.description_de || it.description_en ? { de: it.description_de ?? "", en: it.description_en ?? "" } : undefined,
    origin: it.origin_de || it.origin_en ? { de: it.origin_de ?? "", en: it.origin_en ?? "" } : undefined,
    glass: it.glass_price ?? undefined,
    bottle: it.bottle_price ?? "",
  };
}

function assembleSections<T>(cats: DbCategory[], items: DbItem[], mapItem: (i: DbItem) => T): Array<{ id: string; title: { de: string; en: string }; subtitle?: { de: string; en: string }; items: T[] }> {
  return cats.map((c) => ({
    id: c.slug,
    title: { de: c.name_de, en: c.name_en },
    subtitle: c.subtitle_de || c.subtitle_en ? { de: c.subtitle_de ?? "", en: c.subtitle_en ?? "" } : undefined,
    items: items.filter((i) => i.category_id === c.id).map(mapItem),
  }));
}

export function useWeeklyMenu() {
  const q = useQuery({
    queryKey: ["menu", "weekly"],
    queryFn: async () => {
      const { cats, items, meta } = await fetchType("weekly");
      const list = cats[0] ? items.filter((i) => i.category_id === cats[0].id).map(toMenuItem) : [];
      return {
        dateRange: { de: meta?.date_range_de ?? "", en: meta?.date_range_en ?? "" },
        title: { de: meta?.title_de ?? WEEKLY_FALLBACK.title.de, en: meta?.title_en ?? WEEKLY_FALLBACK.title.en },
        suppeSalat: {
          de: meta?.suppe_salat_de ?? WEEKLY_FALLBACK.suppeSalat.de,
          en: meta?.suppe_salat_en ?? WEEKLY_FALLBACK.suppeSalat.en,
          price: meta?.suppe_salat_price ?? WEEKLY_FALLBACK.suppeSalat.price,
        },
        items: list.length ? list : WEEKLY_FALLBACK.items,
      } as typeof WEEKLY_FALLBACK;
    },
  });
  return q.data ?? WEEKLY_FALLBACK;
}

function useSectionsFor(menu_type: "lunch" | "mesa" | "sushi", fallback: MenuSection[]): MenuSection[] {
  const q = useQuery({
    queryKey: ["menu", menu_type],
    queryFn: async () => {
      const { cats, items } = await fetchType(menu_type);
      return assembleSections(cats, items, toMenuItem) as MenuSection[];
    },
  });
  const data = q.data;
  if (!data || data.length === 0) return fallback;
  return data;
}

export function useLunchMenu() { return useSectionsFor("lunch", LUNCH_FALLBACK); }
export function useMesaMenu() { return useSectionsFor("mesa", MESA_FALLBACK); }
export function useSushiMenu() { return useSectionsFor("sushi", SUSHI_FALLBACK); }

export function useWineMenu(): WineMenuSection[] {
  const q = useQuery({
    queryKey: ["menu", "wine"],
    queryFn: async () => {
      const { cats, items } = await fetchType("wine");
      return assembleSections(cats, items, toWineItem) as WineMenuSection[];
    },
  });
  const data = q.data;
  if (!data || data.length === 0) return WINE_FALLBACK;
  return data;
}

export function useMenuMeta(menu_type: MenuType) {
  return useQuery({
    queryKey: ["menu-meta", menu_type],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_meta").select("*").eq("menu_type", menu_type).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export async function pdfUrlFor(menu_type: MenuType, fallback: string): Promise<string> {
  const { data } = await supabase.from("menu_meta").select("pdf_url").eq("menu_type", menu_type).maybeSingle();
  if (!data?.pdf_url) return fallback;
  if (data.pdf_url.startsWith("http")) return data.pdf_url;
  const { data: signed } = await supabase.storage.from("menu-pdfs").createSignedUrl(data.pdf_url, 60 * 60 * 24);
  return signed?.signedUrl ?? fallback;
}

export function usePdfUrl(menu_type: MenuType, fallback: string) {
  const q = useQuery({
    queryKey: ["menu-pdf", menu_type],
    queryFn: () => pdfUrlFor(menu_type, fallback),
  });
  return q.data ?? fallback;
}