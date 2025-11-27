import { NextResponse } from 'next/server'
import { DashboardService } from '@/lib/services/DashboardService'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dashboardData = await DashboardService.getDashboardData()
    
    if (!dashboardData) {
      return NextResponse.json(
        { error: 'No customer data found for authenticated user' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
