import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get current auth user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        authError 
      }, { status: 401 })
    }

    // Try to find customer by email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', user.email)
      .single()

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
      },
      customer: customer || null,
      customerError: customerError?.message || null,
      isLinked: !!customer
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Debug failed', 
      message: error.message 
    }, { status: 500 })
  }
}
