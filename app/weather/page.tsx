'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import WeatherAlerts from '@/components/weather/WeatherAlerts'
import AirQualityWidget from '@/components/weather/AirQualityWidget'
import WeatherForecastDetailed from '@/components/weather/WeatherForecastDetailed'
import LocationSearch from '@/components/weather/LocationSearch'
import { Cloud, MapPin, RefreshCw, AlertTriangle } from 'lucide-react'

interface WeatherData {
  current: any
  forecast: any[]
  alerts: any[]
  location: any
  mock?: boolean
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [location, setLocation] = useState<string>('')

  async function fetchWeather(locationQuery?: string) {
    try {
      setRefreshing(true)
      const url = locationQuery 
        ? `/api/weather?q=${encodeURIComponent(locationQuery)}`
        : '/api/weather'
      const response = await fetch(url)
      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error('Failed to fetch weather:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(() => fetchWeather(location), 600000) // Refresh every 10 minutes
    return () => clearInterval(interval)
  }, [location])

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation)
    setLoading(true)
    fetchWeather(newLocation)
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Cloud className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!weather) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load weather data</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Weather Dashboard</h1>
          <div className="flex items-center space-x-3">
            <LocationSearch 
              onLocationSelect={handleLocationChange}
              currentLocation={weather.location ? `${weather.location.name}, ${weather.location.country}` : undefined}
            />
            <button
              onClick={() => fetchWeather(location)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        {weather.location && (
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">
              {weather.location.name}
              {weather.location.region && `, ${weather.location.region}`}
              {`, ${weather.location.country}`}
            </p>
            <span className="text-xs text-gray-400">
              ({weather.location.lat.toFixed(2)}, {weather.location.lon.toFixed(2)})
            </span>
          </div>
        )}
      </div>

      {weather.mock && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Mock Data:</strong> Configure WEATHERAPI_KEY in your .env.local file to get real weather data.
            </p>
          </div>
        </div>
      )}

      {/* Weather Alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Active Weather Alerts ({weather.alerts.length})</span>
          </h2>
          <WeatherAlerts alerts={weather.alerts} />
        </div>
      )}

      {/* Current Weather & Air Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Current Weather - 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm opacity-90">Current Weather</p>
                <p className="text-5xl font-bold mt-2">{weather.current.temp}°C</p>
                <p className="text-lg opacity-90 mt-1 capitalize">
                  {weather.current.weather.description}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  Feels like {weather.current.feels_like}°C
                </p>
              </div>
              <div className="text-right">
                <img
                  src={weather.current.weather.icon.startsWith('//') ? `https:${weather.current.weather.icon}` : weather.current.weather.icon}
                  alt={weather.current.weather.main}
                  className="w-24 h-24"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs opacity-75">Humidity</p>
                <p className="text-xl font-bold">{weather.current.humidity}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs opacity-75">Wind</p>
                <p className="text-xl font-bold">{weather.current.wind.speed.toFixed(1)} m/s</p>
                <p className="text-xs opacity-75">{weather.current.wind.dir}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs opacity-75">Visibility</p>
                <p className="text-xl font-bold">{weather.current.visibility} km</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs opacity-75">UV Index</p>
                <p className="text-xl font-bold">{weather.current.uv_index}</p>
              </div>
            </div>

            {weather.current.sunrise && weather.current.sunset && (
              <div className="flex items-center justify-around mt-4 pt-4 border-t border-white/20">
                <div className="text-center">
                  <p className="text-xs opacity-75">Sunrise</p>
                  <p className="text-sm font-semibold">{weather.current.sunrise}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-75">Sunset</p>
                  <p className="text-sm font-semibold">{weather.current.sunset}</p>
                </div>
                {weather.current.moon_phase && (
                  <div className="text-center">
                    <p className="text-xs opacity-75">Moon Phase</p>
                    <p className="text-sm font-semibold">{weather.current.moon_phase}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Air Quality - 1 column */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Air Quality</h2>
          <AirQualityWidget airQuality={weather.current.air_quality} />
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">5-Day Forecast</h2>
        <WeatherForecastDetailed forecast={weather.forecast} />
      </div>
    </AppShell>
  )
}
