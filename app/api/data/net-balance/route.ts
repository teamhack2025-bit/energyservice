import { NextRequest, NextResponse } from 'next/server'
import { getNetBalanceData } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const siteId = searchParams.get('siteId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!siteId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: siteId, startDate, endDate' },
        { status: 400 }
      )
    }

    const data = await getNetBalanceData(
      siteId,
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching net balance data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch net balance data' },
      { status: 500 }
    )
  }
}

