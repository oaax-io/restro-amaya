ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'restaurant';
CREATE INDEX IF NOT EXISTS gallery_images_category_idx ON public.gallery_images(category);