
# Environment Variables in Lovable

## About Environment Variables in Lovable Preview

When developing in Lovable's preview environment, the application doesn't have access to your actual environment variables. This is a security feature and is expected behavior.

## How This Project Handles Environment Variables

This project has been configured to:

1. Use real environment variables in production (Netlify, Vercel, etc.)
2. Use dummy values for preview in the Lovable environment
3. Display descriptive error messages if the variables are missing in production

## Required Environment Variables

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key for authentication

## Setting Environment Variables

### In Netlify (Production)

1. Go to your Netlify dashboard
2. Select your site
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

## How It Works

The main.jsx file includes logic to:
- Check if the app is running in Lovable preview
- Use a dummy key when in preview mode
- Use the real key in production
- Show helpful error messages if the key is missing in production

This allows you to develop in Lovable without seeing authentication errors while ensuring proper security in production.
