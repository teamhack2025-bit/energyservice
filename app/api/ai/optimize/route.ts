import { NextRequest, NextResponse } from 'next/server'
import { getCurrentCustomerId } from '@/lib/supabase-client'

export const revalidate = 0

// Assign house ID based on customer ID hash
function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

export async function POST(request: NextRequest) {
  try {
    const customerId = await getCurrentCustomerId()
    
    // Get house ID for this customer, or use default
    const houseId = customerId ? getHouseIdForCustomer(customerId) : 'H001'
    
    // Get scenario from query params
    const searchParams = request.nextUrl.searchParams
    const scenario = searchParams.get('scenario')
    
    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario parameter is required' },
        { status: 400 }
      )
    }

    // Validate scenario
    const validScenarios = ['add_solar', 'add_battery', 'upgrade_hvac', 'change_tariff', 'add_ev_charger']
    if (!validScenarios.includes(scenario)) {
      return NextResponse.json(
        { error: `Invalid scenario. Must be one of: ${validScenarios.join(', ')}` },
        { status: 400 }
      )
    }
    
    console.log('Fetching cost optimization for house:', houseId, 'scenario:', scenario)
    
    // Fetch from external API
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/ai/optimize/${houseId}?scenario=${scenario}`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch optimization:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch cost optimization analysis' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Cost optimization API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

