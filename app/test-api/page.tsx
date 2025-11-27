'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'

export default function TestAPIPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/real')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <AppShell>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Loading API Data...</h1>
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Real API Data for jesubalan89@gmail.com</h1>
        
        {data?.error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-red-700">{data.error}</p>
          </div>
        ) : (
          <>
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{data?.customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{data?.customer?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{data?.customer?.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-semibold">{data?.customer?.city}, {data?.customer?.postcode}</p>
                </div>
              </div>
            </div>

            {/* Today's Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Today's Statistics</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Production</p>
                  <p className="text-2xl font-bold text-green-600">{data?.todayStats?.production} kWh</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Consumption</p>
                  <p className="text-2xl font-bold text-red-600">{data?.todayStats?.consumption} kWh</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Net Balance</p>
                  <p className="text-2xl font-bold text-blue-600">{data?.todayStats?.netBalance} kWh</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold text-purple-600">{data?.todayStats?.efficiency}%</p>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Monthly Financial</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cost</p>
                  <p className="text-2xl font-bold text-red-600">€{data?.monthlyStats?.cost}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">€{data?.monthlyStats?.revenue}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bill</p>
                  <p className="text-2xl font-bold text-blue-600">€{data?.monthlyStats?.totalBill}</p>
                </div>
              </div>
            </div>

            {/* Devices */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Devices ({data?.devices?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.devices?.map((device: any) => (
                  <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold">{device.device_name}</p>
                    <p className="text-sm text-gray-600">{device.device_type}</p>
                    <p className="text-sm">Capacity: {device.capacity_kw} kW</p>
                    <p className="text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        device.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {device.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Raw API Response</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
