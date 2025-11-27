import { NextResponse } from 'next/server'
import { generateGroupOverviewData } from '@/lib/energySharingData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generateGroupOverviewData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Energy sharing overview API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch energy sharing overview' },
      { status: 500 }
    )
  }
}
