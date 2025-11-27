'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  colors?: string[]
  size?: number
  showPercentage?: boolean
}

const DEFAULT_COLORS = ['#0066CC', '#9333EA', '#00AA44', '#FF8800', '#CC0000']

export default function DonutChart({
  data,
  colors = DEFAULT_COLORS,
  size = 200,
  showPercentage = true,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    percentage: ((item.value / total) * 100).toFixed(1),
    color: item.color || colors[index % colors.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value.toFixed(2)} kWh ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showPercentage ? ({ percent }) => `${(percent * 100).toFixed(0)}%` : false}
          outerRadius={size / 2 - 20}
          innerRadius={size / 3}
          fill="#8884d8"
          dataKey="value"
          stroke="white"
          strokeWidth={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
