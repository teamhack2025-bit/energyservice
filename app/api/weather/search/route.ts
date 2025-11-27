import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const apiKey = process.env.WEATHERAPI_KEY

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  if (!apiKey || apiKey === 'your_api_key_here') {
    // Return mock data if API key is not configured
    return NextResponse.json([
      {
        id: 1,
        name: 'Belval',
        region: 'Esch-sur-Alzette',
        country: 'Luxembourg',
        lat: 49.5022,
        lon: 5.9492,
      },
      {
        id: 2,
        name: 'Luxembourg',
        region: 'Luxembourg',
        country: 'Luxembourg',
        lat: 49.61,
        lon: 6.13,
      },
    ])
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error('Failed to search locations')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Location search error:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
}
