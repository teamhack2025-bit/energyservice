'use client'

import { Leaf, Droplet, Wind, Zap, TrendingUp, DollarSign, Battery, Lightbulb, Thermometer, Home, Car, Activity } from 'lucide-react'

interface ImpactCard {
  id: string
  title: string
  value: string | number
  unit: string
  icon: any
  color: string
  bgColor: string
  trend?: number
  description?: string
}

interface ImpactCardsProps {
  metrics: {
    treesSaved: number
    waterSaved: number
    co2Avoided: number
    energySavedVsPeers: number
    renewablePercentage: number
    peakLoadReduction: number
    deviceEfficiencyScore: number
    carbonNeutralityProgress: number
    energyHealthIndex: number
    annualEnergyReduction: number
    costSavings: number
    standbyReduction: number
    evChargingEfficiency: number
    lightingEfficiencyScore: number
    hvacEfficiencyIndex: number
    applianceHealthRating: number
  }
}

export default function ImpactCards({ metrics }: ImpactCardsProps) {
  const cards: ImpactCard[] = [
    {
      id: 'trees',
      title: 'Trees Saved',
      value: metrics.treesSaved,
      unit: 'trees',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'CO₂ equivalent conversion',
    },
    {
      id: 'water',
      title: 'Water Saved',
      value: metrics.waterSaved,
      unit: 'liters',
      icon: Droplet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Water conserved through energy savings',
    },
    {
      id: 'co2',
      title: 'CO₂ Avoided',
      value: metrics.co2Avoided,
      unit: 'kg',
      icon: Wind,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Carbon emissions avoided',
    },
    {
      id: 'energy-peers',
      title: 'Energy Saved vs Peers',
      value: metrics.energySavedVsPeers,
      unit: '%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: `You saved more than ${metrics.energySavedVsPeers}% of users`,
    },
    {
      id: 'renewable',
      title: 'Renewable Energy',
      value: metrics.renewablePercentage,
      unit: '%',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Percentage from renewable sources',
    },
    {
      id: 'peak-load',
      title: 'Peak Load Reduction',
      value: metrics.peakLoadReduction,
      unit: '%',
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Energy shifted from peak hours',
    },
    {
      id: 'device-efficiency',
      title: 'Device Efficiency',
      value: metrics.deviceEfficiencyScore,
      unit: '/100',
      icon: Battery,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Smart device efficiency score',
    },
    {
      id: 'carbon-neutrality',
      title: 'Carbon Neutrality Progress',
      value: metrics.carbonNeutralityProgress,
      unit: '%',
      icon: Leaf,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Progress towards carbon neutrality',
    },
    {
      id: 'energy-health',
      title: 'Energy Health Index',
      value: metrics.energyHealthIndex,
      unit: '/100',
      icon: Home,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Overall home energy health rating',
    },
    {
      id: 'annual-reduction',
      title: 'Annual Energy Reduction',
      value: metrics.annualEnergyReduction,
      unit: '%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Year-on-year improvement',
    },
    {
      id: 'cost-savings',
      title: 'Cost Savings',
      value: metrics.costSavings,
      unit: '€',
      icon: DollarSign,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Energy bill savings',
    },
    {
      id: 'standby-reduction',
      title: 'Standby Power Reduction',
      value: metrics.standbyReduction,
      unit: '%',
      icon: Battery,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Reduced unnecessary standby usage',
    },
    {
      id: 'ev-efficiency',
      title: 'EV Charging Efficiency',
      value: metrics.evChargingEfficiency,
      unit: '/100',
      icon: Car,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Electric vehicle charging optimization',
    },
    {
      id: 'lighting-efficiency',
      title: 'Lighting Efficiency',
      value: metrics.lightingEfficiencyScore,
      unit: '/100',
      icon: Lightbulb,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      description: 'LED usage and optimized patterns',
    },
    {
      id: 'hvac-efficiency',
      title: 'HVAC Efficiency',
      value: metrics.hvacEfficiencyIndex,
      unit: '/100',
      icon: Thermometer,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Heating & cooling optimization',
    },
    {
      id: 'appliance-health',
      title: 'Appliance Health Rating',
      value: metrics.applianceHealthRating,
      unit: '/100',
      icon: Home,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      description: 'Health and efficiency of appliances',
    },
  ]

  const formatValue = (value: number, unit: string): string => {
    if (unit === '€') {
      return `€${value.toFixed(2)}`
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`
    }
    if (unit === '/100') {
      return `${value}`
    }
    if (value >= 1000 && unit === 'liters') {
      return `${(value / 1000).toFixed(2)}k`
    }
    return value.toFixed(2)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.color} p-2 rounded-lg bg-white`}>
                <Icon className="h-6 w-6" />
              </div>
              {card.trend !== undefined && (
                <span
                  className={`text-sm font-medium ${
                    card.trend >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {card.trend >= 0 ? '↑' : '↓'} {Math.abs(card.trend)}%
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatValue(card.value as number, card.unit)}
              {card.unit !== '/100' && <span className="text-lg text-gray-500 ml-1">{card.unit}</span>}
            </p>
            {card.description && (
              <p className="text-xs text-gray-500 mt-2">{card.description}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

