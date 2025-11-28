'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import ImpactCards from '@/components/sustainability/ImpactCards'
import CertificationsBadges from '@/components/sustainability/CertificationsBadges'
import Leaderboard from '@/components/sustainability/Leaderboard'
import GamificationPanel from '@/components/sustainability/GamificationPanel'
import TrendChart from '@/components/sustainability/TrendChart'
import { Leaf, RefreshCw, AlertCircle } from 'lucide-react'
import { SustainabilityMetrics } from '@/lib/utils/sustainabilityCertifications'

export default function SustainabilityPage() {
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null)
  const [leaderboard, setLeaderboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch metrics and leaderboard in parallel
      const [metricsResponse, leaderboardResponse] = await Promise.all([
        fetch('/api/sustainability/metrics', { cache: 'no-store' }),
        fetch('/api/sustainability/leaderboard', { cache: 'no-store' }),
      ])

      if (!metricsResponse.ok) {
        throw new Error('Failed to fetch sustainability metrics')
      }

      if (!leaderboardResponse.ok) {
        throw new Error('Failed to fetch leaderboard')
      }

      const metricsData = await metricsResponse.json()
      const leaderboardData = await leaderboardResponse.json()

      setMetrics(metricsData as SustainabilityMetrics)
      setLeaderboard(leaderboardData)
      setLastRefresh(new Date())
    } catch (err: any) {
      console.error('Error fetching sustainability data:', err)
      setError(err.message || 'Failed to load sustainability data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Generate mock trend data (in production, fetch from API)
  const generateTrendData = (currentValue: number, days: number = 30) => {
    const data = []
    const today = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Simulate trend with some variation
      const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
      const value = currentValue * (1 + variation * (i / days))
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value),
      })
    }
    return data
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Leaf className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading sustainability data...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !metrics) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error || 'Failed to load sustainability data'}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              Sustainability Board
            </h1>
            <p className="text-gray-600 mt-2">
              Track your environmental impact and compete with others
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Last Updated */}
        <div className="text-sm text-gray-500">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">Overall Sustainability Score</p>
              <p className="text-5xl font-bold">{metrics.overallSustainabilityScore}</p>
              <p className="text-green-100 mt-2">out of 100</p>
            </div>
            <div className="text-right">
              <p className="text-green-100 mb-2">Rank</p>
              <p className="text-4xl font-bold">#{leaderboard?.currentUserRank || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Gamification Panel */}
        <GamificationPanel metrics={metrics} />

        {/* Impact Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact Metrics</h2>
          <ImpactCards metrics={metrics} />
        </div>

        {/* Trends */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TrendChart
              title="CO₂ Avoided Trend"
              data={generateTrendData(metrics.co2Avoided)}
              color="#9333EA"
              unit="kg"
            />
            <TrendChart
              title="Energy Health Index"
              data={generateTrendData(metrics.energyHealthIndex)}
              color="#10B981"
              unit="score"
            />
            <TrendChart
              title="Renewable Energy Usage"
              data={generateTrendData(metrics.renewablePercentage)}
              color="#F59E0B"
              unit="%"
            />
          </div>
        </div>

        {/* Certifications & Badges */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications & Badges</h2>
          <CertificationsBadges metrics={metrics} />
        </div>

        {/* Leaderboard */}
        {leaderboard && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leadership Board</h2>
            <Leaderboard
              leaderboard={leaderboard.leaderboard}
              currentUserRank={leaderboard.currentUserRank}
              currentHouseId={leaderboard.currentHouseId}
            />
          </div>
        )}
      </div>
    </AppShell>
  )
}

