import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Middleware helper to verify admin authentication.
 * Checks JWT token from cookies and verifies admin role.
 * 
 * @param request - Next.js request object
 * @returns Object with authenticated status and user data or error response
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  authenticated: boolean
  user?: any
  response?: NextResponse
}> {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('admin_access_token')?.value

    if (!accessToken) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: {
              code: 'NO_SESSION',
              message: 'Authentication required'
            }
          },
          { status: 401 }
        )
      }
    }

    // Create Supabase client and set session
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid or expired session'
            }
          },
          { status: 401 }
        )
      }
    }

    // Verify user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, role, name, created_at')
      .eq('id', user.id)
      .single()

    if (adminError || !adminUser) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Admin privileges required'
            }
          },
          { status: 403 }
        )
      }
    }

    return {
      authenticated: true,
      user: adminUser
    }
  } catch (error: any) {
    console.error('Admin auth verification error:', error)
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Authentication verification failed'
          }
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware helper to check if user has super_admin role.
 * 
 * @param user - Admin user object
 * @returns boolean indicating if user is super admin
 */
export function isSuperAdmin(user: any): boolean {
  return user?.role === 'super_admin'
}

/**
 * Creates an error response for insufficient permissions.
 */
export function createForbiddenResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'You do not have permission to perform this action'
      }
    },
    { status: 403 }
  )
}
