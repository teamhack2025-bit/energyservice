'use client'

import { useEffect, useState, useRef } from 'react'
import AppShell from '@/components/layout/AppShell'
import ChartCard from '@/components/ui/ChartCard'
import ForecastLineChart from '@/components/charts/ForecastLineChart'
import { Brain, TrendingUp, Zap, Sun, Battery, Grid3x3, Loader2, AlertCircle, Lightbulb, Target, Clock, CheckCircle2, AlertTriangle, Info, ArrowDown, DollarSign, TrendingDown, Calendar, Leaf, AlertCircle as AlertCircleIcon } from 'lucide-react'
import { parseISO, format } from 'date-fns'

interface PredictionData {
  timestamp: string
  laundry_room: number
  kitchen: number
  car: number
  solar_panels: number
  battery: number
  grid: number
  energy_sharing_community: number
  grid_price: number
  community_price: number
}

interface PredictionResponse {
  description: string
  period: {
    start: string
    end: string
    hours: number
  }
  sign_convention: {
    negative: string
    positive: string
  }
  systems: Array<{
    location: string
    unit: string
    description: string
  }>
  data: PredictionData[]
}

interface AIRecommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  reason: string
  potential_savings_eur: number
}

interface AIPrediction {
  hour: number
  predicted_consumption_kwh: number
  estimated_cost_eur: number
  power_percentage: number
  primary_source: string
}

interface AIInsights {
  current_trend: string
  peak_hours_today: number[]
  efficiency_score: number
}

interface AIEnergyInsightsResponse {
  house_id: string
  timestamp: string
  date: string
  current_hour: number
  ai_predictions: {
    next_hour_prediction: AIPrediction
    recommendations: AIRecommendation[]
    insights: AIInsights
  }
  data_sources: {
    current_consumption_records: number
    predictions_available: number
  }
}

interface CostOptimizationResponse {
  house_id: string
  scenario: string
  parameters: Record<string, any>
  generated_at: string
  analysis: {
    scenario_name: string
    investment_summary: {
      upfront_cost_eur: number
      installation_cost_eur: number
      total_investment_eur: number
      financing_options: string[]
    }
    savings_projection: {
      annual_energy_savings_kwh: number
      annual_cost_savings_eur: number
      monthly_savings_eur: number
      first_year_savings_eur: number
    }
    roi_analysis: {
      payback_period_years: number
      roi_percentage: number
      net_present_value_eur: number
      internal_rate_of_return: number
    }
    five_year_projection: Array<{
      year: number
      cumulative_savings_eur: number
      cumulative_cost_eur: number
      net_benefit_eur: number
    }>
    environmental_impact: {
      co2_reduction_kg_year: number
      trees_equivalent: number
      renewable_percentage: number
    }
    risks: Array<{
      risk: string
      severity: string
      mitigation: string
    }>
    alternatives: Array<{
      option: string
      cost_eur: number
      pros: string[]
      cons: string[]
    }>
    recommendation: {
      verdict: 'recommended' | 'not_recommended' | 'conditional'
      confidence: string
      reasoning: string
      best_time_to_implement: string
      priority_score: number
    }
  }
  disclaimer: string
}

