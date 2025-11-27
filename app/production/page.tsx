import AppShell from '@/components/layout/AppShell'
import ChartCard from '@/components/ui/ChartCard'
import MetricCard from '@/components/ui/MetricCard'
import LineChart from '@/components/charts/LineChart'
import DonutChart from '@/components/charts/DonutChart'
import WeatherWidget from '@/components/weather/WeatherWidget'
import { generateProductionData } from '@/lib/mockData'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function ProductionPage() {
  const productionData = generateProductionData(30)
  const totalProduction = productionData.reduce((sum, d) => sum + d.productionKwh, 0)
  const totalSelfConsumed = productionData.reduce((sum, d) => sum + d.selfConsumedKwh, 0)
  const totalExported = productionData.reduce((sum, d) => sum + d.exportedKwh, 0)
  const selfConsumptionRatio = (totalSelfConsumed / totalProduction) * 100
  const autonomyRate = (totalSelfConsumed / (totalSelfConsumed + 100)) * 100 // Simplified
  const revenue = totalExported * 0.10

  const metrics = [
    {
      title: 'Total Production',
      value: totalProduction.toFixed(1),
      unit: 'kWh',
      color: 'green' as const,
    },
    {
      title: 'Self-Consumption',
      value: selfConsumptionRatio.toFixed(1),
      unit: '%',
      color: 'blue' as const,
    },
    {
      title: 'Revenue',
      value: revenue.toFixed(2),
      unit: '€',
      color: 'green' as const,
    },
  ]

  const todayData = productionData[productionData.length - 1]
  const currentPower = 4.2 // Mock current power

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production & Generation</h1>
        <p className="text-gray-600 mt-1">Monitor your energy production</p>
      </div>

      {/* Live Status */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Status</h3>
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-600">Current Power</p>
                <p className="text-2xl font-bold text-gray-900">{currentPower} kW</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayData?.productionKwh.toFixed(1)} kWh</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-2" />
                <span className="text-sm font-medium text-gray-900">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Chart */}
      <div className="mb-6">
        <ChartCard title="Production Over Time">
          <LineChart
            data={productionData}
            dataKey="productionKwh"
            yAxisLabel="kWh"
            height={300}
            multipleSeries={[
              { key: 'productionKwh', name: 'Total Production', color: '#00AA44' },
              { key: 'selfConsumedKwh', name: 'Self-Consumed', color: '#0066CC' },
              { key: 'exportedKwh', name: 'Exported', color: '#FF8800' },
            ]}
            showLegend
          />
        </ChartCard>
      </div>

      {/* Metrics and Weather */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Weather Widget - Important for solar production */}
      <div className="mb-6">
        <WeatherWidget />
      </div>

      {/* Device Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-success mr-3" />
              <div>
                <p className="font-medium text-gray-900">Solar System</p>
                <p className="text-sm text-gray-600">5.0 kWp</p>
              </div>
            </div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-success mr-3" />
              <div>
                <p className="font-medium text-gray-900">Inverter 1</p>
                <p className="text-sm text-gray-600">Fronius Primo 5.0</p>
              </div>
            </div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

