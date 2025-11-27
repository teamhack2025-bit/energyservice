# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for the Energy Portal.

## Prerequisites

1. Supabase project created
2. Google Cloud Console account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Energy Portal
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `https://fzkocsfhlhhlinxqtybf.supabase.co/auth/v1/callback`
     - `http://localhost:3000/api/auth/callback` (for local testing)
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and enable it
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
5. Click **Save**

## Step 3: Update Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, update to your production URL.

## Step 4: Test Google Login

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click **Continue with Google**
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to the dashboard

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud Console matches exactly:
  - `https://fzkocsfhlhhlinxqtybf.supabase.co/auth/v1/callback`
- Check for trailing slashes or typos

### "OAuth consent screen" error
- Complete the OAuth consent screen configuration in Google Cloud Console
- Add your email as a test user if the app is in testing mode

### User not created in database
- Check Supabase logs for errors
- Verify the `users` table exists and has the correct schema
- Check that RLS policies allow inserts

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- In production, use httpOnly cookies instead of localStorage for tokens
- Enable HTTPS in production
- Regularly rotate OAuth credentials

## API Endpoints

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/callback` - Handles OAuth callback from Google

## User Flow

1. User clicks "Continue with Google"
2. Redirected to `/api/auth/google`
3. Redirected to Google sign-in page
4. User signs in with Google
5. Google redirects to Supabase callback URL
6. Supabase processes OAuth and redirects to `/api/auth/callback`
7. Callback creates/updates user in database
8. Redirects to `/login` with tokens in URL
9. Client stores tokens and redirects to dashboard

