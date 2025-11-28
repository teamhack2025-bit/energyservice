/**
 * Sustainability Calculation Utilities
 * 
 * Provides functions to calculate various sustainability metrics including:
 * - CO2 emissions
 * - Trees saved (CO2 equivalent)
 * - Water saved
 * - Energy efficiency scores
 * - Carbon footprint reductions
 */

// Constants for conversions
export const CONVERSION_FACTORS = {
  // CO2 emissions: 1 kWh of traditional grid power produces 0.475 kg CO2
  CO2_PER_KWH: 0.475, // kg CO2 per kWh
  
  // Trees: 1 tree absorbs approximately 22 kg CO2 per year
  CO2_PER_TREE_PER_YEAR: 22, // kg CO2 per tree per year
  
  // Water: 1 kWh saved = approximately 2.5 liters of water conserved
  WATER_PER_KWH: 2.5, // liters per kWh
  
  // Average household consumption for comparison
  AVG_HOUSEHOLD_MONTHLY_KWH: 900, // kWh per month
}

/**
 * Calculate CO2 emissions avoided based on energy saved
 */
export function calculateCO2Avoided(energySavedKWh: number): number {
  return energySavedKWh * CONVERSION_FACTORS.CO2_PER_KWH
}

/**
 * Calculate number of trees saved based on CO2 reduction
 */
export function calculateTreesSaved(co2AvoidedKg: number, periodDays: number = 30): number {
  // Convert period to years
  const periodYears = periodDays / 365
  // Calculate trees needed to absorb this CO2 over the period
  const treesNeeded = co2AvoidedKg / (CONVERSION_FACTORS.CO2_PER_TREE_PER_YEAR * periodYears)
  return Math.max(0, Math.round(treesNeeded * 100) / 100) // Round to 2 decimals
}

/**
 * Calculate water saved based on energy saved
 */
export function calculateWaterSaved(energySavedKWh: number): number {
  return energySavedKWh * CONVERSION_FACTORS.WATER_PER_KWH
}

/**
 * Calculate energy savings compared to peers (percentile)
 */
export function calculatePeerPercentile(
  userConsumption: number,
  peerConsumptions: number[]
): number {
  if (peerConsumptions.length === 0) return 50
  
  const sorted = [...peerConsumptions].sort((a, b) => a - b)
  const userRank = sorted.filter(c => c > userConsumption).length
  const percentile = (userRank / sorted.length) * 100
  
  return Math.round(percentile)
}

/**
 * Calculate renewable energy usage percentage
 */
export function calculateRenewablePercentage(
  renewableEnergy: number,
  totalEnergy: number
): number {
  if (totalEnergy === 0) return 0
  return Math.round((renewableEnergy / totalEnergy) * 100)
}

/**
 * Calculate device efficiency score (0-100)
 */
export function calculateDeviceEfficiencyScore(
  devices: Array<{ power: number; efficiency?: number; status?: string }>
): number {
  if (devices.length === 0) return 0
  
  let totalScore = 0
  let totalWeight = 0
  
  devices.forEach(device => {
    const weight = device.power || 1
    const efficiency = device.efficiency || (device.status === 'on' ? 85 : 0)
    totalScore += efficiency * weight
    totalWeight += weight
  })
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
}

/**
 * Calculate carbon neutrality progress (0-100)
 */
export function calculateCarbonNeutralityProgress(
  currentCO2: number,
  baselineCO2: number
): number {
  if (baselineCO2 === 0) return 0
  const reduction = ((baselineCO2 - currentCO2) / baselineCO2) * 100
  return Math.max(0, Math.min(100, Math.round(reduction)))
}

/**
 * Calculate home energy health index (0-100)
 */
export function calculateEnergyHealthIndex(
  efficiency: number,
  renewablePercentage: number,
  savingsPercentile: number,
  deviceEfficiency: number
): number {
  // Weighted average
  const weights = {
    efficiency: 0.3,
    renewable: 0.25,
    savings: 0.25,
    devices: 0.2,
  }
  
  const score =
    efficiency * weights.efficiency +
    renewablePercentage * weights.renewable +
    savingsPercentile * weights.savings +
    deviceEfficiency * weights.devices
  
  return Math.round(score)
}

/**
 * Calculate annual energy reduction percentage
 */
