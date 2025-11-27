import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-browser'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }
  }

  // Redirect to dashboard after successful login
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
