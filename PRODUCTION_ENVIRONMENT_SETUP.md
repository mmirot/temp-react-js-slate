
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

## Step 2: Configure Clerk

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to Production > Domains
4. Add `svpathlab.com` to your allowed domains
5. Under Redirect URLs, add:
   - `https://svpathlab.com/`
   - `https://svpathlab.com/auth`
   - `https://svpathlab.com/*` (optional, for all routes)

## Step 3: Verify Configuration

1. In the Clerk dashboard, verify that your publishable key starts with `pk_live_` (for production)
2. Check that you're using the correct key in your environment variables
3. Ensure you're using the production instance of Clerk, not development

## Step 4: Testing

After setting up your environment variables and configuring Clerk:

1. Redeploy your application
2. Clear your browser cache
3. Test the authentication flow

## Common Issues

- **Invalid Publishable Key**: Check that you're using the correct key from Clerk
- **Domain Not Allowed**: Ensure svpathlab.com is added to allowed domains
- **Missing Redirect URLs**: Configure the proper redirect URLs in Clerk
- **Using Dev Instead of Production**: Make sure you're using your production instance in Clerk

If you continue to experience issues, check browser console for specific error messages or contact Clerk support.
