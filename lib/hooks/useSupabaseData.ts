'use client'

import { useEffect, useState } from 'react'

// Mock user ID - In production, get from auth context
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'
const MOCK_SITE_ID = '20000000-0000-0000-0000-000000000001'

export function useConsumptionData(days: number = 30) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const response = await fetch(
          `/api/data/consumption?siteId=${MOCK_SITE_ID}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&granularity=daily`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch consumption data')
        }

        const result = await response.json()
        setData(result.data || [])
      } catch (err: any) {
        console.error('Error fetching consumption:', err)
        setError(err.message)
        // Fallback to mock data
        const { generateConsumptionData } = await import('@/lib/mockData')
        setData(generateConsumptionData(days))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  return { data, loading, error }
}

export function useProductionData(days: number = 30) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const response = await fetch(
          `/api/data/production?siteId=${MOCK_SITE_ID}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch production data')
        }

        const result = await response.json()
        setData(result.data || [])
      } catch (err: any) {
        console.error('Error fetching production:', err)
        setError(err.message)
        // Fallback to mock data
        const { generateProductionData } = await import('@/lib/mockData')
        setData(generateProductionData(days))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  return { data, loading, error }
}

export function useNetBalanceData(days: number = 30) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const response = await fetch(
          `/api/data/net-balance?siteId=${MOCK_SITE_ID}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch net balance data')
        }

        const result = await response.json()
        setData(result.data || [])
      } catch (err: any) {
        console.error('Error fetching net balance:', err)
        setError(err.message)
        // Fallback to mock data
        const { generateNetBalanceData } = await import('@/lib/mockData')
        setData(generateNetBalanceData(days))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  return { data, loading, error }
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/data/invoices?userId=${MOCK_USER_ID}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch invoices')
        }

        const result = await response.json()
        setInvoices(result.invoices || [])
      } catch (err: any) {
        console.error('Error fetching invoices:', err)
        setError(err.message)
        // Fallback to mock data
        const { mockInvoices } = await import('@/lib/mockData')
        setInvoices(mockInvoices)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { invoices, loading, error }
}

export function useDevices(siteId: string = MOCK_SITE_ID) {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/data/devices?siteId=${siteId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch devices')
        }

        const result = await response.json()
        setDevices(result.devices || [])
      } catch (err: any) {
        console.error('Error fetching devices:', err)
        setError(err.message)
        // Fallback to mock data
        const { mockDevices } = await import('@/lib/mockData')
        setDevices(mockDevices)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [siteId])

  return { devices, loading, error }
}

export function useNotifications(unreadOnly: boolean = false) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/data/notifications?userId=${MOCK_USER_ID}&unreadOnly=${unreadOnly}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications')
        }

        const result = await response.json()
        setNotifications(result.notifications || [])
      } catch (err: any) {
        console.error('Error fetching notifications:', err)
        setError(err.message)
        // Fallback to mock data
        const { mockNotifications } = await import('@/lib/mockData')
        setNotifications(mockNotifications.filter(n => !unreadOnly || !n.read))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [unreadOnly])

  return { notifications, loading, error }
}

export function useContracts() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/data/contracts?userId=${MOCK_USER_ID}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch contracts')
        }

        const result = await response.json()
        setContracts(result.contracts || [])
      } catch (err: any) {
        console.error('Error fetching contracts:', err)
        setError(err.message)
        // Fallback to mock data
        const { mockContracts } = await import('@/lib/mockData')
        setContracts(mockContracts)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { contracts, loading, error }
}

