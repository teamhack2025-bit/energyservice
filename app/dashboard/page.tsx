import AppShell from '@/components/layout/AppShell'
import MetricCard from '@/components/ui/MetricCard'
import ChartCard from '@/components/ui/ChartCard'
import LineChart from '@/components/charts/LineChart'
import DonutChart from '@/components/charts/DonutChart'
import WeatherWidgetCompact from '@/components/weather/WeatherWidgetCompact'
import { generateNetBalanceData } from '@/lib/mockData'
import { Download, FileText, AlertCircle, Zap, TrendingUp, Sun, Wind } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const netBalanceData = generateNetBalanceData(30)
  const todayNet = netBalanceData[netBalanceData.length - 1]?.netKwh || -2.5
  const monthCost = 78.95
  const monthRevenue = 14.05
  const produced = 4.5
  const consumed = 2.8
  const netBalance = produced - consumed

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
      title: 'Status',
      value: 'Live',
      trend: { value: 0, period: '', direction: 'neutral' as const },
      color: 'green' as const,
      icon: Wind,
    },
  ]

  const consumptionData = netBalanceData.map((d) => ({
    timestamp: d.timestamp,
    consumption: d.importKwh,
  }))

  const productionData = netBalanceData.map((d) => ({
    timestamp: d.timestamp,
    production: d.exportKwh,
  }))

  const netBalanceChartData = [
    { label: 'Produced', value: produced, color: '#0066CC' },
    { label: 'Consumed', value: consumed, color: '#9333EA' },
    { label: 'Net', value: netBalance, color: '#00AA44' },
  ]

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview Dashboard</h1>
        <p className="text-gray-600">Monitor your energy consumption and production</p>
      </div>

      {/* Weather Widget - Compact at Top */}
      <div className="mb-6">
        <WeatherWidgetCompact />
      </div>

      {/* Metric Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Decorative gradient overlay */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
              metric.color === 'blue' ? 'from-blue-400/20 to-blue-600/10' :
              metric.color === 'green' ? 'from-green-400/20 to-green-600/10' :
              metric.color === 'red' ? 'from-red-400/20 to-red-600/10' :
              'from-purple-400/20 to-purple-600/10'
            } rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  metric.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  metric.color === 'green' ? 'from-green-500 to-green-600' :
                  metric.color === 'red' ? 'from-red-500 to-red-600' :
                  'from-purple-500 to-purple-600'
                } shadow-lg`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                {metric.trend && metric.trend.direction !== 'neutral' && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.trend.direction === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend.direction === 'up' ? '↑' : '↓'} {Math.abs(metric.trend.value)}%
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">
                  {typeof metric.value === 'number' 
                    ? (metric.value as number).toLocaleString() 
                    : String(metric.value)}
                </p>
                {metric.unit && (
                  <span className="ml-2 text-lg text-gray-500 font-medium">{metric.unit}</span>
                )}
              </div>
              {metric.trend && metric.trend.period && (
                <p className="text-xs text-gray-500 mt-2">{metric.trend.period}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Net Balance Chart - Large */}
        <div className="lg:col-span-2">
          <div className="card bg-gradient-to-br from-white to-blue-50/30 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Net Balance</h3>
                <p className="text-sm text-gray-600">Last 30 days overview</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Import</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Export</span>
                </div>
              </div>
            </div>
            <LineChart
              data={netBalanceData}
              dataKey="netKwh"
              yAxisLabel="kWh"
              height={300}
              multipleSeries={[
                { key: 'importKwh', name: 'Import', color: '#CC0000' },
                { key: 'exportKwh', name: 'Export', color: '#00AA44' },
              ]}
              showLegend
            />
          </div>
        </div>

        {/* Net Energy Balance Donut */}
        <div className="card bg-gradient-to-br from-white to-purple-50/30 border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Net Energy Balance</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <DonutChart data={netBalanceChartData} size={220} />
            <div className="mt-6 space-y-2 w-full">
              {netBalanceChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}kWh</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consumption and Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-white to-red-50/30 border-red-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Consumption</h3>
              <p className="text-sm text-gray-600">Today: 15 kWh</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <LineChart
            data={consumptionData}
            dataKey="consumption"
            yAxisLabel="kWh"
            height={200}
            colors={['#CC0000']}
          />
        </div>
        <div className="card bg-gradient-to-br from-white to-green-50/30 border-green-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Production</h3>
              <p className="text-sm text-gray-600">Today: 18.5 kWh</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Sun className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <LineChart
            data={productionData}
            dataKey="production"
            yAxisLabel="kWh"
            height={200}
            colors={['#00AA44']}
          />
        </div>
      </div>


      {/* Quick Actions - Enhanced */}
      <div className="card bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/billing"
            className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Download Invoice</p>
              <p className="text-sm text-gray-600">Get your latest bill</p>
            </div>
          </Link>
          <Link
            href="/contracts"
            className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Change Tariff</p>
              <p className="text-sm text-gray-600">Compare and switch</p>
            </div>
          </Link>
          <Link
            href="/support/tickets/new"
            className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Report Issue</p>
              <p className="text-sm text-gray-600">Get support help</p>
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
