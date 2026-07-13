DROP POLICY IF EXISTS "Public read menu pdfs" ON storage.objects;
CREATE POLICY "Public read menu pdfs" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'menu-pdfs');
DROP POLICY IF EXISTS "Admins write menu pdfs" ON storage.objects;
CREATE POLICY "Admins write menu pdfs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-pdfs' AND has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Admins update menu pdfs" ON storage.objects;
CREATE POLICY "Admins update menu pdfs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'menu-pdfs' AND has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Admins delete menu pdfs" ON storage.objects;
CREATE POLICY "Admins delete menu pdfs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'menu-pdfs' AND has_role(auth.uid(),'admin'));