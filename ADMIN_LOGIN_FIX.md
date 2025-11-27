# Admin Login Fix

## Issue
After clicking "Sign In", the login page wasn't redirecting to the dashboard even though authentication was successful.

## Root Cause
1. The `router.push()` wasn't triggering a full page reload, so cookies weren't being properly recognized
2. The `/api/admin/auth/check` route was using client-side Supabase which couldn't access httpOnly cookies

## Fixes Applied

### 1. Login Page (`app/admin/login/page.tsx`)
- Changed from `router.push('/admin/dashboard')` to `window.location.href = '/admin/dashboard'`
- This ensures a full page reload after login, allowing cookies to be properly set and recognized
- Added better error logging

### 2. Auth Check Route (`app/api/admin/auth/check/route.ts`)
- Rewrote to read the JWT token directly from httpOnly cookies
- Uses `supabase.auth.getUser(token)` to verify the token server-side
- Properly checks admin_users table to verify admin privileges
- Clears cookies if authentication fails

## How It Works Now

1. User submits login form with email/password
2. `/api/admin/auth/login` authenticates with Supabase
3. Sets httpOnly cookies: `admin_access_token` and `admin_refresh_token`
4. Returns success response
5. Frontend does full page redirect to `/admin/dashboard`
6. Dashboard page calls `/api/admin/auth/check`
7. Auth check reads token from cookie and verifies it
8. Returns user data if valid
9. Dashboard renders with authenticated user

## Testing

To test the login:

1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `admin@energyplatform.lu`
   - Password: `Admin123!@#`
3. Click "Sign In"
4. Should redirect to dashboard successfully

## Credentials

**Email:** `admin@energyplatform.lu`  
**Password:** `Admin123!@#`

⚠️ **Change the password after first login!**
