import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat') || process.env.NEXT_PUBLIC_DEFAULT_LAT || '52.52'
  const lon = searchParams.get('lon') || process.env.NEXT_PUBLIC_DEFAULT_LON || '13.405'
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    // Return mock data if API key is not configured
    return NextResponse.json({
      current: {
        temp: 15,
        feels_like: 14,
        humidity: 65,
        pressure: 1013,
        visibility: 10000,
        uv_index: 3,
        weather: {
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03d',
        },
        wind: {
          speed: 3.5,
          deg: 200,
        },
      },
      forecast: [
        { date: new Date().toISOString(), temp: 15, condition: 'Clouds', icon: '03d' },
        { date: new Date(Date.now() + 86400000).toISOString(), temp: 18, condition: 'Clear', icon: '01d' },
        { date: new Date(Date.now() + 172800000).toISOString(), temp: 16, condition: 'Rain', icon: '10d' },
      ],
      mock: true,
    })
  }

  try {
    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )

    if (!currentWeatherResponse.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const currentWeather = await currentWeatherResponse.json()

    // Fetch forecast (5 days, 3-hour intervals)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )

    let forecast = []
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json()
      // Get daily forecasts (one per day)
      forecast = forecastData.list
        .filter((item: any, index: number) => index % 8 === 0) // Every 24 hours (8 * 3-hour intervals)
        .slice(0, 5)
        .map((item: any) => ({
          date: new Date(item.dt * 1000).toISOString(),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
        }))
    }

    // Calculate UV index (requires separate API call with paid plan, so we'll estimate)
    const uvIndex = Math.min(10, Math.max(0, Math.round((currentWeather.main.temp / 30) * 10)))

    return NextResponse.json({
      current: {
        temp: Math.round(currentWeather.main.temp),
        feels_like: Math.round(currentWeather.main.feels_like),
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        visibility: currentWeather.visibility / 1000, // Convert to km
        uv_index: uvIndex,
        weather: {
          main: currentWeather.weather[0].main,
          description: currentWeather.weather[0].description,
          icon: currentWeather.weather[0].icon,
        },
        wind: {
          speed: currentWeather.wind.speed,
          deg: currentWeather.wind.deg || 0,
        },
        sunrise: currentWeather.sys.sunrise ? new Date(currentWeather.sys.sunrise * 1000).toISOString() : null,
        sunset: currentWeather.sys.sunset ? new Date(currentWeather.sys.sunset * 1000).toISOString() : null,
      },
      forecast,
      location: {
        name: currentWeather.name,
        country: currentWeather.sys.country,
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
            icon: '03d',
          },
          wind: {
            speed: 3.5,
            deg: 200,
          },
        },
        forecast: [],
      },
      { status: 500 }
    )
  }
}

