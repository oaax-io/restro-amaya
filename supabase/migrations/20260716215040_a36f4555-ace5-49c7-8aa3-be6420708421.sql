
-- LOUNGE MEMBERS
CREATE TABLE public.lounge_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  membership_type TEXT NOT NULL DEFAULT 'standard',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  member_number TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lounge_members TO authenticated;
GRANT INSERT ON public.lounge_members TO anon;
GRANT ALL ON public.lounge_members TO service_role;

ALTER TABLE public.lounge_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply for membership"
  ON public.lounge_members FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view members"
  ON public.lounge_members FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update members"
  ON public.lounge_members FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete members"
  ON public.lounge_members FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lounge_members_updated_at
  BEFORE UPDATE ON public.lounge_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LOUNGE IMAGES
CREATE TABLE public.lounge_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.lounge_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lounge_images TO authenticated;
GRANT ALL ON public.lounge_images TO service_role;

ALTER TABLE public.lounge_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published lounge images"
  ON public.lounge_images FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert lounge images"
  ON public.lounge_images FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lounge images"
  ON public.lounge_images FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lounge images"
  ON public.lounge_images FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lounge_images_updated_at
  BEFORE UPDATE ON public.lounge_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
