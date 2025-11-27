'use client'

import { useEffect, useState } from 'react'
import { Cloud, Sun, Droplets, Wind, Eye, Gauge, Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from 'lucide-react'
import { format } from 'date-fns'

interface WeatherData {
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    visibility: number
    uv_index: number
    weather: {
      main: string
      description: string
      icon: string
    }
    wind: {
      speed: number
      deg: number
    }
    sunrise?: string
    sunset?: string
  }
  forecast: Array<{
    date: string
    temp: number
    condition: string
    description?: string
    icon: string
    humidity?: number
    wind_speed?: number
  }>
  location?: {
    name: string
    country: string
  }
  mock?: boolean
}

function getWeatherIcon(icon: string, size: 'sm' | 'md' = 'md') {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
  }
  const sizeClass = sizeClasses[size]
  
  if (icon.includes('01')) return <Sun className={`${sizeClass} text-yellow-400`} />
  if (icon.includes('02')) return <Cloud className={`${sizeClass} text-blue-300`} />
  if (icon.includes('03') || icon.includes('04')) return <Cloud className={`${sizeClass} text-gray-400`} />
  if (icon.includes('09')) return <CloudDrizzle className={`${sizeClass} text-blue-400`} />
  if (icon.includes('10')) return <CloudRain className={`${sizeClass} text-blue-500`} />
  if (icon.includes('11')) return <CloudLightning className={`${sizeClass} text-purple-500`} />
  if (icon.includes('13')) return <CloudSnow className={`${sizeClass} text-blue-200`} />
  return <Cloud className={`${sizeClass} text-gray-400`} />
}

function getWeatherGradient(icon: string) {
  if (icon.includes('01')) return 'from-yellow-400/20 via-orange-300/10 to-yellow-200/5'
  if (icon.includes('02')) return 'from-blue-400/20 via-sky-300/10 to-blue-200/5'
  if (icon.includes('03') || icon.includes('04')) return 'from-gray-400/20 via-gray-300/10 to-gray-200/5'
  if (icon.includes('09') || icon.includes('10')) return 'from-blue-500/20 via-blue-400/10 to-blue-300/5'
  if (icon.includes('11')) return 'from-purple-600/20 via-purple-500/10 to-purple-400/5'
  if (icon.includes('13')) return 'from-blue-300/20 via-blue-200/10 to-blue-100/5'
  return 'from-gray-400/20 via-gray-300/10 to-gray-200/5'
}

function getWindDirection(deg: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(deg / 45) % 8]
}

export default function WeatherWidgetCompact() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch('/api/weather')
        const data = await response.json()
        setWeather(data)
      } catch (error) {
        console.error('Failed to fetch weather:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="card bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 p-4">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const gradientClass = getWeatherGradient(weather.current.weather.icon)

  return (
    <div className={`card bg-gradient-to-r ${gradientClass} border-gray-200 shadow-md overflow-hidden relative`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
      
      <div className="relative flex items-center justify-between">
        {/* Left: Current Weather */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Weather Icon */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm">
            {getWeatherIcon(weather.current.weather.icon, 'md')}
          </div>
          
          {/* Temperature & Location */}
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-gray-900">{weather.current.temp}</span>
              <span className="text-lg text-gray-600 font-medium">°C</span>
            </div>
            <p className="text-xs text-gray-600 capitalize mt-0.5">
              {weather.current.weather.description}
            </p>
            {weather.location && (
              <p className="text-xs text-gray-500 mt-0.5">
                {weather.location.name}, {weather.location.country}
              </p>
            )}
          </div>
        </div>

        {/* Middle: Weather Stats */}
        <div className="hidden md:flex items-center space-x-6 px-6 border-l border-r border-gray-200/50">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600">Humidity</p>
              <p className="text-sm font-bold text-gray-900">{weather.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Wind</p>
              <p className="text-sm font-bold text-gray-900">
                {weather.current.wind.speed.toFixed(1)} m/s
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-600">Visibility</p>
              <p className="text-sm font-bold text-gray-900">{weather.current.visibility} km</p>
            </div>
          </div>
        </div>

        {/* Right: Forecast & Sunrise/Sunset */}
        <div className="flex items-center space-x-4">
          {/* Sunrise/Sunset */}
          {weather.current.sunrise && weather.current.sunset && (
            <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="flex items-center space-x-1.5">
                <Sunrise className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600">Sunrise</p>
                  <p className="text-xs font-bold text-gray-900">
                    {format(new Date(weather.current.sunrise), 'HH:mm')}
                  </p>
                </div>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-1.5">
                <Sunset className="h-4 w-4 text-pink-500" />
                <div>
                  <p className="text-xs text-gray-600">Sunset</p>
                  <p className="text-xs font-bold text-gray-900">
                    {format(new Date(weather.current.sunset), 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Preview */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="hidden xl:flex items-center space-x-3">
              {weather.forecast.slice(0, 3).map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center px-2 py-1 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50"
                >
                  <span className="text-xs text-gray-600 mb-1">
                    {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                  </span>
                  <div className="mb-1">{getWeatherIcon(day.icon, 'sm')}</div>
                  <span className="text-xs font-bold text-gray-900">{day.temp}°</span>
                </div>
              ))}
            </div>
          )}

          {/* Mock indicator */}
          {weather.mock && (
            <span className="text-xs text-warning font-medium px-2 py-1 bg-warning/10 rounded-full">
              Mock
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

