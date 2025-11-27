'use client'

import { Filter } from 'lucide-react'

interface OfferFiltersProps {
  filters: {
    timeWindow: string
    priceRange: number[]
    energyType: string
    location: string
  }
  onFiltersChange: (filters: any) => void
}

export default function OfferFilters({ filters, onFiltersChange }: OfferFiltersProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Time Window Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Window
          </label>
          <select
            value={filters.timeWindow}
            onChange={(e) => onFiltersChange({ ...filters, timeWindow: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All times</option>
            <option value="now">Next 2 hours</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Range (€/kWh)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={filters.priceRange[0]}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                priceRange: [parseFloat(e.target.value), filters.priceRange[1]] 
              })}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Min"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={filters.priceRange[1]}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                priceRange: [filters.priceRange[0], parseFloat(e.target.value)] 
              })}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Energy Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Energy Type
          </label>
          <select
            value={filters.energyType}
            onChange={(e) => onFiltersChange({ ...filters, energyType: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="green">Green certified</option>
            <option value="solar">Solar only</option>
            <option value="wind">Wind only</option>
            <option value="battery">Battery storage</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All locations</option>
            <option value="neighborhood">My neighborhood</option>
            <option value="district">My district</option>
            <option value="any">Any location</option>
          </select>
        </div>
      </div>

      {/* Reset Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onFiltersChange({
            timeWindow: 'all',
            priceRange: [0, 1],
            energyType: 'all',
            location: 'all'
          })}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
