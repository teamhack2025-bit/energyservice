'use client'

import { useState } from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle, X, ChevronRight } from 'lucide-react'
import { EnergyAlert } from '@/types/energy'
import { motion, AnimatePresence } from 'framer-motion'
import ClientTime from '@/components/common/ClientTime'

interface AlertsPanelProps {
  alerts: EnergyAlert[]
  onDismiss?: (id: string) => void
}

export default function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const handleDismiss = (id: string) => {
    setDismissedAlerts(prev => new Set([...prev, id]))
    onDismiss?.(id)
  }

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id) && !alert.dismissed)

  const getAlertIcon = (type: EnergyAlert['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'error':
        return XCircle
      case 'info':
      default:
        return Info
    }
  }

  const getAlertColors = (type: EnergyAlert['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          text: 'text-green-900',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-900',
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          text: 'text-red-900',
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
        }
    }
  }

  if (visibleAlerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="text-lg font-semibold text-gray-900 mb-1">All Clear!</p>
        <p className="text-sm text-gray-600">No alerts or recommendations at the moment.</p>
      </div>
    )
  }

  // return (
  //   <div className="space-y-3">
  //     <div className="flex items-center justify-between mb-4">
  //       <h3 className="text-xl font-bold text-gray-900">Smart Alerts & Recommendations</h3>
  //       <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
  //         {visibleAlerts.length} Active
  //       </span>
  //     </div>

  //     <AnimatePresence>
  //       {visibleAlerts.map((alert) => {
  //         const Icon = getAlertIcon(alert.type)
  //         const colors = getAlertColors(alert.type)

  //         return (
  //           <motion.div
  //             key={alert.id}
  //             initial={{ opacity: 0, x: -20 }}
  //             animate={{ opacity: 1, x: 0 }}
  //             exit={{ opacity: 0, x: 20 }}
  //             className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4 hover:shadow-md transition-all`}
  //           >
  //             <div className="flex items-start space-x-3">
  //               <div className={`flex-shrink-0 ${colors.icon}`}>
  //                 <Icon className="h-6 w-6" />
  //               </div>
  //               <div className="flex-1 min-w-0">
  //                 <div className="flex items-start justify-between mb-2">
  //                   <h4 className={`text-sm font-bold ${colors.text}`}>{alert.title}</h4>
  //                   <button
  //                     onClick={() => handleDismiss(alert.id)}
  //                     className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
  //                   >
  //                     <X className="h-4 w-4" />
  //                   </button>
  //                 </div>
  //                 <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
  //                 {alert.action && (
  //                   <button
  //                     onClick={alert.action.onClick}
  //                     className={`flex items-center space-x-2 px-4 py-2 ${colors.bg} border ${colors.border} rounded-lg hover:shadow-md transition-all text-sm font-semibold ${colors.text}`}
  //                   >
  //                     <span>{alert.action.label}</span>
  //                     <ChevronRight className="h-4 w-4" />
  //                   </button>
  //                 )}
  //                 <p className="text-xs text-gray-500 mt-2">
  //                   <ClientTime date={alert.timestamp} format="datetime" />
  //                 </p>
  //               </div>
  //             </div>
  //           </motion.div>
  //         )
  //       })}
  //     </AnimatePresence>
  //   </div>
  // )
}
