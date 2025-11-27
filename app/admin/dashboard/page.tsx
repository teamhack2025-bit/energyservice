'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import StatsCard from '@/components/admin/StatsCard'
import { 
  Users, 
  Building2, 
  Plug, 
  UsersRound,
  ShoppingCart,
  TrendingUp,
  Ticket,
  Activity
} from 'lucide-react'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'

interface DashboardStats {
  users: {
    total: number
    active: number
    new_this_month: number
  }
  customers: {
    total: number
    with_devices: number
  }
  devices: {
    total: number
    by_type: Record<string, number>
    active: number
  }
  communities: {
    total: number
    total_members: number
  }
  trading: {
    active_offers: number
    completed_trades_today: number
    total_volume_kwh: number
  }
  recent_activity: {
    id: string
    type: string
    description: string
    timestamp: string
    entity_id: string
  }[]
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, authenticated } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      // Check authentication
      if (!authenticated) {
        router.push('/admin/login')
        return
      }

      // Load dashboard stats
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to load dashboard stats')
        }
        const data = await response.json()
        setStats(data.data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadData()
    }
  }, [authLoading, authenticated, router])

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of the energy platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.users.total || 0}
            icon={Users}
            href="/admin/users"
            subtitle={`${stats?.users.active || 0} active`}
            trend={{
              value: stats?.users.new_this_month || 0,
              label: 'new this month',
              positive: true
            }}
          />
          
          <StatsCard
            title="Customers"
            value={stats?.customers.total || 0}
            icon={Building2}
            href="/admin/customers"
            subtitle={`${stats?.customers.with_devices || 0} with devices`}
          />
          
          <StatsCard
            title="Devices"
            value={stats?.devices.total || 0}
            icon={Plug}
            href="/admin/devices"
            subtitle={`${stats?.devices.active || 0} active`}
          />
          
          <StatsCard
            title="Communities"
            value={stats?.communities.total || 0}
            icon={UsersRound}
            href="/admin/communities"
            subtitle={`${stats?.communities.total_members || 0} total members`}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Active Offers"
            value={stats?.trading.active_offers || 0}
            icon={ShoppingCart}
            href="/admin/trading/offers"
          />
          
          <StatsCard
            title="Trades Today"
            value={stats?.trading.completed_trades_today || 0}
            icon={TrendingUp}
            href="/admin/trading/trades"
          />
          
          <StatsCard
            title="Trading Volume"
            value={`${stats?.trading.total_volume_kwh || 0} kWh`}
            icon={Activity}
          />
        </div>

        {/* Device Breakdown */}
        {stats?.devices.by_type && Object.keys(stats.devices.by_type).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Devices by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.devices.by_type).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    {type.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {activity.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/users"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </a>
            <a
              href="/admin/devices"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Plug className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Devices</span>
            </a>
            <a
              href="/admin/tickets"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Ticket className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Support Tickets</span>
            </a>
            <a
              href="/admin/trading/offers"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Trading Offers</span>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
