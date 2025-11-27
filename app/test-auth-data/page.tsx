'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function TestAuthDataPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      // Get session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session:', session)
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User:', user)
      
      let customer = null
      if (user) {
        // Get customer by auth_user_id
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle()
        
        customer = customerData
        console.log('Customer:', customer)
      }
      
      setData({
        session: session ? {
          access_token: session.access_token.substring(0, 20) + '...',
          user: session.user
        } : null,
        user,
        customer
      })
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Data Test</h1>
        
        {/* Session */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session</h2>
          {data.session ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✓ Logged In</p>
              <p><strong>Email:</strong> {data.session.user.email}</p>
              <p><strong>User ID:</strong> {data.session.user.id}</p>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">✗ Not Logged In</p>
          )}
        </div>

        {/* Customer Data */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Data</h2>
          {data.customer ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✓ Customer Found</p>
              <p><strong>Name:</strong> {data.customer.name}</p>
              <p><strong>Email:</strong> {data.customer.email}</p>
              <p><strong>Customer ID:</strong> {data.customer.id}</p>
              <p><strong>Address:</strong> {data.customer.address}</p>
              <p><strong>City:</strong> {data.customer.city}, {data.customer.postcode}</p>
              <p><strong>Country:</strong> {data.customer.country}</p>
              <p><strong>Linked:</strong> {data.customer.auth_user_id ? '✓ Yes' : '✗ No'}</p>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">✗ No Customer Data Found</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-2">
            {!data.session && (
              <a href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Go to Login
              </a>
            )}
            {data.session && !data.customer && (
              <div>
                <p className="text-yellow-700 mb-2">You're logged in but not linked to a customer.</p>
                <a href="/link-account" className="inline-block bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700">
                  Link Account
                </a>
              </div>
            )}
            {data.session && data.customer && (
              <div className="space-x-4">
                <a href="/dashboard" className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                  Go to Dashboard
                </a>
                <a href="/settings/profile" className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
