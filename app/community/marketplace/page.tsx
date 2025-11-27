'use client'

import { useState, useEffect } from 'react'
import { P2PMarketData } from '@/types/community'
import { Loader2, RefreshCw } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import MarketplaceHeader from '@/components/community/MarketplaceHeader'
import BuyOffers from '@/components/community/BuyOffers'
import SellOffers from '@/components/community/SellOffers'
import OfferFilters from '@/components/community/OfferFilters'

export default function MarketplacePage() {
  const [data, setData] = useState<P2PMarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [filters, setFilters] = useState({
    timeWindow: 'all',
    priceRange: [0, 1],
    energyType: 'all',
    location: 'all'
  })

  useEffect(() => {
    fetchMarketData()
    
    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(fetchMarketData, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchMarketData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/community/market')
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data')
      }
      
      const marketData = await response.json()
      setData(marketData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching market data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading marketplace...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl border-2 border-red-200 p-8 max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Marketplace</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMarketData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
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
      <div className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">P2P Energy Marketplace</h1>
            <p className="text-gray-600 mt-1">Trade energy directly with your community members</p>
          </div>
          <button
            onClick={fetchMarketData}
            className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm font-semibold">Refresh</span>
          </button>
        </div>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-end space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Auto-refresh every 30s</span>
          </label>
        </div>

        {/* Market Price Header */}
        <MarketplaceHeader priceSignal={data.current_price} marketStats={data.market_stats} />

        {/* Filters */}
        <OfferFilters filters={filters} onFiltersChange={setFilters} />

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buy Offers */}
          <BuyOffers offers={data.buy_offers} filters={filters} />

          {/* Sell Offers */}
          <SellOffers offers={data.sell_offers} filters={filters} />
        </div>

        {/* Recent Trades */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Trades</h3>
          <div className="space-y-2">
            {data.recent_trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {trade.buyer_anonymous_id} ↔ {trade.seller_anonymous_id}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(trade.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{trade.energy.quantity.toFixed(1)} kWh</p>
                  <p className="text-xs text-gray-600">€{trade.pricing.agreed_price}/kWh</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </AppShell>
  )
}
