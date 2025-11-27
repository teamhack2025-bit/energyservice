import { NextResponse } from 'next/server'
import { ExternalEnergyService } from '@/lib/services/ExternalEnergyService'
import { DataTransformer } from '@/lib/services/DataTransformer'
import { HouseIdManager } from '@/lib/services/HouseIdManager'
import { generateNetBalanceData } from '@/lib/mockData'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // For now, use a default house ID (H001)
    // In production, get user ID from authentication
    const userId = 'default-user'
    const houseId = await HouseIdManager.getHouseIdForUser(userId)
    
    console.log(`Fetching dashboard data for house ${houseId}`)
    
    // Fetch data from external API
    const externalService = new ExternalEnergyService()
    const externalData = await externalService.getDashboardData(houseId)
    
    // Transform to internal format
    const internalData = DataTransformer.transformExternalToInternal(externalData)
    
    return NextResponse.json({
      ...internalData,
      fallbackUsed: false,
      houseId,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    
    // Fallback to mock data
    const mockData = {
      todayStats: {
        netBalance: -2.5,
        production: 18.5,
        consumption: 15.2,
        efficiency: 72,
      },
      monthlyStats: {
        cost: 78.95,
        revenue: 14.05,
      },
      metrics: {
        netToday: { value: -2.5, change: 12, direction: 'down' as const },
        costThisMonth: { value: 78.95, change: 6, direction: 'down' as const },
        revenueThisMonth: { value: 14.05, change: 8, direction: 'up' as const },
        efficiency: { value: 72, change: 5, direction: 'up' as const },
        todayProduction: { value: 18.5, change: 5, direction: 'up' as const },
        todayConsumption: { value: 15.2, change: 3, direction: 'down' as const },
      },
      last30Days: generateNetBalanceData(30),
      last7DaysConsumption: [],
      last7DaysProduction: [],
      energyBalance: {
        produced: 4.5,
        consumed: 2.8,
        net: 1.7,
      },
      quickActions: [
        {
          id: 'download_invoice',
          title: 'Download Invoice',
          description: 'Get your latest bill',
          icon: 'download',
          href: '/billing',
        },
        {
          id: 'change_tariff',
          title: 'Change Tariff',
          description: 'Compare and switch',
          icon: 'tariff',
          href: '/contracts',
        },
        {
          id: 'report_issue',
          title: 'Report Issue',
          description: 'Get support help',
          icon: 'support',
          href: '/support/tickets/new',
        },
      ],
      fallbackUsed: true,
    }
    
    return NextResponse.json(mockData)
  }
}
