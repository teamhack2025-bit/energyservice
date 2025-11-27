import { supabase, getCurrentCustomerId, getCurrentCustomerData } from '../supabase-client'

export interface DashboardData {
  customer: any
  devices: any[]
  todayStats: {
    production: number
    consumption: number
    netBalance: number
    efficiency: number
  }
  monthlyStats: {
    cost: number
    revenue: number
    totalBill: number
  }
  last30Days: Array<{
    date: string
    import: number
    export: number
  }>
  last7Days: {
    consumption: Array<{ date: string; value: number }>
    production: Array<{ date: string; value: number }>
  }
}

// Assign random house ID based on customer email hash
function getHouseIdForCustomer(customerId: string): string {
  // Use customer ID to deterministically pick a house (H001-H006)
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData | null> {
    const customerId = await getCurrentCustomerId()
    
    if (!customerId) {
      console.error('No customer ID found for authenticated user')
      return null
    }
    
    // Get house ID for this customer
    const houseId = getHouseIdForCustomer(customerId)
    console.log('Fetching data for customer:', customerId, 'house:', houseId)

    try {
      // Fetch data from external API
      const response = await fetch(`https://energyserviceapi.vercel.app/api/dashboard/realtime/${houseId}`)
      
      if (!response.ok) {
        console.error('Failed to fetch from external API')
        return null
      }
      
      const apiData = await response.json()
      console.log('API Data received:', apiData.house_name)
      
      // Get customer info from Supabase
      const customer = await getCurrentCustomerData()
      
      if (!customer) {
        console.error('Customer not found')
        return null
      }
      
      // Extract summary data
      const summary = apiData.summary || {}
      const systemStatus = apiData.system_status || {}
      
      // Transform timeline data for last 30 days (use last 24 hours repeated)
      const timeline = apiData.timeline_24h || []
      const last30Days = []
      const today = new Date()
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Use timeline data cyclically
        const dayData = timeline[i % timeline.length] || { solar: 0, consumption: 0, grid: 0 }
        
        last30Days.push({
          date: dateStr,
          import: Math.max(0, dayData.grid || 0),
          export: Math.max(0, -(dayData.grid || 0))
        })
      }
      
      // Last 7 days
      const last7Days = {
        consumption: timeline.slice(-7).map((d: any, i: number) => ({
          date: new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: d.consumption || 0
        })),
        production: timeline.slice(-7).map((d: any, i: number) => ({
          date: new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: d.solar || 0
        }))
      }
      
      return {
        customer,
        devices: [], // Can be populated from live_metrics if needed
        todayStats: {
          production: summary.solar_production_today || systemStatus.solar_generation || 0,
          consumption: summary.consumption_today || systemStatus.total_consumption || 0,
          netBalance: (summary.solar_production_today || 0) - (summary.consumption_today || 0),
          efficiency: summary.self_sufficiency || 0
        },
        monthlyStats: {
          cost: summary.cost_today * 30 || 0, // Estimate monthly from daily
          revenue: summary.savings_today * 30 || 0,
          totalBill: (summary.cost_today * 30) - (summary.savings_today * 30) || 0
        },
        last30Days,
        last7Days
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return null
    }
  }
}
