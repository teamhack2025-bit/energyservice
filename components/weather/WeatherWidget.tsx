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

function getWeatherIcon(icon: string, size: 'sm' | 'md' | 'lg' = 'md') {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-12 w-12',
  }
  const sizeClass = sizeClasses[size]
  
  // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
  if (icon.includes('01')) return <Sun className={`${sizeClass} text-yellow-400 drop-shadow-lg`} />
  if (icon.includes('02')) return <Cloud className={`${sizeClass} text-blue-300`} />
  if (icon.includes('03') || icon.includes('04')) return <Cloud className={`${sizeClass} text-gray-400`} />
  if (icon.includes('09')) return <CloudDrizzle className={`${sizeClass} text-blue-400`} />
  if (icon.includes('10')) return <CloudRain className={`${sizeClass} text-blue-500`} />
  if (icon.includes('11')) return <CloudLightning className={`${sizeClass} text-purple-500`} />
  if (icon.includes('13')) return <CloudSnow className={`${sizeClass} text-blue-200`} />
  return <Cloud className={`${sizeClass} text-gray-400`} />
}

function getWeatherGradient(icon: string) {
  if (icon.includes('01')) return 'from-yellow-400 via-orange-300 to-yellow-200'
  if (icon.includes('02')) return 'from-blue-400 via-sky-300 to-blue-200'
  if (icon.includes('03') || icon.includes('04')) return 'from-gray-400 via-gray-300 to-gray-200'
  if (icon.includes('09') || icon.includes('10')) return 'from-blue-500 via-blue-400 to-blue-300'
  if (icon.includes('11')) return 'from-purple-600 via-purple-500 to-purple-400'
  if (icon.includes('13')) return 'from-blue-300 via-blue-200 to-blue-100'
  return 'from-gray-400 via-gray-300 to-gray-200'
}

function getWindDirection(deg: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(deg / 45) % 8]
}

export default function WeatherWidget() {
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
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
        <div className="relative p-6">
          <div className="h-6 bg-white/50 rounded w-32 mb-4"></div>
          <div className="h-20 bg-white/50 rounded"></div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const gradientClass = getWeatherGradient(weather.current.weather.icon)

  return (
    <div className="card overflow-hidden relative group">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Weather</h3>
            {weather.location && (
              <p className="text-sm text-gray-600 font-medium">
                {weather.location.name}, {weather.location.country}
              </p>
            )}
            {weather.mock && (
              <p className="text-xs text-warning font-medium mt-1 flex items-center">
                <span className="inline-block w-2 h-2 bg-warning rounded-full mr-2 animate-pulse"></span>
                Using mock data
              </p>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
            <div className="relative bg-white/50 backdrop-blur-sm rounded-full p-3 shadow-lg">
              {getWeatherIcon(weather.current.weather.icon, 'lg')}
            </div>
          </div>
        </div>

        {/* Current Weather - Large Display */}
        <div className="mb-6 relative">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="flex items-start">
                <span className="text-5xl font-bold text-gray-900 leading-none">{weather.current.temp}</span>
                <span className="text-2xl font-semibold text-gray-600 ml-1">°C</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 capitalize font-medium">
                {weather.current.weather.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Feels like {weather.current.feels_like}°C
              </p>
            </div>
          </div>

          {/* Weather Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-600 font-medium">Humidity</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{weather.current.humidity}%</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-600 font-medium">Wind</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {weather.current.wind.speed.toFixed(1)} m/s
              </p>
              <p className="text-xs text-gray-500">{getWindDirection(weather.current.wind.deg)}</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-gray-600 font-medium">Visibility</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{weather.current.visibility} km</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Gauge className="h-4 w-4 text-indigo-500" />
                <span className="text-xs text-gray-600 font-medium">Pressure</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{weather.current.pressure} hPa</p>
            </div>
          </div>

          {/* Sunrise/Sunset */}
          {weather.current.sunrise && weather.current.sunset && (
            <div className="mt-4 flex items-center justify-center space-x-6 bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-4 border border-orange-200/50">
              <div className="flex items-center space-x-2">
                <Sunrise className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600">Sunrise</p>
                  <p className="text-sm font-bold text-gray-900">
                    {format(new Date(weather.current.sunrise), 'HH:mm')}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-orange-300"></div>
              <div className="flex items-center space-x-2">
                <Sunset className="h-5 w-5 text-pink-500" />
                <div>
                  <p className="text-xs text-gray-600">Sunset</p>
                  <p className="text-sm font-bold text-gray-900">
                    {format(new Date(weather.current.sunset), 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forecast */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div className="border-t border-gray-200/50 pt-6">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
              5-Day Forecast
            </h4>
            <div className="space-y-2">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 hover:bg-white/60 hover:shadow-md transition-all group/item"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-semibold text-gray-900 w-16">
                      {index === 0 ? (
                        <span className="text-primary">Today</span>
                      ) : (
                        format(new Date(day.date), 'EEE')
                      )}
                    </span>
                    <div className="bg-white/60 rounded-lg p-1.5 group-hover/item:scale-110 transition-transform">
                      {getWeatherIcon(day.icon, 'sm')}
                    </div>
                    <span className="text-xs text-gray-600 capitalize flex-1 truncate">
                      {day.description || day.condition}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{day.temp}°</span>
                    </div>
                    {day.humidity !== undefined && (
                      <div className="hidden md:flex items-center space-x-1 text-xs text-gray-500">
                        <Droplets className="h-3 w-3" />
                        <span>{day.humidity}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
