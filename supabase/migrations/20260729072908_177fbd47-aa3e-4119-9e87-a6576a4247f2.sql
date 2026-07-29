CREATE TABLE public.analytics_pageviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  referrer text,
  device_type text NOT NULL DEFAULT 'desktop',
  browser text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  session_id text NOT NULL,
  x_percent numeric NOT NULL,
  y_percent numeric NOT NULL,
  viewport_width integer,
  viewport_height integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.analytics_pageviews TO anon, authenticated;
GRANT SELECT, DELETE ON public.analytics_pageviews TO authenticated;
GRANT ALL ON public.analytics_pageviews TO service_role;

GRANT INSERT ON public.analytics_clicks TO anon, authenticated;
GRANT SELECT, DELETE ON public.analytics_clicks TO authenticated;
GRANT ALL ON public.analytics_clicks TO service_role;

ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log pageviews" ON public.analytics_pageviews
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(path) BETWEEN 1 AND 500
    AND char_length(visitor_id) BETWEEN 1 AND 100
    AND char_length(session_id) BETWEEN 1 AND 100
    AND device_type IN ('mobile','tablet','desktop')
    AND (referrer IS NULL OR char_length(referrer) <= 500)
    AND (browser IS NULL OR char_length(browser) <= 50)
  );

CREATE POLICY "Admins can view pageviews" ON public.analytics_pageviews
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pageviews" ON public.analytics_pageviews
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can log clicks" ON public.analytics_clicks
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(path) BETWEEN 1 AND 500
    AND char_length(session_id) BETWEEN 1 AND 100
    AND x_percent >= 0 AND x_percent <= 100
    AND y_percent >= 0 AND y_percent <= 100
  );

CREATE POLICY "Admins can view clicks" ON public.analytics_clicks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete clicks" ON public.analytics_clicks
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_analytics_pageviews_created_at ON public.analytics_pageviews (created_at DESC);
CREATE INDEX idx_analytics_pageviews_path ON public.analytics_pageviews (path);
CREATE INDEX idx_analytics_clicks_created_at ON public.analytics_clicks (created_at DESC);
CREATE INDEX idx_analytics_clicks_path ON public.analytics_clicks (path);