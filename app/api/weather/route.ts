import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('q') || process.env.NEXT_PUBLIC_DEFAULT_LOCATION || '49.5022,5.9492'
  const apiKey = process.env.WEATHERAPI_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    // Return mock data if API key is not configured
    return NextResponse.json({
      current: {
        temp: 15,
        feels_like: 14,
        humidity: 65,
        pressure: 1013,
        visibility: 10,
        uv_index: 3,
        weather: {
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        },
        wind: {
          speed: 3.5,
          deg: 200,
          dir: 'SW',
        },
        air_quality: {
          co: 230.3,
          no2: 13.5,
          o3: 84.3,
          so2: 1.2,
          pm2_5: 8.6,
          pm10: 12.3,
          'us-epa-index': 1,
          'gb-defra-index': 1,
        },
      },
      forecast: [
        { date: new Date().toISOString(), temp: 15, condition: 'Clouds', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png', maxtemp: 18, mintemp: 12 },
        { date: new Date(Date.now() + 86400000).toISOString(), temp: 18, condition: 'Clear', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png', maxtemp: 20, mintemp: 14 },
        { date: new Date(Date.now() + 172800000).toISOString(), temp: 16, condition: 'Rain', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png', maxtemp: 17, mintemp: 13 },
      ],
      alerts: [],
      mock: true,
    })
  }

  try {
    // Fetch forecast with alerts, air quality, and all features
    const forecastResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=yes&alerts=yes`,
      { next: { revalidate: 600 } } // Cache for 10 minutes
    )

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await forecastResponse.json()

    // Transform to our format
    return NextResponse.json({
      current: {
        temp: Math.round(data.current.temp_c),
        feels_like: Math.round(data.current.feelslike_c),
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        uv_index: data.current.uv,
        weather: {
          main: data.current.condition.text,
          description: data.current.condition.text.toLowerCase(),
          icon: data.current.condition.icon,
        },
        wind: {
          speed: data.current.wind_kph / 3.6, // Convert to m/s
          deg: data.current.wind_degree,
          dir: data.current.wind_dir,
          gust: data.current.gust_kph / 3.6,
        },
        air_quality: data.current.air_quality || null,
        sunrise: data.forecast.forecastday[0].astro.sunrise,
        sunset: data.forecast.forecastday[0].astro.sunset,
        moonrise: data.forecast.forecastday[0].astro.moonrise,
        moonset: data.forecast.forecastday[0].astro.moonset,
        moon_phase: data.forecast.forecastday[0].astro.moon_phase,
      },
      forecast: data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        temp: Math.round(day.day.avgtemp_c),
        maxtemp: Math.round(day.day.maxtemp_c),
        mintemp: Math.round(day.day.mintemp_c),
        condition: day.day.condition.text,
        description: day.day.condition.text.toLowerCase(),
        icon: day.day.condition.icon,
        humidity: day.day.avghumidity,
        wind_speed: day.day.maxwind_kph / 3.6,
        uv: day.day.uv,
        rain_chance: day.day.daily_chance_of_rain,
        snow_chance: day.day.daily_chance_of_snow,
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset,
      })),
      alerts: data.alerts?.alert || [],
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        tz_id: data.location.tz_id,
        localtime: data.location.localtime,
      },
      mock: false,
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch weather data',
        mock: true,
        current: {
          temp: 15,
          feels_like: 14,
          humidity: 65,
          pressure: 1013,
          visibility: 10,
          uv_index: 3,
          weather: {
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          },
          wind: {
            speed: 3.5,
            deg: 200,
            dir: 'SW',
          },
          air_quality: null,
        },
        forecast: [],
        alerts: [],
      },
      { status: 500 }
    )
  }
}

