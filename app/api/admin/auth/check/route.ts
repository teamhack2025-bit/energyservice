import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/admin/auth/check
 * Checks if the current session is valid and user has admin privileges.
 * Verifies JWT token from httpOnly cookies.
 */
export async function GET(request: NextRequest) {
  try {
    // Check if access token cookie exists
    const cookieStore = cookies()
    const accessToken = cookieStore.get('admin_access_token')

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          data: {
            authenticated: false
          },
          error: {
            code: 'NO_SESSION',
            message: 'No active session found'
          }
        },
        { status: 401 }
      )
    }

    // Create Supabase client with the access token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    })

    // Verify the token by getting the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken.value)

    if (userError || !user) {
      // Clear invalid cookies
      cookieStore.delete('admin_access_token')
      cookieStore.delete('admin_refresh_token')

      return NextResponse.json(
        {
          success: false,
          data: {
            authenticated: false
          },
          error: {
            code: 'AUTH_INVALID',
            message: 'Invalid or expired session'
          }
        },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, role, name, created_at')
      .eq('id', user.id)
      .single()

    if (adminError || !adminUser) {
      // User is authenticated but not an admin
      cookieStore.delete('admin_access_token')
      cookieStore.delete('admin_refresh_token')

      return NextResponse.json(
        {
          success: false,
          data: {
            authenticated: false
          },
          error: {
            code: 'NOT_ADMIN',
            message: 'Admin privileges required'
          }
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        authenticated: true,
        user: adminUser
      }
    })
  } catch (error: any) {
    console.error('Admin auth check error:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          authenticated: false
        },
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      },
      { status: 500 }
    )
  }
}
