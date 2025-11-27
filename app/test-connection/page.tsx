'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function TestConnectionPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    fetch('/api/test-connection')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setData({ success: false, error: err.message })
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'passed' || status === 'found' || status === 'authenticated' || status === 'success') {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    } else if (status === 'not found' || status === 'not authenticated') {
      return <AlertCircle className="h-6 w-6 text-yellow-500" />
    } else {
      return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Testing API connection...</p>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">API Connection Test</h1>
          <button
            onClick={fetchData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Overall Status */}
        <div className={`p-6 rounded-lg mb-6 ${
          data?.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            {data?.success ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
            <div>
              <h2 className={`text-2xl font-bold ${data?.success ? 'text-green-900' : 'text-red-900'}`}>
                {data?.success ? 'Connection Successful!' : 'Connection Failed'}
              </h2>
              <p className={data?.success ? 'text-green-700' : 'text-red-700'}>
                {data?.timestamp && `Tested at ${new Date(data.timestamp).toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>

        {data?.error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">Error Details</h3>
            <p className="text-red-700 mb-2">{data.error}</p>
            {data.details && (
              <pre className="bg-red-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(data.details, null, 2)}
              </pre>
            )}
          </div>
        )}

        {data?.tests && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Customer Found</p>
                <p className="text-2xl font-bold">
                  {data.summary?.customerFound ? (
                    <span className="text-green-600">Yes ✓</span>
                  ) : (
                    <span className="text-red-600">No ✗</span>
                  )}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Devices</p>
                <p className="text-2xl font-bold text-blue-600">{data.summary?.deviceCount || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Energy Data</p>
                <p className="text-2xl font-bold">
                  {data.summary?.hasEnergyData ? (
                    <span className="text-green-600">Yes ✓</span>
                  ) : (
                    <span className="text-yellow-600">No</span>
                  )}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Financial Data</p>
                <p className="text-2xl font-bold">
                  {data.summary?.hasFinancialData ? (
                    <span className="text-green-600">Yes ✓</span>
                  ) : (
                    <span className="text-yellow-600">No</span>
                  )}
                </p>
              </div>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              {/* Connection Test */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon status={data.tests.connection?.status} />
                  <h3 className="text-xl font-bold">1. Supabase Connection</h3>
                </div>
                <p className="text-gray-600">{data.tests.connection?.message}</p>
              </div>

              {/* Auth Test */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon status={data.tests.auth?.status} />
                  <h3 className="text-xl font-bold">2. Authentication</h3>
                </div>
                <p className="text-gray-600 mb-2">Status: {data.tests.auth?.status}</p>
                {data.tests.auth?.user && (
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm"><strong>Email:</strong> {data.tests.auth.user.email}</p>
                    <p className="text-sm"><strong>User ID:</strong> {data.tests.auth.user.id}</p>
                  </div>
                )}
                {data.tests.auth?.error && (
                  <p className="text-yellow-600 text-sm mt-2">Note: {data.tests.auth.error}</p>
                )}
              </div>

              {/* Customer Test */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon status={data.tests.customer?.status} />
                  <h3 className="text-xl font-bold">3. Customer Lookup</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  Looking for: <strong>{data.tests.customer?.email}</strong>
                </p>
                {data.tests.customer?.data ? (
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm"><strong>ID:</strong> {data.tests.customer.data.id}</p>
                    <p className="text-sm"><strong>Name:</strong> {data.tests.customer.data.name}</p>
                    <p className="text-sm"><strong>Address:</strong> {data.tests.customer.data.address}</p>
                    <p className="text-sm"><strong>City:</strong> {data.tests.customer.data.city}, {data.tests.customer.data.postcode}</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded">
                    <p className="text-yellow-700">Customer not found in database</p>
                    {data.tests.customer?.error && (
                      <p className="text-sm text-yellow-600 mt-2">{data.tests.customer.error}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Devices Test */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon status={data.tests.devices?.status} />
                  <h3 className="text-xl font-bold">4. Devices ({data.tests.devices?.count || 0})</h3>
                </div>
                {data.tests.devices?.data && data.tests.devices.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.tests.devices.data.map((device: any) => (
                      <div key={device.id} className="bg-gray-50 p-3 rounded">
                        <p className="font-semibold">{device.device_name}</p>
                        <p className="text-sm text-gray-600">{device.device_type}</p>
                        <p className="text-sm">Capacity: {device.capacity_kw} kW</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No devices found</p>
                )}
              </div>

              {/* Energy Readings Test */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon status={data.tests.energyReadings?.status} />
                  <h3 className="text-xl font-bold">5. Energy Readings ({data.tests.energyReadings?.count || 0})</h3>
                </div>
                {data.tests.energyReadings?.latest ? (
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm mb-2"><strong>Latest Reading:</strong></p>
                    <p className="text-sm">Time: {new Date(data.tests.energyReadings.latest.timestamp).toLocaleString()}</p>
                    <p className="text-sm">Production: {data.tests.energyReadings.latest.production_kwh} kWh</p>
                    <p className="text-sm">Consumption: {data.tests.energyReadings.latest.consumption_kwh} kWh</p>
                    <p className="text-sm">Grid Import: {data.tests.energyReadings.latest.grid_import_kwh} kWh</p>
                    <p className="text-sm">Grid Export: {data.tests.energyReadings.latest.grid_export_kwh} kWh</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No energy readings found</p>
                )}
              </div>

              {/* Financial Data Test */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon status={data.tests.financialData?.status} />
                  <h3 className="text-xl font-bold">6. Financial Data ({data.tests.financialData?.count || 0})</h3>
                </div>
                {data.tests.financialData?.latest ? (
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm mb-2"><strong>Latest Period:</strong></p>
                    <p className="text-sm">Period: {new Date(data.tests.financialData.latest.period_start).toLocaleDateString()} - {new Date(data.tests.financialData.latest.period_end).toLocaleDateString()}</p>
                    <p className="text-sm">Cost: €{data.tests.financialData.latest.energy_cost_eur}</p>
                    <p className="text-sm">Revenue: €{data.tests.financialData.latest.energy_revenue_eur}</p>
                    <p className="text-sm">Total Bill: €{data.tests.financialData.latest.total_bill_eur}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No financial data found</p>
                )}
              </div>
            </div>

            {/* Raw JSON */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Raw API Response</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
