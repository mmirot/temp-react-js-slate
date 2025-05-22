
# Production Environment Setup for svpathlab.com

This document provides specific instructions for configuring authentication on your production deployment at svpathlab.com.

## Authentication Issues

If you're experiencing authentication issues on your production site where:
- Sign in button doesn't work
- Authentication errors appear
- Clerk components fail to load

Follow these steps to resolve them:

## Step 1: Set Environment Variables

Your application needs the `VITE_CLERK_PUBLISHABLE_KEY` environment variable to authenticate users.

### Setting Environment Variables in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to Site settings > Build & deploy > Environment
4. Click "Edit variables"
5. Add `VITE_CLERK_PUBLISHABLE_KEY` with your value from the Clerk dashboard
6. Redeploy your site

### Setting Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings > Environment Variables
4. Add `VITE_CLERK_PUBLISHABLE_KEY` with your value from the Clerk dashboard
5. Redeploy your site

## Step 2: Configure Clerk Account Portal

Your site is configured to use Clerk's Account Portal at `accounts.svpathlab.com` for authentication. Make sure:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to Production > Account Portal
4. Ensure the Account Portal is enabled
5. Verify that `accounts.svpathlab.com` is properly configured as your account portal domain

## Step 3: Configure Clerk Redirect URLs

1. In your Clerk Dashboard, navigate to Production > Domains
2. Add `svpathlab.com` to your allowed domains
3. Under Redirect URLs, ensure you have:
   - `https://svpathlab.com/`
   - `https://accounts.svpathlab.com/sign-in`
   - `https://accounts.svpathlab.com/sign-up`
   - `https://svpathlab.com/*` (optional, for all routes)

## Step 4: Verify Component URLs

1. In your Clerk Dashboard, navigate to Production > Paths
2. Ensure the following paths are correctly set:
   - `<SignIn />` should point to `https://accounts.svpathlab.com/sign-in`
   - `<SignUp />` should point to `https://accounts.svpathlab.com/sign-up`
   - Signing Out should redirect to `https://accounts.svpathlab.com/sign-in`

## Step 5: Verify Configuration

1. In the Clerk dashboard, verify that your publishable key starts with `pk_live_` (for production)
2. Check that you're using the correct key in your environment variables
3. Ensure you're using the production instance of Clerk, not development

## Step 6: Testing

After setting up your environment variables and configuring Clerk:

1. Redeploy your application
2. Clear your browser cache
3. Test the authentication flow by clicking on the Sign In/Sign Up buttons

## Common Issues

- **Invalid Publishable Key**: Check that you're using the correct key from Clerk
- **Domain Not Allowed**: Ensure svpathlab.com is added to allowed domains
- **Missing Redirect URLs**: Configure the proper redirect URLs in Clerk
- **Using Dev Instead of Production**: Make sure you're using your production instance in Clerk
- **Account Portal Not Configured**: Verify the account portal settings match your implementation

If you continue to experience issues, check browser console for specific error messages or contact Clerk support.
