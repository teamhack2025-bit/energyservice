import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {

    // Get counts for various entities
    // Note: This is a basic implementation. Task 13.1 will implement the full version with caching
    
    const [
      usersResult,
      customersResult,
      devicesResult,
      communitiesResult,
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('devices').select('id', { count: 'exact', head: true }),
      supabase.from('communities').select('id', { count: 'exact', head: true }),
    ])

    // Get device breakdown by type
    const { data: devicesByType } = await supabase
      .from('devices')
      .select('device_type')

    const deviceTypeCount: Record<string, number> = {}
    devicesByType?.forEach((device: { device_type: string }) => {
      const type = device.device_type
      deviceTypeCount[type] = (deviceTypeCount[type] || 0) + 1
    })

    // Get active devices count
    const { count: activeDevicesCount } = await supabase
      .from('devices')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get customers with devices
    const { data: customersWithDevices } = await supabase
      .from('devices')
      .select('customer_id')
    
    const uniqueCustomersWithDevices = new Set(
      customersWithDevices?.map((d: { customer_id: string }) => d.customer_id) || []
    ).size

    // Get community members count
    const { count: communityMembersCount } = await supabase
      .from('community_members')
      .select('id', { count: 'exact', head: true })

    // Get trading stats
    const { count: activeOffersCount } = await supabase
      .from('trading_offers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get trades completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: tradesTodayCount } = await supabase
      .from('trades')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Get total trading volume (sum of all trade quantities)
    const { data: trades } = await supabase
      .from('trades')
      .select('quantity_kwh')
    
    const totalVolume = trades?.reduce((sum: number, trade: { quantity_kwh: number }) => sum + (trade.quantity_kwh || 0), 0) || 0

    // Get recent activity (placeholder - will be enhanced in task 13.1)
    const recentActivity = [
      {
        id: '1',
        type: 'user_registered',
        description: 'New user registered',
        timestamp: new Date().toISOString(),
        entity_id: '1'
      }
    ]

    const stats = {
      users: {
        total: usersResult.count || 0,
        active: usersResult.count || 0, // Placeholder
        new_this_month: 0, // Placeholder
      },
      customers: {
        total: customersResult.count || 0,
        with_devices: uniqueCustomersWithDevices,
      },
      devices: {
        total: devicesResult.count || 0,
        by_type: deviceTypeCount,
        active: activeDevicesCount || 0,
      },
      communities: {
        total: communitiesResult.count || 0,
        total_members: communityMembersCount || 0,
      },
      trading: {
        active_offers: activeOffersCount || 0,
        completed_trades_today: tradesTodayCount || 0,
        total_volume_kwh: totalVolume,
      },
      recent_activity: recentActivity,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: 'Failed to fetch dashboard statistics',
        },
      },
      { status: 500 }
    )
  }
}
