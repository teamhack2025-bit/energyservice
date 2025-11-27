import AppShell from '@/components/layout/AppShell'
import ChartCard from '@/components/ui/ChartCard'
import MetricCard from '@/components/ui/MetricCard'
import LineChart from '@/components/charts/LineChart'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import { generateConsumptionData } from '@/lib/mockData'
import { Download } from 'lucide-react'

export default function ConsumptionPage() {
  const consumptionData = generateConsumptionData(30)
  const totalKwh = consumptionData.reduce((sum, d) => sum + d.consumptionKwh, 0)
  const totalCost = consumptionData.reduce((sum, d) => sum + d.cost, 0)
  const avgDaily = totalKwh / consumptionData.length
  const peakKwh = Math.max(...consumptionData.map(d => d.consumptionKwh))

  const summaryMetrics = [
    {
      title: 'Total',
      value: totalKwh.toFixed(1),
      unit: 'kWh',
      color: 'blue' as const,
    },
    {
      title: 'Avg Daily',
      value: avgDaily.toFixed(1),
      unit: 'kWh',
      color: 'blue' as const,
    },
    {
      title: 'Peak',
      value: peakKwh.toFixed(1),
      unit: 'kW',
      color: 'red' as const,
    },
  ]

  const costMetrics = [
    {
      title: 'Total Cost',
      value: totalCost.toFixed(2),
      unit: '€',
      color: 'red' as const,
    },
    {
      title: 'Avg Daily Cost',
      value: (totalCost / consumptionData.length).toFixed(2),
      unit: '€',
      color: 'red' as const,
    },
  ]

  const donutData = [
    { label: 'Main Meter', value: totalKwh * 0.7 },
    { label: 'Kitchen', value: totalKwh * 0.2 },
    { label: 'Other', value: totalKwh * 0.1 },
  ]

  const comparisonData = [
    { label: 'This Month', value: totalKwh },
    { label: 'Last Month', value: totalKwh * 1.06 },
  ]

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consumption Analytics</h1>
        <p className="text-gray-600 mt-1">Analyze your energy consumption patterns</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>Last month</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Meters</option>
            <option>Main Meter</option>
            <option>Kitchen Meter</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Daily</option>
            <option>Hourly</option>
            <option>15-minute</option>
          </select>
          <button className="btn-outline flex items-center ml-auto">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Consumption Chart */}
      <div className="mb-6">
        <ChartCard title="Consumption Over Time">
          <LineChart
            data={consumptionData}
            dataKey="consumptionKwh"
            yAxisLabel="kWh"
            height={300}
            colors={['#CC0000']}
          />
        </ChartCard>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {summaryMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
        {costMetrics.map((metric, index) => (
          <MetricCard key={`cost-${index}`} metric={metric} />
        ))}
      </div>

      {/* Breakdown and Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard title="By Meter">
          <DonutChart data={donutData} />
        </ChartCard>
        <ChartCard title="Comparison">
          <BarChart data={comparisonData} color="#0066CC" />
        </ChartCard>
      </div>
    </AppShell>
  )
}

