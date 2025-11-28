import { NextResponse } from 'next/server'
import { getCurrentCustomerId } from '@/lib/supabase-client'
import {
  calculateCO2Avoided,
  calculateTreesSaved,
  calculateWaterSaved,
  calculateRenewablePercentage,
  calculateDeviceEfficiencyScore,
  calculateCarbonNeutralityProgress,
  calculateEnergyHealthIndex,
  calculatePeerPercentile,
  calculateCostSavings,
  calculateStandbyReduction,
  calculateEVChargingEfficiency,
  calculateLightingEfficiency,
  calculateHVACEfficiency,
  calculateApplianceHealth,
  calculatePeakLoadReduction,
  calculateOverallSustainabilityScore,
  CONVERSION_FACTORS,
} from '@/lib/utils/sustainabilityCalculations'

export const dynamic = 'force-dynamic'

function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}

export async function GET() {
  try {
    const customerId = await getCurrentCustomerId()
    
    // If not authenticated, use a default house for demo
    const houseId = customerId ? getHouseIdForCustomer(customerId) : 'H001'
    
    // Fetch device data
    let devices: any[] = []
    try {
      const deviceResponse = await fetch(
        `https://energyserviceapi.vercel.app/api/devices?house_id=${houseId}`,
        { cache: 'no-store' }
      )
      
      if (deviceResponse.ok) {
        const deviceData = await deviceResponse.json()
        devices = Array.isArray(deviceData.devices) 
          ? deviceData.devices 
          : (Array.isArray(deviceData) ? deviceData : [])
      } else {
        console.warn(`Device API returned ${deviceResponse.status}, using empty device list`)
      }
    } catch (deviceError) {
      console.warn('Failed to fetch device data, using empty device list:', deviceError)
      // Continue with empty devices array
    }
    
    // Fetch dashboard data for consumption/production metrics
    let consumption = 0
    let production = 0
    let renewableEnergy = 0
    
    try {
      const dashboardResponse = await fetch(
        `https://energyserviceapi.vercel.app/api/dashboard/realtime/${houseId}`,
        { cache: 'no-store' }
      )
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json()
        const summary = dashboardData.summary || {}
        consumption = Number(summary.consumption_today) || 0
        production = Number(summary.solar_production_today) || 0
        renewableEnergy = production // Assuming solar is renewable
      }
    } catch (dashboardError) {
      console.warn('Failed to fetch dashboard data, using defaults:', dashboardError)
      // Use default values if dashboard fetch fails
    }
    
    // Calculate device-level metrics with safe defaults
    const totalDevicePower = devices.length > 0 
      ? devices.reduce((sum: number, d: any) => sum + (Number(d.power) || 0), 0)
      : 0
    
    const evDevices = devices.filter((d: any) => {
      const type = String(d.type || '').toLowerCase()
      const name = String(d.name || '').toLowerCase()
      return type.includes('ev') || name.includes('ev')
    })
    
    const lightingDevices = devices.filter((d: any) => {
      const type = String(d.type || '').toLowerCase()
      const name = String(d.name || '').toLowerCase()
      return type.includes('light') || name.includes('light')
    })
    
    const hvacDevices = devices.filter((d: any) => {
      const type = String(d.type || '').toLowerCase()
      const name = String(d.name || '').toLowerCase()
      return type.includes('hvac') || name.includes('hvac') || type.includes('heating') || type.includes('cooling')
    })
    
    const appliances = devices.filter((d: any) => 
      !evDevices.includes(d) && 
      !lightingDevices.includes(d) && 
      !hvacDevices.includes(d) &&
      (Number(d.power) || 0) > 100 // High-power devices
    )
    
    // Calculate baseline (assume average household)
    const baselineConsumption = CONVERSION_FACTORS.AVG_HOUSEHOLD_MONTHLY_KWH / 30 // Daily average
    const energySaved = Math.max(0, baselineConsumption - consumption)
    
    // Calculate all metrics with safe defaults
    const energySavedMonthly = Math.max(0, energySaved * 30)
    const co2Avoided = calculateCO2Avoided(energySavedMonthly)
    const treesSaved = calculateTreesSaved(co2Avoided, 30)
    const waterSaved = calculateWaterSaved(energySavedMonthly)
    const renewablePercentage = consumption > 0
      ? calculateRenewablePercentage(renewableEnergy, consumption)
      : 0
    const deviceEfficiency = devices.length > 0
      ? calculateDeviceEfficiencyScore(devices)
      : 0
    
    const currentCO2 = consumption * CONVERSION_FACTORS.CO2_PER_KWH
    const baselineCO2 = baselineConsumption * CONVERSION_FACTORS.CO2_PER_KWH
    const carbonNeutralityProgress = baselineCO2 > 0
      ? calculateCarbonNeutralityProgress(currentCO2, baselineCO2)
      : 0
    
    // Mock peer data (in production, fetch from database)
    const mockPeerConsumptions = Array.from({ length: 100 }, () => 
      baselineConsumption * (0.7 + Math.random() * 0.6) // 70-130% of baseline
    )
    const peerPercentile = mockPeerConsumptions.length > 0
      ? calculatePeerPercentile(consumption, mockPeerConsumptions)
      : 50 // Default to middle percentile
    
    const energyHealthIndex = calculateEnergyHealthIndex(
      deviceEfficiency,
      renewablePercentage,
      peerPercentile,
      deviceEfficiency
    )
    
    const costSavings = calculateCostSavings(energySavedMonthly)
    
    // Calculate specialized metrics with safe defaults
    const standbyPower = devices.length > 0
      ? devices.reduce((sum: number, d: any) => 
          sum + (String(d.status || '').toLowerCase() === 'standby' ? (Number(d.power) || 0) : 0), 0
        )
      : 0
    const baselineStandby = totalDevicePower * 0.1 // Assume 10% baseline standby
    const standbyReduction = baselineStandby > 0 
      ? calculateStandbyReduction(standbyPower, baselineStandby)
      : 0
    
    const evEfficiency = evDevices.length > 0 
      ? calculateEVChargingEfficiency(evDevices)
      : 0
    
    const lightingEfficiency = lightingDevices.length > 0
      ? calculateLightingEfficiency(lightingDevices)
      : 0
    
    const hvacEfficiency = hvacDevices.length > 0
      ? calculateHVACEfficiency(hvacDevices)
      : 0
    
    const applianceHealth = appliances.length > 0
      ? calculateApplianceHealth(appliances)
      : 0
    
    // Peak load (simplified - use max device power)
    const devicePowers = devices.map((d: any) => Number(d.power) || 0)
    const currentPeak = devicePowers.length > 0 ? Math.max(...devicePowers, 0) : 0
    const baselinePeak = baselineConsumption * 2 // Assume peak is 2x average
    const peakLoadReduction = baselinePeak > 0
      ? calculatePeakLoadReduction(currentPeak, baselinePeak)
      : 0
    
    // Overall sustainability score
    const overallScore = calculateOverallSustainabilityScore(
      carbonNeutralityProgress,
      energyHealthIndex,
      renewablePercentage,
      deviceEfficiency
    )
    
    // Calculate annual reduction (mock - would need historical data)
    const annualReduction = Math.max(0, Math.min(25, peerPercentile / 4)) // Estimate based on percentile
    
    // Helper function to ensure valid numbers
    const safeNumber = (value: number): number => {
      const num = Number(value)
      return isNaN(num) || !isFinite(num) ? 0 : num
    }
    
    return NextResponse.json({
      // Core Metrics (15+)
      treesSaved: safeNumber(Math.round(treesSaved * 100) / 100),
      waterSaved: safeNumber(Math.round(waterSaved * 100) / 100),
      co2Avoided: safeNumber(Math.round(co2Avoided * 100) / 100),
      energySavedVsPeers: safeNumber(peerPercentile),
      renewablePercentage: safeNumber(renewablePercentage),
      peakLoadReduction: safeNumber(peakLoadReduction),
      deviceEfficiencyScore: safeNumber(deviceEfficiency),
      carbonNeutralityProgress: safeNumber(carbonNeutralityProgress),
      energyHealthIndex: safeNumber(energyHealthIndex),
      annualEnergyReduction: safeNumber(annualReduction),
      costSavings: safeNumber(Math.round(costSavings * 100) / 100),
      standbyReduction: safeNumber(standbyReduction),
      evChargingEfficiency: safeNumber(evEfficiency),
      lightingEfficiencyScore: safeNumber(lightingEfficiency),
      hvacEfficiencyIndex: safeNumber(hvacEfficiency),
      applianceHealthRating: safeNumber(applianceHealth),
      
      // Overall Score
      overallSustainabilityScore: safeNumber(overallScore),
      
      // Raw Data
      consumption: safeNumber(consumption),
      production: safeNumber(production),
      renewableEnergy: safeNumber(renewableEnergy),
      energySaved: safeNumber(energySaved),
      baselineConsumption: safeNumber(baselineConsumption),
      
      // Device Counts
      totalDevices: devices.length,
      evDevices: evDevices.length,
      lightingDevices: lightingDevices.length,
      hvacDevices: hvacDevices.length,
      
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error calculating sustainability metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

