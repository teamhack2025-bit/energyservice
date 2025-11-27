'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import { User, Mail, MapPin, Phone, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'

export default function ProfilePage() {
  const [customerData, setCustomerData] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session:', session)
      
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Auth User:', user)
      setAuthUser(user)
      
      if (user) {
        // Try to find customer by auth_user_id first
        const { data: customerByAuth } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle()
        
        console.log('Customer by auth_user_id:', customerByAuth)
        
        // Fallback to email
        if (!customerByAuth) {
          const { data: customerByEmail } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .maybeSingle()
          
          console.log('Customer by email:', customerByEmail)
          setCustomerData(customerByEmail)
        } else {
          setCustomerData(customerByAuth)
        }
      }
      
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </AppShell>
    )
  }

  const displayName = customerData?.name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'User'
  const displayEmail = customerData?.email || authUser?.email || ''
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  
  console.log('Display Name:', displayName)
  console.log('Display Email:', displayEmail)

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your profile information</p>
      </div>

      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-center">
          <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-medium mr-6">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-600">{displayEmail}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
              Active Customer
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900 mt-1">{displayName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 mt-1 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {displayEmail || 'No email found'}
              </p>
            </div>
            {authUser && (
              <div>
                <label className="text-sm font-medium text-gray-600">Auth Provider</label>
                <p className="text-gray-900 mt-1">{authUser.app_metadata?.provider || 'Unknown'}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600">Customer ID</label>
              <p className="text-gray-900 mt-1 font-mono text-sm">{customerData?.id || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Member Since</label>
              <p className="text-gray-900 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {customerData?.created_at ? new Date(customerData.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Address
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Street Address</label>
              <p className="text-gray-900 mt-1">{customerData?.address || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Postal Code</label>
                <p className="text-gray-900 mt-1">{customerData?.postcode || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-gray-900 mt-1">{customerData?.city || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Country</label>
              <p className="text-gray-900 mt-1">{customerData?.country || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Account Type</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">Prosumer</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600">Account Status</p>
            <p className="text-2xl font-bold text-green-900 mt-1">Active</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-600">Last Updated</p>
            <p className="text-lg font-bold text-purple-900 mt-1">
              {customerData?.updated_at ? new Date(customerData.updated_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
