import { NextResponse } from 'next/server'
import { generateTradingHistoryData } from '@/lib/communityData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const historyData = generateTradingHistoryData()
    return NextResponse.json(historyData)
  } catch (error) {
    console.error('Trading history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading history data' },
      { status: 500 }
    )
  }
}
