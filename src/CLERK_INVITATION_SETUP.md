
# Setting Up Invitation-Only Registration in Clerk

This document explains how to configure Clerk to support invitation-only user registration for SV Pathology Lab.

## Step 1: Configure Environment Variables

Make sure these environment variables are set in your deployment environment:

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

## Step 2: Enable Invitation-Only Mode in Clerk

1. Go to your [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Select your application
3. Navigate to **User & Authentication → Email, Phone, Username**
4. Scroll to the **Invitations** section
5. Toggle "Allow sign ups with invitations only" to **ON**
   - This will prevent any new sign-ups without an invitation

## Step 3: Generate and Send Invitations

As an admin, you can invite users through:

1. Clerk Dashboard:
   - Go to **User & Authentication → Invitations**
   - Click "New invitation"
   - Enter the email address of the user you want to invite
   - Set an expiration time if desired
   - Click "Create invitation"

2. Programmatically (for developers):
   - You can set up a server-side function to generate invitations using Clerk's API
   - Requires using the Clerk secret key, which should only be used server-side

## Step 4: Configure Email Templates (Optional)

1. Go to **Customization → Email Templates** in the Clerk Dashboard
2. Customize the "Invitation" template to match your organization's branding

## Important Notes

- Only administrators can create invitations
- You can restrict who can create invitations in the "Permissions" section of the Clerk Dashboard
- Each invitation can only be used once
- Invitations can have expiration dates
- The invitation flow will direct users through Clerk's standard sign-up process, but requires a valid invitation code

## Production vs Development

- For development, you may want to temporarily disable invitation-only mode
- For production, ensure invitation-only mode is enabled before deployment

## Troubleshooting

If users report issues with invitations:
- Check that the invitation hasn't expired
- Verify the email address matches exactly
- Ensure invitation-only mode is correctly enabled
- Check the Clerk logs for any errors
