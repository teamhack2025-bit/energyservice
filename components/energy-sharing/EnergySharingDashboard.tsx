'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Leaf, 
  Euro, 
  Settings, 
  Zap,
  ArrowRight,
  ArrowLeft,
  Home,
  Building2,
  Battery,
  Sun,
  Wind,
  Activity,
  BarChart3,
  Clock,
  Shield
} from 'lucide-react'
import { GroupOverviewData } from '@/types/energy-sharing'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import EnergyFlowVisualization from './EnergyFlowVisualization'
import MemberManagementPanel from './MemberManagementPanel'
import PricingControlPanel from './PricingControlPanel'

interface Props {
  data: GroupOverviewData
  onRefresh: () => void
}

export default function EnergySharingDashboard({ data, onRefresh }: Props) {
  const { group, member, kpis, members, rules } = data
  const isAdmin = member.role === 'admin'
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'members' | 'pricing'>('overview')

  // Generate time series data for energy flow
  const energyFlowData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    production: Math.sin(i / 3) * 50 + 100 + Math.random() * 20,
    consumption: Math.cos(i / 4) * 40 + 120 + Math.random() * 15,
    shared: Math.sin(i / 3) * 30 + 60 + Math.random() * 10,
  }))

  const productionSourcesData = [
    { name: 'Solar', value: kpis.total_production_kwh * 0.75, color: '#fbbf24' },
    { name: 'Wind', value: kpis.total_production_kwh * 0.15, color: '#60a5fa' },
    { name: 'Battery', value: kpis.total_production_kwh * 0.10, color: '#34d399' },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header with Group Info */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Building2 className="h-8 w-8" />
              <span>{group.name}</span>
            </h1>
            <p className="text-green-100 mt-1">{group.description}</p>
            <p className="text-sm text-green-100 mt-2 flex items-center space-x-4">
              <span>📍 {group.region} • {group.postcode}</span>
              <span>• {group.type.charAt(0).toUpperCase() + group.type.slice(1)} Community</span>
              <span>• 🇱🇺 Luxembourg Framework</span>
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {isAdmin && (
              <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>GROUP ADMIN</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-green-100">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>Live Data</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer"
          >
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4" />
              <p className="text-xs text-green-100">Members</p>
            </div>
            <p className="text-2xl font-bold">{group.member_count}</p>
            <p className="text-xs text-green-200">{members.filter(m => m.is_prosumer).length} prosumers</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer"
          >
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4" />
              <p className="text-xs text-green-100">Self-Sufficiency</p>
            </div>
            <p className="text-2xl font-bold">{kpis.self_sufficiency_ratio.toFixed(1)}%</p>
            <p className="text-xs text-green-200">+5.2% vs last month</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer"
          >
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="h-4 w-4" />
              <p className="text-xs text-green-100">Internal Sharing</p>
            </div>
            <p className="text-2xl font-bold">{kpis.internal_sharing_percentage.toFixed(1)}%</p>
            <p className="text-xs text-green-200">{kpis.internal_sharing_kwh.toFixed(0)} kWh</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer"
          >
            <div className="flex items-center space-x-2 mb-1">
              <Euro className="h-4 w-4" />
              <p className="text-xs text-green-100">Total Savings</p>
            </div>
            <p className="text-2xl font-bold">€{kpis.total_savings_eur.toFixed(0)}</p>
            <p className="text-xs text-green-200">This month</p>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="h-5 w-5 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'flow'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Activity className="h-5 w-5 inline mr-2" />
          Energy Flow
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'members'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Members
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'pricing'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5 inline mr-2" />
              Pricing
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Real-time KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Sun className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Live
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Production</h3>
                <p className="text-3xl font-bold text-gray-900">{kpis.total_production_kwh.toFixed(0)}</p>
                <p className="text-sm text-gray-600">kWh this month</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Shared
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Internal Sharing</h3>
                <p className="text-3xl font-bold text-gray-900">{kpis.internal_sharing_kwh.toFixed(0)}</p>
                <p className="text-sm text-gray-600">kWh shared internally</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Euro className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    €{kpis.average_internal_price.toFixed(2)}/kWh
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Avg Internal Price</h3>
                <p className="text-3xl font-bold text-gray-900">€{kpis.average_internal_price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">vs €0.28 grid price</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
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
                <h3 className="text-sm font-semibold text-gray-700 mb-1">CO₂ Avoided</h3>
                <p className="text-3xl font-bold text-gray-900">{kpis.co2_avoided_kg.toFixed(0)}</p>
                <p className="text-sm text-gray-600">kg this month</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 24h Energy Flow */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>24-Hour Energy Flow</span>
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={energyFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="production" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="shared" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="consumption" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Production Sources */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Production Sources</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productionSourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productionSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)} kWh`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {productionSourcesData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                      <p className="text-sm font-bold text-gray-900">{item.value.toFixed(0)} kWh</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'flow' && (
          <motion.div
            key="flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EnergyFlowVisualization data={data} />
          </motion.div>
        )}

        {activeTab === 'members' && isAdmin && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MemberManagementPanel data={data} onRefresh={onRefresh} />
          </motion.div>
        )}

        {activeTab === 'pricing' && isAdmin && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PricingControlPanel data={data} onRefresh={onRefresh} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
