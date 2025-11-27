'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, UserMinus, Shield, Home, Sun, Check, X, Mail } from 'lucide-react'
import { GroupOverviewData } from '@/types/energy-sharing'

interface Props {
  data: GroupOverviewData
  onRefresh: () => void
}

export default function MemberManagementPanel({ data, onRefresh }: Props) {
  const { members, group } = data
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  const prosumers = members.filter(m => m.is_prosumer)
  const consumers = members.filter(m => !m.is_prosumer)
  const admins = members.filter(m => m.role === 'admin')

  // Mock pending requests
  const pendingRequests = [
    { id: 'req-1', name: 'Household 25', meter: 'LU-METER-1025', requested: '2 days ago' },
    { id: 'req-2', name: 'Household 26', meter: 'LU-METER-1026', requested: '5 days ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Pending Join Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-yellow-600" />
            <span>Pending Join Requests ({pendingRequests.length})</span>
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{request.name}</p>
                  <p className="text-sm text-gray-600">Meter: {request.meter}</p>
                  <p className="text-xs text-gray-500">Requested {request.requested}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2">
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Member Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Total Members</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{members.length}</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Sun className="h-5 w-5 text-yellow-600" />
            <h4 className="font-semibold text-gray-700">Prosumers</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{prosumers.length}</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Home className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-gray-700">Consumers</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{consumers.length}</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Admins</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
        </div>
      </div>

      {/* Member List */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>All Members</span>
          </h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Invite Members</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Meter ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, idx) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    selectedMember === member.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMember(member.id)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        member.is_prosumer ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {member.is_prosumer ? (
                          <Sun className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Home className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{member.display_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{member.meter_id}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      member.is_prosumer 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {member.is_prosumer ? 'Prosumer' : 'Consumer'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.role === 'admin' ? (
                        <span className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        'Member'
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {member.role !== 'admin' && (
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                          Make Admin
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                        Remove
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invitation Code */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Group Invitation</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share this code with new members to join the group
        </p>
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-white rounded-lg border-2 border-gray-200 p-4">
            <p className="text-2xl font-mono font-bold text-center text-gray-900">
              BELVAL-{group.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Copy Code
          </button>
        </div>
      </div>
    </div>
  )
}
