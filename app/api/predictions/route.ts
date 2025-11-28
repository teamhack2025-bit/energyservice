import { NextResponse } from 'next/server'

export const revalidate = 0

export async function GET() {
  try {
    const response = await fetch('https://energyserviceapi.vercel.app/api/predictions', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error('Failed to fetch predictions:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch predictions data' },
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
    console.error('Predictions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

