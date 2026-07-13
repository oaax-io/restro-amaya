ALTER TABLE public.menu_categories
  ADD COLUMN IF NOT EXISTS menu_type text NOT NULL DEFAULT 'lunch',
  ADD COLUMN IF NOT EXISTS subtitle_de text,
  ADD COLUMN IF NOT EXISTS subtitle_en text;

ALTER TABLE public.menu_categories DROP CONSTRAINT IF EXISTS menu_categories_slug_key;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='menu_categories_type_slug_key') THEN
    ALTER TABLE public.menu_categories ADD CONSTRAINT menu_categories_type_slug_key UNIQUE (menu_type, slug);
  END IF;
END $$;

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS price_text text,
  ADD COLUMN IF NOT EXISTS tags text[],
  ADD COLUMN IF NOT EXISTS highlight boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS origin_de text,
  ADD COLUMN IF NOT EXISTS origin_en text,
  ADD COLUMN IF NOT EXISTS glass_price text,
  ADD COLUMN IF NOT EXISTS bottle_price text;
ALTER TABLE public.menu_items ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.menu_items ALTER COLUMN price SET DEFAULT NULL;

CREATE TABLE IF NOT EXISTS public.menu_meta (
  menu_type text PRIMARY KEY,
  pdf_url text,
  date_range_de text,
  date_range_en text,
  title_de text,
  title_en text,
  suppe_salat_de text,
  suppe_salat_en text,
  suppe_salat_price text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_meta TO anon, authenticated;
GRANT ALL ON public.menu_meta TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.menu_meta TO authenticated;
ALTER TABLE public.menu_meta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read menu meta" ON public.menu_meta;
CREATE POLICY "Public can read menu meta" ON public.menu_meta FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins manage menu meta" ON public.menu_meta;
CREATE POLICY "Admins manage menu meta" ON public.menu_meta FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_menu_meta_updated ON public.menu_meta;
CREATE TRIGGER trg_menu_meta_updated BEFORE UPDATE ON public.menu_meta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();