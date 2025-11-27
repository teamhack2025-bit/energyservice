'use client'

import { Droplets, Wind, Sun, Sunrise, Sunset, CloudRain } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

interface ForecastDay {
  date: string
  temp: number
  maxtemp: number
  mintemp: number
  condition: string
  description: string
  icon: string
  humidity: number
  wind_speed: number
  uv: number
  rain_chance: number
  snow_chance: number
  sunrise: string
  sunset: string
}

interface WeatherForecastDetailedProps {
  forecast: ForecastDay[]
}

export default function WeatherForecastDetailed({ forecast }: WeatherForecastDetailedProps) {
  if (!forecast || forecast.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {forecast.map((day, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src={day.icon.startsWith('//') ? `https:${day.icon}` : day.icon}
                  alt={day.condition}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {index === 0 ? 'Today' : format(new Date(day.date), 'EEEE, MMM dd')}
                </p>
                <p className="text-xs text-gray-600 capitalize">{day.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">{day.maxtemp}°</span>
                <span className="text-lg text-gray-500">/ {day.mintemp}°</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-600">Humidity</p>
                <p className="text-sm font-bold text-gray-900">{day.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600">Wind</p>
                <p className="text-sm font-bold text-gray-900">{day.wind_speed.toFixed(1)} m/s</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-600">UV Index</p>
                <p className="text-sm font-bold text-gray-900">{day.uv}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2">
              <CloudRain className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Rain</p>
                <p className="text-sm font-bold text-gray-900">{day.rain_chance}%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Sunrise className="h-4 w-4 text-orange-500" />
              <span>{day.sunrise}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Sunset className="h-4 w-4 text-pink-500" />
              <span>{day.sunset}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
