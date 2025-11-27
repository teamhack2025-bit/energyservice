import { NextResponse } from 'next/server'
import { generateP2PMarketData } from '@/lib/communityData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const marketData = generateP2PMarketData()
    return NextResponse.json(marketData)
  } catch (error) {
    console.error('P2P market API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch P2P market data' },
      { status: 500 }
    )
  }
}
