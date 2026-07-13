
-- Opening hours
CREATE TABLE public.opening_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  slot text NOT NULL CHECK (slot IN ('lunch','dinner','bar')),
  opens time,
  closes time,
  is_closed boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (day_of_week, slot)
);
GRANT SELECT ON public.opening_hours TO anon, authenticated;
GRANT ALL ON public.opening_hours TO service_role;
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read opening hours" ON public.opening_hours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage opening hours" ON public.opening_hours FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_opening_hours_updated_at BEFORE UPDATE ON public.opening_hours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed opening hours from existing restaurant.ts
-- day_of_week: 1=Mon,...,7 mapped 0=Sun
INSERT INTO public.opening_hours (day_of_week, slot, opens, closes, is_closed, sort_order) VALUES
  (1,'lunch','11:30','14:00',false,10),(1,'dinner',NULL,NULL,true,20),
  (2,'lunch','11:30','14:00',false,10),(2,'dinner','18:30','23:30',false,20),
  (3,'lunch','11:30','14:00',false,10),(3,'dinner','18:30','23:30',false,20),
  (4,'lunch','11:30','14:00',false,10),(4,'dinner','18:30','23:30',false,20),
  (5,'lunch','11:30','14:00',false,10),(5,'dinner','18:30','03:00',false,20),
  (6,'lunch',NULL,NULL,true,10),(6,'dinner','18:30','03:00',false,20),
  (0,'lunch',NULL,NULL,true,10),(0,'dinner',NULL,NULL,true,20);

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','unsubscribed')),
  source text,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(email) BETWEEN 3 AND 200 AND email ~~ '%_@_%.__%' AND status = 'active');
CREATE POLICY "Admins view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies: admins can manage gallery & menu-images; authenticated can read (private buckets, we'll use signed URLs)
CREATE POLICY "Admins upload gallery" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update gallery" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete gallery" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read gallery" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins upload menu images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'menu-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update menu images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete menu images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read menu images" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(),'admin'));
