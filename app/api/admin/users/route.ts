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

interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// GET /api/admin/users - List users with pagination, search, sort
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Calculate offset
    const offset = (page - 1) * pageSize

    // Build query for auth.users
    let query = supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: pageSize
    })

    const { data: usersData, error: usersError } = await query

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: 'Failed to fetch users',
            details: usersError
          }
        },
        { status: 500 }
      )
    }

    let users = usersData.users || []

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      users = users.filter(user => 
        user.email?.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower) ||
        user.user_metadata?.name?.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    users.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case 'email':
          aVal = a.email || ''
          bVal = b.email || ''
          break
        case 'created_at':
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
          break
        case 'last_sign_in_at':
          aVal = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0
          bVal = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0
          break
        default:
          aVal = a.created_at
          bVal = b.created_at
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    // Get total count
    const total = users.length

    // Apply pagination after filtering
    const paginatedUsers = users.slice(offset, offset + pageSize)

    // Format response
    const formattedUsers = paginatedUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      confirmed_at: user.confirmed_at,
      phone: user.phone,
      role: user.role
    }))

    return NextResponse.json({
      success: true,
      data: {
        data: formattedUsers,
        total,
        page,
        pageSize
      }
    })
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error)
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

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
            details: { missing: !email ? 'email' : 'password' }
          }
        },
        { status: 400 }
      )
    }

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      phone,
      user_metadata: {
        name: name || email.split('@')[0]
      }
    })

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CREATE_ERROR',
            message: error.message || 'Failed to create user',
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
        created_at: data.user.created_at,
        phone: data.user.phone
      }
    })
  } catch (error) {
    console.error('Error in POST /api/admin/users:', error)
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
