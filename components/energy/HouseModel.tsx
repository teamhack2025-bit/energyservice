'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { EnergyFlow } from '@/types/energy'
import { Sun, Battery, Zap, Car, Flame, Wind, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react'

interface HouseModelProps {
  energyFlow: EnergyFlow
  onZoneClick?: (zone: string) => void
}

// Energy flow line component
function EnergyFlowLine({ 
  from, 
  to, 
  power, 
  color, 
  label 
}: { 
  from: { x: number; y: number }
  to: { x: number; y: number }
  power: number
  color: string
  label: string
}) {
  if (power <= 0) return null

  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI)
  const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: from.x,
        top: from.y,
        width: distance,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
      }}
    >
      {/* Animated flow line */}
      <svg width={distance} height="4" className="absolute top-0">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="2"
          x2={distance}
          y2="2"
          stroke={`url(#gradient-${label})`}
          strokeWidth={Math.min(power * 2 + 2, 8)}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Animated particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color, top: 1 }}
          animate={{
            x: [0, distance],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Power label */}
      <div
        className="absolute whitespace-nowrap text-xs font-bold px-2 py-1 rounded-full shadow-lg"
        style={{
          backgroundColor: color,
          color: 'white',
          left: distance / 2,
          top: -20,
          transform: `translateX(-50%) rotate(-${angle}deg)`,
        }}
      >
        {power.toFixed(1)} kW
      </div>
    </div>
  )
}

