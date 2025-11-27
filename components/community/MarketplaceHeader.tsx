'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Clock, BarChart3 } from 'lucide-react'
import { CommunityPriceSignal } from '@/types/community'

interface MarketplaceHeaderProps {
  priceSignal: CommunityPriceSignal
  marketStats: {
    total_volume_24h: number
    average_price_24h: number
    active_offers: number
    price_range: { min: number; max: number }
  }
}

export default function MarketplaceHeader({ priceSignal, marketStats }: MarketplaceHeaderProps) {
  const getTrendIcon = () => {
    switch (priceSignal.market_conditions.price_trend) {
      case 'rising':
        return <TrendingUp className="h-5 w-5 text-red-600" />
      case 'falling':
        return <TrendingDown className="h-5 w-5 text-green-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (priceSignal.market_conditions.price_trend) {
      case 'rising':
        return 'text-red-600'
      case 'falling':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white shadow-xl">
      {/* Current Price */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100 mb-1">Current P2P Price</p>
            <div className="flex items-center space-x-3">
              <p className="text-5xl font-bold">€{priceSignal.pricing.current_p2p_price}</p>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-sm font-semibold ${getTrendColor()}`}>
                  {priceSignal.market_conditions.price_trend}
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-100 mt-1">per kWh</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-blue-100 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Updated {new Date(priceSignal.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-blue-100">Next Hour Forecast</p>
              <p className="text-2xl font-bold">€{priceSignal.forecast.next_hour_price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-xs text-blue-100">Grid Import</p>
          <p className="text-xl font-bold">€{priceSignal.pricing.grid_import_price}</p>
          <p className="text-xs text-green-200">
            Save €{((priceSignal.pricing.grid_import_price - priceSignal.pricing.current_p2p_price) * 100).toFixed(0)}/100kWh
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-xs text-blue-100">Grid Export</p>
          <p className="text-xl font-bold">€{priceSignal.pricing.grid_export_price}</p>
          <p className="text-xs text-green-200">
            Earn €{((priceSignal.pricing.current_p2p_price - priceSignal.pricing.grid_export_price) * 100).toFixed(0)}/100kWh more
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-xs text-blue-100">Supply/Demand</p>
          <p className="text-xl font-bold capitalize">{priceSignal.market_conditions.balance}</p>
          <p className="text-xs text-blue-100">
            {priceSignal.market_conditions.supply.toFixed(1)} / {priceSignal.market_conditions.demand.toFixed(1)} kWh
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-xs text-blue-100">4h Trend</p>
          <p className="text-xl font-bold capitalize">{priceSignal.forecast.next_4h_trend}</p>
          <p className="text-xs text-blue-100">
            {priceSignal.forecast.next_4h_trend === 'up' ? 'Prices rising' : 
             priceSignal.forecast.next_4h_trend === 'down' ? 'Prices falling' : 'Stable prices'}
          </p>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-5 w-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-100">24h Volume</p>
            <p className="text-lg font-bold">{marketStats.total_volume_24h.toFixed(1)} kWh</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-100">24h Avg Price</p>
            <p className="text-lg font-bold">€{marketStats.average_price_24h}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-5 w-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-100">Active Offers</p>
            <p className="text-lg font-bold">{marketStats.active_offers}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-100">Price Range</p>
            <p className="text-lg font-bold">€{marketStats.price_range.min} - €{marketStats.price_range.max}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
