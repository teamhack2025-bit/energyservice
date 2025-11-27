'use client'

import { useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TimelineData } from '@/types/energy'

interface TimelineGraphProps {
  data: TimelineData[]
}

export default function TimelineGraph({ data }: TimelineGraphProps) {
  const [visibleLines, setVisibleLines] = useState({
    solar: true,
    consumption: true,
    export: true,
    import: true,
    batterySoc: false,
  })

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">24-Hour Energy Timeline</h3>
          <p className="text-sm text-gray-600">Today's energy flow and grid interaction</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleLine('solar')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              visibleLines.solar
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Solar
          </button>
          <button
            onClick={() => toggleLine('consumption')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              visibleLines.consumption
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Consumption
          </button>
          <button
            onClick={() => toggleLine('export')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              visibleLines.export
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Export
          </button>
          <button
            onClick={() => toggleLine('import')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              visibleLines.import
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Import
          </button>
          <button
            onClick={() => toggleLine('batterySoc')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              visibleLines.batterySoc
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Battery %
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="hour"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickFormatter={(hour) => `${hour}:00`}
          />
          <YAxis
            yAxisId="left"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#3b82f6"
            tick={{ fontSize: 12 }}
            label={{ value: 'Battery (%)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'batterySoc') return [`${value}%`, 'Battery']
              return [`${value} kW`, name.charAt(0).toUpperCase() + name.slice(1)]
            }}
            labelFormatter={(hour) => `Time: ${hour}:00`}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          
          {visibleLines.solar && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="solar"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              name="Solar"
            />
          )}
          {visibleLines.consumption && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="consumption"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              name="Consumption"
            />
          )}
          {visibleLines.export && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="export"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              name="Export"
            />
          )}
          {visibleLines.import && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="import"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              name="Import"
            />
          )}
          {visibleLines.batterySoc && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="batterySoc"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Battery SOC"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Total Solar</p>
          <p className="text-lg font-bold text-green-600">
            {data.reduce((sum, d) => sum + d.solar, 0).toFixed(1)} kWh
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Total Consumption</p>
          <p className="text-lg font-bold text-orange-600">
            {data.reduce((sum, d) => sum + d.consumption, 0).toFixed(1)} kWh
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Total Export</p>
          <p className="text-lg font-bold text-cyan-600">
            {data.reduce((sum, d) => sum + d.export, 0).toFixed(1)} kWh
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Total Import</p>
          <p className="text-lg font-bold text-yellow-600">
            {data.reduce((sum, d) => sum + d.import, 0).toFixed(1)} kWh
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Self-Consumption</p>
          <p className="text-lg font-bold text-blue-600">
            {((data.reduce((sum, d) => sum + d.solar, 0) - data.reduce((sum, d) => sum + d.export, 0)) /
              data.reduce((sum, d) => sum + d.solar, 0) * 100 || 0).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  )
}
