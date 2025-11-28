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

  // CRITICAL FIX: Ensure only ONE direction for grid flow at a time
  const isImporting = grid.import > 0.01 // Small threshold to avoid floating point issues
  const isExporting = grid.export > 0.01 && !isImporting // Export only if NOT importing

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

      {/* Sun - simple icon only */}
      {solar.production > 0 && (
        <motion.div
          className="absolute top-8 right-8 z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <Sun className="h-20 w-20 text-yellow-400 drop-shadow-2xl" fill="currentColor" />
        </motion.div>
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
            isImporting
              ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-600' 
              : isExporting
              ? 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-600'
              : 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-600'
          }`}>
            <Zap className="h-10 w-10 text-white" />
            {isImporting ? (
              <TrendingDown className="absolute -top-2 -right-2 h-6 w-6 text-red-600 bg-white rounded-full p-1" />
            ) : isExporting ? (
              <TrendingUp className="absolute -top-2 -right-2 h-6 w-6 text-green-600 bg-white rounded-full p-1" />
            ) : null}
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-gray-300 whitespace-nowrap">
            <p className="text-xs font-bold text-gray-600">Grid</p>
            <p className={`text-sm font-bold ${isImporting ? 'text-yellow-600' : isExporting ? 'text-cyan-600' : 'text-gray-600'}`}>
              {isImporting ? `↓ ${grid.import.toFixed(1)}` : isExporting ? `↑ ${grid.export.toFixed(1)}` : '0.0'} kW
            </p>
          </div>
          
          {/* Connection line from grid to main flow */}
          {isImporting && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-yellow-500/30 to-transparent" />
          )}
          {isExporting && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-t from-cyan-500/30 to-transparent" />
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
            
            {/* Solar Panels on Roof with data */}
            <g className="cursor-pointer" onClick={() => onZoneClick?.('solar')}>
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
              {/* Solar production label on panels */}
              <foreignObject x="200" y="40" width="100" height="40">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg text-center">
                  {solar.production.toFixed(1)} kW
                </div>
              </foreignObject>
            </g>

            {/* House Body - More transparent */}
            <rect
              x="70"
              y="160"
              width="360"
              height="240"
              fill="url(#houseGradient)"
              fillOpacity="0.4"
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

            {/* Garage - More visible */}
            <rect x="430" y="200" width="120" height="200" fill="#e5e5e5" fillOpacity="0.8" stroke="#333" strokeWidth="4" />
            <rect x="445" y="250" width="90" height="140" fill="#555" fillOpacity="0.3" stroke="#333" strokeWidth="3" />
            {/* Garage door lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="445" y1={250 + i * 28} x2="535" y2={250 + i * 28} stroke="#666" strokeWidth="2" opacity="0.5" />
            ))}
            
            {/* EV in garage - More visible */}
            <g className="cursor-pointer" onClick={() => onZoneClick?.('ev')}>
              {/* Car body */}
              <ellipse cx="490" cy="365" rx="40" ry="20" fill="#2563eb" stroke="#1e40af" strokeWidth="3" />
              <rect x="455" y="345" width="70" height="28" fill="#2563eb" stroke="#1e40af" strokeWidth="3" rx="10" />
              {/* Windows */}
              <rect x="465" y="350" width="25" height="15" fill="#87CEEB" stroke="#1e40af" strokeWidth="2" rx="3" />
              <rect x="495" y="350" width="25" height="15" fill="#87CEEB" stroke="#1e40af" strokeWidth="2" rx="3" />
              {/* Wheels */}
              <circle cx="470" cy="383" r="12" fill="#1a1a1a" stroke="#333" strokeWidth="3" />
              <circle cx="470" cy="383" r="6" fill="#666" />
              <circle cx="510" cy="383" r="12" fill="#1a1a1a" stroke="#333" strokeWidth="3" />
              <circle cx="510" cy="383" r="6" fill="#666" />
              {/* Headlights */}
              <circle cx="525" cy="360" r="3" fill="#FFD700" />
              {/* Charging indicator */}
              {ev.charging && (
                <motion.g
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <circle cx="490" cy="355" r="12" fill="#10b981" opacity="0.9" />
                  <path d="M 485 350 L 490 355 L 487 355 L 492 362 L 487 357 L 490 357 Z" fill="#fff" />
                </motion.g>
              )}
              {/* EV label */}
              <text x="490" y="400" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563eb">
                EV {ev.soc.toFixed(0)}%
              </text>
            </g>

            <defs>
              <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central consumption indicator */}
          <motion.div
            className="absolute top-1/2 right-[-120px] transform -translate-y-1/2 z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-6 shadow-2xl border-4 border-white">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-orange-500 whitespace-nowrap">
              <p className="text-xs font-bold text-gray-600">Total Power</p>
              <p className="text-lg font-bold text-orange-600">{consumption.total.toFixed(1)} kW</p>
            </div>
          </motion.div>
        </div>

        {/* Energy Flow Connections - Proper SVG paths */}
        <svg className="absolute inset-0 pointer-events-none" width="700" height="500">
          <defs>
            {/* Gradients for energy flows */}
            <linearGradient id="solarFlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="batteryFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gridImportFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gridExportFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Connection lines (static, subtle) */}
          {solar.production > 0 && (
            <line x1="350" y1="120" x2="350" y2="250" stroke="#10b981" strokeWidth="3" strokeOpacity="0.2" strokeDasharray="5,5" />
          )}
          {battery.power !== 0 && (
            <path d="M 140 450 Q 250 400 350 350" stroke="#3b82f6" strokeWidth="3" strokeOpacity="0.2" strokeDasharray="5,5" fill="none" />
          )}
          {isImporting && (
            <path d="M 80 120 Q 200 180 320 280" stroke="#f59e0b" strokeWidth="3" strokeOpacity="0.2" strokeDasharray="5,5" fill="none" />
          )}
          {isExporting && (
            <path d="M 320 280 Q 200 180 80 120" stroke="#06b6d4" strokeWidth="3" strokeOpacity="0.2" strokeDasharray="5,5" fill="none" />
          )}

          {/* Solar to House - Vertical flow */}
          {solar.production > 0 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={`solar-${i}`}
                  cx="350"
                  cy="120"
                  r="5"
                  fill="#10b981"
                  initial={{ cy: 120, opacity: 0 }}
                  animate={{ 
                    cy: [120, 250],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </>
          )}

          {/* Battery to House - Curved path */}
          {battery.power < 0 && (
            <>
              <path id="batteryToHousePath" d="M 140 450 Q 250 400 350 350" fill="none" />
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={`battery-discharge-${i}`}
                  r="5"
                  fill="#3b82f6"
                >
                  <animateMotion
                    dur="2.5s"
                    repeatCount="indefinite"
                    begin={`${i * 0.4}s`}
                    path="M 140 450 Q 250 400 350 350"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2.5s"
                    repeatCount="indefinite"
                    begin={`${i * 0.4}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}

          {/* House to Battery - Charging */}
          {battery.power > 0 && (
            <>
              <path id="houseToBatteryPath" d="M 350 350 Q 250 400 140 450" fill="none" />
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={`battery-charge-${i}`}
                  r="5"
                  fill="#10b981"
                >
                  <animateMotion
                    dur="2.5s"
                    repeatCount="indefinite"
                    begin={`${i * 0.4}s`}
                    path="M 350 350 Q 250 400 140 450"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2.5s"
                    repeatCount="indefinite"
                    begin={`${i * 0.4}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}

          {/* Grid Import - Curved path to house - ONLY if importing */}
          {isImporting && (
            <>
              <path id="gridImportPath" d="M 80 120 Q 200 180 320 280" fill="none" />
              {[...Array(7)].map((_, i) => (
                <motion.circle
                  key={`grid-import-${i}`}
                  r="5"
                  fill="#f59e0b"
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.28}s`}
                    path="M 80 120 Q 200 180 320 280"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.28}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}

          {/* Grid Export - Curved path from house - ONLY if exporting */}
          {isExporting && (
            <>
              <path id="gridExportPath" d="M 320 280 Q 200 180 80 120" fill="none" />
              {[...Array(7)].map((_, i) => (
                <motion.circle
                  key={`grid-export-${i}`}
                  r="5"
                  fill="#06b6d4"
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.28}s`}
                    path="M 320 280 Q 200 180 80 120"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.28}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}

          {/* EV Charging - from house to garage */}
          {ev.charging && (
            <>
              <path id="evChargePath" d="M 380 350 L 550 380" fill="none" />
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={`ev-charge-${i}`}
                  r="4"
                  fill="#10b981"
                >
                  <animateMotion
                    dur="1.8s"
                    repeatCount="indefinite"
                    begin={`${i * 0.35}s`}
                    path="M 380 350 L 550 380"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="1.8s"
                    repeatCount="indefinite"
                    begin={`${i * 0.35}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}

          {/* Gas to House - if heating active */}
          {gas.heatingActive && (
            <>
              <path id="gasFlowPath" d="M 50 250 L 280 280" fill="none" />
              {[...Array(4)].map((_, i) => (
                <motion.circle
                  key={`gas-${i}`}
                  r="4"
                  fill="#a855f7"
                >
                  <animateMotion
                    dur="2.2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.55}s`}
                    path="M 50 250 L 280 280"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2.2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.55}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}

          {/* Heat Pump to House */}
          {heatPump.active && (
            <>
              <path id="heatPumpPath" d="M 580 450 Q 500 400 400 350" fill="none" />
              {[...Array(4)].map((_, i) => (
                <motion.circle
                  key={`heatpump-${i}`}
                  r="4"
                  fill="#6366f1"
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                    path="M 580 450 Q 500 400 400 350"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                  />
                </motion.circle>
              ))}
            </>
          )}
        </svg>

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
          {/* Connection line to house */}
          {battery.power !== 0 && (
            <div className="absolute top-0 right-0 w-48 h-1 bg-gradient-to-r from-blue-500/30 to-transparent transform -translate-y-20 translate-x-20" />
          )}
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
            {/* Connection line to house */}
            <div className="absolute top-0 left-0 w-48 h-1 bg-gradient-to-l from-indigo-500/30 to-transparent transform -translate-y-20 -translate-x-20" />
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
            {/* Connection line to house */}
            <div className="absolute top-1/2 right-0 w-32 h-1 bg-gradient-to-r from-purple-500/30 to-transparent transform translate-x-full" />
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
