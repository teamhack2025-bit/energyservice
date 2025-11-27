'use client'

import { Sun, Battery, Zap, TrendingDown, TrendingUp, Flame, Wind } from 'lucide-react'
import { EnergyFlow } from '@/types/energy'

interface LiveKPIsProps {
  energyFlow: EnergyFlow
}

export default function LiveKPIs({ energyFlow }: LiveKPIsProps) {
  const { solar, battery, grid, consumption, ev, gas, heatPump } = energyFlow

  const kpis = [
    {
      title: 'Solar Production',
      value: solar.production,
      unit: 'kW',
      icon: Sun,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      details: [
        { label: 'To House', value: `${solar.toHouse} kW` },
        { label: 'To Grid', value: `${solar.toGrid} kW` },
        { label: 'To Battery', value: `${solar.toBattery} kW` },
      ],
    },
    {
      title: 'Battery',
      value: battery.soc,
      unit: '%',
      icon: Battery,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      details: [
        { label: 'Power', value: `${battery.power > 0 ? '+' : ''}${battery.power} kW` },
        { label: 'Capacity', value: `${battery.capacity} kWh` },
        { label: 'Runtime', value: battery.estimatedRuntime > 0 ? `${battery.estimatedRuntime} min` : 'N/A' },
      ],
    },
    {
      title: 'Consumption',
      value: consumption.total,
      unit: 'kW',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      details: Object.entries(consumption.byRoom)
        .filter(([_, power]) => power > 0)
        .slice(0, 3)
        .map(([room, power]) => ({ label: room, value: `${power} kW` })),
    },
    {
      title: 'Grid',
      value: grid.import > 0 ? grid.import : grid.export,
      unit: 'kW',
      icon: grid.import > 0 ? TrendingDown : TrendingUp,
      color: grid.import > 0 ? 'from-yellow-500 to-amber-600' : 'from-cyan-500 to-blue-600',
      bgColor: grid.import > 0 ? 'bg-yellow-50' : 'bg-cyan-50',
      textColor: grid.import > 0 ? 'text-yellow-700' : 'text-cyan-700',
      details: [
        { label: 'Import', value: `${grid.import} kW` },
        { label: 'Export', value: `${grid.export} kW` },
        { label: 'Price', value: `€${grid.currentPrice}/kWh` },
        { label: 'Tariff', value: grid.tariff },
      ],
    },
    {
      title: 'EV Charging',
      value: ev.soc,
      unit: '%',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      details: [
        { label: 'Power', value: ev.charging ? `${ev.power} kW` : 'Not charging' },
        { label: 'Time to Full', value: ev.charging ? `${ev.timeToFull} min` : 'N/A' },
        { label: 'Cost', value: `€${ev.cost.toFixed(2)}` },
      ],
    },
    {
      title: 'Gas Usage',
      value: gas.flowRate,
      unit: 'm³/h',
      icon: Flame,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      details: [
        { label: 'Today', value: `${gas.todayUsage} m³` },
        { label: 'Heating', value: gas.heatingActive ? 'Active' : 'Inactive' },
      ],
    },
    {
      title: 'Heat Pump',
      value: heatPump.currentTemp,
      unit: '°C',
      icon: Wind,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      details: [
        { label: 'Power', value: `${heatPump.power} kW` },
        { label: 'Mode', value: heatPump.mode },
        { label: 'Target', value: `${heatPump.targetTemp}°C` },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className={`${kpi.bgColor} rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color} shadow-md`}>
              <kpi.icon className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${kpi.bgColor} ${kpi.textColor} border border-current`}>
              Live
            </span>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-2">{kpi.title}</h3>

          <div className="flex items-baseline space-x-1 mb-3">
            <span className="text-3xl font-bold text-gray-900">
              {typeof kpi.value === 'number' ? kpi.value.toFixed(1) : kpi.value}
            </span>
            <span className="text-sm text-gray-600 font-medium">{kpi.unit}</span>
          </div>

          <div className="space-y-1">
            {kpi.details.map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{detail.label}</span>
                <span className={`font-semibold ${kpi.textColor}`}>{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
