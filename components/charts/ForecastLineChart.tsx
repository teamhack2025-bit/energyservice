'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, parseISO } from 'date-fns'

interface ForecastLineChartProps {
  data: Array<Record<string, any>>
  dataKey: string
  xAxisKey?: string
  yAxisLabel?: string
  height?: number
  showLegend?: boolean
  colors?: string[]
  multipleSeries?: Array<{ key: string; name: string; color?: string; isPrediction?: boolean }>
  currentDate?: Date // Date to split historical vs predicted data
}

export default function ForecastLineChart({
  data,
  dataKey,
  xAxisKey = 'timestamp',
  yAxisLabel,
  height = 300,
  showLegend = true,
  colors = ['#0066CC'],
  multipleSeries = [],
  currentDate = new Date(),
}: ForecastLineChartProps) {
  const formatDate = (value: string | Date) => {
    if (typeof value === 'string') {
      try {
        const date = parseISO(value)
        return format(date, 'MMM dd HH:mm')
      } catch {
        return value
      }
    }
    return format(value, 'MMM dd HH:mm')
  }

  const chartData = data.map((item) => {
    const xValue = item[xAxisKey] || item.timestamp
    const timestamp = typeof xValue === 'string' 
      ? parseISO(xValue)
      : xValue instanceof Date 
      ? xValue
      : new Date(xValue)
    
    return {
      ...item,
      timestamp: formatDate(timestamp),
      _rawTimestamp: timestamp,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="timestamp" 
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
          interval="preserveStartEnd"
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '8px 12px',
          }}
          labelFormatter={(value) => {
            const item = chartData.find(d => d.timestamp === value)
            return item?._rawTimestamp ? formatDate(item._rawTimestamp) : value
          }}
        />
        {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
        {multipleSeries.length > 0 ? (
          multipleSeries.map((series, index) => {
            const isPredicted = series.isPrediction || false
            return (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color || colors[index % colors.length]}
                strokeWidth={3}
                strokeDasharray={isPredicted ? '8 4' : '0'}
                dot={false}
                activeDot={{ r: 7, fill: series.color || colors[index % colors.length] }}
                connectNulls={false}
                animationDuration={750}
              />
            )
          })
        ) : (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={colors[0]}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 7 }}
            connectNulls={false}
            animationDuration={750}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