export default function AIForecastPage() {
  const [data, setData] = useState<PredictionResponse | null>(null)
  const [aiInsights, setAiInsights] = useState<AIEnergyInsightsResponse | null>(null)
  const [costOptimization, setCostOptimization] = useState<CostOptimizationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [optimizationLoading, setOptimizationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDate] = useState(new Date())
  const [selectedMetric, setSelectedMetric] = useState<string>('grid')
  const [selectedScenario, setSelectedScenario] = useState<string>('add_battery')
  const recommendationsRef = useRef<HTMLDivElement>(null)

  const fetchCostOptimization = async (scenario: string) => {
    try {
      setOptimizationLoading(true)
      const response = await fetch(`/api/ai/optimize?scenario=${scenario}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      
      if (response.ok) {
        const optimizationData = await response.json()
        setCostOptimization(optimizationData)
      } else {
        console.error('Failed to fetch cost optimization')
      }
    } catch (err) {
      console.error('Error fetching cost optimization:', err)
    } finally {
      setOptimizationLoading(false)
    }
  }

  const handleScenarioChange = (scenario: string) => {
    setSelectedScenario(scenario)
    fetchCostOptimization(scenario)
  }

  useEffect(() => {
    async function fetchPredictions() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/predictions')
        
        if (!response.ok) {
          throw new Error('Failed to fetch predictions')
        }
        
        const predictionData = await response.json()
        setData(predictionData)
      } catch (err) {
        console.error('Error fetching predictions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load predictions')
      } finally {
        setLoading(false)
      }
    }

    async function fetchAIInsights() {
      try {
        setInsightsLoading(true)
        const today = new Date().toISOString().split('T')[0]
        const response = await fetch(`/api/ai/energy-insights?date=${today}`)
        
        if (response.ok) {
          const insightsData = await response.json()
          setAiInsights(insightsData)
        } else {
          console.warn('Failed to fetch AI insights:', response.status)
        }
      } catch (err) {
        console.error('Error fetching AI insights:', err)
        // Don't set error state for insights, just log it
      } finally {
        setInsightsLoading(false)
      }
    }

    fetchPredictions()
    fetchAIInsights()
    // Load default scenario on mount
    fetchCostOptimization(selectedScenario)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Determine which data points are historical vs predicted
  const processChartData = () => {
    if (!data) return []

    return data.data.map((item) => {
      const timestamp = parseISO(item.timestamp)
      // Data is historical if timestamp is <= current date
      const isHistorical = timestamp <= currentDate
      
      return {
        timestamp: item.timestamp,
        grid: item.grid,
        solar_panels: item.solar_panels,
        battery: item.battery,
        car: item.car,
        kitchen: item.kitchen,
        laundry_room: item.laundry_room,
        energy_sharing_community: item.energy_sharing_community,
        grid_price: item.grid_price,
        community_price: item.community_price,
        _isHistorical: isHistorical,
        _timestamp: timestamp,
      }
    })
  }

  const chartData = processChartData()
  
  // Split data into historical and predicted for the selected metric
  const historicalData = chartData.filter(d => d._isHistorical)
  const predictedData = chartData.filter(d => !d._isHistorical)
  
  // Find the transition point (last historical data point)
  const lastHistoricalIndex = chartData.findIndex((item, index) => {
    const nextItem = chartData[index + 1]
    return item._isHistorical && nextItem && !nextItem._isHistorical
  })
  
  // Combine data with separate series for historical and predicted
  const combinedData = chartData.map((item, index) => {
    const metricValue = item[selectedMetric as keyof typeof item] as number
    const isHistorical = item._isHistorical
    
    // For smooth transition, include the last historical point in both series
    const isTransitionPoint = index === lastHistoricalIndex
    
    return {
      ...item,
      [`${selectedMetric}_historical`]: isHistorical || isTransitionPoint ? metricValue : null,
      [`${selectedMetric}_predicted`]: !isHistorical || isTransitionPoint ? metricValue : null,
    }
  })

  const metricOptions = [
    { key: 'grid', label: 'Grid Import/Export', color: '#0066CC', icon: Grid3x3 },
    { key: 'solar_panels', label: 'Solar Production', color: '#FFA500', icon: Sun },
    { key: 'battery', label: 'Battery Charge/Discharge', color: '#00AA44', icon: Battery },
    { key: 'car', label: 'EV Charging', color: '#CC0000', icon: Zap },
    { key: 'kitchen', label: 'Kitchen', color: '#9932CC', icon: Zap },
    { key: 'laundry_room', label: 'Laundry Room', color: '#FF6347', icon: Zap },
    { key: 'energy_sharing_community', label: 'Energy Sharing', color: '#20B2AA', icon: TrendingUp },
  ]

  const selectedMetricInfo = metricOptions.find(m => m.key === selectedMetric)

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading AI predictions...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Error loading predictions</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return null
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">AI Forecast</h1>
        </div>
        <p className="text-gray-600 mt-1">
          {data.description} - Predictive analytics powered by AI
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Period: {format(parseISO(data.period.start), 'MMM dd, yyyy')} - {format(parseISO(data.period.end), 'MMM dd, yyyy')}
        </div>
      </div>

      {/* Metric Selector */}
      <div className="mb-6">
        <div className="card bg-gradient-to-r from-primary/5 to-purple-50 border-primary/20">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Metric to Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {metricOptions.map((metric) => {
              const Icon = metric.icon
              const isSelected = selectedMetric === metric.key
              return (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary text-white shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {metric.label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="mb-6">
        <ChartCard 
          title={`${selectedMetricInfo?.label} Forecast`}
          subtitle="Solid line: Historical data | Dotted line: AI predictions"
          actions={[
            aiInsights && (
              <button
                key="recommendations-btn"
                onClick={() => {
                  recommendationsRef.current?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="font-semibold">AI Recommendations</span>
                <ArrowDown className="h-4 w-4" />
              </button>
            ),
          ]}
        >
          <ForecastLineChart
            data={combinedData}
            dataKey={`${selectedMetric}_historical`}
            xAxisKey="timestamp"
            yAxisLabel="kWh"
            height={400}
            showLegend={true}
            currentDate={currentDate}
            multipleSeries={[
              {
                key: `${selectedMetric}_historical`,
                name: 'Historical',
                color: selectedMetricInfo?.color || '#0066CC',
                isPrediction: false,
              },
              {
                key: `${selectedMetric}_predicted`,
                name: 'AI Prediction',
                color: selectedMetricInfo?.color || '#0066CC',
                isPrediction: true,
              },
            ]}
          />
        </ChartCard>
      </div>

      {/* AI Insights & Recommendations */}
      {aiInsights && (
        <div ref={recommendationsRef} className="mb-6 space-y-6 scroll-mt-20">
          {/* Next Hour Prediction & Efficiency Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Hour Prediction */}
            <div className="card bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 border-purple-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Next Hour Prediction</h3>
                  <p className="text-sm text-gray-600">Hour {aiInsights.ai_predictions.next_hour_prediction.hour}:00</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Predicted Consumption</span>
                  <span className="text-lg font-bold text-gray-900">
                    {aiInsights.ai_predictions.next_hour_prediction.predicted_consumption_kwh.toFixed(2)} kWh
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Estimated Cost</span>
                  <span className="text-lg font-bold text-primary">
                    €{aiInsights.ai_predictions.next_hour_prediction.estimated_cost_eur.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Primary Source</span>
                  <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold capitalize">
                    {aiInsights.ai_predictions.next_hour_prediction.primary_source}
                  </span>
                </div>
              </div>
            </div>

            {/* Efficiency Score */}
            <div className="card bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Efficiency Score</h3>
                  <p className="text-sm text-gray-600">Current performance</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(aiInsights.ai_predictions.insights.efficiency_score / 100) * 351.86} 351.86`}
                      className="text-green-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {aiInsights.ai_predictions.insights.efficiency_score}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Current Trend</p>
                  <span className="px-4 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold capitalize">
                    {aiInsights.ai_predictions.insights.current_trend}
                  </span>
                </div>
                {aiInsights.ai_predictions.insights.peak_hours_today.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600 mb-2">Peak Hours Today</p>
                    <div className="flex gap-2 justify-center">
                      {aiInsights.ai_predictions.insights.peak_hours_today.map((hour) => (
                        <span key={hour} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                          {hour}:00
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="card bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
                <p className="text-sm text-gray-600">Personalized energy optimization suggestions</p>
              </div>
            </div>
            
            {insightsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                <span className="text-gray-600">Loading recommendations...</span>
              </div>
            ) : aiInsights?.ai_predictions.recommendations && aiInsights.ai_predictions.recommendations.length > 0 ? (
              <div className="space-y-4">
                {aiInsights.ai_predictions.recommendations.map((recommendation, index) => {
                  const priorityConfig = {
                    high: {
                      color: 'red',
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      text: 'text-red-800',
                      icon: AlertTriangle,
                      badge: 'bg-red-500 text-white',
                    },
                    medium: {
                      color: 'orange',
                      bg: 'bg-orange-50',
                      border: 'border-orange-200',
                      text: 'text-orange-800',
                      icon: Info,
                      badge: 'bg-orange-500 text-white',
                    },
                    low: {
                      color: 'blue',
                      bg: 'bg-blue-50',
                      border: 'border-blue-200',
                      text: 'text-blue-800',
                      icon: CheckCircle2,
                      badge: 'bg-blue-500 text-white',
                    },
                  }
                  
                  const config = priorityConfig[recommendation.priority]
                  const PriorityIcon = config.icon
                  
                  return (
                    <div
                      key={index}
                      className={`${config.bg} ${config.border} border-2 rounded-xl p-5 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 ${config.badge} rounded-lg flex-shrink-0`}>
                          <PriorityIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 ${config.badge} rounded-full text-xs font-bold uppercase`}>
                                {recommendation.priority} Priority
                              </span>
                            </div>
                            <div className="text-lg font-bold text-green-700">
                              €{recommendation.potential_savings_eur.toFixed(2)}
                            </div>
                          </div>
                          <h4 className={`font-semibold text-gray-900 mb-2 ${config.text}`}>
                            {recommendation.action}
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {recommendation.reason}
                          </p>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Potential Savings</span>
                              <span className="text-sm font-semibold text-green-700">
                                Save up to €{recommendation.potential_savings_eur.toFixed(2)} per hour
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recommendations available at this time.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cost Optimization Scenarios */}
      <div className="mb-6">
        <ChartCard 
          title="Cost Optimization Scenarios"
          subtitle="AI-powered investment analysis and ROI projections"
        >
          <div className="space-y-6">
            {/* Scenario Selector */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Optimization Scenario</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { key: 'add_battery', label: 'Add Battery', icon: Battery, selectedClass: 'border-blue-500 bg-blue-50', iconClass: 'text-blue-600', textClass: 'text-blue-900' },
                  { key: 'add_solar', label: 'Add Solar', icon: Sun, selectedClass: 'border-yellow-500 bg-yellow-50', iconClass: 'text-yellow-600', textClass: 'text-yellow-900' },
                  { key: 'upgrade_hvac', label: 'Upgrade HVAC', icon: Zap, selectedClass: 'border-green-500 bg-green-50', iconClass: 'text-green-600', textClass: 'text-green-900' },
                  { key: 'change_tariff', label: 'Change Tariff', icon: DollarSign, selectedClass: 'border-purple-500 bg-purple-50', iconClass: 'text-purple-600', textClass: 'text-purple-900' },
                  { key: 'add_ev_charger', label: 'Add EV Charger', icon: Zap, selectedClass: 'border-orange-500 bg-orange-50', iconClass: 'text-orange-600', textClass: 'text-orange-900' },
                ].map((scenario) => {
                  const Icon = scenario.icon
                  const isSelected = selectedScenario === scenario.key
                  return (
                    <button
                      key={scenario.key}
                      onClick={() => handleScenarioChange(scenario.key)}
                      disabled={optimizationLoading}
                      className={`
                        p-3 rounded-lg border-2 transition-all text-left
                        ${isSelected 
                          ? `${scenario.selectedClass} shadow-md` 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                        ${optimizationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <Icon className={`h-5 w-5 mb-1 ${isSelected ? scenario.iconClass : 'text-gray-600'}`} />
                      <div className={`text-xs font-medium ${isSelected ? scenario.textClass : 'text-gray-700'}`}>
                        {scenario.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Optimization Results */}
            {optimizationLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin mr-3" />
                <span className="text-gray-600">Analyzing cost optimization scenario...</span>
              </div>
            ) : costOptimization ? (
              <div className="space-y-4">
                {/* Recommendation Verdict */}
                <div className={`
                  p-4 rounded-lg border-2
                  ${costOptimization.analysis.recommendation.verdict === 'recommended' 
                    ? 'bg-green-50 border-green-200' 
                    : costOptimization.analysis.recommendation.verdict === 'conditional'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                  }
                `}>
                  <div className="flex items-start gap-3">
                    {costOptimization.analysis.recommendation.verdict === 'recommended' ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : costOptimization.analysis.recommendation.verdict === 'conditional' ? (
                      <AlertCircleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">
                          {costOptimization.analysis.scenario_name}
                        </h4>
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-bold uppercase
                          ${costOptimization.analysis.recommendation.verdict === 'recommended' 
                            ? 'bg-green-200 text-green-800' 
                            : costOptimization.analysis.recommendation.verdict === 'conditional'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                          }
                        `}>
                          {costOptimization.analysis.recommendation.verdict.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {costOptimization.analysis.recommendation.reasoning}
                      </p>
                      {costOptimization.analysis.recommendation.best_time_to_implement && (
                        <p className="text-xs text-gray-600 italic">
                          💡 {costOptimization.analysis.recommendation.best_time_to_implement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Investment */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-medium text-gray-600">Investment</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      €{costOptimization.analysis.investment_summary.total_investment_eur.toLocaleString()}
                    </p>
                  </div>

                  {/* Annual Savings */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                      <span className="text-xs font-medium text-gray-600">Annual Savings</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      €{costOptimization.analysis.savings_projection.annual_cost_savings_eur.toLocaleString()}
                    </p>
                  </div>

                  {/* Payback Period */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="text-xs font-medium text-gray-600">Payback Period</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {costOptimization.analysis.roi_analysis.payback_period_years.toFixed(1)} yrs
                    </p>
                  </div>

                  {/* ROI */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="text-xs font-medium text-gray-600">ROI</span>
                    </div>
                    <p className={`text-2xl font-bold ${costOptimization.analysis.roi_analysis.roi_percentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {costOptimization.analysis.roi_analysis.roi_percentage >= 0 ? '+' : ''}
                      {costOptimization.analysis.roi_analysis.roi_percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Savings Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Monthly Savings</p>
                    <p className="text-xl font-bold text-gray-900">
                      €{costOptimization.analysis.savings_projection.monthly_savings_eur.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Energy Savings (Annual)</p>
                    <p className="text-xl font-bold text-gray-900">
                      {costOptimization.analysis.savings_projection.annual_energy_savings_kwh.toLocaleString()} kWh
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">CO₂ Reduction</p>
                    <p className="text-xl font-bold text-green-700 flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      {costOptimization.analysis.environmental_impact.co2_reduction_kg_year.toLocaleString()} kg/yr
                    </p>
                  </div>
                </div>

                {/* 5-Year Projection Preview */}
                {costOptimization.analysis.five_year_projection && costOptimization.analysis.five_year_projection.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">5-Year Projection</h5>
                    <div className="space-y-2">
                      {costOptimization.analysis.five_year_projection.slice(0, 3).map((year) => (
                        <div key={year.year} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Year {year.year}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-700">Savings: €{year.cumulative_savings_eur.toLocaleString()}</span>
                            <span className={`font-semibold ${year.net_benefit_eur >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                              Net: €{year.net_benefit_eur.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {costOptimization.analysis.five_year_projection.length > 3 && (
                        <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                          + {costOptimization.analysis.five_year_projection.length - 3} more years...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 italic">
                  {costOptimization.disclaimer}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Select a scenario above to see cost optimization analysis</p>
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{data.period.hours}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">{data.data.length}</p>
            </div>
            <Brain className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Historical</p>
              <p className="text-2xl font-bold text-gray-900">{historicalData.length}</p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Predicted</p>
              <p className="text-2xl font-bold text-gray-900">{predictedData.length}</p>
            </div>
            <Sun className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.systems.map((system) => (
            <div key={system.location} className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {system.location.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500">{system.unit}</span>
              </div>
              <p className="text-xs text-gray-600">{system.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Sign Convention:</span> {data.sign_convention.negative} (negative), {data.sign_convention.positive} (positive)
          </p>
        </div>
      </div>
    </AppShell>
  )
}

