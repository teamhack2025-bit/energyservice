# Admin Authentication Service

The `AdminAuthService` provides secure authentication and session management for admin users in the energy management platform.

## Overview

The service uses Supabase Auth for JWT token handling and verifies admin privileges by checking the `admin_users` table. It provides methods for login, logout, session checking, and token refresh.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│                  (useAdminAuth hook)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests (with httpOnly cookies)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   API Routes                                 │
│  /api/admin/auth/login                                       │
│  /api/admin/auth/logout                                      │
│  /api/admin/auth/check                                       │
│  /api/admin/auth/refresh                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Service calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│              AdminAuthService                                │
│  - login(email, password)                                    │
│  - logout()                                                  │
│  - checkAuth()                                               │
│  - refreshSession()                                          │
│  - getCurrentUser()                                          │
│  - getAccessToken()                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Supabase Client
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Supabase                                   │
│  - Auth (JWT tokens)                                         │
│  - admin_users table                                         │
└──────────────────────────────────────────────────────────────┘
```

## Features

### 1. Secure Authentication
- Email/password authentication via Supabase Auth
- JWT token-based sessions
- Admin role verification from `admin_users` table
- Automatic session cleanup on failed admin verification

### 2. Session Management
- httpOnly cookies for secure token storage
- Access token (1 hour expiry)
- Refresh token (7 days expiry)
- Automatic session refresh capability

### 3. Authorization
- Verifies admin role before granting access
- Supports both `admin` and `super_admin` roles
- Middleware helpers for route protection

## Usage

### Server-Side (API Routes)

```typescript
import { AdminAuthService } from '@/lib/services/AdminAuthService'

// Login
const result = await AdminAuthService.login(email, password)
if (result.success) {
  console.log('User:', result.user)
  console.log('Access Token:', result.accessToken)
}

// Check authentication
const authCheck = await AdminAuthService.checkAuth()
if (authCheck.authenticated) {
  console.log('User:', authCheck.user)
}

// Logout
const success = await AdminAuthService.logout()

// Refresh session
const refreshed = await AdminAuthService.refreshSession()

// Get current user
const user = await AdminAuthService.getCurrentUser()

// Get access token
const token = await AdminAuthService.getAccessToken()
```

### Client-Side (React Components)

```typescript
'use client'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'

function AdminComponent() {
  const { user, loading, authenticated, login, logout } = useAdminAuth()

  const handleLogin = async () => {
    const result = await login('admin@example.com', 'password')
    if (result.success) {
      console.log('Logged in!')
    } else {
      console.error(result.error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!authenticated) return <div>Not authenticated</div>

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protecting API Routes

```typescript
import { verifyAdminAuth } from '@/lib/middleware/adminAuth'

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  
  if (!authResult.authenticated) {
    return authResult.response // Returns 401/403 error
  }

  // Protected logic here
  return NextResponse.json({ data: 'Protected data' })
}
```

## API Endpoints

### POST /api/admin/auth/login
Authenticates an admin user and sets httpOnly cookies.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "admin",
      "name": "Admin User",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Cookies Set:**
- `admin_access_token` (httpOnly, 1 hour)
- `admin_refresh_token` (httpOnly, 7 days)

### POST /api/admin/auth/logout
Logs out the admin user and clears cookies.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### GET /api/admin/auth/check
Checks if the current session is valid.

**Response (Authenticated):**
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "admin",
      "name": "Admin User",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Response (Not Authenticated):**
```json
{
  "success": false,
  "data": {
    "authenticated": false
  },
  "error": {
    "code": "NO_SESSION",
    "message": "No active session found"
  }
}
```

### POST /api/admin/auth/refresh
Refreshes the session using the refresh token.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Session refreshed successfully"
  }
}
```

## Security Features

1. **httpOnly Cookies**: Tokens stored in httpOnly cookies prevent XSS attacks
2. **Secure Flag**: Cookies use secure flag in production (HTTPS only)
3. **SameSite Protection**: Cookies use SameSite=lax to prevent CSRF
4. **Role Verification**: Every request verifies admin role from database
5. **Token Expiry**: Short-lived access tokens (1 hour) with refresh capability
6. **Automatic Cleanup**: Invalid sessions are automatically cleared

## Error Handling

All methods return consistent error responses:

```typescript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable error message',
    details?: any // Only in development
  }
}
```

### Common Error Codes

- `MISSING_CREDENTIALS`: Email or password not provided
- `AUTH_FAILED`: Invalid credentials
- `NO_SESSION`: No active session found
- `AUTH_INVALID`: Session is invalid or expired
- `FORBIDDEN`: User does not have admin privileges
- `NO_REFRESH_TOKEN`: Refresh token not found
- `REFRESH_FAILED`: Session refresh failed
- `INTERNAL_ERROR`: Unexpected server error

## Database Schema

The service relies on the `admin_users` table:

```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role admin_role NOT NULL DEFAULT 'admin',
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);
```

## Requirements Satisfied

This implementation satisfies the following requirements from the admin panel specification:

- **Requirement 1.2**: Authenticates administrators with valid credentials
- **Requirement 1.3**: Rejects invalid credentials with appropriate error messages
- **Requirement 1.5**: Requires re-authentication when session expires

## Next Steps

After implementing this service, you can:

1. Create the admin login page (`/app/admin/login/page.tsx`)
2. Implement protected admin routes using the middleware
3. Build the admin dashboard and entity management pages
4. Add audit logging for admin actions
