ALTER TABLE public.event_bookings ADD COLUMN IF NOT EXISTS ticket_token uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.event_bookings ADD COLUMN IF NOT EXISTS checked_in_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS event_bookings_ticket_token_idx ON public.event_bookings(ticket_token);
CREATE OR REPLACE FUNCTION public.check_in_event_ticket(_token uuid, _environment text, _event_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.event_bookings;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF _environment NOT IN ('sandbox', 'live') THEN RAISE EXCEPTION 'Invalid environment'; END IF;
  SELECT * INTO b FROM public.event_bookings WHERE ticket_token = _token AND environment = _environment FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'Ticket nicht gefunden.'); END IF;
  IF _event_id IS NOT NULL AND b.event_id <> _event_id THEN RETURN jsonb_build_object('error', 'Ticket gehört zu einem anderen Event.'); END IF;
  IF b.status = 'attended' OR b.checked_in_at IS NOT NULL THEN RETURN jsonb_build_object('error', 'Ticket wurde bereits eingelöst.'); END IF;
  IF b.status <> 'confirmed' OR b.payment_status NOT IN ('paid', 'card_saved') THEN RETURN jsonb_build_object('error', 'Ticket ist nicht gültig.'); END IF;
  UPDATE public.event_bookings SET status = 'attended', checked_in_at = now(), updated_at = now() WHERE id = b.id;
  RETURN jsonb_build_object('ok', true, 'name', b.name, 'persons', b.persons);
END;
$$;
REVOKE ALL ON FUNCTION public.check_in_event_ticket(uuid, text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_in_event_ticket(uuid, text, uuid) TO authenticated;
