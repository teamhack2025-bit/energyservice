'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Zap, Battery, Sun, Car, Flame, Wind, Activity, Clock, DollarSign } from 'lucide-react'
import { EnergyFlow } from '@/types/energy'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ComponentDetailModalProps {
  component: string | null
  energyFlow: EnergyFlow
  onClose: () => void
}

export default function ComponentDetailModal({ component, energyFlow, onClose }: ComponentDetailModalProps) {
  if (!component) return null

  const getComponentData = () => {
    switch (component) {
      case 'grid':
        return {
          title: 'Grid Connection',
          icon: Zap,
          color: energyFlow.grid.import > 0 ? 'yellow' : 'cyan',
          gradient: energyFlow.grid.import > 0 ? 'from-yellow-500 to-amber-600' : 'from-cyan-500 to-blue-600',
          data: {
            'Current Flow': energyFlow.grid.import > 0 
              ? `${energyFlow.grid.import.toFixed(2)} kW (Import)` 
              : `${energyFlow.grid.export.toFixed(2)} kW (Export)`,
            'Current Price': `€${energyFlow.grid.currentPrice}/kWh`,
            'Tariff': energyFlow.grid.tariff.toUpperCase(),
            'Today Import': `${(energyFlow.grid.import * 12).toFixed(1)} kWh`,
            'Today Export': `${(energyFlow.grid.export * 8).toFixed(1)} kWh`,
            'Cost Today': `€${(energyFlow.grid.import * energyFlow.grid.currentPrice * 12).toFixed(2)}`,
            'Revenue Today': `€${(energyFlow.grid.export * 0.08 * 8).toFixed(2)}`,
          },
          chart: generateHourlyData('grid', energyFlow),
          tips: [
            energyFlow.grid.tariff === 'peak' 
              ? '⚠️ Peak tariff active - Consider shifting high-power activities'
              : '✅ Off-peak tariff - Good time for high consumption',
            energyFlow.grid.export > 0 
              ? '💰 Exporting to grid - Earning revenue from solar'
              : '🔌 Importing from grid - Using grid power',
          ],
        }
      
      case 'solar':
        return {
          title: 'Solar Production',
          icon: Sun,
          color: 'green',
          gradient: 'from-green-500 to-emerald-600',
          data: {
            'Current Production': `${energyFlow.solar.production.toFixed(2)} kW`,
            'To House': `${energyFlow.solar.toHouse.toFixed(2)} kW`,
            'To Grid': `${energyFlow.solar.toGrid.toFixed(2)} kW`,
            'To Battery': `${energyFlow.solar.toBattery.toFixed(2)} kW`,
            'Today Production': `${(energyFlow.solar.production * 8).toFixed(1)} kWh`,
            'Self-Consumption': `${((energyFlow.solar.toHouse / energyFlow.solar.production) * 100 || 0).toFixed(0)}%`,
            'Revenue Today': `€${(energyFlow.solar.toGrid * 0.08 * 8).toFixed(2)}`,
          },
          chart: generateHourlyData('solar', energyFlow),
          tips: [
            energyFlow.solar.production > 3 
              ? '☀️ Excellent solar conditions - Great time to charge battery or run appliances'
              : '⛅ Moderate solar production',
            `🔋 ${((energyFlow.solar.toHouse / energyFlow.solar.production) * 100 || 0).toFixed(0)}% self-consumed - ${
              ((energyFlow.solar.toHouse / energyFlow.solar.production) * 100) > 70 
                ? 'Excellent!' 
                : 'Consider using more appliances during peak solar hours'
            }`,
          ],
        }
      
      case 'battery':
        return {
          title: 'Battery Storage',
          icon: Battery,
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          data: {
            'State of Charge': `${energyFlow.battery.soc.toFixed(1)}%`,
            'Current Power': `${energyFlow.battery.power > 0 ? '+' : ''}${energyFlow.battery.power.toFixed(2)} kW`,
            'Status': energyFlow.battery.power > 0 ? 'Charging' : energyFlow.battery.power < 0 ? 'Discharging' : 'Idle',
            'Capacity': `${energyFlow.battery.capacity} kWh`,
            'Stored Energy': `${(energyFlow.battery.soc / 100 * energyFlow.battery.capacity).toFixed(2)} kWh`,
            'Runtime': energyFlow.battery.estimatedRuntime > 0 ? `${energyFlow.battery.estimatedRuntime} min` : 'N/A',
            'Cycles Today': '2',
          },
          chart: generateHourlyData('battery', energyFlow),
          tips: [
            energyFlow.battery.soc < 20 
              ? '⚠️ Low battery - Consider charging from grid during off-peak'
              : energyFlow.battery.soc > 80 
                ? '✅ Battery well charged'
                : '🔋 Battery at moderate level',
            energyFlow.battery.power > 0 
              ? '⚡ Charging from solar - Storing excess energy'
              : energyFlow.battery.power < 0 
                ? '🏠 Powering house - Reducing grid import'
                : '⏸️ Battery idle',
          ],
        }
      
      case 'ev':
        return {
          title: 'EV Charger',
          icon: Car,
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          data: {
            'Charging Status': energyFlow.ev.charging ? 'Active' : 'Idle',
            'Charging Power': `${energyFlow.ev.power.toFixed(2)} kW`,
            'Battery Level': `${energyFlow.ev.soc.toFixed(0)}%`,
            'Time to Full': energyFlow.ev.timeToFull > 0 ? `${Math.floor(energyFlow.ev.timeToFull / 60)}h ${energyFlow.ev.timeToFull % 60}m` : 'N/A',
            'Cost This Session': `€${energyFlow.ev.cost.toFixed(2)}`,
            'Energy Added': `${(energyFlow.ev.power * 2).toFixed(1)} kWh`,
            'Estimated Range': `${(energyFlow.ev.soc * 4).toFixed(0)} km`,
          },
          chart: generateHourlyData('ev', energyFlow),
          tips: [
            energyFlow.ev.charging && energyFlow.grid.tariff === 'peak'
              ? '💡 Charging during peak hours - Consider scheduling for off-peak to save money'
              : energyFlow.ev.charging 
                ? '✅ Charging during off-peak - Optimal timing!'
                : '🚗 Not charging',
            energyFlow.solar.production > 5 && !energyFlow.ev.charging
              ? '☀️ High solar production - Good time to charge EV'
              : '',
          ].filter(Boolean),
        }
      
      case 'heatpump':
        return {
          title: 'Heat Pump',
          icon: Wind,
          color: 'indigo',
          gradient: 'from-indigo-500 to-indigo-600',
          data: {
            'Status': energyFlow.heatPump.active ? 'Active' : 'Idle',
            'Mode': energyFlow.heatPump.mode.toUpperCase(),
            'Current Power': `${energyFlow.heatPump.power.toFixed(2)} kW`,
            'Current Temp': `${energyFlow.heatPump.currentTemp}°C`,
            'Target Temp': `${energyFlow.heatPump.targetTemp}°C`,
            'COP': '3.5',
            'Energy Today': `${(energyFlow.heatPump.power * 8).toFixed(1)} kWh`,
          },
          chart: generateHourlyData('heatpump', energyFlow),
          tips: [
            Math.abs(energyFlow.heatPump.currentTemp - energyFlow.heatPump.targetTemp) > 2
              ? '🌡️ Large temperature difference - Heat pump working hard'
              : '✅ Temperature near target',
            energyFlow.solar.production > 2 && energyFlow.heatPump.active
              ? '☀️ Running on solar power - Free heating!'
              : '',
          ].filter(Boolean),
        }
      
      case 'gas':
        return {
          title: 'Gas Meter',
          icon: Flame,
          color: 'purple',
          gradient: 'from-purple-500 to-pink-600',
          data: {
            'Flow Rate': `${energyFlow.gas.flowRate.toFixed(2)} m³/h`,
            'Heating Status': energyFlow.gas.heatingActive ? 'Active' : 'Inactive',
            'Today Usage': `${energyFlow.gas.todayUsage.toFixed(2)} m³`,
            'Cost Today': `€${(energyFlow.gas.todayUsage * 0.85).toFixed(2)}`,
            'Monthly Estimate': `${(energyFlow.gas.todayUsage * 30).toFixed(0)} m³`,
            'Monthly Cost': `€${(energyFlow.gas.todayUsage * 30 * 0.85).toFixed(2)}`,
          },
          chart: generateHourlyData('gas', energyFlow),
          tips: [
            energyFlow.gas.heatingActive && energyFlow.heatPump.active
              ? '💡 Both gas and heat pump active - Consider optimizing'
              : '',
            energyFlow.gas.flowRate > 2
              ? '⚠️ High gas consumption - Check for efficiency'
              : '✅ Normal gas usage',
          ].filter(Boolean),
        }
      
      default:
        return null
    }
  }

  const data = getComponentData()
  if (!data) return null

  const Icon = data.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${data.gradient} p-6 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Icon className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{data.title}</h2>
                  <p className="text-white/80 mt-1">Real-time monitoring and insights</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Current Status</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(data.data).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">{key}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>24-Hour History</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.chart}>
                    <defs>
                      <linearGradient id={`color${component}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`var(--${data.color}-500)`} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={`var(--${data.color}-500)`} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(hour) => `${hour}:00`}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={`var(--${data.color}-600)`}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={`url(#color${component})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tips & Recommendations */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Smart Insights</span>
              </h3>
              <div className="space-y-3">
                {data.tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-blue-900">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>View Cost Analysis</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Generate mock hourly data for charts
function generateHourlyData(component: string, energyFlow: EnergyFlow) {
  const currentHour = new Date().getHours()
  const data = []
  
  for (let i = 0; i <= currentHour; i++) {
    let value = 0
    
    switch (component) {
      case 'grid':
        value = energyFlow.grid.import > 0 ? energyFlow.grid.import : -energyFlow.grid.export
        value += (Math.random() - 0.5) * 2
        break
      case 'solar':
        value = i >= 6 && i <= 20 ? Math.sin((i - 6) / 14 * Math.PI) * 5 : 0
        break
      case 'battery':
        value = 30 + Math.random() * 40
        break
      case 'ev':
        value = i >= 22 || i <= 6 ? energyFlow.ev.power : 0
        break
      case 'heatpump':
        value = i >= 6 && i <= 9 || i >= 18 && i <= 23 ? energyFlow.heatPump.power : 0
        break
      case 'gas':
        value = i >= 6 && i <= 9 || i >= 18 && i <= 23 ? energyFlow.gas.flowRate : 0
        break
    }
    
    data.push({ hour: i, value: Math.max(0, value) })
  }
  
  return data
}
