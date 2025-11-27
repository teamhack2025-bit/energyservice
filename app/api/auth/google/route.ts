import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'

    // Generate Google OAuth URL
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to initiate Google login' },
        { status: 400 }
      )
    }

    // Redirect to Google OAuth URL
    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    return NextResponse.json(
      { error: 'Failed to generate OAuth URL' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Google login error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

