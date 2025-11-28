'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import DeviceFormModal from '@/components/devices/DeviceFormModal'
import { 
  Zap, 
  Sun, 
  Battery, 
  Refrigerator, 
  Tv, 
  Wind, 
  Droplet, 
  Flame,
  Grid3x3,
  Package,
  Calendar,
  Hash,
  Building2,
  RefreshCw,
  Waves,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

interface Device {
  id: string
  name: string
  purchaseDate: string
  type: string
  brand: string
  room: string
  serialNumber: string
  houseId?: string
}

const getDeviceIcon = (type: string, name: string) => {
  const lowerName = name.toLowerCase()
  const lowerType = type.toLowerCase()
  
  if (lowerType === 'grid') return Grid3x3
  if (lowerType === 'solar') return Sun
  if (lowerType === 'battery') return Battery
  if (lowerName.includes('refrigerator') || lowerName.includes('freezer')) return Refrigerator
  if (lowerName.includes('washing')) return Waves
  if (lowerName.includes('tv')) return Tv
  if (lowerName.includes('hvac') || lowerName.includes('air')) return Wind
  if (lowerName.includes('water')) return Droplet
  if (lowerName.includes('microwave')) return Zap
  if (lowerName.includes('oven') || lowerName.includes('dryer')) return Flame
  if (lowerName.includes('dishwasher')) return Droplet
  
  return Package
}

const getDeviceColor = (type: string) => {
  const lowerType = type.toLowerCase()
  
  if (lowerType === 'grid') return 'from-yellow-500 to-orange-600'
  if (lowerType === 'solar') return 'from-green-500 to-emerald-600'
  if (lowerType === 'battery') return 'from-blue-500 to-indigo-600'
  
  return 'from-purple-500 to-pink-600'
}

const getRoomColor = (room: string) => {
  const lowerRoom = room.toLowerCase()
  
  if (lowerRoom.includes('kitchen')) return 'bg-orange-100 text-orange-700'
  if (lowerRoom.includes('living')) return 'bg-blue-100 text-blue-700'
  if (lowerRoom.includes('bedroom')) return 'bg-purple-100 text-purple-700'
  if (lowerRoom.includes('bathroom')) return 'bg-cyan-100 text-cyan-700'
  if (lowerRoom.includes('garage') || lowerRoom.includes('basement')) return 'bg-gray-100 text-gray-700'
  if (lowerRoom.includes('laundry')) return 'bg-teal-100 text-teal-700'
  if (lowerRoom.includes('exterior')) return 'bg-green-100 text-green-700'
  
  return 'bg-indigo-100 text-indigo-700'
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState<string>('all')
  const [roomFilter, setRoomFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/devices', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()
      setDevices(data.devices || [])
      setCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleCreateDevice = async (deviceData: any) => {
    const response = await fetch('/api/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create device')
    }

    await fetchDevices()
  }

  const handleEditDevice = async (deviceData: any) => {
    const response = await fetch('/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update device')
    }

    await fetchDevices()
  }

  const handleDeleteDevice = async (deviceId: string) => {
    const response = await fetch(`/api/devices?id=${deviceId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete device')
    }

    setDeleteConfirm(null)
    await fetchDevices()
  }

  const openCreateModal = () => {
    setModalMode('create')
    setSelectedDevice(null)
    setIsModalOpen(true)
  }

  const openEditModal = (device: Device) => {
    setModalMode('edit')
    setSelectedDevice(device)
    setIsModalOpen(true)
  }

  const filteredDevices = devices.filter(device => {
    const typeMatch = filter === 'all' || device.type === filter
    const roomMatch = roomFilter === 'all' || device.room.toLowerCase() === roomFilter.toLowerCase()
    return typeMatch && roomMatch
  })

  const deviceTypes = ['all', ...Array.from(new Set(devices.map(d => d.type)))]
  const rooms = ['all', ...Array.from(new Set(devices.map(d => d.room)))]

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Package className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading devices...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <span>My Devices</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and monitor all your connected devices
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Device</span>
            </button>
            <button
              onClick={fetchDevices}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Devices</p>
                <p className="text-3xl font-bold">{count}</p>
              </div>
              <Package className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Solar Panels</p>
                <p className="text-3xl font-bold">{devices.filter(d => d.type === 'solar').length}</p>
              </div>
              <Sun className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Appliances</p>
                <p className="text-3xl font-bold">{devices.filter(d => d.type === 'appliance').length}</p>
              </div>
              <Refrigerator className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Rooms</p>
                <p className="text-3xl font-bold">{rooms.length - 1}</p>
              </div>
              <Building2 className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <div className="flex flex-wrap gap-2">
              {deviceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Room</label>
            <div className="flex flex-wrap gap-2">
              {rooms.slice(0, 6).map(room => (
                <button
                  key={room}
                  onClick={() => setRoomFilter(room)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    roomFilter === room
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {room.charAt(0).toUpperCase() + room.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => {
          const Icon = getDeviceIcon(device.type, device.name)
          const colorClass = getDeviceColor(device.type)
          const roomColorClass = getRoomColor(device.room)
          
          return (
            <div
              key={device.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Device Header with Icon */}
              <div className={`bg-gradient-to-br ${colorClass} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roomColorClass}`}>
                    {device.room}
                  </span>
                </div>
              </div>

              {/* Device Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {device.name}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium mr-2">Brand:</span>
                    <span>{device.brand}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium mr-2">Purchased:</span>
                    <span>{new Date(device.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium mr-2">Serial:</span>
                    <span className="font-mono text-xs">{device.serialNumber}</span>
                  </div>
                </div>

                {/* Device Type Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(device)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  {deleteConfirm === device.id ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(device.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No devices found matching your filters</p>
        </div>
      )}

      {/* Device Form Modal */}
      <DeviceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreateDevice : handleEditDevice}
        device={selectedDevice}
        mode={modalMode}
      />
    </AppShell>
  )
}
