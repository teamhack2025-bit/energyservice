'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  name: string
  created_at: string
}

export interface AdminAuthState {
  user: AdminUser | null
  loading: boolean
  authenticated: boolean
}

/**
 * React hook for managing admin authentication state.
 * Provides login, logout, and auth checking functionality.
 */
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    loading: true,
    authenticated: false
  })

  /**
   * Check authentication status on mount and when needed
   */
  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const response = await fetch('/api/admin/auth/check', {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success && data.data.authenticated) {
        setState({
          user: data.data.user,
          loading: false,
          authenticated: true
        })
      } else {
        setState({
          user: null,
          loading: false,
          authenticated: false
        })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setState({
        user: null,
        loading: false,
        authenticated: false
      })
    }
  }, [])

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setState({
          user: data.data.user,
          loading: false,
          authenticated: true
        })
        return { success: true }
      } else {
        return {
          success: false,
          error: data.error?.message || 'Login failed'
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      }
    }
  }, [])

  /**
   * Logout the current admin user
   */
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      // Clear state regardless of API response
      setState({
        user: null,
        loading: false,
        authenticated: false
      })

      return data.success
    } catch (error) {
      console.error('Logout error:', error)
      // Clear state even on error
      setState({
        user: null,
        loading: false,
        authenticated: false
      })
      return false
    }
  }, [])

  /**
   * Refresh the session
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        // Re-check auth to get updated user data
        await checkAuth()
        return true
      }

      return false
    } catch (error) {
      console.error('Session refresh error:', error)
      return false
    }
  }, [checkAuth])

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user: state.user,
    loading: state.loading,
    authenticated: state.authenticated,
    login,
    logout,
    checkAuth,
    refreshSession
  }
}
