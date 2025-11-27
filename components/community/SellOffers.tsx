'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, MapPin, Leaf, Zap } from 'lucide-react'
import { TradingOffer } from '@/types/community'

interface SellOffersProps {
  offers: TradingOffer[]
  filters: {
    timeWindow: string
    priceRange: number[]
    energyType: string
    location: string
  }
}

export default function SellOffers({ offers, filters }: SellOffersProps) {
  // Filter offers based on filters
  const filteredOffers = offers.filter(offer => {
    // Time window filter
    if (filters.timeWindow !== 'all') {
      const deliveryStart = new Date(offer.timing.delivery_start)
      const now = new Date()
      const hoursDiff = (deliveryStart.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      if (filters.timeWindow === 'now' && hoursDiff > 2) return false
      if (filters.timeWindow === 'today' && hoursDiff > 24) return false
      if (filters.timeWindow === 'week' && hoursDiff > 168) return false
    }

    // Price range filter
    if (offer.pricing.price < filters.priceRange[0] || offer.pricing.price > filters.priceRange[1]) {
      return false
    }

    // Energy type filter
    if (filters.energyType !== 'all') {
      if (filters.energyType === 'green' && !offer.energy.green_certificate) return false
      if (filters.energyType !== 'green' && offer.energy.energy_type !== filters.energyType) return false
    }

    // Location filter
    if (filters.location !== 'all' && offer.conditions.location_preference !== filters.location) {
      return false
    }

    return true
  })

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ArrowUpRight className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sell Offers</h3>
        </div>
        <span className="text-sm text-gray-600">{filteredOffers.length} offers</span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No sell offers match your filters</p>
          </div>
        ) : (
          filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Offer Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">{offer.anonymous_id}</p>
                  <p className="text-xs text-gray-500">Wants to sell</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">€{offer.pricing.price}</p>
                  <p className="text-xs text-gray-500">/kWh</p>
                </div>
              </div>

              {/* Energy Details */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Available</p>
                  <p className="text-sm font-bold text-gray-900">{offer.energy.quantity.toFixed(1)} kWh</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Time Window</p>
                  <p className="text-sm font-bold text-gray-900">{offer.timing.time_window}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {offer.energy.green_certificate && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Leaf className="h-3 w-3" />
                    <span>Green</span>
                  </span>
                )}
                {offer.energy.energy_type && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Zap className="h-3 w-3" />
                    <span>{offer.energy.energy_type}</span>
                  </span>
                )}
                {offer.conditions.location_preference && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{offer.conditions.location_preference}</span>
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{offer.timing.flexibility} flexibility</span>
                </span>
              </div>

              {/* Conditions */}
              <div className="space-y-1">
                {offer.pricing.min_price && (
                  <p className="text-xs text-gray-600">
                    Min price: €{offer.pricing.min_price}/kWh
                  </p>
                )}
                {offer.conditions.max_quantity && (
                  <p className="text-xs text-gray-600">
                    Max quantity: {offer.conditions.max_quantity} kWh
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
                Buy from this seller
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
