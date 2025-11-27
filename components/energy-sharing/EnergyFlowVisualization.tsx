'use client'

import { motion } from 'framer-motion'
import { Home, Building2, Zap, ArrowRight, Sun, Wind, Battery, TrendingUp } from 'lucide-react'
import { GroupOverviewData } from '@/types/energy-sharing'

interface Props {
  data: GroupOverviewData
}

export default function EnergyFlowVisualization({ data }: Props) {
  const { kpis, members } = data
  
  // Calculate flow percentages
  const productionToSharing = (kpis.internal_sharing_kwh / kpis.total_production_kwh) * 100
  const productionToGrid = ((kpis.total_production_kwh - kpis.internal_sharing_kwh) / kpis.total_production_kwh) * 100
  const sharingToConsumption = (kpis.internal_sharing_kwh / kpis.total_consumption_kwh) * 100
  const gridToConsumption = (kpis.grid_import_kwh / kpis.total_consumption_kwh) * 100

  const prosumers = members.filter(m => m.is_prosumer)
  const consumers = members.filter(m => !m.is_prosumer)

  return (
    <div className="space-y-6">
      {/* Main Flow Diagram */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span>Live Energy Flow Visualization</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Production Sources */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 text-center">PRODUCTION</h3>
            
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg"
            >
              <Sun className="h-8 w-8 mx-auto mb-2" />
              <p className="text-center text-sm font-semibold">Solar</p>
              <p className="text-center text-2xl font-bold">{(kpis.total_production_kwh * 0.75).toFixed(0)}</p>
              <p className="text-center text-xs">kWh</p>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg"
            >
              <Wind className="h-8 w-8 mx-auto mb-2" />
              <p className="text-center text-sm font-semibold">Wind</p>
              <p className="text-center text-2xl font-bold">{(kpis.total_production_kwh * 0.15).toFixed(0)}</p>
              <p className="text-center text-xs">kWh</p>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg"
            >
              <Battery className="h-8 w-8 mx-auto mb-2" />
              <p className="text-center text-sm font-semibold">Storage</p>
              <p className="text-center text-2xl font-bold">{(kpis.total_production_kwh * 0.10).toFixed(0)}</p>
              <p className="text-center text-xs">kWh</p>
            </motion.div>
          </div>

          {/* Flow to Community Pool */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-8 w-8 text-green-600" />
              <div className="text-center">
                <p className="text-xs text-gray-600">To Community</p>
                <p className="text-lg font-bold text-green-600">{productionToSharing.toFixed(0)}%</p>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <p className="text-xs text-gray-600">To Grid</p>
                <p className="text-lg font-bold text-gray-600">{productionToGrid.toFixed(0)}%</p>
              </div>
            </motion.div>
          </div>

          {/* Community Pool */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 text-center mb-4">COMMUNITY POOL</h3>
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(59, 130, 246, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
            >
              <Building2 className="h-12 w-12 mx-auto mb-3" />
              <p className="text-center text-sm font-semibold">Shared Energy</p>
              <p className="text-center text-4xl font-bold">{kpis.internal_sharing_kwh.toFixed(0)}</p>
              <p className="text-center text-sm">kWh</p>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-center text-xs">€{kpis.average_internal_price.toFixed(2)}/kWh</p>
                <p className="text-center text-xs mt-1">{prosumers.length} Prosumers</p>
              </div>
            </motion.div>
          </div>

          {/* Flow to Consumers */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <p className="text-xs text-gray-600">From Community</p>
                <p className="text-lg font-bold text-blue-600">{sharingToConsumption.toFixed(0)}%</p>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-8 w-8 text-red-400" />
              <div className="text-center">
                <p className="text-xs text-gray-600">From Grid</p>
                <p className="text-lg font-bold text-red-600">{gridToConsumption.toFixed(0)}%</p>
              </div>
            </motion.div>
          </div>

          {/* Consumption */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 text-center mb-4">CONSUMPTION</h3>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-lg"
            >
              <Home className="h-12 w-12 mx-auto mb-3" />
              <p className="text-center text-sm font-semibold">Total Usage</p>
              <p className="text-center text-4xl font-bold">{kpis.total_consumption_kwh.toFixed(0)}</p>
              <p className="text-center text-sm">kWh</p>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-center text-xs">{members.length} Members</p>
                <p className="text-center text-xs mt-1">{consumers.length} Consumers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{kpis.self_sufficiency_ratio.toFixed(1)}%</span>
          </div>
          <h3 className="text-sm font-bold text-gray-700">Self-Sufficiency</h3>
          <p className="text-xs text-gray-600 mt-1">
            Community produces {kpis.self_sufficiency_ratio.toFixed(1)}% of its consumption
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{kpis.internal_sharing_percentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-sm font-bold text-gray-700">Internal Sharing</h3>
          <p className="text-xs text-gray-600 mt-1">
            {kpis.internal_sharing_kwh.toFixed(0)} kWh shared within community
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Sun className="h-8 w-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">€{kpis.total_savings_eur.toFixed(0)}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-700">Total Savings</h3>
          <p className="text-xs text-gray-600 mt-1">
            Saved vs standard grid tariff this month
          </p>
        </div>
      </div>

      {/* Member Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prosumers ({prosumers.length})</h3>
          <div className="space-y-2">
            {prosumers.slice(0, 5).map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Sun className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{member.display_name}</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">Producing</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Consumers ({consumers.length})</h3>
          <div className="space-y-2">
            {consumers.slice(0, 5).map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{member.display_name}</span>
                </div>
                <span className="text-sm text-blue-600 font-semibold">Consuming</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
