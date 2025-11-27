import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  href?: string
  subtitle?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
}

export default function StatsCard({ title, value, icon: Icon, href, subtitle, trend }: StatsCardProps) {
  const CardContent = (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        {CardContent}
      </Link>
    )
  }

  return CardContent
}
