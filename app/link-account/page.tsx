'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react'

export default function LinkAccountPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLink = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/link-account', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.message || 'Failed to link account')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Link Your Account</h1>
          <p className="text-gray-600 mt-1">
            Connect your Google authentication with your customer record
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-center mb-6">
            <LinkIcon className="h-16 w-16 text-primary" />
          </div>

          <p className="text-gray-700 mb-6 text-center">
            Click the button below to link your authenticated Google account with your customer data.
            This will allow the dashboard to display your real energy data.
          </p>

          <button
            onClick={handleLink}
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Linking...' : 'Link My Account'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">Success!</h3>
                  <p className="text-green-700 text-sm mt-1">{result.message}</p>
                  {result.customer && (
                    <div className="mt-3 text-sm text-green-800">
                      <p><strong>Name:</strong> {result.customer.name}</p>
                      <p><strong>Email:</strong> {result.customer.email}</p>
                      <p><strong>Customer ID:</strong> {result.customer.id}</p>
                    </div>
                  )}
                  <a
                    href="/dashboard"
                    className="inline-block mt-4 text-sm font-medium text-green-700 hover:text-green-800 underline"
                  >
                    Go to Dashboard →
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">What does this do?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Links your Google login to your customer record in the database</li>
            <li>• Enables the dashboard to show your real energy data</li>
            <li>• Displays your correct name and profile information</li>
            <li>• Required for accessing personalized features</li>
          </ul>
        </div>
      </div>
    </AppShell>
  )
}