export function calculateAnnualReduction(
  currentConsumption: number,
  previousConsumption: number
): number {
  if (previousConsumption === 0) return 0
  const reduction = ((previousConsumption - currentConsumption) / previousConsumption) * 100
  return Math.round(reduction * 100) / 100
}

/**
 * Calculate cost savings in EUR
 */
export function calculateCostSavings(
  energySavedKWh: number,
  pricePerKWh: number = 0.25
): number {
  return Math.round(energySavedKWh * pricePerKWh * 100) / 100
}

/**
 * Calculate standby power waste reduction percentage
 */
export function calculateStandbyReduction(
  currentStandby: number,
  baselineStandby: number
): number {
  if (baselineStandby === 0) return 0
  const reduction = ((baselineStandby - currentStandby) / baselineStandby) * 100
  return Math.max(0, Math.round(reduction))
}

/**
 * Calculate EV charging efficiency score (0-100)
 */
export function calculateEVChargingEfficiency(
  evDevices: Array<{ power: number; efficiency?: number; chargingTime?: number }>
): number {
  if (evDevices.length === 0) return 0
  
  let totalEfficiency = 0
  evDevices.forEach(device => {
    const efficiency = device.efficiency || 80
    totalEfficiency += efficiency
  })
  
  return Math.round(totalEfficiency / evDevices.length)
}

/**
 * Calculate lighting efficiency score (0-100)
 */
export function calculateLightingEfficiency(
  lightingDevices: Array<{ type: string; power: number; efficiency?: number }>
): number {
  if (lightingDevices.length === 0) return 0
  
  // LED = 100, CFL = 70, Incandescent = 30
  const typeScores: Record<string, number> = {
    led: 100,
    cfl: 70,
    incandescent: 30,
    halogen: 50,
  }
  
  let totalScore = 0
  let totalWeight = 0
  
  lightingDevices.forEach(device => {
    const typeScore = typeScores[device.type?.toLowerCase() || 'incandescent'] || 50
    const efficiency = device.efficiency || typeScore
    const weight = device.power || 1
    totalScore += efficiency * weight
    totalWeight += weight
  })
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
}

/**
 * Calculate HVAC efficiency index (0-100)
 */
export function calculateHVACEfficiency(
  hvacDevices: Array<{ power: number; efficiency?: number; type?: string }>
): number {
  if (hvacDevices.length === 0) return 0
  
  let totalEfficiency = 0
  let totalWeight = 0
  
  hvacDevices.forEach(device => {
    const efficiency = device.efficiency || 75
    const weight = device.power || 1
    totalEfficiency += efficiency * weight
    totalWeight += weight
  })
  
  return totalWeight > 0 ? Math.round(totalEfficiency / totalWeight) : 0
}

/**
 * Calculate appliance health rating (0-100)
 */
export function calculateApplianceHealth(
  appliances: Array<{ power: number; efficiency?: number; age?: number }>
): number {
  if (appliances.length === 0) return 0
  
  let totalHealth = 0
  let totalWeight = 0
  
  appliances.forEach(appliance => {
    const efficiency = appliance.efficiency || 80
    // Age factor: newer appliances score higher
    const ageFactor = appliance.age ? Math.max(0.5, 1 - (appliance.age / 20)) : 1
    const health = efficiency * ageFactor
    const weight = appliance.power || 1
    totalHealth += health * weight
    totalWeight += weight
  })
  
  return totalWeight > 0 ? Math.round(totalHealth / totalWeight) : 0
}

/**
 * Calculate peak load reduction percentage
 */
export function calculatePeakLoadReduction(
  currentPeak: number,
  baselinePeak: number
): number {
  if (baselinePeak === 0) return 0
  const reduction = ((baselinePeak - currentPeak) / baselinePeak) * 100
  return Math.max(0, Math.round(reduction))
}

/**
 * Calculate overall sustainability score (0-100)
 */
export function calculateOverallSustainabilityScore(
  co2Reduction: number,
  energyHealth: number,
  renewablePercentage: number,
  efficiencyScore: number
): number {
  // Normalize CO2 reduction (assume max 50% reduction = 100 points)
  const co2Score = Math.min(100, (co2Reduction / 50) * 100)
  
  const weights = {
    co2: 0.3,
    health: 0.3,
    renewable: 0.2,
    efficiency: 0.2,
  }
  
  const score =
    co2Score * weights.co2 +
    energyHealth * weights.health +
    renewablePercentage * weights.renewable +
    efficiencyScore * weights.efficiency
  
  return Math.round(score)
}

