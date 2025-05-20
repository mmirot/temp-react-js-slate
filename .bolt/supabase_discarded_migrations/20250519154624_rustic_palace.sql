/*
  # Configure authentication settings
  
  1. Changes
    - Set site URL to svpathlab.com
    - Configure allowed redirect URLs
    - Enable email authentication only
    - Disable all other authentication providers
*/

-- Update auth settings
ALTER TABLE auth.identities
DISABLE ROW LEVEL SECURITY;

UPDATE auth.config SET 
  site_url = 'https://svpathlab.com',
  additional_redirect_urls = ARRAY['https://svpathlab.com/**'],
  mailer_autoconfirm = true,
  phone_autoconfirm = false,
  sms_provider = '',
  external_email_enabled = false,
  external_phone_enabled = false;

-- Disable all OAuth providers
UPDATE auth.providers SET 
  enabled = false 
WHERE provider_id != 'email';