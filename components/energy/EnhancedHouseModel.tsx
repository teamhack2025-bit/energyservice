'use client'

import { motion } from 'framer-motion'
import { EnergyFlow } from '@/types/energy'
import { Sun, Battery, Zap, Car, Flame, Wind, TrendingUp, TrendingDown } from 'lucide-react'

interface EnhancedHouseModelProps {
  energyFlow: EnergyFlow
  onZoneClick?: (zone: string) => void
}

export default function EnhancedHouseModel({ energyFlow, onZoneClick }: EnhancedHouseModelProps) {
  const { solar, battery, grid, consumption, ev, gas, heatPump } = energyFlow

  return (
    <div className="relative bg-gradient-to-b from-sky-300 via-sky-100 to-green-50 rounded-3xl p-8 overflow-hidden border-4 border-gray-300 shadow-2xl min-h-[600px]">
      {/* Time of day indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-bold text-gray-700">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Animated clouds */}
      <motion.div
        className="absolute top-12 left-20 w-24 h-12 bg-white/70 rounded-full blur-md"
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-24 right-32 w-32 h-14 bg-white/60 rounded-full blur-md"
        animate={{ x: [0, -80, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sun with animated rays */}
      {solar.production > 0 && (
        <div className="absolute top-8 right-8 z-10">
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <Sun className="h-24 w-24 text-yellow-400 drop-shadow-2xl" fill="currentColor" />
            {/* Animated sun rays */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-12 bg-gradient-to-t from-yellow-300 to-transparent origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scaleY: [0.7, 1.3, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
            {solar.production.toFixed(1)} kW
          </div>
        </div>
      )}

      {/* Main container for house and components */}
      <div className="relative mx-auto mt-20" style={{ width: '700px', height: '500px' }}>
        
        {/* Grid Connection - Top Left */}
        <motion.div
          className="absolute top-0 left-0 cursor-pointer group z-20"
          onClick={() => onZoneClick?.('grid')}
          whileHover={{ scale: 1.1 }}
        >
          <div className={`relative p-5 rounded-2xl shadow-2xl border-4 transition-all ${
            grid.import > 0 
              ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-600' 
              : 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-600'
          }`}>
            <Zap className="h-10 w-10 text-white" />
            {grid.import > 0 ? (
              <TrendingDown className="absolute -top-2 -right-2 h-6 w-6 text-red-600 bg-white rounded-full p-1" />
            ) : grid.export > 0 ? (
              <TrendingUp className="absolute -top-2 -right-2 h-6 w-6 text-green-600 bg-white rounded-full p-1" />
            ) : null}
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-gray-300 whitespace-nowrap">
            <p className="text-xs font-bold text-gray-600">Grid</p>
            <p className={`text-sm font-bold ${grid.import > 0 ? 'text-yellow-600' : 'text-cyan-600'}`}>
              {grid.import > 0 ? `↓ ${grid.import.toFixed(1)}` : `↑ ${grid.export.toFixed(1)}`} kW
            </p>
          </div>
          
          {/* Enhanced animated energy flow from/to grid */}
          {grid.import > 0 && (
            <svg className="absolute top-full left-1/2 transform -translate-x-1/2" width="8" height="120">
              <defs>
                <linearGradient id="gridImportGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx="4"
                  cy="0"
                  r="5"
                  fill="url(#gridImportGradient)"
                  animate={{ cy: [0, 120], scale: [1, 1.5, 1] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.3, 
                    ease: 'easeInOut' 
                  }}
                />
              ))}
            </svg>
          )}
          {grid.export > 0 && (
            <svg className="absolute bottom-full left-1/2 transform -translate-x-1/2" width="8" height="120">
              <defs>
                <linearGradient id="gridExportGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx="4"
                  cy="120"
                  r="5"
                  fill="url(#gridExportGradient)"
                  animate={{ cy: [120, 0], scale: [1, 1.5, 1] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.3, 
                    ease: 'easeInOut' 
                  }}
                />
              ))}
            </svg>
          )}
        </motion.div>

        {/* House with Solar Panels */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <svg width="500" height="400" viewBox="0 0 500 400" className="drop-shadow-2xl">
            {/* Roof */}
            <defs>
              <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B4513" />
                <stop offset="100%" stopColor="#654321" />
              </linearGradient>
              <linearGradient id="houseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0f0f0" />
              </linearGradient>
            </defs>
            
            <polygon
              points="250,20 450,160 50,160"
              fill="url(#roofGradient)"
              stroke="#654321"
              strokeWidth="4"
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onZoneClick?.('solar')}
            />
            
            {/* Solar Panels on Roof */}
            {solar.production > 0 && (
              <g>
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <rect
                      x={120 + i * 70}
                      y={70 + i * 15}
                      width="65"
                      height="50"
                      fill="#1e3a8a"
                      stroke="#1e40af"
                      strokeWidth="3"
                      rx="3"
                    />
                    {/* Panel grid */}
                    <line x1={120 + i * 70 + 32} y1={70 + i * 15} x2={120 + i * 70 + 32} y2={120 + i * 15} stroke="#3b82f6" strokeWidth="2" />
                    <line x1={120 + i * 70} y1={95 + i * 15} x2={185 + i * 70} y2={95 + i * 15} stroke="#3b82f6" strokeWidth="2" />
                    {/* Shine effect */}
                    <motion.rect
                      x={120 + i * 70}
                      y={70 + i * 15}
                      width="65"
                      height="50"
                      fill="white"
                      opacity="0"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                  </g>
                ))}
              </g>
            )}

            {/* House Body */}
            <rect
              x="70"
              y="160"
              width="360"
              height="240"
              fill="url(#houseGradient)"
              stroke="#333"
              strokeWidth="4"
            />

            {/* Windows with realistic glass effect */}
            {[
              { x: 100, y: 190, room: 'living-room', label: 'Living' },
              { x: 200, y: 190, room: 'kitchen', label: 'Kitchen' },
              { x: 300, y: 190, room: 'bedroom', label: 'Bedroom' },
            ].map((window, i) => (
              <g
                key={i}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onZoneClick?.(window.room)}
              >
                <rect x={window.x} y={window.y} width="70" height="70" fill="#87CEEB" stroke="#333" strokeWidth="3" rx="5" />
                <rect x={window.x} y={window.y} width="70" height="70" fill="url(#windowGradient)" opacity="0.3" rx="5" />
                <line x1={window.x + 35} y1={window.y} x2={window.x + 35} y2={window.y + 70} stroke="#333" strokeWidth="3" />
                <line x1={window.x} y1={window.y + 35} x2={window.x + 70} y2={window.y + 35} stroke="#333" strokeWidth="3" />
                {/* Room label */}
                <text x={window.x + 35} y={window.y + 90} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#333">
                  {window.label}
                </text>
                {/* Power indicator */}
                <text x={window.x + 35} y={window.y + 102} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f97316">
                  {consumption.byRoom[window.label + ' Room']?.toFixed(1) || '0.0'} kW
                </text>
              </g>
            ))}

            {/* Door */}
            <rect x="215" y="290" width="70" height="110" fill="#8B4513" stroke="#333" strokeWidth="3" rx="5" />
            <circle cx="270" cy="345" r="4" fill="#FFD700" stroke="#333" strokeWidth="1" />
            <line x1="250" y1="290" x2="250" y2="400" stroke="#654321" strokeWidth="2" />

            {/* Garage */}
            <rect x="430" y="200" width="120" height="200" fill="#e5e5e5" stroke="#333" strokeWidth="4" />
            <rect x="445" y="250" width="90" height="140" fill="#555" stroke="#333" strokeWidth="3" />
            {/* Garage door lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="445" y1={250 + i * 28} x2="535" y2={250 + i * 28} stroke="#333" strokeWidth="2" />
            ))}
            
            {/* EV in garage */}
            {ev.charging && (
              <g className="cursor-pointer" onClick={() => onZoneClick?.('ev')}>
                <ellipse cx="490" cy="360" rx="35" ry="18" fill="#3b82f6" />
                <rect x="460" y="342" width="60" height="25" fill="#3b82f6" rx="8" />
                <circle cx="470" cy="378" r="10" fill="#222" stroke="#333" strokeWidth="2" />
                <circle cx="510" cy="378" r="10" fill="#222" stroke="#333" strokeWidth="2" />
                {/* Charging bolt */}
                <motion.g
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap x="475" y="345" width="20" height="20" fill="#10b981" stroke="#fff" strokeWidth="1" />
                </motion.g>
              </g>
            )}

            <defs>
              <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central consumption indicator */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-6 shadow-2xl border-4 border-white">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-orange-500 whitespace-nowrap">
              <p className="text-xs font-bold text-gray-600">Total Load</p>
              <p className="text-lg font-bold text-orange-600">{consumption.total.toFixed(1)} kW</p>
            </div>
          </motion.div>
        </div>

        {/* Battery - Bottom Left */}
        <motion.div
          className="absolute bottom-0 left-20 cursor-pointer group z-20"
          onClick={() => onZoneClick?.('battery')}
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative p-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl border-4 border-blue-700">
            <Battery className="h-12 w-12 text-white" />
            {/* Battery level indicator */}
            <div className="absolute inset-2 flex items-end justify-center pointer-events-none">
              <motion.div
                className="w-8 bg-green-400 rounded-sm"
                initial={{ height: 0 }}
                animate={{ height: `${battery.soc * 0.6}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            {/* Charging/Discharging indicator */}
            {battery.power !== 0 && (
              <motion.div
                className={`absolute -top-3 -right-3 p-2 rounded-full ${
                  battery.power > 0 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {battery.power > 0 ? (
                  <TrendingUp className="h-5 w-5 text-white" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-white" />
                )}
              </motion.div>
            )}
          </div>
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-blue-300 whitespace-nowrap">
            <p className="text-xs font-bold text-gray-600">Battery</p>
            <p className="text-sm font-bold text-blue-600">{battery.soc.toFixed(0)}%</p>
            <p className="text-xs text-gray-600">
              {battery.power > 0 ? `+${battery.power.toFixed(1)}` : battery.power.toFixed(1)} kW
            </p>
          </div>
        </motion.div>

        {/* Heat Pump - Bottom Right */}
        {heatPump.active && (
          <motion.div
            className="absolute bottom-0 right-20 cursor-pointer group z-20"
            onClick={() => onZoneClick?.('heatpump')}
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative p-5 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-2xl border-4 border-indigo-700">
              <Wind className="h-12 w-12 text-white" />
              {/* Animated air flow */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-full w-2 h-2 bg-indigo-300 rounded-full"
                  animate={{
                    x: [0, 30],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-indigo-300 whitespace-nowrap">
              <p className="text-xs font-bold text-gray-600">Heat Pump</p>
              <p className="text-sm font-bold text-indigo-600">{heatPump.currentTemp}°C</p>
              <p className="text-xs text-gray-600">{heatPump.power.toFixed(1)} kW</p>
            </div>
          </motion.div>
        )}

        {/* Gas Meter - Left Side */}
        {gas.heatingActive && (
          <motion.div
            className="absolute top-1/2 -left-16 transform -translate-y-1/2 cursor-pointer group z-20"
            onClick={() => onZoneClick?.('gas')}
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-2xl border-4 border-purple-700">
              <Flame className="h-10 w-10 text-white" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
              </motion.div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-lg shadow-lg border-2 border-purple-300 whitespace-nowrap">
              <p className="text-xs font-bold text-purple-600">{gas.flowRate.toFixed(1)} m³/h</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border-2 border-gray-300">
        <p className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <span>Energy Flow</span>
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow"></div>
            <span className="font-semibold">Solar</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow"></div>
            <span className="font-semibold">Battery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full shadow"></div>
            <span className="font-semibold">Grid Import</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow"></div>
            <span className="font-semibold">Grid Export</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow"></div>
            <span className="font-semibold">Consumption</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow"></div>
            <span className="font-semibold">Gas</span>
          </div>
        </div>
      </div>

      {/* Interaction hint */}
      <motion.div
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-sm font-bold flex items-center space-x-2">
          <span>👆</span>
          <span>Click any component for details</span>
        </p>
      </motion.div>
    </div>
  )
}
