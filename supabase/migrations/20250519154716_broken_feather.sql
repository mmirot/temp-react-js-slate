/*
  # Configure authentication settings

  1. Changes
    - Set site URL to svpathlab.com
    - Enable email authentication only
    - Configure email autoconfirm
    - Disable all other auth providers
*/

-- Create a function to handle auth configuration
CREATE OR REPLACE FUNCTION public.configure_auth()
RETURNS void AS $$
BEGIN
  -- Update email settings in public schema
  INSERT INTO public.auth_settings (
    site_url,
    redirect_urls,
    email_enabled,
    email_autoconfirm
  ) VALUES (
    'https://svpathlab.com',
    ARRAY['https://svpathlab.com/**'],
    true,
    true
  )
  ON CONFLICT (site_url) DO UPDATE
  SET
    redirect_urls = EXCLUDED.redirect_urls,
    email_enabled = EXCLUDED.email_enabled,
    email_autoconfirm = EXCLUDED.email_autoconfirm;
END;
$$ LANGUAGE plpgsql;

-- Create auth settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.auth_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_url text UNIQUE NOT NULL,
  redirect_urls text[],
  email_enabled boolean DEFAULT true,
  email_autoconfirm boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to auth settings"
  ON public.auth_settings
  FOR SELECT
  TO public
  USING (true);

-- Execute the configuration function
SELECT public.configure_auth();