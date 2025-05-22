
# Environment Variables in Lovable

## About Environment Variables in Lovable Preview

When developing in Lovable's preview environment, the application doesn't have access to your environment variables. This is a security feature and is expected behavior.

## How This Project Handles Environment Variables

This project has been configured to:

1. Use real environment variables in production (Netlify, Vercel, etc.)
2. Display a friendly message when environment variables are missing in the preview environment
3. Allow you to continue development without authentication features in preview mode

## Required Environment Variables

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key for authentication

## Setting Environment Variables

### In Netlify (Production)

1. Go to your Netlify dashboard
2. Select your site (svpathlab.com)
3. Navigate to Site settings > Build & deploy > Environment
4. Add `VITE_CLERK_PUBLISHABLE_KEY` with your value from Clerk

### In Local Development

When developing locally outside of Lovable:

1. Create a `.env` file in your project root
2. Add your variables in this format:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_key_here
   ```
3. Make sure the `.env` file is in your `.gitignore` to avoid exposing sensitive data

## Development Workflow

During development in the Lovable preview environment:

1. You'll see an environment setup message when first loading the app
2. Use the "Continue to App" button to use the app without authentication features
3. Focus on developing non-authentication parts of your application
4. When ready to publish, you'll set the environment variables during deployment

This approach ensures your development workflow can continue while maintaining proper security practices.
