/*
  # Configure authentication settings
  
  Updates authentication settings to:
  1. Set site URL to svpathlab.com
  2. Enable email authentication only
  3. Configure autoconfirm settings
  4. Disable all other auth providers
*/

-- Create a function to update auth settings
CREATE OR REPLACE FUNCTION auth.update_site_config()
RETURNS void AS $$
BEGIN
  -- Update site URL and redirect settings
  UPDATE auth.instances
  SET 
    raw_base_config = raw_base_config || 
      jsonb_build_object(
        'site_url', 'https://svpathlab.com',
        'additional_redirect_urls', ARRAY['https://svpathlab.com/**']::text[]
      );
      
  -- Configure authentication methods
  UPDATE auth.flow_state
  SET 
    authentication_method = 'email';
    
  -- Enable email signup and autoconfirm
  UPDATE auth.instances
  SET 
    raw_base_config = raw_base_config || 
      jsonb_build_object(
        'mailer_autoconfirm', true,
        'enable_signup', true
      );
      
  -- Disable all non-email providers
  UPDATE auth.providers 
  SET enabled = CASE WHEN provider_id = 'email' THEN true ELSE false END;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT auth.update_site_config();