
# Environment Configuration for SVPathLab

## Current Configuration

Your application is now configured with **Clerk Authentication**:

- **Clerk Authentication** (Primary)
  - Status: Configured with environment variables
  - Purpose: User authentication, account management
  - Domain setup: Main site and Account Portal
  - Authentication types: Email only (social logins disabled)

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

## Clerk Configuration

### Email-Only Authentication

To ensure your application only uses email authentication:

1. **Clerk Dashboard Setup:**
   - Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
   - Navigate to "Authentication" > "Social connections"
   - Disable all social providers (Google, Facebook, GitHub, etc.)
   - Navigate to "Email, Phone, Username" settings
   - Ensure that "Email address" is enabled
   - Save your changes

2. **Verify Configuration:**
   - Clear browser cache or try in an incognito window
   - Test the authentication flow to ensure only email signup/signin is available
   - Check that no social login buttons appear

## Troubleshooting

If you encounter authentication issues:

1. Check the browser console for specific error messages
2. Verify your environment variables are correctly set
3. Clear browser cache or try in an incognito window
4. Ensure DNS records are properly configured for Clerk

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
