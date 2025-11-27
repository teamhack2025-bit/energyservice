# Admin Authentication Middleware

This directory contains middleware helpers for protecting admin routes and verifying admin authentication.

## Usage Example

### Protecting an API Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/middleware/adminAuth'

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = await verifyAdminAuth(request)
  
  if (!authResult.authenticated) {
    return authResult.response // Returns 401 or 403 error
  }

  // User is authenticated as admin
  const adminUser = authResult.user

  // Your protected logic here
  return NextResponse.json({
    success: true,
    data: {
      message: 'Protected data',
      user: adminUser
    }
  })
}
```

### Checking for Super Admin

```typescript
import { verifyAdminAuth, isSuperAdmin, createForbiddenResponse } from '@/lib/middleware/adminAuth'

export async function DELETE(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  
  if (!authResult.authenticated) {
    return authResult.response
  }

  // Check if user is super admin
  if (!isSuperAdmin(authResult.user)) {
    return createForbiddenResponse()
  }

  // Super admin only logic here
  return NextResponse.json({ success: true })
}
```

## Functions

### `verifyAdminAuth(request: NextRequest)`

Verifies that the request has a valid admin session.

**Returns:**
- `authenticated: boolean` - Whether the user is authenticated as an admin
- `user?: AdminUser` - The admin user object if authenticated
- `response?: NextResponse` - Error response if not authenticated

### `isSuperAdmin(user: any)`

Checks if the given user has super_admin role.

**Returns:** `boolean`

### `createForbiddenResponse()`

Creates a standardized 403 Forbidden response.

**Returns:** `NextResponse`
