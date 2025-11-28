'use client'

import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LeaderboardEntry {
  houseId: string
  houseName: string
  rank: number
  overallSustainabilityScore: number
  co2Avoided: number
  energySaved: number
  efficiencyScore: number
  waterSaved: number
  treesSaved: number
  renewablePercentage: number
  deviceOptimizationScore: number
  isCurrentUser: boolean
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[]
  currentUserRank: number
  currentHouseId: string
}

export default function Leaderboard({ leaderboard, currentUserRank, currentHouseId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />
      default:
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-300'
      case 2:
        return 'bg-gray-50 border-gray-300'
      case 3:
        return 'bg-orange-50 border-orange-300'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Sustainability Leadership Board
          </h2>
          <div className="text-sm text-gray-600">
            Your Rank: <span className="font-bold text-primary">#{currentUserRank}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                House
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CO₂ Avoided
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Energy Saved
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efficiency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trees Saved
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((entry) => (
              <tr
                key={entry.houseId}
                className={`hover:bg-gray-50 transition-colors ${
                  entry.isCurrentUser ? 'bg-primary/5 border-l-4 border-primary' : ''
                } ${getRankColor(entry.rank)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{entry.houseName}</span>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{entry.overallSustainabilityScore}</span>
                    <span className="text-xs text-gray-500">/100</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {entry.co2Avoided.toFixed(1)} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {entry.energySaved.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {entry.efficiencyScore}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {entry.treesSaved.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Participants: {leaderboard.length}</span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Rankings update daily
          </span>
        </div>
      </div>
    </div>
  )
}

