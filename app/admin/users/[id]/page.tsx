'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import { ArrowLeft, Save, Trash2, User, Mail, Phone, Calendar, Link as LinkIcon } from 'lucide-react'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'

interface UserDetail {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in_at: string | null
  confirmed_at: string | null
  phone: string | null
  role: string
  user_metadata: any
  linked_customer: any
  devices: any[]
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { authenticated, loading: authLoading } = useAdminAuth()
  
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: ''
  })

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.push('/admin/login')
    }
  }, [authLoading, authenticated, router])

  useEffect(() => {
    if (authenticated && userId) {
      loadUser()
    }
  }, [authenticated, userId])

  const loadUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load user')
      }

      const result = await response.json()
      if (result.success) {
        setUser(result.data)
        setFormData({
          email: result.data.email || '',
          name: result.data.name || '',
          phone: result.data.phone || '',
          password: ''
        })
      } else {
        throw new Error(result.error?.message || 'Failed to load user')
      }
    } catch (err: any) {
      console.error('Error loading user:', err)
      setError(err.message || 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')

      const updateData: any = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone
      }

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to update user')
      }

      setIsEditing(false)
      loadUser() // Reload user data
    } catch (err: any) {
      setError(err.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setSaving(true)
      setError('')

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to delete user')
      }

      router.push('/admin/users')
    } catch (err: any) {
      setError(err.message || 'Failed to delete user')
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error && !user) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Users
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 inline mr-2" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      email: user?.email || '',
                      name: user?.name || '',
                      phone: user?.phone || '',
                      password: ''
                    })
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* User Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
          </div>
          <div className="p-6 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    Name
                  </div>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created
                  </div>
                  <p className="text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last Sign In
                  </div>
                  <p className="text-gray-900">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.confirmed_at ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Linked Customer */}
        {user?.linked_customer && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                Linked Customer Account
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Customer ID</div>
                  <p className="text-gray-900">{user.linked_customer.id}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Name</div>
                  <p className="text-gray-900">{user.linked_customer.name}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <p className="text-gray-900">{user.linked_customer.address}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">City</div>
                  <p className="text-gray-900">{user.linked_customer.city}, {user.linked_customer.postcode}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devices */}
        {user?.devices && user.devices.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Devices ({user.devices.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.devices.map((device) => (
                    <tr key={device.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {device.device_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {device.device_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.capacity_kw} kW
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          device.status === 'active' ? 'bg-green-100 text-green-800' :
                          device.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
