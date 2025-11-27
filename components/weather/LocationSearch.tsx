'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, X, Loader2 } from 'lucide-react'

interface Location {
  id: number
  name: string
  region: string
  country: string
  lat: number
  lon: number
}

interface LocationSearchProps {
  onLocationSelect: (location: string) => void
  currentLocation?: string
}

export default function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Failed to search locations:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchLocations, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (location: Location) => {
    onLocationSelect(`${location.lat},${location.lon}`)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <MapPin className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-700">
          {currentLocation || 'Change Location'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city or location..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('')
                    setResults([])
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-500">
                No locations found
              </div>
            )}

            {!loading && query.length < 2 && (
              <div className="py-8 text-center text-sm text-gray-500">
                Type at least 2 characters to search
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="py-2">
                {results.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {location.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {location.region && `${location.region}, `}
                          {location.country}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
