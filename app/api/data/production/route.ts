import { NextRequest, NextResponse } from 'next/server'
import { getProductionData } from '@/lib/supabase/queries'

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

    const data = await getProductionData(
      siteId,
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching production data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch production data' },
      { status: 500 }
    )
  }
}

