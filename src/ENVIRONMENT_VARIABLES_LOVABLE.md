
# Environment Variables in Lovable

## About Environment Variables

When developing in Lovable's preview environment, the application doesn't have access to your environment variables. This is a security feature and is expected behavior. However, when deploying your app, you'll need to set these variables in your deployment environment.

## For Production at svpathlab.com

To fix authentication issues on the production site (svpathlab.com), you need to:

1. **Set the environment variable in your hosting provider:**
   - Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk publishable key
   - This will vary depending on your hosting provider (Netlify, Vercel, etc.)

2. **Configure Clerk for your domain:**
   - Add `svpathlab.com` to the list of allowed domains in your Clerk dashboard
   - Set up redirect URLs to include `https://svpathlab.com/auth`

3. **Common issues to check:**
   - Ensure the key starts with `pk_` (publishable key, not secret key)
   - Verify that the domain is properly configured in Clerk
   - Check that the redirect URLs are correctly set up

## Required Environment Variables

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key for authentication

## Setting Environment Variables

### When Publishing Your App

When you're ready to deploy your application:

1. Click the "Publish" button in the Lovable interface
2. During the deployment process, you'll be prompted to set environment variables
3. Add `VITE_CLERK_PUBLISHABLE_KEY` with your value from the Clerk dashboard
4. You can get your publishable key from the [Clerk Dashboard](https://dashboard.clerk.dev/) under API Keys

### In Local Development

When developing locally outside of Lovable:

1. Create a `.env` file in your project root
2. Add your variables in this format:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_key_here
   ```
3. Make sure the `.env` file is in your `.gitignore` to avoid exposing sensitive data

## Production Setup for svpathlab.com

For the svpathlab.com domain specifically:

1. Go to the Clerk Dashboard and navigate to your project
2. Under "Domains", add svpathlab.com as an allowed domain
3. Under "Redirect URLs", add https://svpathlab.com/auth as a redirect URL
4. Copy your publishable key and set it in your hosting provider's environment variables
5. Redeploy your application to apply the changes

## Development Workflow

During development in the Lovable preview environment:

1. The app runs in demo mode with authentication UI mocked
2. You can develop and test all non-authentication features
3. Authentication-related features will display their UI but won't be functional
4. When you're ready to deploy, set the environment variables to enable actual authentication

