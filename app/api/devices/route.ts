import { NextResponse } from 'next/server'
import { HouseIdManager } from '@/lib/services/HouseIdManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    // Get house ID for the user
    const userId = 'default-user'
    const houseId = await HouseIdManager.getHouseIdForUser(userId)
    
    console.log(`Fetching devices for house ${houseId}`)
    
    // Fetch devices from external API
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/devices?house_id=${houseId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
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
    console.error('Devices API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}
