'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'

interface LineChartProps {
  data: Array<Record<string, any>>
  dataKey: string
  xAxisKey?: string
  yAxisLabel?: string
  height?: number
  showLegend?: boolean
  colors?: string[]
  multipleSeries?: Array<{ key: string; name: string; color?: string }>
}

export default function LineChart({
  data,
  dataKey,
  xAxisKey = 'timestamp',
  yAxisLabel,
  height = 300,
  showLegend = false,
  colors = ['#0066CC'],
  multipleSeries = [],
}: LineChartProps) {
  const formatDate = (value: string | Date) => {
    if (typeof value === 'string') {
      return format(new Date(value), 'MMM dd')
    }
    return format(value, 'MMM dd')
  }

  const chartData = data.map((item) => {
    const xValue = item[xAxisKey] || item.timestamp
    return {
      ...item,
      timestamp: typeof xValue === 'string' 
        ? formatDate(xValue)
        : xValue instanceof Date 
        ? formatDate(xValue)
        : formatDate(new Date(xValue)),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="timestamp" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        {showLegend && <Legend />}
        {multipleSeries.length > 0 ? (
          multipleSeries.map((series, index) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.name}
              stroke={series.color || colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={colors[0]}
            strokeWidth={2}
            dot={false}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

