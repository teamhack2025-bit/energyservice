import { NextRequest, NextResponse } from 'next/server'
import { getConsumptionData } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const siteId = searchParams.get('siteId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const granularity = (searchParams.get('granularity') || 'daily') as '15min' | 'hourly' | 'daily' | 'monthly'

    if (!siteId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: siteId, startDate, endDate' },
        { status: 400 }
      )
    }

    const data = await getConsumptionData(
      siteId,
      new Date(startDate),
      new Date(endDate),
      granularity
    )

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching consumption data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch consumption data' },
      { status: 500 }
    )
  }
}

