import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  filters?: ReactNode
  actions?: ReactNode[]
  className?: string
}

export default function ChartCard({ title, subtitle, children, filters, actions, className = '' }: ChartCardProps) {
  return (
    <div className={`card bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {filters}
          {actions?.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
