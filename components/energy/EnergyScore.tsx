'use client'

import { Trophy, TrendingUp, Flame, Award } from 'lucide-react'
import { EnergyScore as EnergyScoreData } from '@/types/energy'
import { motion } from 'framer-motion'

interface EnergyScoreProps {
  data: EnergyScoreData
}

export default function EnergyScore({ data }: EnergyScoreProps) {
  const { score, breakdown, badges, streak } = data

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-blue-500 to-blue-600'
    if (score >= 40) return 'from-yellow-500 to-amber-600'
    return 'from-red-500 to-red-600'
  }

  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Score Circle */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Energy Efficiency Score</span>
          </h3>
          <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
            <Flame className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-600">{streak} Day Streak</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="relative">
            <svg className="transform -rotate-90" width="180" height="180">
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="90"
                cy="90"
                r="70"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : '#f59e0b'} />
                  <stop offset="100%" stopColor={score >= 80 ? '#059669' : score >= 60 ? '#2563eb' : '#d97706'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-sm text-gray-600 font-semibold">/ 100</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3 w-full">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(value)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="h-5 w-5 text-purple-600" />
          <span>Achievement Badges</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                badge.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-xs font-bold text-gray-900 mb-1">{badge.name}</p>
              {badge.earned && badge.earnedAt && (
                <p className="text-xs text-gray-600">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              )}
              {!badge.earned && (
                <p className="text-xs text-gray-500">Not earned yet</p>
              )}
              {badge.earned && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <Trophy className="h-3 w-3 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">Improve Your Score</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Increase self-consumption by using appliances during peak solar hours</li>
              <li>• Optimize battery charging/discharging cycles</li>
              <li>• Shift high-power activities to off-peak tariff times</li>
              <li>• Reduce standby power consumption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
