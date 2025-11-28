import { NextRequest, NextResponse } from 'next/server'
import { getCurrentCustomerId } from '@/lib/supabase-client'

export const revalidate = 0

// Assign house ID based on customer ID hash
function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

export async function GET(request: NextRequest) {
  try {
    const customerId = await getCurrentCustomerId()
    
    // Get house ID for this customer, or use default
    const houseId = customerId ? getHouseIdForCustomer(customerId) : 'H001'
    
    // Get date from query params, default to today
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    console.log('Fetching AI energy insights for house:', houseId, 'date:', date)
    
    // Fetch from external API
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/ai/energy-insights/${houseId}?date=${date}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch AI insights:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch AI energy insights' },
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
    console.error('AI insights API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

