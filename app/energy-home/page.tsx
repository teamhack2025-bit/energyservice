'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import LiveKPIs from '@/components/energy/LiveKPIs'
import EnhancedHouseModel from '@/components/energy/EnhancedHouseModel'
import TimelineGraph from '@/components/energy/TimelineGraph'
import FinancialSummary from '@/components/energy/FinancialSummary'
import AlertsPanel from '@/components/energy/AlertsPanel'
import EnergyScore from '@/components/energy/EnergyScore'
import ComponentDetailModal from '@/components/energy/ComponentDetailModal'
import { EnergyFlow } from '@/types/energy'
import { generateTimelineData, generateFinancialSummary, generateAlerts, generateEnergyScore } from '@/lib/energyData'
import { RefreshCw, Zap, AlertCircle } from 'lucide-react'

export default function EnergyHomePage() {
  const [energyFlow, setEnergyFlow] = useState<EnergyFlow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  
  // Generate static data for other components
  const timelineData = generateTimelineData()
  const financialData = generateFinancialSummary()
  const alerts = generateAlerts()
  const energyScore = generateEnergyScore()

  async function fetchEnergyData() {
    try {
      // Fetch the full smart home data from external API
      const houseResponse = await fetch('/api/energy/smart-home')
      
      if (houseResponse.ok) {
        const houseData = await houseResponse.json()
        console.log('Received house data:', houseData)
        setEnergyFlow(houseData)
        setLastUpdate(new Date())
        setError(null)
      } else {
        console.error('Smart home API failed:', houseResponse.status)
        // Fallback to mock data if not logged in or API fails
        const mockResponse = await fetch('/api/energy/live')
        if (mockResponse.ok) {
          const data = await mockResponse.json()
          setEnergyFlow(data)
          setLastUpdate(new Date())
          setError(null)
        } else {
          throw new Error('Failed to fetch energy data')
        }
      }
    } catch (err) {
      console.error('Energy data fetch error:', err)
      setError('Failed to load energy data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnergyData()
    // Refresh every 5 seconds
    const interval = setInterval(fetchEnergyData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Zap className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading energy data...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !energyFlow) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'No energy data available'}</p>
            <button
              onClick={fetchEnergyData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <span>Smart Home Energy</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time energy monitoring and control
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-sm font-semibold text-gray-700">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            )}
            <button
              onClick={fetchEnergyData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">System Online</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">
              {energyFlow.solar.production.toFixed(1)} kW
            </span>{' '}
            solar generation
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-orange-600">
              {energyFlow.consumption.total.toFixed(1)} kW
            </span>{' '}
            total consumption
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">
              {energyFlow.battery.soc.toFixed(0)}%
            </span>{' '}
            battery charge
          </div>
        </div>
      </div>

      {/* Interactive House Model */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span>Interactive Smart Home</span>
        </h2>
        <EnhancedHouseModel energyFlow={energyFlow} onZoneClick={setSelectedZone} />
        
        {/* Component Detail Modal */}
        <ComponentDetailModal
          component={selectedZone}
          energyFlow={energyFlow}
          onClose={() => setSelectedZone(null)}
        />
      </div>

      {/* Live KPIs */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Live Metrics</h2>
        <LiveKPIs energyFlow={energyFlow} />
      </div>

      {/* Timeline Graph */}
      <div className="mb-6">
        <TimelineGraph data={timelineData} />
      </div>

      {/* Financial Summary & Energy Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <FinancialSummary data={financialData} />
        </div>
        <div>
          <EnergyScore data={energyScore} />
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="mb-6">
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900 mb-1">
              🎉 Smart Home Dashboard Complete!
            </p>
            <p className="text-sm text-green-700">
              All Phase 2 features are now live: Interactive house model with animated energy flows,
              24-hour timeline graph, financial tracking, smart alerts, and gamification with energy score & badges.
              Click on any component in the house to explore details!
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
