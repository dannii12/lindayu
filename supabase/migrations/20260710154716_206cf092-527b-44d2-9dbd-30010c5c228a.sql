DROP POLICY IF EXISTS "Public can update site config" ON public.site_config;
DROP POLICY IF EXISTS "Public can upsert site config" ON public.site_config;
REVOKE INSERT, UPDATE, DELETE ON public.site_config FROM anon, authenticated;