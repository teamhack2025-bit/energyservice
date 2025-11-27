import AppShell from '@/components/layout/AppShell'
import ChartCard from '@/components/ui/ChartCard'
import MetricCard from '@/components/ui/MetricCard'
import LineChart from '@/components/charts/LineChart'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import { generateNetBalanceData } from '@/lib/mockData'

export default function NetBalancePage() {
  const netBalanceData = generateNetBalanceData(30)
  const totalImport = netBalanceData.reduce((sum, d) => sum + d.importKwh, 0)
  const totalExport = netBalanceData.reduce((sum, d) => sum + d.exportKwh, 0)
  const netImport = totalImport - totalExport
  const totalCost = netBalanceData.reduce((sum, d) => sum + d.cost, 0)
  const totalRevenue = netBalanceData.reduce((sum, d) => sum + d.revenue, 0)
  const netCost = totalCost - totalRevenue

  const metrics = [
    {
      title: 'Net Import',
      value: netImport.toFixed(1),
      unit: 'kWh',
      color: 'blue' as const,
    },
    {
      title: 'Cost',
      value: totalCost.toFixed(2),
      unit: '€',
      color: 'red' as const,
    },
    {
      title: 'Revenue',
      value: totalRevenue.toFixed(2),
      unit: '€',
      color: 'green' as const,
    },
  ]

  const costBreakdown = [
    { label: 'Consumption', value: totalCost * 0.8 },
    { label: 'Grid Fees', value: totalCost * 0.15 },
    { label: 'Tax', value: totalCost * 0.05 },
  ]

  const monthlyData = [
    { label: 'Nov', value: 88.5 },
    { label: 'Dec', value: 102.3 },
    { label: 'Jan', value: netCost },
  ]

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Net Balance & Financials</h1>
        <p className="text-gray-600 mt-1">Unified view of consumption, production, and finances</p>
      </div>

      {/* Net Balance Chart */}
      <div className="mb-6">
        <ChartCard title="Net Import/Export Over Time">
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
        </ChartCard>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Cost Breakdown and Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Cost Breakdown">
          <DonutChart data={costBreakdown} />
        </ChartCard>
        <ChartCard title="Monthly Summary">
          <BarChart data={monthlyData} color="#0066CC" />
        </ChartCard>
      </div>

      {/* Scenario Tools */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Tools</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-outline">What if I add solar?</button>
          <button className="btn-outline">What if I shift usage?</button>
        </div>
      </div>
    </AppShell>
  )
}