export default function HouseModel({ energyFlow, onZoneClick }: HouseModelProps) {
  const { solar, battery, grid, consumption, ev, gas, heatPump } = energyFlow

  // Define positions for energy flow lines
  const positions = {
    grid: { x: 100, y: 80 },
    solar: { x: 400, y: 100 },
    house: { x: 400, y: 300 },
    battery: { x: 200, y: 450 },
    ev: { x: 600, y: 450 },
  }

  return (
    <div className="relative bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-2xl p-8 overflow-hidden border-2 border-gray-300 shadow-xl">
      {/* Animated clouds */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-10 bg-white/60 rounded-full blur-sm"
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-20 right-20 w-24 h-12 bg-white/50 rounded-full blur-sm"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sun with rays */}
      {solar.production > 0 && (
        <div className="absolute top-8 right-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Sun className="h-20 w-20 text-yellow-400 drop-shadow-2xl" fill="currentColor" />
          </motion.div>
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-8 bg-yellow-300 origin-bottom"
              style={{
                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Grid Connection (top left) */}
      <div
        className="absolute top-8 left-8 cursor-pointer group"
        onClick={() => onZoneClick?.('grid')}
      >
        <div className="relative">
          <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-yellow-400 group-hover:scale-110 transition-transform">
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold">
              {grid.import > 0 ? (
                <span className="text-yellow-600">↓ {grid.import} kW</span>
              ) : (
                <span className="text-cyan-600">↑ {grid.export} kW</span>
              )}
            </div>
          </div>
          {/* Animated flow to/from grid */}
          {grid.import > 0 && (
            <svg className="absolute top-full left-1/2 transform -translate-x-1/2" width="4" height="100">
              <motion.circle
                cx="2"
                cy="0"
                r="3"
                fill="#F59E0B"
                animate={{ cy: [0, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          )}
        </div>
      </div>

      {/* House Structure */}
      <div className="relative mx-auto" style={{ width: '500px', height: '400px' }}>
        {/* Roof with Solar Panels */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 cursor-pointer group"
          onClick={() => onZoneClick?.('solar')}
        >
          <svg width="400" height="150" viewBox="0 0 400 150">
            {/* Roof */}
            <polygon
              points="200,10 380,140 20,140"
              fill="#8B4513"
              stroke="#654321"
              strokeWidth="3"
              className="group-hover:fill-amber-700 transition-colors"
            />
            {/* Solar Panels */}
            {solar.production > 0 && (
              <>
                <rect x="100" y="60" width="80" height="60" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
                <rect x="190" y="60" width="80" height="60" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
                <rect x="280" y="60" width="80" height="60" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
                {/* Solar panel grid lines */}
                <line x1="140" y1="60" x2="140" y2="120" stroke="#3b82f6" strokeWidth="1" />
                <line x1="230" y1="60" x2="230" y2="120" stroke="#3b82f6" strokeWidth="1" />
                <line x1="320" y1="60" x2="320" y2="120" stroke="#3b82f6" strokeWidth="1" />
              </>
            )}
          </svg>
          {/* Solar production badge */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ☀️ {solar.production} kW
          </div>
        </div>

        {/* House Body */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
          <svg width="360" height="250" viewBox="0 0 360 250">
            {/* Main house */}
            <rect x="40" y="10" width="280" height="240" fill="#f5f5f5" stroke="#333" strokeWidth="3" />
            
            {/* Windows - Living Room */}
            <g className="cursor-pointer hover:opacity-80" onClick={() => onZoneClick?.('living-room')}>
              <rect x="70" y="50" width="60" height="60" fill="#87CEEB" stroke="#333" strokeWidth="2" />
              <line x1="100" y1="50" x2="100" y2="110" stroke="#333" strokeWidth="2" />
              <line x1="70" y1="80" x2="130" y2="80" stroke="#333" strokeWidth="2" />
            </g>

            {/* Windows - Kitchen */}
            <g className="cursor-pointer hover:opacity-80" onClick={() => onZoneClick?.('kitchen')}>
              <rect x="150" y="50" width="60" height="60" fill="#87CEEB" stroke="#333" strokeWidth="2" />
              <line x1="180" y1="50" x2="180" y2="110" stroke="#333" strokeWidth="2" />
              <line x1="150" y1="80" x2="210" y2="80" stroke="#333" strokeWidth="2" />
            </g>

            {/* Windows - Bedroom */}
            <g className="cursor-pointer hover:opacity-80" onClick={() => onZoneClick?.('bedroom')}>
              <rect x="230" y="50" width="60" height="60" fill="#87CEEB" stroke="#333" strokeWidth="2" />
              <line x1="260" y1="50" x2="260" y2="110" stroke="#333" strokeWidth="2" />
              <line x1="230" y1="80" x2="290" y2="80" stroke="#333" strokeWidth="2" />
            </g>

            {/* Door */}
            <rect x="155" y="150" width="50" height="100" fill="#8B4513" stroke="#333" strokeWidth="2" />
            <circle cx="195" cy="200" r="3" fill="#FFD700" />

            {/* Garage */}
            <rect x="320" y="80" width="100" height="170" fill="#e5e5e5" stroke="#333" strokeWidth="3" />
            <rect x="330" y="120" width="80" height="120" fill="#666" stroke="#333" strokeWidth="2" />
            
            {/* EV in garage */}
            {ev.charging && (
              <g className="cursor-pointer" onClick={() => onZoneClick?.('ev')}>
                <ellipse cx="370" cy="210" rx="30" ry="15" fill="#3b82f6" />
                <rect x="345" y="195" width="50" height="20" fill="#3b82f6" rx="5" />
                <circle cx="355" cy="225" r="8" fill="#333" />
                <circle cx="385" cy="225" r="8" fill="#333" />
                {/* Charging indicator */}
                <motion.circle
                  cx="370"
                  cy="200"
                  r="4"
                  fill="#10b981"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Battery (bottom left of house) */}
        <div
          className="absolute bottom-8 left-8 cursor-pointer group"
          onClick={() => onZoneClick?.('battery')}
        >
          <div className="relative">
            <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-blue-400 group-hover:scale-110 transition-transform">
              <Battery className="h-10 w-10 text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{battery.soc}%</span>
              </div>
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold">
                {battery.power > 0 ? (
                  <span className="text-green-600">↑ {battery.power} kW</span>
                ) : battery.power < 0 ? (
                  <span className="text-orange-600">↓ {Math.abs(battery.power)} kW</span>
                ) : (
                  <span className="text-gray-600">Idle</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Heat Pump (bottom right) */}
        {heatPump.active && (
          <div
            className="absolute bottom-8 right-8 cursor-pointer group"
            onClick={() => onZoneClick?.('heatpump')}
          >
            <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-indigo-400 group-hover:scale-110 transition-transform">
              <Wind className="h-10 w-10 text-indigo-600" />
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold text-indigo-600">
                {heatPump.currentTemp}°C
              </div>
            </div>
          </div>
        )}

        {/* Gas Meter (left side) */}
        {gas.heatingActive && (
          <div
            className="absolute top-1/2 -left-16 transform -translate-y-1/2 cursor-pointer group"
            onClick={() => onZoneClick?.('gas')}
          >
            <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-purple-400 group-hover:scale-110 transition-transform">
              <Flame className="h-8 w-8 text-purple-600" />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold text-purple-600">
                {gas.flowRate} m³/h
              </div>
            </div>
          </div>
        )}

        {/* Consumption indicator (center of house) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="bg-white rounded-full p-4 shadow-xl border-4 border-orange-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="h-8 w-8 text-orange-600" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {consumption.total} kW
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="text-xs font-bold text-gray-700 mb-2">Energy Flow</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Solar</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Battery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Grid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Consumption</span>
          </div>
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <p className="text-xs text-blue-700">
          💡 Click on any component for details
        </p>
      </div>
    </div>
  )
}
