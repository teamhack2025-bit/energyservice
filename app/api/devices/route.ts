import { NextResponse } from 'next/server'
import { HouseIdManager } from '@/lib/services/HouseIdManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get house ID for the user
    const userId = 'default-user'
    const houseId = await HouseIdManager.getHouseIdForUser(userId)
    
    console.log(`Fetching devices for house ${houseId}`)
    
    // Fetch devices from external API
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/devices?house_id=${houseId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Devices API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = 'default-user'
    const houseId = await HouseIdManager.getHouseIdForUser(userId)
    
    const body = await request.json()
    
    // Add house_id to the device data
    const deviceData = {
      ...body,
      house_id: houseId
    }
    
    console.log('Creating device:', deviceData)
    
    const response = await fetch(
      'https://energyserviceapi.vercel.app/api/devices',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Create device error:', error)
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create device' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Updating device:', id, updateData)
    
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/devices/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Update device error:', error)
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update device' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Deleting device:', id)
    
    const response = await fetch(
      `https://energyserviceapi.vercel.app/api/devices/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Delete device error:', error)
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete device' },
      { status: 500 }
    )
  }
}
