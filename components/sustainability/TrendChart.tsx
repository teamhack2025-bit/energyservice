'use client'

import LineChart from '@/components/charts/LineChart'

interface TrendChartProps {
  title: string
  data: Array<{ date: string; value: number }>
  color?: string
  unit?: string
}

export default function TrendChart({ title, data, color = '#0066CC', unit = '' }: TrendChartProps) {
  const chartData = data.map(item => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
  }))

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <LineChart 
          data={chartData} 
          dataKey="value"
          xAxisKey="label"
          colors={[color]}
          height={256}
        />
      </div>
      {unit && (
        <p className="text-xs text-gray-500 mt-2 text-center">Values in {unit}</p>
      )}
    </div>
  )
}

