import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MENU_VISIBILITY_KEY = "menu_visibility";

export const MENU_KEYS = ["weekly", "lunch", "mesa", "sushi", "wine", "bar"] as const;
export type MenuKey = (typeof MENU_KEYS)[number];

export const MENU_LABELS: Record<MenuKey, string> = {
  weekly: "Wochenmenü",
  lunch: "Lunch",
  mesa: "Mesa Amaya",
  sushi: "Asian Fusion / Sushi",
  wine: "Weinkarte",
  bar: "Bar",
};

export type MenuVisibility = Record<MenuKey, boolean>;

export const DEFAULT_MENU_VISIBILITY: MenuVisibility = {
  weekly: true,
  lunch: true,
  mesa: true,
  sushi: true,
  wine: true,
  bar: true,
};

export function normalizeVisibility(value: unknown): MenuVisibility {
  const raw = (value ?? {}) as Partial<Record<MenuKey, unknown>>;
  const out = { ...DEFAULT_MENU_VISIBILITY };
  for (const k of MENU_KEYS) {
    if (typeof raw[k] === "boolean") out[k] = raw[k] as boolean;
  }
  return out;
}

export async function fetchMenuVisibility(): Promise<MenuVisibility> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", MENU_VISIBILITY_KEY)
    .maybeSingle();
  return normalizeVisibility(data?.value);
}

export function useMenuVisibility() {
  return useQuery({
    queryKey: ["menu-visibility"],
    queryFn: fetchMenuVisibility,
    staleTime: 60_000,
  });
}

export async function saveMenuVisibility(value: MenuVisibility) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: MENU_VISIBILITY_KEY, value }, { onConflict: "key" });
  if (error) throw error;
}
