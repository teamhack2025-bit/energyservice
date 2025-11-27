import { NextResponse } from 'next/server'
import { generateAdminDashboardData } from '@/lib/energySharingData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generateAdminDashboardData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Admin dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin dashboard data' },
      { status: 500 }
    )
  }
}
