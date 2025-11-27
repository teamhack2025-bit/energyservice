import { NextResponse } from 'next/server'
import { generateLiveEnergyFlow } from '@/lib/energyData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const energyFlow = generateLiveEnergyFlow()
    return NextResponse.json(energyFlow)
  } catch (error) {
    console.error('Energy API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch energy data' },
      { status: 500 }
    )
  }
}
