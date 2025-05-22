
# Environment Configuration for SVPathLab

## Current Configuration

Your application is now configured with **Clerk Authentication**:

- **Clerk Authentication** (Primary)
  - Status: Configured with environment variables
  - Purpose: User authentication, account management
  - Domain setup: Main site and Account Portal

**Note**: Supabase is still configured for database and backend operations, but not for authentication.

## Environment Variables

### Clerk Authentication
- `VITE_CLERK_PUBLISHABLE_KEY`: Currently set ✓
  - Used for: Authentication flows, user management
  - Format: Starts with `pk_live_` for production

### Supabase Connection
- Supabase credentials are used for database operations only
- Used for: Database operations and backend services

## Setting Environment Variables

### In Netlify (Recommended for svpathlab.com)
1. Go to your Netlify dashboard
2. Select your site (svpathlab.com)
3. Navigate to Site settings > Build & deploy > Environment
4. Ensure the `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
5. Optional Supabase variables (for database features only):
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

### In Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings > Environment Variables
4. Add/verify the environment variables

## Google OAuth Configuration

### Fix for "Error 400: invalid_request"

To resolve the Google OAuth error, follow these steps:

1. **Google Cloud Console Setup:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project or create a new one
   - Navigate to "APIs & Services" > "OAuth consent screen"
     - Set User Type to "External" if not an internal app
     - Fill in the required application information
     - Add scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, and `openid`
     - Add your domain (svpathlab.com) to authorized domains
   - Go to "APIs & Services" > "Credentials"
     - Click "Create Credentials" > "OAuth client ID"
     - Application type: "Web application"
     - Add authorized JavaScript origins:
       - `https://svpathlab.com`
       - `https://accounts.svpathlab.com`
     - Add authorized redirect URIs:
       - Get this from your Clerk dashboard (Google provider section)
       - Usually follows the format: `https://accounts.svpathlab.com/v1/oauth_callback`

2. **Clerk Dashboard Setup:**
   - Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
   - Navigate to "Authentication" > "Social connections"
   - Click on Google provider
   - Enter the Client ID and Client Secret from your Google Cloud Console
   - Verify that the redirect URI matches what you set in Google Cloud Console
   - Save changes

3. **Verify Configuration:**
   - Clear browser cache or try in an incognito window
   - Test the Google sign-in flow again

## Troubleshooting

If you encounter authentication issues:

1. Check the browser console for specific error messages
2. Verify your environment variables are correctly set
3. Clear browser cache or try in an incognito window
4. Ensure DNS records are properly configured for Clerk

### Common Google OAuth Errors:

- **invalid_request**: Usually means incorrect redirect URI or client configuration
- **unauthorized_client**: Client ID or secret is incorrect
- **access_denied**: User declined permissions or consent screen not properly configured

## Next Steps

Given that Clerk is your primary auth system:

1. **Decide on database access strategy**:
   - Use Clerk user details with Supabase for data operations
   - Implement appropriate security measures for database access

2. **Configure application logic**:
   - All components should use Clerk for authentication
   - Database operations can still use Supabase client

For more detailed setup instructions, refer to:
- `CLERK_DOMAIN_SETUP.md` - For Clerk domain configuration
