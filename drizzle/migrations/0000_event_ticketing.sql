ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS price_chf numeric(10,2),
  ADD COLUMN IF NOT EXISTS payment_mode text NOT NULL DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS cancel_allowed boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS cancel_days integer NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS late_fee_chf numeric(10,2) NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS noshow_fee_chf numeric(10,2),
  ADD COLUMN IF NOT EXISTS max_tickets integer;

CREATE TABLE public.event_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  persons integer NOT NULL DEFAULT 1,
  notes text,
  unit_price_chf numeric(10,2) NOT NULL DEFAULT 0,
  amount_chf numeric(10,2) NOT NULL DEFAULT 0,
  payment_mode text NOT NULL DEFAULT 'direct',
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  charged_amount_chf numeric(10,2) NOT NULL DEFAULT 0,
  stripe_session_id text,
  stripe_customer_id text,
  stripe_payment_method_id text,
  stripe_payment_intent_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_event_bookings_event ON public.event_bookings(event_id);
CREATE INDEX idx_event_bookings_session ON public.event_bookings(stripe_session_id);

GRANT SELECT, UPDATE, DELETE ON public.event_bookings TO authenticated;
GRANT ALL ON public.event_bookings TO service_role;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read bookings" ON public.event_bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.event_bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete bookings" ON public.event_bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_event_bookings_updated BEFORE UPDATE ON public.event_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.event_booked_count(_event_id uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(SUM(persons),0)::int FROM public.event_bookings
  WHERE event_id = _event_id AND status IN ('confirmed','attended','no_show')
$$;
GRANT EXECUTE ON FUNCTION public.event_booked_count(uuid) TO anon, authenticated;