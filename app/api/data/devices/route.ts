import { NextRequest, NextResponse } from 'next/server'
import { getDevices } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const siteId = searchParams.get('siteId')

    if (!siteId) {
      return NextResponse.json(
        { error: 'Missing required parameter: siteId' },
        { status: 400 }
      )
    }

    const devices = await getDevices(siteId)

    return NextResponse.json({ devices })
  } catch (error: any) {
    console.error('Error fetching devices:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}

