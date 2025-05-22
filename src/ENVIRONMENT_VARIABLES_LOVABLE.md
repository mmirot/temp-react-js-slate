
# Environment Variables in Lovable

## About Environment Variables in Lovable Preview

When developing in Lovable's preview environment, the application doesn't have access to your environment variables. This is a security feature and is expected behavior.

## How This Project Handles Environment Variables

This project has been configured to:

1. Use real environment variables in production (when deployed)
2. Display a friendly message when environment variables are missing in the preview environment
3. Allow you to continue development with a demo mode in the preview environment

## Required Environment Variables

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key for authentication

## Setting Environment Variables

### When Publishing Your App

When you're ready to deploy your application:

1. Click the "Publish" button in the Lovable interface
2. During the deployment process, you'll be prompted to set environment variables
3. Add `VITE_CLERK_PUBLISHABLE_KEY` with your value from the Clerk dashboard

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
2. Use the "Continue to App" button to use the app in demo mode
3. In demo mode, authentication UI is visible but not functional
4. You can develop non-authentication parts of your application
5. When ready to publish, you'll set the environment variables during deployment

This approach ensures your development workflow can continue while maintaining proper security practices.
