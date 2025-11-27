import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthService } from '@/lib/services/AdminAuthService'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/auth/login
 * Authenticates an admin user and sets httpOnly cookies for session management.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          }
        },
        { status: 400 }
      )
    }

    // Attempt login
    const loginResult = await AdminAuthService.login(email, password)

    if (!loginResult.success || !loginResult.user || !loginResult.accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_FAILED',
            message: loginResult.error || 'Authentication failed'
          }
        },
        { status: 401 }
      )
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: loginResult.user
      }
    })

    // Set httpOnly cookies for session management
    const cookieStore = cookies()
    
    // Access token cookie (short-lived)
    cookieStore.set('admin_access_token', loginResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })

    // Refresh token cookie (long-lived)
    if (loginResult.refreshToken) {
      cookieStore.set('admin_refresh_token', loginResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
    }

    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      {
        success: false,
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
