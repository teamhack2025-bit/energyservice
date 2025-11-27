import { NextResponse } from 'next/server'
import { generatePersonalDashboardData } from '@/lib/energySharingData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generatePersonalDashboardData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Personal dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal dashboard data' },
      { status: 500 }
    )
  }
}
