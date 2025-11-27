'use client'

import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react'
import { format } from 'date-fns'

interface WeatherAlert {
  headline: string
  msgtype: string
  severity: string
  urgency: string
  areas: string
  category: string
  certainty: string
  event: string
  note: string
  effective: string
  expires: string
  desc: string
  instruction: string
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'extreme':
    case 'severe':
      return 'bg-red-50 border-red-300 text-red-900'
    case 'moderate':
      return 'bg-orange-50 border-orange-300 text-orange-900'
    case 'minor':
      return 'bg-yellow-50 border-yellow-300 text-yellow-900'
    default:
      return 'bg-blue-50 border-blue-300 text-blue-900'
  }
}

function getSeverityIcon(severity: string) {
  switch (severity.toLowerCase()) {
    case 'extreme':
    case 'severe':
      return <XCircle className="h-5 w-5 text-red-600" />
    case 'moderate':
      return <AlertTriangle className="h-5 w-5 text-orange-600" />
    case 'minor':
      return <AlertCircle className="h-5 w-5 text-yellow-600" />
    default:
      return <Info className="h-5 w-5 text-blue-600" />
  }
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (!alerts || alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-lg border-2 p-4 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold">{alert.event}</h4>
                  <p className="text-xs opacity-75 mt-0.5">{alert.areas}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-white/50">
                  {alert.severity}
                </span>
              </div>
              
              <p className="text-xs font-medium mb-2">{alert.headline}</p>
              
              <div className="text-xs space-y-1 mb-2">
                <p>
                  <span className="font-semibold">Effective:</span>{' '}
                  {format(new Date(alert.effective), 'MMM dd, HH:mm')}
                </p>
                <p>
                  <span className="font-semibold">Expires:</span>{' '}
                  {format(new Date(alert.expires), 'MMM dd, HH:mm')}
                </p>
              </div>

              {alert.instruction && (
                <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                  <p className="font-semibold mb-1">Instructions:</p>
                  <p>{alert.instruction}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
