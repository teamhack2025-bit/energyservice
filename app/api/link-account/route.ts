import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Get current auth user (using regular client)
    const { createClient: createBrowserClient } = await import('@supabase/supabase-js')
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        message: 'Please log in first'
      }, { status: 401 })
    }

    // Find customer by email
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('email', user.email)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ 
        error: 'Customer not found',
        message: `No customer record found for email: ${user.email}`,
        suggestion: 'Make sure your customer record exists in the database'
      }, { status: 404 })
    }

    // Check if already linked
    if (customer.auth_user_id === user.id) {
      return NextResponse.json({ 
        success: true,
        message: 'Account already linked',
        customer
      })
    }

    // Link the accounts
    const { data: updatedCustomer, error: updateError } = await supabaseAdmin
      .from('customers')
      .update({ auth_user_id: user.id })
      .eq('id', customer.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ 
        error: 'Failed to link account',
        message: updateError.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Account successfully linked!',
      customer: updatedCustomer,
      authUser: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Link failed', 
      message: error.message 
    }, { status: 500 })
  }
}
