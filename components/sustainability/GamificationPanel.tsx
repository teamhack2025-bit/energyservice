'use client'

import { Zap, Flame, Target, Award, TrendingUp } from 'lucide-react'
import { calculateSustainabilityPoints, calculateUserLevel } from '@/lib/utils/sustainabilityCertifications'
import { SustainabilityMetrics } from '@/lib/utils/sustainabilityCertifications'

interface GamificationPanelProps {
  metrics: SustainabilityMetrics
}

export default function GamificationPanel({ metrics }: GamificationPanelProps) {
  const points = calculateSustainabilityPoints(metrics)
  const level = calculateUserLevel(points)
  
  // Calculate points needed for next level
  const pointsForNextLevel = [
    500, 1500, 3000, 5000, 7500, 10000, 15000, 20000, 30000, Infinity
  ]
  const currentLevelPoints = level > 1 ? pointsForNextLevel[level - 2] : 0
  const nextLevelPoints = pointsForNextLevel[level - 1]
  const progressToNextLevel = level < 10 
    ? ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    : 100

  // Mock streak data (in production, fetch from database)
  const currentStreak = 7 // days
  const longestStreak = 12 // days

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Points & Level */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sustainability Points</h3>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-4xl font-bold text-purple-600 mb-2">{points.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Level {level}</span>
          </div>
        </div>
        {level < 10 && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {nextLevelPoints - points} points to next level
            </p>
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-4xl font-bold text-orange-600 mb-2">{currentStreak}</p>
          <p className="text-sm text-gray-600">days of efficient energy use</p>
        </div>
        <div className="pt-4 border-t border-orange-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Longest Streak</span>
            <span className="text-sm font-semibold text-gray-900">{longestStreak} days</span>
          </div>
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Certifications</span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.floor(points / 100)} earned
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Badges</span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.floor(points / 50)} earned
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Milestones</span>
            <span className="text-sm font-semibold text-gray-900">
              {metrics.treesSaved >= 10 ? '✓' : '○'} Trees
            </span>
          </div>
          <div className="pt-3 border-t border-green-200">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Keep it up! You're doing great!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

