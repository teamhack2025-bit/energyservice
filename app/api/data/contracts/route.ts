import { NextRequest, NextResponse } from 'next/server'
import { getContracts } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }

    const contracts = await getContracts(userId)

    return NextResponse.json({ contracts })
  } catch (error: any) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

