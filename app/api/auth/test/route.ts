import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// Test endpoint to verify Supabase connection
export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'Supabase connection failed',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Test endpoint error',
    })
  }
}

