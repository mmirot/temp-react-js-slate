/*
  # Configure authentication settings

  Updates the auth settings to:
  - Set site URL to svpathlab.com
  - Configure allowed redirect URLs
  - Enable email auth
  - Disable other auth providers
*/

-- Update auth settings
SELECT auth.update_config(
  jsonb_build_object(
    'site_url', 'https://svpathlab.com',
    'additional_redirect_urls', ARRAY[
      'https://svpathlab.com/**'
    ],
    'enable_email_signup', true,
    'enable_email_autoconfirm', true,
    'enable_phone_signup', false,
    'enable_phone_autoconfirm', false,
    'enable_google_oauth', false,
    'enable_facebook_oauth', false,
    'enable_github_oauth', false,
    'enable_discord_oauth', false,
    'enable_twitter_oauth', false,
    'enable_twitch_oauth', false,
    'enable_apple_oauth', false,
    'enable_azure_oauth', false,
    'enable_bitbucket_oauth', false,
    'enable_gitlab_oauth', false,
    'enable_keycloak_oauth', false,
    'enable_linkedin_oauth', false,
    'enable_notion_oauth', false,
    'enable_spotify_oauth', false,
    'enable_slack_oauth', false,
    'enable_workos_oauth', false,
    'enable_zoom_oauth', false
  )
);