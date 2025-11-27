'use client'

import React from 'react'
import AppShell from '@/components/layout/AppShell'
import MetricCard from '@/components/ui/MetricCard'
import ChartCard from '@/components/ui/ChartCard'
import LineChart from '@/components/charts/LineChart'
import DonutChart from '@/components/charts/DonutChart'
import WeatherWidgetCompact from '@/components/weather/WeatherWidgetCompact'
import { generateNetBalanceData } from '@/lib/mockData'
import { useNetBalanceData } from '@/lib/hooks/useSupabaseData'
import { Download, FileText, AlertCircle, Zap, TrendingUp, Sun, Wind, ArrowUp, ArrowDown, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [realData, setRealData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    fetch('/api/dashboard/real')
      .then(res => res.json())
      .then(data => {
        setRealData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching real data:', err)
        setLoading(false)
      })
  }, [])
  
  // Use real data if available, otherwise use mock data
  const { data: netBalanceData, loading: netBalanceLoading } = useNetBalanceData(30)
  const netBalanceDataToUse = realData?.last30Days || (netBalanceData.length > 0 ? netBalanceData : generateNetBalanceData(30))
  const todayNet = realData?.todayStats?.netBalance || (netBalanceDataToUse[netBalanceDataToUse.length - 1]?.netKwh || -2.5)
  const monthCost = realData?.monthlyStats?.cost || 78.95
  const monthRevenue = realData?.monthlyStats?.revenue || 14.05
  const produced = realData?.todayStats?.production || 4.5
  const consumed = realData?.todayStats?.consumption || 2.8
  const netBalance = produced - consumed
  const todayConsumption = realData?.todayStats?.consumption || 15.2
  const todayProduction = realData?.todayStats?.production || 18.5
  const efficiency = realData?.todayStats?.efficiency || 72

  const metrics = [
    {
      title: 'Net Today',
      value: todayNet.toFixed(1),
      unit: 'kWh',
      trend: { value: 12, period: 'vs last month', direction: 'down' as const },
      color: 'blue' as const,
      icon: Zap,
    },
    {
      title: 'Cost This Month',
      value: monthCost.toFixed(2),
      unit: '€',
      trend: { value: 6, period: 'vs last month', direction: 'down' as const },
      color: 'red' as const,
      icon: TrendingUp,
    },
    {
      title: 'Revenue This Month',
      value: monthRevenue.toFixed(2),
      unit: '€',
      trend: { value: 8, period: 'vs last month', direction: 'up' as const },
      color: 'green' as const,
      icon: Sun,
    },
    {
      title: 'Efficiency',
      value: efficiency,
      unit: '%',
      trend: { value: 5, period: 'vs last month', direction: 'up' as const },
      color: 'purple' as const,
      icon: Activity,
    },
  ]

  const consumptionData = netBalanceDataToUse.map((d: any) => ({
    timestamp: d.timestamp,
    consumption: d.importKwh,
  }))

  const productionData = netBalanceDataToUse.map((d: any) => ({
    timestamp: d.timestamp,
    production: d.exportKwh,
  }))

  const netBalanceChartData = [
    { label: 'Produced', value: produced, color: '#0066CC' },
    { label: 'Consumed', value: consumed, color: '#9333EA' },
    { label: 'Net', value: netBalance, color: '#00AA44' },
  ]

  // Last 7 days data for compact charts
  const last7Days = netBalanceDataToUse.slice(-7)

  return (
    <AppShell>
      {/* Compact Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time energy monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      {/* Weather Widget - Compact at Top */}
      <div className="mb-4">
        <WeatherWidgetCompact />
      </div>

      {/* Compact Metric Cards - 6 columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Decorative gradient */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${
              metric.color === 'blue' ? 'from-blue-400/20 to-blue-600/10' :
              metric.color === 'green' ? 'from-green-400/20 to-green-600/10' :
              metric.color === 'red' ? 'from-red-400/20 to-red-600/10' :
              'from-purple-400/20 to-purple-600/10'
            } rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${
                  metric.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  metric.color === 'green' ? 'from-green-500 to-green-600' :
                  metric.color === 'red' ? 'from-red-500 to-red-600' :
                  'from-purple-500 to-purple-600'
                } shadow-md`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
                {metric.trend && (metric.trend.direction === 'up' || metric.trend.direction === 'down') && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    metric.trend.direction === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend.direction === 'up' ? '↑' : '↓'} {Math.abs(metric.trend.value)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">{metric.title}</p>
              <div className="flex items-baseline">
                <p className="text-xl font-bold text-gray-900">
                  {typeof metric.value === 'number' 
                    ? (metric.value as number).toLocaleString() 
                    : String(metric.value)}
                </p>
                {metric.unit && (
                  <span className="ml-1 text-xs text-gray-500 font-medium">{metric.unit}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Additional compact metrics */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-md border border-orange-100 p-4 hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                <Sun className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Today Prod</p>
            <p className="text-xl font-bold text-gray-900">{todayProduction} kWh</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-red-50 rounded-xl shadow-md border border-red-100 p-4 hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Today Cons</p>
            <p className="text-xl font-bold text-gray-900">{todayConsumption} kWh</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Net Balance Chart - 2 columns */}
        <div className="lg:col-span-2">
          <div className="card bg-gradient-to-br from-white to-blue-50/30 border-blue-100 shadow-lg hover:shadow-xl transition-shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Net Balance</h3>
                <p className="text-xs text-gray-600">Last 30 days</p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Import</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Export</span>
                </div>
              </div>
            </div>
            {netBalanceLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <div className="text-gray-500">Loading data...</div>
              </div>
            ) : (
              <LineChart
                data={netBalanceDataToUse}
                dataKey="netKwh"
                yAxisLabel="kWh"
                height={250}
                multipleSeries={[
                  { key: 'importKwh', name: 'Import', color: '#CC0000' },
                  { key: 'exportKwh', name: 'Export', color: '#00AA44' },
                ]}
                showLegend
              />
            )}
          </div>
        </div>

        {/* Net Energy Balance Donut - Compact */}
        <div className="card bg-gradient-to-br from-white to-purple-50/30 border-purple-100 shadow-lg hover:shadow-xl transition-shadow p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Energy Balance</h3>
          <div className="flex flex-col items-center justify-center py-2">
            <DonutChart data={netBalanceChartData} size={180} />
            <div className="mt-4 space-y-1.5 w-full">
              {netBalanceChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/60 rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}kWh</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consumption and Production - Side by Side Compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="card bg-gradient-to-br from-white to-red-50/30 border-red-100 shadow-lg hover:shadow-xl transition-shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Consumption</h3>
              <p className="text-xs text-gray-600">Last 7 days</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <LineChart
            data={last7Days.map((d: any) => ({ timestamp: d.timestamp, consumption: d.importKwh }))}
            dataKey="consumption"
            yAxisLabel="kWh"
            height={180}
            colors={['#CC0000']}
          />
        </div>
        <div className="card bg-gradient-to-br from-white to-green-50/30 border-green-100 shadow-lg hover:shadow-xl transition-shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Production</h3>
              <p className="text-xs text-gray-600">Last 7 days</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Sun className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <LineChart
            data={last7Days.map((d: any) => ({ timestamp: d.timestamp, production: d.exportKwh }))}
            dataKey="production"
            yAxisLabel="kWh"
            height={180}
            colors={['#00AA44']}
          />
        </div>
      </div>

      {/* Quick Actions - Compact Grid */}
      <div className="card bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-lg p-4">
        <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/billing"
            className="group flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Download className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Download Invoice</p>
              <p className="text-xs text-gray-600 truncate">Get your latest bill</p>
            </div>
          </Link>
          <Link
            href="/contracts"
            className="group flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Change Tariff</p>
              <p className="text-xs text-gray-600 truncate">Compare and switch</p>
            </div>
          </Link>
          <Link
            href="/support/tickets/new"
            className="group flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Report Issue</p>
              <p className="text-xs text-gray-600 truncate">Get support help</p>
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
