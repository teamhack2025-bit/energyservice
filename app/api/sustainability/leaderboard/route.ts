import { NextResponse } from 'next/server'
import { getCurrentCustomerId } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

// Mock leaderboard data generator
// In production, this would fetch from database
function generateMockLeaderboard(currentHouseId: string) {
  const houses = ['H001', 'H002', 'H003', 'H004', 'H005', 'H006']
  const leaderboard = houses.map((houseId, index) => {
    // Generate varied metrics
    const baseScore = 50 + Math.random() * 50
    const co2Avoided = 50 + Math.random() * 200
    const energySaved = 10 + Math.random() * 40
    const efficiency = 60 + Math.random() * 35
    const waterSaved = 200 + Math.random() * 1500
    const treesSaved = 5 + Math.random() * 30
    const renewablePercentage = 20 + Math.random() * 70
    const deviceOptimization = 70 + Math.random() * 25
    
    // Calculate overall sustainability score
    const overallScore = Math.round(
      (baseScore * 0.3) +
      (efficiency * 0.2) +
      (renewablePercentage * 0.2) +
      (energySaved * 0.15) +
      (deviceOptimization * 0.15)
    )
    
    return {
      houseId,
      houseName: `House ${houseId.slice(-1)}`,
      rank: index + 1,
      overallSustainabilityScore: overallScore,
      co2Avoided: Math.round(co2Avoided * 100) / 100,
      energySaved: Math.round(energySaved * 100) / 100,
      efficiencyScore: Math.round(efficiency),
      waterSaved: Math.round(waterSaved * 100) / 100,
      treesSaved: Math.round(treesSaved * 100) / 100,
      renewablePercentage: Math.round(renewablePercentage),
      deviceOptimizationScore: Math.round(deviceOptimization),
      isCurrentUser: houseId === currentHouseId,
    }
  })
  
  // Sort by overall score (descending)
  leaderboard.sort((a, b) => b.overallSustainabilityScore - a.overallSustainabilityScore)
  
  // Update ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1
  })
  
  return leaderboard
}

export async function GET(request: Request) {
  try {
    const customerId = await getCurrentCustomerId()
    
    // If not authenticated, use a default house for demo
    const houseId = customerId ? getHouseIdForCustomer(customerId) : 'H001'
    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'global' // global, neighborhood, household-type
    
    // Generate mock leaderboard
    // In production, fetch from database based on view type
    const leaderboard = generateMockLeaderboard(houseId)
    
    // Find current user's position
    const currentUserEntry = leaderboard.find(entry => entry.isCurrentUser)
    const currentUserRank = currentUserEntry?.rank || 0
    
    return NextResponse.json({
      leaderboard,
      currentUserRank,
      currentHouseId: houseId,
      view,
      totalParticipants: leaderboard.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

