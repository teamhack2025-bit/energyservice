import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // For now, use H006 as default house ID
    // In production, get this from authenticated user
    const houseId = 'H006'
    const apiUrl = `https://energyserviceapi.vercel.app/api/dashboard/realtime/${houseId}`
    
    console.log(`Fetching realtime data from: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Realtime data received successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Realtime API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch realtime data' },
      { status: 500 }
    )
  }
}
