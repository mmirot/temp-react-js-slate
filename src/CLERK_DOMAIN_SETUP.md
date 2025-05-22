
# Clerk Domain Setup Guide for svpathlab.com

This guide provides step-by-step instructions for configuring domains in your Clerk dashboard for `svpathlab.com`.

## Step 1: Access Domain Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Production** > **Domains**

## Step 2: Configure Application Domain

1. Click "Add domain"
2. Enter `svpathlab.com` as the domain
3. Select "Application domain" as the type
4. Click "Create"

## Step 3: Configure Account Portal Domain

1. Click "Add domain" again
2. Enter `accounts.svpathlab.com` as the domain
3. Select "Account Portal domain" as the type
4. Click "Create"

## Step 4: Verify DNS Settings

For each domain, you'll need to verify ownership by adding DNS records:

### For svpathlab.com:
1. Add a CNAME record with:
   - Name: The DNS verification name provided by Clerk
   - Value: The DNS verification value provided by Clerk
   - TTL: 3600 (or as recommended)

### For accounts.svpathlab.com:
1. Add a CNAME record pointing to Clerk's servers:
   - Name: `accounts` (subdomain)
   - Value: The Clerk-provided hostname
   - TTL: 3600 (or as recommended)

## Step 5: Configure Redirect URLs

1. In the Clerk Dashboard, go to **Production** > **Domains**
2. Under Redirect URLs section, add:
   - `https://svpathlab.com/*` (covers all pages)
   - `https://accounts.svpathlab.com/sign-in`
   - `https://accounts.svpathlab.com/sign-up`

## Step 6: Set Path Configuration

1. Go to **Production** > **Paths**
2. Configure the following:
   - `<SignIn />`: Set to redirect to `https://accounts.svpathlab.com/sign-in`
   - `<SignUp />`: Set to redirect to `https://accounts.svpathlab.com/sign-up`
   - Sign out: Set to redirect to `https://accounts.svpathlab.com/sign-in`

## Step 7: Wait for DNS Propagation

1. DNS changes may take up to 48 hours to propagate
2. Check the status in the Clerk dashboard - domains should show as "Ready"

## Step 8: Test the Configuration

1. Open `svpathlab.com` in a private/incognito browser
2. Click the "Sign In" button
3. Verify you're redirected to `accounts.svpathlab.com/sign-in`
4. Sign in and verify you're redirected back to `svpathlab.com`

## Troubleshooting

If you encounter issues:

1. Verify DNS records are correctly set up
2. Ensure both domains show as "Ready" in the Clerk dashboard
3. Check that your `VITE_CLERK_PUBLISHABLE_KEY` is correctly set in your hosting environment
4. Clear browser cache or test in an incognito window
5. Check the browser console for specific error messages

## Next Steps

Once domains are properly configured:
1. Update your Clerk publishable key in your deployment environment
2. Redeploy your application
3. Test the complete authentication flow
