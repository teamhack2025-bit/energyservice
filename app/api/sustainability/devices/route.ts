import { NextResponse } from 'next/server'
import { getCurrentCustomerId } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

// Assign house ID based on customer ID hash
function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

export async function GET() {
  try {
    const customerId = await getCurrentCustomerId()
    
    // If not authenticated, use a default house for demo
    const houseId = customerId ? getHouseIdForCustomer(customerId) : 'H001'
    console.log('Fetching sustainability device data for house:', houseId)
    
    // Fetch device data from external API
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/devices?house_id=${houseId}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
    
    if (!response.ok) {
      console.error('Failed to fetch from external API:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch device data from external API' },
        { status: response.status }
      )
    }
    
    const deviceData = await response.json()
    
    return NextResponse.json({
      houseId,
      devices: deviceData.devices || deviceData || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error fetching sustainability device data:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

