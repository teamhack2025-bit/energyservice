import { NextResponse } from 'next/server'
import { generateCommunityDashboardData } from '@/lib/communityData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dashboardData = generateCommunityDashboardData()
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Community dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community dashboard data' },
      { status: 500 }
    )
  }
}
