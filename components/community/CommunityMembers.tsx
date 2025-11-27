'use client'

import { motion } from 'framer-motion'
import { Users, MapPin, Star, TrendingUp, Zap, Battery } from 'lucide-react'
import { CommunityMember } from '@/types/community'

interface CommunityMembersProps {
  members: CommunityMember[]
}

export default function CommunityMembers({ members }: CommunityMembersProps) {
  const getMemberIcon = (type: string) => {
    switch (type) {
      case 'prosumer':
        return <Zap className="h-5 w-5 text-yellow-600" />
      case 'storage_operator':
        return <Battery className="h-5 w-5 text-blue-600" />
      default:
        return <Users className="h-5 w-5 text-gray-600" />
    }
  }

  const getMemberBadgeColor = (type: string) => {
    switch (type) {
      case 'prosumer':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'storage_operator':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Community Members</h3>
        <span className="text-sm text-gray-600">{members.length} members shown</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Member Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getMemberIcon(member.type)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{member.anonymous_id}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getMemberBadgeColor(member.type)}`}>
                    {member.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Info */}
            {member.privacy_settings.show_location && (
              <div className="mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{member.location.district}</span>
                </div>
                {member.location.approximate_address && (
                  <p className="text-xs text-gray-500 ml-6">{member.location.approximate_address}</p>
                )}
              </div>
            )}

            {/* Reputation Score */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">{member.reputation.score}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Reliability</p>
                <p className="text-sm font-semibold text-gray-900">{member.reputation.reliability}%</p>
              </div>
            </div>

            {/* Trading Stats */}
            {member.privacy_settings.show_trading_history && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Total Trades</span>
                  <span className="font-semibold text-gray-900">{member.reputation.total_trades}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">
                    {((member.reputation.successful_trades / member.reputation.total_trades) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="mt-3 text-xs text-gray-500">
              Member since {new Date(member.joined_at).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
