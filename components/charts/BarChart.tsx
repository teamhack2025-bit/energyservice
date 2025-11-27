'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface BarChartProps {
  data: Array<{ label: string; value: number; [key: string]: string | number }>
  dataKey?: string
  xAxisKey?: string
  height?: number
  color?: string
  multipleSeries?: Array<{ key: string; name: string; color?: string }>
}

export default function BarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'label',
  height = 300,
  color = '#0066CC',
  multipleSeries = [],
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xAxisKey}
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        {multipleSeries.length > 0 ? (
          <>
            <Legend />
            {multipleSeries.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.name}
                fill={series.color || color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </>
        ) : (
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

