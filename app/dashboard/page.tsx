'use client'

import React from 'react'
import AppShell from '@/components/layout/AppShell'
import LineChart from '@/components/charts/LineChart'
import WeatherWidgetCompact from '@/components/weather/WeatherWidgetCompact'
import { Download, FileText, AlertCircle, Zap, TrendingUp, Sun, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [fallbackUsed, setFallbackUsed] = React.useState(false)
  const [lastRefresh, setLastRefresh] = React.useState<Date>(new Date())
  
  const fetchDashboardData = React.useCallback(() => {
    console.log('Fetching dashboard data at:', new Date().toLocaleTimeString())
    fetch('/api/dashboard/overview', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Dashboard data received:', data)
        console.log('Metrics structure:', data.metrics)
        console.log('Today stats:', data.todayStats)
        console.log('Monthly stats:', data.monthlyStats)
        setDashboardData(data)
        setFallbackUsed(data.fallbackUsed || false)
        setLoading(false)
        setLastRefresh(new Date())
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    // Initial fetch
    fetchDashboardData()
    
    // Refresh every 4 seconds
    const interval = setInterval(fetchDashboardData, 4000)
    
    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [fetchDashboardData])
  
  // Extract data from API response
  const todayNet = dashboardData?.todayStats?.netBalance ?? -2.5
  const monthCost = dashboardData?.monthlyStats?.cost ?? 78.95
  const monthRevenue = dashboardData?.monthlyStats?.revenue ?? 14.05
  const todayConsumption = dashboardData?.todayStats?.consumption ?? 15.2
  const todayProduction = dashboardData?.todayStats?.production ?? 18.5
  const efficiency = dashboardData?.todayStats?.efficiency ?? 72
  
  // Debug: Log extracted values
  React.useEffect(() => {
    if (dashboardData) {
      console.log('Extracted values:', {
        todayNet,
        monthCost,
        monthRevenue,
        todayConsumption,
        todayProduction,
        efficiency
      })
    }
  }, [dashboardData, todayNet, monthCost, monthRevenue, todayConsumption, todayProduction, efficiency])

  const metrics = [
    {
      title: 'Net Today',
      value: todayNet.toFixed(1),
      unit: 'kWh',
      trend: { 
        value: Math.abs(dashboardData?.metrics?.netToday?.change || 12), 
        period: 'vs last month', 
        direction: dashboardData?.metrics?.netToday?.direction || 'down' as const 
      },
      color: 'blue' as const,
      icon: Zap,
    },
    {
      title: 'Cost This Month',
      value: monthCost.toFixed(2),
      unit: '€',
      trend: { 
        value: Math.abs(dashboardData?.metrics?.costThisMonth?.change || 6), 
        period: 'vs last month', 
        direction: dashboardData?.metrics?.costThisMonth?.direction || 'down' as const 
      },
      color: 'red' as const,
      icon: TrendingUp,
    },
    {
      title: 'Revenue This Month',
      value: monthRevenue.toFixed(2),
      unit: '€',
      trend: { 
        value: Math.abs(dashboardData?.metrics?.revenueThisMonth?.change || 8), 
        period: 'vs last month', 
        direction: dashboardData?.metrics?.revenueThisMonth?.direction || 'up' as const 
      },
      color: 'green' as const,
      icon: Sun,
    },
    {
      title: 'Efficiency',
      value: efficiency,
      unit: '%',
      trend: { 
        value: Math.abs(dashboardData?.metrics?.efficiency?.change || 5), 
        period: 'vs last month', 
        direction: dashboardData?.metrics?.efficiency?.direction || 'up' as const 
      },
      color: 'purple' as const,
      icon: Activity,
    },
  ]

  // Get chart data
  const netBalanceDataToUse = dashboardData?.last30Days || []
  const last7DaysConsumption = dashboardData?.last7DaysConsumption || []
  const last7DaysProduction = dashboardData?.last7DaysProduction || []

  // Flatten hourly consumption data for chart
  const consumptionChartData = last7DaysConsumption.flatMap((day: any) => 
    day.hourlyValues?.map((value: number, hour: number) => ({
      timestamp: `${day.date} ${hour.toString().padStart(2, '0')}:00`,
      consumption: value,
      date: day.date,
      hour
    })) || []
  )

  // Flatten hourly production data for chart
  const productionChartData = last7DaysProduction.flatMap((day: any) => 
    day.hourlyValues?.map((value: number, hour: number) => ({
      timestamp: `${day.date} ${hour.toString().padStart(2, '0')}:00`,
      production: value,
      date: day.date,
      hour
    })) || []
  )

  return (
    <AppShell>
      {/* Compact Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time energy monitoring • Auto-refresh every 4s</p>
        </div>
        <div className="flex items-center space-x-2">
          {fallbackUsed && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              <AlertCircle className="w-3 h-3 mr-1" />
              Using cached data
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Last update: {lastRefresh.toLocaleTimeString()}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            fallbackUsed ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          }`}>
            <span className={`w-1.5 h-1.5 ${fallbackUsed ? 'bg-yellow-500' : 'bg-green-500'} rounded-full mr-1.5 ${!fallbackUsed && 'animate-pulse'}`}></span>
            {fallbackUsed ? 'Offline' : 'Live'}
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

      {/* Net Balance Chart - Full Width */}
      <div className="mb-4">
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
          {loading ? (
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
            data={consumptionChartData}
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
            data={productionChartData}
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
