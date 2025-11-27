import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, role = 'customer' } = body

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName' },
        { status: 400 }
      )
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          role: role,
        },
      },
    })

    if (authError) {
      console.error('Supabase signup error:', authError)
      return NextResponse.json(
        { error: authError.message || 'Failed to create account' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user record in custom users table
    // Note: Supabase Auth handles password hashing, so we'll store a placeholder
    // In production, you might want to use a database trigger or function
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        email_verified: authData.user.email_confirmed_at ? true : false,
        password_hash: 'managed_by_auth', // Supabase Auth manages passwords
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role: role,
        language: 'en',
        timezone: 'UTC',
        is_active: true,
      })

    // If user table insert fails but auth succeeded, still return success
    // The user can still log in via Supabase Auth
    if (userError) {
      console.error('User table insert error:', userError)
      // Don't fail the request if auth succeeded
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: firstName,
        lastName: lastName,
      },
      requiresEmailVerification: !authData.user.email_confirmed_at,
      message: authData.user.email_confirmed_at
        ? 'Account created successfully'
        : 'Account created. Please check your email to verify your account.',
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

