'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LogoutPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Logging out...')

  useEffect(() => {
    async function handleLogout() {
      try {
        setStatus('Signing out...')
        
        // Sign out from Supabase if authenticated
        try {
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.error('Supabase logout error:', error)
          }
        } catch (supabaseError) {
          // Supabase might not be configured, continue anyway
          console.log('Supabase not available, continuing logout')
        }
        
        // Clear any local storage
        if (typeof window !== 'undefined') {
          try {
            localStorage.clear()
            sessionStorage.clear()
          } catch (storageError) {
            console.error('Storage clear error:', storageError)
          }
        }
        
        setStatus('Redirecting...')
        
        // Wait a moment to show the loading state
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to login page
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        setStatus('Redirecting...')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{status}</h2>
        <p className="text-gray-600">Please wait while we sign you out...</p>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

