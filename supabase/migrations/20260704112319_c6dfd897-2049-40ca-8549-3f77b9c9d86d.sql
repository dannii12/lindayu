CREATE TABLE public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_config TO anon;
GRANT SELECT ON public.site_config TO authenticated;
GRANT ALL ON public.site_config TO service_role;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site config" ON public.site_config FOR SELECT USING (true);
INSERT INTO public.site_config (id, payload) VALUES ('main', '{}'::jsonb) ON CONFLICT (id) DO NOTHING;