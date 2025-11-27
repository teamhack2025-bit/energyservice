import { NextResponse } from 'next/server'
import { getCurrentCustomerId } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

// Assign random house ID based on customer email hash
function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

export async function GET() {
  try {
    const customerId = await getCurrentCustomerId()
    
    // If not authenticated, use a random house for demo
    let houseId = 'H001'
    if (customerId) {
      houseId = getHouseIdForCustomer(customerId)
    } else {
      // Random house for non-authenticated users
      const randomNum = Math.floor(Math.random() * 6) + 1
      houseId = `H00${randomNum}`
    }
    
    console.log('Fetching smart home data for house:', houseId)
    
    // Fetch from external API
    const response = await fetch(`https://energyserviceapi.vercel.app/api/dashboard/realtime/${houseId}`)
    
    if (!response.ok) {
      console.error('External API returned error:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch from external API' },
        { status: 500 }
      )
    }
    
    const apiData = await response.json()
    console.log('Successfully fetched data for house:', apiData.house_name)
    
    // Transform API data to match expected format
    const transformedData = {
      solar: {
        production: apiData.energy_flow.solar.production || 0,
        toHouse: apiData.energy_flow.solar.to_house || 0,
        toGrid: apiData.energy_flow.solar.to_grid || 0,
        toBattery: apiData.energy_flow.solar.to_battery || 0,
        status: apiData.energy_flow.solar.status || 'idle'
      },
      battery: {
        soc: apiData.energy_flow.battery.charge_level || 0,
        power: apiData.energy_flow.battery.charge_rate || 0,
        capacity: apiData.energy_flow.battery.capacity || 13.5,
        estimatedRuntime: Math.abs(apiData.energy_flow.battery.charge_rate) > 0 
          ? Math.round((apiData.energy_flow.battery.capacity * (100 - apiData.energy_flow.battery.charge_level) / 100) / Math.abs(apiData.energy_flow.battery.charge_rate) * 60)
          : 0,
        status: apiData.energy_flow.battery.status || 'idle'
      },
      grid: {
        import: apiData.energy_flow.grid.import || 0,
        export: apiData.energy_flow.grid.export || 0,
        net: apiData.energy_flow.grid.net || 0,
        tariff: 'peak',
        price: 0.28,
        status: apiData.energy_flow.grid.status || 'idle'
      },
      consumption: {
        total: apiData.energy_flow.house.total_load || 0,
        byRoom: {
          'Living Room': apiData.live_metrics?.find((m: any) => m.id === 'consumption')?.details?.living_room || 0,
          'Kitchen': apiData.live_metrics?.find((m: any) => m.id === 'consumption')?.details?.kitchen || 0,
          'Bedroom': apiData.live_metrics?.find((m: any) => m.id === 'consumption')?.details?.bedroom || 0
        }
      },
      ev: {
        charging: apiData.energy_flow.ev_charger.status === 'charging',
        power: apiData.energy_flow.ev_charger.power || 0,
        soc: apiData.energy_flow.ev_charger.charge_level || 0,
        estimatedTime: apiData.live_metrics?.find((m: any) => m.id === 'ev_charging')?.details?.time_to_full || 0,
        cost: apiData.live_metrics?.find((m: any) => m.id === 'ev_charging')?.daily?.cost || 0
      },
      gas: {
        flowRate: apiData.live_metrics?.find((m: any) => m.id === 'gas_usage')?.current_value || 0,
        todayUsage: apiData.live_metrics?.find((m: any) => m.id === 'gas_usage')?.daily?.usage || 0,
        heatingActive: apiData.live_metrics?.find((m: any) => m.id === 'gas_usage')?.status === 'active',
        status: apiData.live_metrics?.find((m: any) => m.id === 'gas_usage')?.status || 'idle'
      },
      heatPump: {
        power: apiData.energy_flow.heat_pump.power || 0,
        currentTemp: apiData.energy_flow.heat_pump.temperature || 20,
        mode: apiData.live_metrics?.find((m: any) => m.id === 'heat_pump')?.details?.mode || 'auto',
        targetTemp: apiData.live_metrics?.find((m: any) => m.id === 'heat_pump')?.details?.target || 21,
        status: apiData.energy_flow.heat_pump.status || 'idle'
      }
    }
    
    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error('Smart home API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
