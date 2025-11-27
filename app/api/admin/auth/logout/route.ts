import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthService } from '@/lib/services/AdminAuthService'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/auth/logout
 * Logs out the admin user and clears session cookies.
 */
export async function POST(request: NextRequest) {
  try {
    // Attempt logout
    const success = await AdminAuthService.logout()

    // Clear cookies regardless of logout result
    const cookieStore = cookies()
    cookieStore.delete('admin_access_token')
    cookieStore.delete('admin_refresh_token')

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LOGOUT_FAILED',
            message: 'Logout failed, but cookies were cleared'
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    })
  } catch (error: any) {
    console.error('Admin logout error:', error)
    
    // Still try to clear cookies
    const cookieStore = cookies()
    cookieStore.delete('admin_access_token')
    cookieStore.delete('admin_refresh_token')

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
