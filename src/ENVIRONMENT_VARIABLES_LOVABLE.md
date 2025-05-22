
# Environment Variables in Lovable

## About Environment Variables in Lovable Preview

When developing in Lovable's preview environment, the application doesn't have access to your environment variables. This is a security feature and is expected behavior.

## How This Project Handles Environment Variables

This project has been configured to:

1. Run in demo mode in the preview environment when no environment variables are set
2. Use real authentication in production when environment variables are properly set
3. Display clear instructions for setting up environment variables during deployment

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

## Development Workflow

During development in the Lovable preview environment:

1. The app runs in demo mode with authentication UI mocked
2. You can develop and test all non-authentication features
3. Authentication-related features will display their UI but won't be functional
4. When you're ready to deploy, set the environment variables to enable actual authentication

## Troubleshooting

If you encounter issues with authentication:

1. Confirm your Clerk key is valid and properly formatted (starts with `pk_test_` or `pk_live_`)
2. Ensure the environment variable is set with the exactly correct name: `VITE_CLERK_PUBLISHABLE_KEY`
3. If in the Lovable preview, remember that authentication will only be simulated in demo mode

For more information, visit the [Clerk documentation](https://clerk.com/docs).
