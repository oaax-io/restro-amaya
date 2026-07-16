
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.job_applications;

CREATE POLICY "Anyone can submit an application"
  ON public.job_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 200
    AND email LIKE '%_@_%.__%'
    AND char_length(position) BETWEEN 1 AND 100
    AND (message IS NULL OR char_length(message) <= 5000)
    AND (phone IS NULL OR char_length(phone) <= 50)
    AND status = 'new'::public.application_status
  );
