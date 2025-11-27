import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (errorParam) {
      return NextResponse.redirect(
        `/login?error=${encodeURIComponent(errorDescription || errorParam || 'OAuth authentication failed')}`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `/login?error=${encodeURIComponent('No authorization code provided')}`
      )
    }

    // Create a Supabase client for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(
        `/login?error=${encodeURIComponent(error.message || 'Authentication failed')}`
      )
    }

    if (!data.session || !data.user) {
      return NextResponse.redirect(
        `/login?error=${encodeURIComponent('Failed to create session')}`
      )
    }

    // Check if user exists in custom users table, if not create it
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (!existingUser) {
      // Create user record in custom users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          email_verified: data.user.email_confirmed_at ? true : false,
          password_hash: 'oauth_google', // OAuth users don't have passwords
          first_name: data.user.user_metadata?.first_name || data.user.user_metadata?.full_name?.split(' ')[0] || 'User',
          last_name: data.user.user_metadata?.last_name || data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          phone: data.user.user_metadata?.phone || null,
          role: 'customer',
          language: 'en',
          timezone: 'UTC',
          avatar_url: data.user.user_metadata?.avatar_url || null,
          is_active: true,
        })

      if (userError) {
        console.error('User creation error:', userError)
        // Continue anyway, user can still log in via OAuth
      }
    } else {
      // Update last login
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id)
    }

    // Store session tokens (in production, use httpOnly cookies)
    // For now, pass tokens via URL params - client will store them
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUrl = new URL('/login', baseUrl)
    redirectUrl.searchParams.set('token', data.session.access_token)
    redirectUrl.searchParams.set('refresh', data.session.refresh_token)
    redirectUrl.searchParams.set('redirectTo', redirectTo)

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error: any) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      `/login?error=${encodeURIComponent(error.message || 'Authentication error')}`
    )
  }
}

