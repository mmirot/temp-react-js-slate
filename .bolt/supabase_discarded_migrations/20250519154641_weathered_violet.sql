/*
  # Configure authentication settings
  
  Updates authentication configuration to:
  1. Set site URL to svpathlab.com
  2. Configure email-only authentication
  3. Disable all other auth providers
*/

-- Create a function to update auth settings
CREATE OR REPLACE FUNCTION update_auth_settings()
RETURNS void AS $$
BEGIN
  -- Update auth settings in the database
  INSERT INTO auth.config (
    site_url,
    additional_redirect_urls,
    mailer_autoconfirm,
    phone_autoconfirm,
    sms_provider,
    external_email_enabled,
    external_phone_enabled
  )
  VALUES (
    'https://svpathlab.com',
    ARRAY['https://svpathlab.com/**'],
    true,  -- Enable email autoconfirm
    false, -- Disable phone autoconfirm
    '',    -- No SMS provider
    false, -- Disable external email
    false  -- Disable external phone
  )
  ON CONFLICT (site_url) DO UPDATE
  SET
    additional_redirect_urls = EXCLUDED.additional_redirect_urls,
    mailer_autoconfirm = EXCLUDED.mailer_autoconfirm,
    phone_autoconfirm = EXCLUDED.phone_autoconfirm,
    sms_provider = EXCLUDED.sms_provider,
    external_email_enabled = EXCLUDED.external_email_enabled,
    external_phone_enabled = EXCLUDED.external_phone_enabled;

  -- Disable all non-email providers
  UPDATE auth.providers 
  SET enabled = (provider_id = 'email');
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT update_auth_settings();