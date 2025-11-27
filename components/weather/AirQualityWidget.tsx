'use client'

import { Wind, AlertTriangle } from 'lucide-react'

interface AirQualityData {
  co: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  'us-epa-index': number
  'gb-defra-index': number
}

interface AirQualityWidgetProps {
  airQuality: AirQualityData | null
}

function getAQILevel(index: number) {
  if (index === 1) return { label: 'Good', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' }
  if (index === 2) return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' }
  if (index === 3) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' }
  if (index === 4) return { label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
  if (index === 5) return { label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' }
  return { label: 'Hazardous', color: 'bg-red-900', textColor: 'text-red-900', bgColor: 'bg-red-100' }
}

export default function AirQualityWidget({ airQuality }: AirQualityWidgetProps) {
  if (!airQuality) {
    return null
  }

  const aqiLevel = getAQILevel(airQuality['us-epa-index'])

  return (
    <div className={`rounded-xl border-2 p-4 ${aqiLevel.bgColor} border-${aqiLevel.color.replace('bg-', '')}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wind className={`h-5 w-5 ${aqiLevel.textColor}`} />
          <h3 className="text-sm font-bold text-gray-900">Air Quality</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${aqiLevel.color}`}></div>
          <span className={`text-xs font-bold ${aqiLevel.textColor}`}>
            {aqiLevel.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/60 rounded-lg p-2">
          <p className="text-xs text-gray-600">PM2.5</p>
          <p className="text-sm font-bold text-gray-900">{airQuality.pm2_5.toFixed(1)}</p>
          <p className="text-xs text-gray-500">μg/m³</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <p className="text-xs text-gray-600">PM10</p>
          <p className="text-sm font-bold text-gray-900">{airQuality.pm10.toFixed(1)}</p>
          <p className="text-xs text-gray-500">μg/m³</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <p className="text-xs text-gray-600">O₃</p>
          <p className="text-sm font-bold text-gray-900">{airQuality.o3.toFixed(1)}</p>
          <p className="text-xs text-gray-500">μg/m³</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/60 rounded-lg p-2">
          <p className="text-xs text-gray-600">NO₂</p>
          <p className="text-sm font-bold text-gray-900">{airQuality.no2.toFixed(1)}</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <p className="text-xs text-gray-600">SO₂</p>
          <p className="text-sm font-bold text-gray-900">{airQuality.so2.toFixed(1)}</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <p className="text-xs text-gray-600">CO</p>
          <p className="text-sm font-bold text-gray-900">{airQuality.co.toFixed(0)}</p>
        </div>
      </div>

      {airQuality['us-epa-index'] >= 3 && (
        <div className="mt-3 flex items-start space-x-2 p-2 bg-white/60 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">
            Sensitive groups should reduce prolonged outdoor activities.
          </p>
        </div>
      )}
    </div>
  )
}
