'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Zap, 
  TrendingUp, 
  Leaf, 
  Euro, 
  BarChart3, 
  MapPin, 
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Sun,
  AlertCircle
} from 'lucide-react'
import { CommunityDashboardData } from '@/types/community'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import CommunityMembers from './CommunityMembers'
import { generateCommunityMembers } from '@/lib/communityData'

interface CommunityDashboardProps {
  data: CommunityDashboardData
}

export default function CommunityDashboard({ data }: CommunityDashboardProps) {
  const { community, stats, price_signals, recent_trades, personal_stats, alerts } = data

  // Generate chart data
  const energyFlowData = [
    { name: 'Production', value: stats.production.total, color: '#10b981' },
    { name: 'Self-Consumed', value: stats.consumption.self_consumed, color: '#3b82f6' },
    { name: 'P2P Traded', value: stats.consumption.traded_p2p, color: '#f59e0b' },
    { name: 'Grid Import', value: stats.consumption.grid_imported, color: '#ef4444' }
  ]

  const energySourcesData = [
    { name: 'Solar', value: stats.production.solar, color: '#fbbf24' },
    { name: 'Wind', value: stats.production.wind, color: '#60a5fa' },
    { name: 'Other', value: stats.production.other_renewable, color: '#34d399' }
  ]

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <p className="text-green-100 mt-1">{community.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-100">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{community.location.district}, {community.location.postcode_zone}</span>
            </div>
            <div className="flex items-center space-x-2 text-green-100 mt-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">{community.members.active} active members</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-green-100">Total Members</p>
            <p className="text-2xl font-bold">{community.members.total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-green-100">Prosumers</p>
            <p className="text-2xl font-bold">{community.members.prosumers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-green-100">Self-Sufficiency</p>
            <p className="text-2xl font-bold">{stats.environmental.self_sufficiency.toFixed(1)}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-green-100">CO₂ Avoided</p>
            <p className="text-2xl font-bold">{stats.environmental.co2_avoided.toFixed(0)} kg</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border-2 p-4 flex items-start space-x-3 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <AlertCircle className={`h-5 w-5 mt-0.5 ${
                alert.severity === 'critical' ? 'text-red-600' :
                alert.severity === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
              Today
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Community Production</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.production.total.toFixed(1)}</p>
          <p className="text-sm text-gray-600">kWh</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              P2P
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Energy Traded</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.trading.total_volume.toFixed(1)}</p>
          <p className="text-sm text-gray-600">kWh</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Euro className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
              Savings
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Community Savings</h3>
          <p className="text-3xl font-bold text-gray-900">€{stats.trading.savings_vs_grid.toFixed(1)}</p>
          <p className="text-sm text-gray-600">vs grid-only</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              Green
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Renewable Share</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.environmental.renewable_share.toFixed(1)}</p>
          <p className="text-sm text-gray-600">%</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Flow Overview */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Energy Flow Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={energyFlowData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {energyFlowData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)} kWh`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {energyFlowData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Production Sources */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Production Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={energySourcesData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {energySourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)} kWh`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {energySourcesData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
                <p className="text-sm font-bold text-gray-900">{item.value.toFixed(1)} kWh</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Market Price */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Current Market Conditions</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Updated {new Date(price_signals.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">P2P Price</p>
            <p className="text-2xl font-bold text-blue-600">€{price_signals.pricing.current_p2p_price}</p>
            <p className="text-xs text-gray-500">/kWh</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Grid Import</p>
            <p className="text-2xl font-bold text-gray-600">€{price_signals.pricing.grid_import_price}</p>
            <p className="text-xs text-gray-500">/kWh</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Grid Export</p>
            <p className="text-2xl font-bold text-gray-600">€{price_signals.pricing.grid_export_price}</p>
            <p className="text-xs text-gray-500">/kWh</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Your Savings</p>
            <p className="text-2xl font-bold text-green-600">
              €{((price_signals.pricing.grid_import_price - price_signals.pricing.current_p2p_price) * 100).toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">per 100 kWh</p>
          </div>
        </div>

        {/* Market Signals */}
        <div className="mt-4 flex flex-wrap gap-2">
          {price_signals.signals.good_time_to_buy && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center space-x-1">
              <ArrowDownLeft className="h-4 w-4" />
              <span>Good time to buy</span>
            </span>
          )}
          {price_signals.signals.good_time_to_sell && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center space-x-1">
              <ArrowUpRight className="h-4 w-4" />
              <span>Good time to sell</span>
            </span>
          )}
          {price_signals.signals.high_renewable_availability && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center space-x-1">
              <Sun className="h-4 w-4" />
              <span>High renewable availability</span>
            </span>
          )}
        </div>
      </div>

      {/* Personal Trading Summary */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Trading Summary (This Month)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Energy Bought</p>
            <p className="text-xl font-bold text-gray-900">{personal_stats.trading.energy_bought.toFixed(1)} kWh</p>
            <p className="text-xs text-green-600">€{personal_stats.trading.total_spent.toFixed(2)} spent</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Energy Sold</p>
            <p className="text-xl font-bold text-gray-900">{personal_stats.trading.energy_sold.toFixed(1)} kWh</p>
            <p className="text-xs text-blue-600">€{personal_stats.trading.total_earned.toFixed(2)} earned</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Euro className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Net Balance</p>
            <p className={`text-xl font-bold ${personal_stats.trading.net_cost < 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{Math.abs(personal_stats.trading.net_cost).toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">{personal_stats.trading.net_cost < 0 ? 'profit' : 'cost'}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-600">Total Savings</p>
            <p className="text-xl font-bold text-emerald-600">€{personal_stats.savings.total_savings.toFixed(2)}</p>
            <p className="text-xs text-gray-600">{personal_stats.savings.savings_percentage.toFixed(1)}% saved</p>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Community Trades</h3>
        <div className="space-y-3">
          {recent_trades.slice(0, 5).map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  trade.buyer_id === 'current-user' ? 'bg-green-100' : 
                  trade.seller_id === 'current-user' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {trade.buyer_id === 'current-user' ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  ) : trade.seller_id === 'current-user' ? (
                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Zap className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {trade.buyer_anonymous_id} ↔ {trade.seller_anonymous_id}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(trade.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{trade.energy.quantity.toFixed(1)} kWh</p>
                <p className="text-xs text-gray-600">€{trade.pricing.agreed_price}/kWh</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Members */}
      <CommunityMembers members={generateCommunityMembers()} />
    </div>
  )
}
