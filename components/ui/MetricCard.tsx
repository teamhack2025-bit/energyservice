import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'
import type { MetricCard as MetricCardType } from '@/types'

interface MetricCardProps {
  metric: MetricCardType
  onClick?: () => void
}

export default function MetricCard({ metric, onClick }: MetricCardProps) {
  const colorClasses = {
    blue: 'border-primary text-primary',
    green: 'border-success text-success',
    orange: 'border-warning text-warning',
    red: 'border-danger text-danger',
    purple: 'border-purple-500 text-purple-500',
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'card cursor-pointer hover:shadow-md transition-shadow',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
            </p>
            {metric.unit && (
              <span className="ml-2 text-sm text-gray-500">{metric.unit}</span>
            )}
          </div>
          {metric.trend && (
            <div className="mt-2 flex items-center text-sm">
              {metric.trend.direction === 'up' && (
                <TrendingUp className="h-4 w-4 text-danger mr-1" />
              )}
              {metric.trend.direction === 'down' && (
                <TrendingDown className="h-4 w-4 text-success mr-1" />
              )}
              {metric.trend.direction === 'neutral' && (
                <Minus className="h-4 w-4 text-gray-400 mr-1" />
              )}
              <span
                className={clsx(
                  'font-medium',
                  metric.trend.direction === 'up' && 'text-danger',
                  metric.trend.direction === 'down' && 'text-success',
                  metric.trend.direction === 'neutral' && 'text-gray-500'
                )}
              >
                {Math.abs(metric.trend.value)}%
              </span>
              <span className="ml-1 text-gray-500">{metric.trend.period}</span>
            </div>
          )}
        </div>
        {metric.color && (
          <div className={clsx('h-12 w-12 rounded-lg flex items-center justify-center', {
            'bg-primary/10': metric.color === 'blue',
            'bg-success/10': metric.color === 'green',
            'bg-warning/10': metric.color === 'orange',
            'bg-danger/10': metric.color === 'red',
            'bg-purple-500/10': metric.color === 'purple',
          })}>
            {metric.icon && <span className="text-2xl">{metric.icon}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

