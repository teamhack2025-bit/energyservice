'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import { supabase } from '@/lib/supabase-client'

export default function DebugAuthPage() {
  const [authUser, setAuthUser] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Get auth user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Auth User:', user)
        console.log('Auth Error:', authError)
        setAuthUser(user)

        if (user) {
          // Try to find customer by auth_user_id
          const { data: customerByAuth, error: authLinkError } = await supabase
            .from('customers')
            .select('*')
            .eq('auth_user_id', user.id)
            .maybeSingle()
          
          console.log('Customer by auth_user_id:', customerByAuth)
          console.log('Auth link error:', authLinkError)

          // Try to find customer by email
          const { data: customerByEmail, error: emailError } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .maybeSingle()
          
          console.log('Customer by email:', customerByEmail)
          console.log('Email error:', emailError)

          setCustomer(customerByAuth || customerByEmail)
          setError({ authLinkError, emailError })
        }
      } catch (err) {
        console.error('Error:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <AppShell>
        <div className="text-center py-8">Loading...</div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>

        {/* Auth User */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Authenticated User</h2>
          {authUser ? (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(authUser, null, 2)}
            </pre>
          ) : (
            <p className="text-red-600">No authenticated user found</p>
          )}
        </div>

        {/* Customer Data */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Customer Record</h2>
          {customer ? (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(customer, null, 2)}
            </pre>
          ) : (
            <p className="text-red-600">No customer record found</p>
          )}
        </div>

        {/* Errors */}
        {error && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">Errors</h2>
            <pre className="bg-red-50 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Summary */}
        <div className="card bg-blue-50">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Auth User ID:</strong> {authUser?.id || 'N/A'}</p>
            <p><strong>Auth Email:</strong> {authUser?.email || 'N/A'}</p>
            <p><strong>Customer ID:</strong> {customer?.id || 'N/A'}</p>
            <p><strong>Customer Email:</strong> {customer?.email || 'N/A'}</p>
            <p><strong>Customer Name:</strong> {customer?.name || 'N/A'}</p>
            <p><strong>Linked (auth_user_id):</strong> {customer?.auth_user_id ? 'Yes ✓' : 'No ✗'}</p>
          </div>
        </div>

        {authUser && !customer && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold mb-2">⚠️ Account Not Linked</p>
            <p className="text-yellow-700 text-sm mb-4">
              You're logged in but no customer record was found for email: {authUser.email}
            </p>
            <a
              href="/link-account"
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Link Account
            </a>
          </div>
        )}
      </div>
    </AppShell>
  )
}
