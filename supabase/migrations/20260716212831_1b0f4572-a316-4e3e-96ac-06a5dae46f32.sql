
-- Events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flyer_url text,
  kicker text,
  title text NOT NULL,
  description text,
  event_date date,
  event_time text,
  end_time text,
  location text,
  capacity text,
  is_paid boolean NOT NULL DEFAULT false,
  price_text text,
  cta_label text,
  cta_href text,
  is_recurring boolean NOT NULL DEFAULT false,
  recurrence text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for event-flyers bucket
CREATE POLICY "Anyone can view event flyers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-flyers');

CREATE POLICY "Admins can upload event flyers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-flyers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update event flyers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-flyers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event flyers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-flyers' AND public.has_role(auth.uid(), 'admin'));
