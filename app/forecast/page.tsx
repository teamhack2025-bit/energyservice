import AppShell from '@/components/layout/AppShell'
import ChartCard from '@/components/ui/ChartCard'
import LineChart from '@/components/charts/LineChart'
import DonutChart from '@/components/charts/DonutChart'
import { generateConsumptionData, generateProductionData } from '@/lib/mockData'
import { Lightbulb, Battery, TrendingUp } from 'lucide-react'

export default function ForecastPage() {
  const consumptionData = generateConsumptionData(7)
  const productionData = generateProductionData(7)
  
  // Forecast data (mock future predictions)
  const forecastConsumption = consumptionData.map((d, i) => ({
    timestamp: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
    consumption: d.consumptionKwh + (Math.random() - 0.5) * 2,
  }))

  const forecastProduction = productionData.map((d, i) => ({
    timestamp: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
    production: d.productionKwh + (Math.random() - 0.5) * 2,
  }))

  const efficiencyData = [
    { label: 'Consumption Efficiency', value: 80 },
    { label: 'Production Optimization', value: 65 },
    { label: 'Tariff Optimization', value: 70 },
  ]

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Forecast & Insights</h1>
        <p className="text-gray-600 mt-1">Predictive analytics and optimization recommendations</p>
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Consumption Forecast (Next 7 Days)">
          <LineChart
            data={forecastConsumption}
            dataKey="consumption"
            yAxisLabel="kWh"
            height={250}
            colors={['#CC0000']}
          />
        </ChartCard>
        <ChartCard title="Production Forecast (Next 7 Days)">
          <LineChart
            data={forecastProduction}
            dataKey="production"
            yAxisLabel="kWh"
            height={250}
            colors={['#00AA44']}
          />
        </ChartCard>
      </div>

      {/* Optimization Insights */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <Lightbulb className="h-5 w-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Shift usage to off-peak hours</h4>
              <p className="text-sm text-gray-600 mt-1">
                You could save €15/month by shifting 20% of your peak usage to off-peak hours.
              </p>
              <button className="text-sm text-primary hover:underline mt-2">Learn More</button>
            </div>
          </div>
          <div className="flex items-start p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <Battery className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Optimize battery charging</h4>
              <p className="text-sm text-gray-600 mt-1">
                Charge during low-price hours for better savings.
              </p>
              <button className="text-sm text-primary hover:underline mt-2">Configure</button>
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Efficiency Score">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-5xl font-bold text-primary mb-2">72</div>
            <div className="text-2xl font-semibold text-gray-900 mb-4">/100</div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
              Good
            </span>
          </div>
          <DonutChart data={efficiencyData} size={180} />
        </ChartCard>
        <ChartCard title="Goals">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Monthly Consumption</span>
                <span className="text-sm text-gray-600">250 / 300 kWh</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{ width: '83%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">83% of goal</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button className="btn-outline w-full">Create New Goal</button>
            </div>
          </div>
        </ChartCard>
      </div>
    </AppShell>
  )
}

