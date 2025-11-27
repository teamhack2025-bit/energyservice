import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get user from Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id)

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: 'Failed to fetch user',
            details: error
          }
        },
        { status: error.status || 500 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found'
          }
        },
        { status: 404 }
      )
    }

    // Get linked customer account if exists
    const { data: customerData } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('auth_user_id', id)
      .single()

    // Get devices if customer is linked
    let devices = []
    if (customerData) {
      const { data: devicesData } = await supabaseAdmin
        .from('devices')
        .select('*')
        .eq('customer_id', customerData.id)
      
      devices = devicesData || []
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Unknown',
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
        confirmed_at: data.user.confirmed_at,
        phone: data.user.phone,
        role: data.user.role,
        user_metadata: data.user.user_metadata,
        linked_customer: customerData || null,
        devices: devices
      }
    })
  } catch (error) {
    console.error('Error in GET /api/admin/users/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: error
        }
      },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { email, name, phone, password } = body

    // Build update object
    const updateData: any = {}
    
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (password !== undefined) updateData.password = password
    
    if (name !== undefined) {
      updateData.user_metadata = { name }
    }

    // Update user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      updateData
    )

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_ERROR',
            message: error.message || 'Failed to update user',
            details: error
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        phone: data.user.phone,
        updated_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/users/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: error
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DELETE_ERROR',
            message: error.message || 'Failed to delete user',
            details: error
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: 'User deleted successfully' }
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/users/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: error
        }
      },
      { status: 500 }
    )
  }
}
