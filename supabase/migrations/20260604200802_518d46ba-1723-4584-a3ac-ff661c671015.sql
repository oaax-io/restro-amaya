
-- Lock down SECURITY DEFINER functions: only postgres/service_role may execute
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Tighten reservation insert policy (still public, but with basic constraints)
DROP POLICY IF EXISTS "Anyone can submit reservation" ON public.reservations;
CREATE POLICY "Public can submit reservation"
ON public.reservations FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 200
  AND email LIKE '%_@_%.__%'
  AND party_size BETWEEN 1 AND 50
  AND reservation_date >= CURRENT_DATE
  AND status = 'pending'
);
