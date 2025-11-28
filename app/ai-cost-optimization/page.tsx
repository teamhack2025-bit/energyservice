'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import ChartCard from '@/components/ui/ChartCard'
import { Calculator, Battery, Sun, Zap, DollarSign, Loader2, CheckCircle2, AlertTriangle, Info, TrendingUp, Calendar, Leaf, AlertCircle, TrendingDown } from 'lucide-react'

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

export default function AICostOptimizationPage() {
  const [costOptimization, setCostOptimization] = useState<CostOptimizationResponse | null>(null)
  const [optimizationLoading, setOptimizationLoading] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string>('add_battery')

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
    // Load default scenario on mount
    fetchCostOptimization(selectedScenario)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scenarioConfig = {
    add_battery: { label: 'Add Battery', icon: Battery, color: 'blue', selectedClass: 'border-blue-500 bg-blue-50', iconClass: 'text-blue-600', textClass: 'text-blue-900' },
    add_solar: { label: 'Add Solar', icon: Sun, color: 'yellow', selectedClass: 'border-yellow-500 bg-yellow-50', iconClass: 'text-yellow-600', textClass: 'text-yellow-900' },
    upgrade_hvac: { label: 'Upgrade HVAC', icon: Zap, color: 'green', selectedClass: 'border-green-500 bg-green-50', iconClass: 'text-green-600', textClass: 'text-green-900' },
    change_tariff: { label: 'Change Tariff', icon: DollarSign, color: 'purple', selectedClass: 'border-purple-500 bg-purple-50', iconClass: 'text-purple-600', textClass: 'text-purple-900' },
    add_ev_charger: { label: 'Add EV Charger', icon: Zap, color: 'orange', selectedClass: 'border-orange-500 bg-orange-50', iconClass: 'text-orange-600', textClass: 'text-orange-900' },
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">AI Cost Optimization</h1>
        </div>
        <p className="text-gray-600 mt-1">
          Analyze investment scenarios and ROI projections powered by AI
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="mb-6">
        <ChartCard 
          title="Select Optimization Scenario"
          subtitle="Choose an investment scenario to analyze"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(scenarioConfig).map(([key, config]) => {
              const Icon = config.icon
              const isSelected = selectedScenario === key
              return (
                <button
                  key={key}
                  onClick={() => handleScenarioChange(key)}
                  disabled={optimizationLoading}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${isSelected 
                      ? `${config.selectedClass} shadow-md` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                    ${optimizationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
                  `}
                >
                  <Icon className={`h-6 w-6 mb-2 ${isSelected ? config.iconClass : 'text-gray-600'}`} />
                  <div className={`text-sm font-semibold ${isSelected ? config.textClass : 'text-gray-700'}`}>
                    {config.label}
                  </div>
                </button>
              )
            })}
          </div>
        </ChartCard>
      </div>

      {/* Optimization Results */}
      {optimizationLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing cost optimization scenario...</p>
          </div>
        </div>
      ) : costOptimization ? (
        <div className="space-y-6">
          {/* Recommendation Verdict */}
          <div className={`
            card border-2 shadow-lg
            ${costOptimization.analysis.recommendation.verdict === 'recommended' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
              : costOptimization.analysis.recommendation.verdict === 'conditional'
              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
            }
          `}>
            <div className="flex items-start gap-4">
              {costOptimization.analysis.recommendation.verdict === 'recommended' ? (
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              ) : costOptimization.analysis.recommendation.verdict === 'conditional' ? (
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              ) : (
                <div className="p-3 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {costOptimization.analysis.scenario_name}
                  </h3>
                  <span className={`
                    px-4 py-2 rounded-full text-sm font-bold uppercase
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
                <p className="text-base text-gray-700 mb-3 leading-relaxed">
                  {costOptimization.analysis.recommendation.reasoning}
                </p>
                {costOptimization.analysis.recommendation.best_time_to_implement && (
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">💡 Best Time to Implement:</span> {costOptimization.analysis.recommendation.best_time_to_implement}
                    </p>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                  <span>Confidence: <span className="font-semibold">{costOptimization.analysis.recommendation.confidence}</span></span>
                  <span>Priority Score: <span className="font-semibold">{costOptimization.analysis.recommendation.priority_score}/100</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Investment */}
            <ChartCard title="Investment" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    €{costOptimization.analysis.investment_summary.total_investment_eur.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Upfront: €{costOptimization.analysis.investment_summary.upfront_cost_eur.toLocaleString()}
                  </p>
                </div>
              </div>
              {costOptimization.analysis.investment_summary.financing_options.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Financing Options:</p>
                  <div className="flex gap-2">
                    {costOptimization.analysis.investment_summary.financing_options.map((option) => (
                      <span key={option} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Annual Savings */}
            <ChartCard title="Annual Savings" className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    €{costOptimization.analysis.savings_projection.annual_cost_savings_eur.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Monthly: €{costOptimization.analysis.savings_projection.monthly_savings_eur.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-xs text-gray-600">
                  Energy Savings: <span className="font-semibold">{costOptimization.analysis.savings_projection.annual_energy_savings_kwh.toLocaleString()} kWh/year</span>
                </p>
              </div>
            </ChartCard>

            {/* Payback Period */}
            <ChartCard title="Payback Period" className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {costOptimization.analysis.roi_analysis.payback_period_years.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Years</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                  Break-even point for investment
                </p>
              </div>
            </ChartCard>

            {/* ROI */}
            <ChartCard title="Return on Investment" className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className={`text-3xl font-bold ${costOptimization.analysis.roi_analysis.roi_percentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {costOptimization.analysis.roi_analysis.roi_percentage >= 0 ? '+' : ''}
                    {costOptimization.analysis.roi_analysis.roi_percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    IRR: {costOptimization.analysis.roi_analysis.internal_rate_of_return.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className={`text-xs ${costOptimization.analysis.roi_analysis.net_present_value_eur >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  NPV: €{costOptimization.analysis.roi_analysis.net_present_value_eur.toLocaleString()}
                </p>
              </div>
            </ChartCard>
          </div>

          {/* 5-Year Projection */}
          <ChartCard title="5-Year Financial Projection">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Year</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Cumulative Savings</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Cumulative Cost</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Net Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {costOptimization.analysis.five_year_projection.map((year) => (
                    <tr key={year.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Year {year.year}</td>
                      <td className="py-3 px-4 text-sm text-right text-green-700 font-semibold">
                        €{year.cumulative_savings_eur.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        €{year.cumulative_cost_eur.toLocaleString()}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-bold ${year.net_benefit_eur >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        €{year.net_benefit_eur.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Environmental Impact & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Environmental Impact */}
            <ChartCard title="Environmental Impact" className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">CO₂ Reduction</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">
                    {costOptimization.analysis.environmental_impact.co2_reduction_kg_year.toLocaleString()} kg/year
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Trees Equivalent</span>
                  <span className="text-lg font-bold text-green-700">
                    {costOptimization.analysis.environmental_impact.trees_equivalent.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Renewable Increase</span>
                  <span className="text-lg font-bold text-green-700">
                    +{costOptimization.analysis.environmental_impact.renewable_percentage}%
                  </span>
                </div>
              </div>
            </ChartCard>

            {/* Risks */}
            <ChartCard title="Risks & Mitigation">
              <div className="space-y-3">
                {costOptimization.analysis.risks.map((risk, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{risk.risk}</span>
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${risk.severity === 'high' ? 'bg-red-100 text-red-800' : 
                          risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}
                      `}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Alternatives */}
          {costOptimization.analysis.alternatives && costOptimization.analysis.alternatives.length > 0 && (
            <ChartCard title="Alternative Options">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {costOptimization.analysis.alternatives.map((alternative, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{alternative.option}</h4>
                      <span className="text-sm font-bold text-gray-700">€{alternative.cost_eur.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-green-700 mb-1">Pros:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {alternative.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-600">✓</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-700 mb-1">Cons:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {alternative.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-red-600">✗</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 italic">{costOptimization.disclaimer}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Select a scenario above to see cost optimization analysis</p>
        </div>
      )}
    </AppShell>
  )
}

