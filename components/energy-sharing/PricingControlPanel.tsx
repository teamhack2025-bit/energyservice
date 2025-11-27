'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Euro, TrendingUp, TrendingDown, Save, Clock, BarChart3 } from 'lucide-react'
import { GroupOverviewData } from '@/types/energy-sharing'

interface Props {
  data: GroupOverviewData
  onRefresh: () => void
}

export default function PricingControlPanel({ data, onRefresh }: Props) {
  const { rules, kpis, members } = data
  const currentRule = rules[0]
  const prosumers = members.filter(m => m.is_prosumer)
  
  const [buyPrice, setBuyPrice] = useState(currentRule?.internal_buy_price || 0.18)
  const [sellPrice, setSellPrice] = useState(currentRule?.internal_sell_price || 0.16)
  const [pricingModel, setPricingModel] = useState<'flat' | 'time_of_use'>('flat')

  const gridImportPrice = 0.28
  const gridExportPrice = 0.08

  const savingsPerKwh = gridImportPrice - buyPrice
  const earningsPerKwh = sellPrice - gridExportPrice

  return (
    <div className="space-y-6">
      {/* Current Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingDown className="h-8 w-8 text-green-600" />
            <span className="text-xs font-semibold px-2 py-1 bg-green-200 text-green-700 rounded-full">
              BUY
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-700">Internal Buy Price</h3>
          <p className="text-3xl font-bold text-green-600">€{buyPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">per kWh</p>
          <p className="text-xs text-green-600 mt-2 font-semibold">
            Save €{savingsPerKwh.toFixed(2)}/kWh vs grid
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-700 rounded-full">
              SELL
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-700">Internal Sell Price</h3>
          <p className="text-3xl font-bold text-blue-600">€{sellPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">per kWh</p>
          <p className="text-xs text-blue-600 mt-2 font-semibold">
            Earn €{earningsPerKwh.toFixed(2)}/kWh more vs grid
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <span className="text-xs font-semibold px-2 py-1 bg-purple-200 text-purple-700 rounded-full">
              MARGIN
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-700">Price Spread</h3>
          <p className="text-3xl font-bold text-purple-600">€{(buyPrice - sellPrice).toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">per kWh</p>
          <p className="text-xs text-purple-600 mt-2 font-semibold">
            {((buyPrice - sellPrice) / buyPrice * 100).toFixed(1)}% margin
          </p>
        </div>
      </div>

      {/* Pricing Model Selection */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setPricingModel('flat')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              pricingModel === 'flat'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Euro className="h-6 w-6 text-blue-600" />
              {pricingModel === 'flat' && (
                <span className="text-xs font-semibold px-2 py-1 bg-blue-600 text-white rounded-full">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Flat Rate</h4>
            <p className="text-sm text-gray-600">
              Single price for all hours. Simple and predictable for all members.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setPricingModel('time_of_use')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              pricingModel === 'time_of_use'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Clock className="h-6 w-6 text-purple-600" />
              {pricingModel === 'time_of_use' && (
                <span className="text-xs font-semibold px-2 py-1 bg-purple-600 text-white rounded-full">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Time of Use</h4>
            <p className="text-sm text-gray-600">
              Different prices for peak and off-peak hours. Encourages load shifting.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Price Configuration */}
      {pricingModel === 'flat' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Configure Flat Rate Pricing</h3>
          
          <div className="space-y-6">
            {/* Buy Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Internal Buy Price (Members pay)
                </label>
                <span className="text-2xl font-bold text-green-600">€{buyPrice.toFixed(2)}/kWh</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.25"
                step="0.01"
                value={buyPrice}
                onChange={(e) => setBuyPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>€0.10</span>
                <span className="text-red-600">Grid: €{gridImportPrice}</span>
                <span>€0.25</span>
              </div>
            </div>

            {/* Sell Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Internal Sell Price (Prosumers earn)
                </label>
                <span className="text-2xl font-bold text-blue-600">€{sellPrice.toFixed(2)}/kWh</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.20"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>€0.05</span>
                <span className="text-red-600">Grid: €{gridExportPrice}</span>
                <span>€0.20</span>
              </div>
            </div>

            {/* Impact Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border-2 border-blue-200">
              <h4 className="font-bold text-gray-900 mb-4">Impact Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly savings for consumers</p>
                  <p className="text-2xl font-bold text-green-600">
                    €{(savingsPerKwh * (kpis.internal_sharing_kwh / members.length)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">per member (avg)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly earnings for prosumers</p>
                  <p className="text-2xl font-bold text-blue-600">
                    €{(earningsPerKwh * (kpis.internal_sharing_kwh / prosumers.length)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">per prosumer (avg)</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg flex items-center justify-center space-x-2 shadow-lg">
              <Save className="h-5 w-5" />
              <span>Save Pricing Changes</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Grid Price Comparison */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Grid Price Comparison</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Grid Import Price</p>
              <p className="text-xs text-gray-600">Standard retail tariff</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">€{gridImportPrice}</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Grid Export Price</p>
              <p className="text-xs text-gray-600">Feed-in tariff</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">€{gridExportPrice}</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div>
              <p className="font-semibold text-green-900">Your Community Advantage</p>
              <p className="text-xs text-green-600">Total savings potential</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              €{((gridImportPrice - buyPrice) + (sellPrice - gridExportPrice)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
