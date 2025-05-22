
# Environment Variables Checker for svpathlab.com

## Current Status Check

When visiting your site at https://svpathlab.com/, check the following:

1. Open the browser developer console (F12 or right-click > Inspect > Console)
2. Look for a message that says either:
   - "Environment details: ... hasPublishableKey: true" (✓ Good!)
   - "Environment details: ... hasPublishableKey: false" (✗ Problem!)

## If Environment Variable is Missing

If your console shows that the publishable key is missing, you need to set it in your hosting provider:

### For Netlify:
1. Go to your Netlify dashboard
2. Select your site (svpathlab.com)
3. Navigate to Site settings > Build & deploy > Environment
4. Click "Edit variables"
5. Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk publishable key
6. Click "Save"
7. Trigger a new deployment

### For Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings > Environment Variables
4. Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk publishable key
5. Click "Save"
6. Redeploy your site

### For other hosting providers:
- Look for "Environment Variables" or "Configuration" in your hosting dashboard
- Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk publishable key

## Verifying Your Clerk Publishable Key

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to API Keys
4. Copy the value that starts with `pk_live_` (for production)
5. Make sure you're using this production key, not a test key

## After Setting the Environment Variable

After setting the environment variable and redeploying:
1. Clear your browser cache or open in incognito mode
2. Visit https://svpathlab.com/ again
3. Check the console to verify the environment variable is detected
4. Try signing in to test the authentication flow

## Common Issues

1. **Wrong variable name**: Make sure it's exactly `VITE_CLERK_PUBLISHABLE_KEY`
2. **Using development key**: Make sure you're using a production key (starts with `pk_live_`)
3. **Missing redeploy**: Many platforms require a redeploy after changing environment variables
4. **Cache issues**: Try clearing browser cache or using incognito mode
