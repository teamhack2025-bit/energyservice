import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthService } from '@/lib/services/AdminAuthService'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/auth/refresh
 * Refreshes the admin session using the refresh token from httpOnly cookies.
 */
export async function POST(request: NextRequest) {
  try {
    // Check if refresh token cookie exists
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('admin_refresh_token')

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'No refresh token found'
          }
        },
        { status: 401 }
      )
    }

    // Attempt to refresh session
    const success = await AdminAuthService.refreshSession()

    if (!success) {
      // Clear invalid cookies
      cookieStore.delete('admin_access_token')
      cookieStore.delete('admin_refresh_token')

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REFRESH_FAILED',
            message: 'Session refresh failed'
          }
        },
        { status: 401 }
      )
    }

    // Get new access token
    const newAccessToken = await AdminAuthService.getAccessToken()

    if (!newAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TOKEN_RETRIEVAL_FAILED',
            message: 'Failed to retrieve new access token'
          }
        },
        { status: 500 }
      )
    }

    // Update access token cookie
    cookieStore.set('admin_access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Session refreshed successfully'
      }
    })
  } catch (error: any) {
    console.error('Admin session refresh error:', error)
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
