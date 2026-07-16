
CREATE POLICY "Public read lounge images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'lounge-images');

CREATE POLICY "Admins upload lounge images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lounge-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update lounge images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lounge-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete lounge images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lounge-images' AND public.has_role(auth.uid(), 'admin'));
