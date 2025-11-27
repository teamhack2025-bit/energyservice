import AppShell from '@/components/layout/AppShell'
import { mockDevices } from '@/lib/mockData'
import { CheckCircle, AlertCircle, XCircle, Zap, Sun, Battery, Car } from 'lucide-react'
import Link from 'next/link'

function getDeviceIcon(type: string) {
  switch (type) {
    case 'meter':
      return <Zap className="h-6 w-6" />
    case 'solar':
      return <Sun className="h-6 w-6" />
    case 'battery':
      return <Battery className="h-6 w-6" />
    case 'ev_charger':
      return <Car className="h-6 w-6" />
    default:
      return <Zap className="h-6 w-6" />
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'online':
      return <CheckCircle className="h-5 w-5 text-success" />
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-warning" />
    case 'offline':
    case 'fault':
      return <XCircle className="h-5 w-5 text-danger" />
    default:
      return <CheckCircle className="h-5 w-5 text-gray-400" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'bg-success/10 text-success'
    case 'warning':
      return 'bg-warning/10 text-warning'
    case 'offline':
    case 'fault':
      return 'bg-danger/10 text-danger'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function DevicesPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Devices & Assets</h1>
        <p className="text-gray-600 mt-1">Manage your energy devices and assets</p>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDevices.map((device) => (
          <Link
            key={device.id}
            href={`/devices/${device.id}`}
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{device.type.replace('_', ' ')}</p>
                </div>
              </div>
              {getStatusIcon(device.status)}
            </div>
            <div className="space-y-2">
              {device.metadata && (
                <>
                  {device.metadata.reading && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reading</span>
                      <span className="font-medium text-gray-900">
                        {device.metadata.reading} {device.metadata.unit || 'kWh'}
                      </span>
                    </div>
                  )}
                  {device.metadata.capacityKw && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium text-gray-900">{device.metadata.capacityKw} kWp</span>
                    </div>
                  )}
                  {device.metadata.todayKwh && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Today</span>
                      <span className="font-medium text-gray-900">{device.metadata.todayKwh} kWh</span>
                    </div>
                  )}
                  {device.metadata.capacityKwh && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium text-gray-900">{device.metadata.capacityKwh} kWh</span>
                    </div>
                  )}
                  {device.metadata.chargePercent !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Charge</span>
                      <span className="font-medium text-gray-900">{device.metadata.chargePercent}%</span>
                    </div>
                  )}
                  {device.metadata.maxPowerKw && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Max Power</span>
                      <span className="font-medium text-gray-900">{device.metadata.maxPowerKw} kW</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                {device.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}

