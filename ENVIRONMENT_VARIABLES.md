
# Environment Variables for SV Pathology Lab

This document outlines the environment variables required for this application to function properly.

## Required Environment Variables

### Clerk Authentication

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
  - Required for authentication functionality
  - Must be set in your deployment environment (Netlify, Vercel, etc.)
  - Can be obtained from the [Clerk Dashboard](https://dashboard.clerk.com)

## How to Set Environment Variables

### In Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to Site settings > Build & deploy > Environment
4. Click "Edit variables"
5. Add the environment variables listed above
6. Redeploy your site for changes to take effect

### In Local Development

When developing locally, you can set your environment variables by:

1. Creating a `.env` file in your project root
2. Adding your variables in this format:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_key_here
   ```
3. Make sure the `.env` file is in your `.gitignore` to avoid exposing sensitive data

**Note:** Never commit your environment variables to version control.
