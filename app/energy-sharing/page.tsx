'use client'

import { useState, useEffect } from 'react'
import { GroupOverviewData } from '@/types/energy-sharing'
import { Loader2 } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import EnergySharingDashboard from '@/components/energy-sharing/EnergySharingDashboard'

export default function EnergySharingPage() {
  const [data, setData] = useState<GroupOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(false) // Don't show loading on refresh
      const response = await fetch('/api/energy-sharing/overview')
      if (!response.ok) throw new Error('Failed to fetch data')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading Energy Sharing Group...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl border-2 border-red-200 p-8 max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Try Again
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <EnergySharingDashboard data={data} onRefresh={fetchData} />
    </AppShell>
  )
}
