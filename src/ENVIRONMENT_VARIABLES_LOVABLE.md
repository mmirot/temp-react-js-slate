
# Environment Variables in Lovable

## About Environment Variables

When developing in Lovable's preview environment, the application doesn't have access to your environment variables. This is a security feature and is expected behavior. However, when deploying your app, you'll need to set these variables in your deployment environment.

## For Production at svpathlab.com

To properly configure authentication on the production site (svpathlab.com), you need to:

1. **Set the environment variable in your hosting provider:**
   - Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk publishable key
   - This will vary depending on your hosting provider (Netlify, Vercel, etc.)

2. **Configure Clerk for your domain:**
   - Ensure your Account Portal at `accounts.svpathlab.com` is properly configured
   - Add `svpathlab.com` to the list of allowed domains in your Clerk dashboard
   - Set up redirect URLs to include proper paths
   - Verify component paths in Clerk settings match your implementation
   - **Enable invitation-only mode** (see CLERK_INVITATION_SETUP.md)

3. **Common issues to check:**
   - Ensure the key starts with `pk_live_` (publishable key, not secret key)
   - Verify that the domain is properly configured in Clerk
   - Check that the redirect URLs are correctly set up
   - Confirm Account Portal settings match your implementation
   - Verify invitation-only mode is enabled if you want to restrict registration

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

## Domain Configuration for svpathlab.com

For the svpathlab.com domain to work with Clerk authentication:

1. Go to the [Clerk Dashboard](https://dashboard.clerk.com/) > Domains
2. Configure two domains:
   - **Application Domain:** Add `svpathlab.com` as your main application domain
   - **Account Portal Domain:** Set `accounts.svpathlab.com` as your account portal domain
   
3. After adding both domains, ensure:
   - The domains are marked as "Ready" in the Clerk dashboard
   - You've verified ownership if required by Clerk
   - Both domains have proper DNS records configured

4. Under Redirect URLs settings:
   - Add `https://svpathlab.com/*` to allow redirecting back to any page
   - Add `https://accounts.svpathlab.com/sign-in`
   - Add `https://accounts.svpathlab.com/sign-up`

## Invitation-Only Access

To restrict new user registration to invitation-only:

1. Go to the Clerk Dashboard > User & Authentication > Email, Phone, Username
2. Scroll to the "Invitations" section
3. Enable "Allow sign ups with invitations only"
4. Generate invitation links from the Clerk Dashboard > User & Authentication > Invitations

For more details, see the CLERK_INVITATION_SETUP.md file in your project.
