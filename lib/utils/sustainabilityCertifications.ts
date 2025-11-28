/**
 * Sustainability Certifications and Badges System
 * 
 * Defines certification levels, badges, and achievement criteria
 */

export interface Certification {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: (metrics: SustainabilityMetrics) => boolean
  level: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'energy' | 'carbon' | 'water' | 'efficiency' | 'renewable' | 'device'
  criteria: (metrics: SustainabilityMetrics) => boolean
}

export interface SustainabilityMetrics {
  overallSustainabilityScore: number
  annualEnergyReduction: number
  carbonNeutralityProgress: number
  renewablePercentage: number
  deviceEfficiencyScore: number
  co2Avoided: number
  waterSaved: number
  treesSaved: number
  energySavedVsPeers: number
  standbyReduction: number
  evChargingEfficiency: number
  lightingEfficiencyScore: number
  hvacEfficiencyIndex: number
  applianceHealthRating: number
  peakLoadReduction: number
  energyHealthIndex: number
  costSavings: number
}

// Certification Levels (Tiers)
export const CERTIFICATIONS: Certification[] = [
  {
    id: 'bronze-eco-saver',
    name: 'Bronze Eco Saver',
    description: 'Basic energy reduction (5-10%)',
    icon: '🥉',
    color: '#CD7F32',
    level: 1,
    criteria: (m) => m.annualEnergyReduction >= 5 && m.annualEnergyReduction < 10,
  },
  {
    id: 'silver-eco-saver',
    name: 'Silver Eco Saver',
    description: '10-20% energy savings',
    icon: '🥈',
    color: '#C0C0C0',
    level: 2,
    criteria: (m) => m.annualEnergyReduction >= 10 && m.annualEnergyReduction < 20,
  },
  {
    id: 'gold-sustainability-champion',
    name: 'Gold Sustainability Champion',
    description: '20-35% energy savings',
    icon: '🥇',
    color: '#FFD700',
    level: 3,
    criteria: (m) => m.annualEnergyReduction >= 20 && m.annualEnergyReduction < 35,
  },
  {
    id: 'platinum-earth-guardian',
    name: 'Platinum Earth Guardian',
    description: '35-50% energy savings',
    icon: '💎',
    color: '#E5E4E2',
    level: 4,
    criteria: (m) => m.annualEnergyReduction >= 35 && m.annualEnergyReduction < 50,
  },
  {
    id: 'diamond-zero-carbon-leader',
    name: 'Diamond Zero-Carbon Leader',
    description: 'Achieved below-net carbon profile',
    icon: '💠',
    color: '#B9F2FF',
    level: 5,
    criteria: (m) => m.carbonNeutralityProgress >= 100,
  },
  {
    id: 'carbon-conscious-household',
    name: 'Carbon Conscious Household',
    description: 'Consistent reduction over 12 months',
    icon: '🌍',
    color: '#4CAF50',
    level: 3,
    criteria: (m) => m.carbonNeutralityProgress >= 50 && m.annualEnergyReduction >= 15,
  },
  {
    id: 'smart-energy-optimizer',
    name: 'Smart Energy Optimizer',
    description: 'Excellent smart device coordination',
    icon: '🔋',
    color: '#2196F3',
    level: 3,
    criteria: (m) => m.deviceEfficiencyScore >= 85 && m.standbyReduction >= 50,
  },
  {
    id: 'green-home-certification',
    name: 'Green Home Certification',
    description: 'High renewable usage + high efficiency',
    icon: '🌱',
    color: '#8BC34A',
    level: 4,
    criteria: (m) => m.renewablePercentage >= 60 && m.energyHealthIndex >= 80,
  },
  {
    id: 'water-warrior',
    name: 'Water Warrior',
    description: 'Exceptional water savings',
    icon: '💧',
    color: '#00BCD4',
    level: 2,
    criteria: (m) => m.waterSaved >= 1000, // 1000+ liters saved
  },
  {
    id: 'clean-air-contributor',
    name: 'Clean Air Contributor',
    description: 'Low CO₂ footprint contribution',
    icon: '🌬',
    color: '#9C27B0',
    level: 2,
    criteria: (m) => m.co2Avoided >= 100, // 100+ kg CO2 avoided
  },
]

// Badges (Achievement-based)
export const BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Reduced energy consumption by 5%',
    icon: '👣',
    color: '#9E9E9E',
    category: 'energy',
    criteria: (m) => m.annualEnergyReduction >= 5,
  },
  {
    id: 'tree-planter',
    name: 'Tree Planter',
    description: 'Saved 10+ trees worth of CO2',
    icon: '🌳',
    color: '#4CAF50',
    category: 'carbon',
    criteria: (m) => m.treesSaved >= 10,
  },
  {
    id: 'water-saver',
    name: 'Water Saver',
    description: 'Saved 500+ liters of water',
    icon: '💧',
    color: '#00BCD4',
    category: 'water',
    criteria: (m) => m.waterSaved >= 500,
  },
  {
    id: 'efficiency-master',
    name: 'Efficiency Master',
    description: 'Achieved 90+ device efficiency score',
    icon: '⚡',
    color: '#FF9800',
    category: 'efficiency',
    criteria: (m) => m.deviceEfficiencyScore >= 90,
  },
  {
    id: 'solar-champion',
    name: 'Solar Champion',
    description: '80%+ renewable energy usage',
    icon: '☀️',
    color: '#FFC107',
    category: 'renewable',
    criteria: (m) => m.renewablePercentage >= 80,
  },
  {
    id: 'smart-home-guru',
    name: 'Smart Home Guru',
    description: 'Optimized all smart devices',
    icon: '🏠',
    color: '#673AB7',
    category: 'device',
    criteria: (m) => m.deviceEfficiencyScore >= 85 && m.standbyReduction >= 60,
  },
  {
    id: 'carbon-neutral',
    name: 'Carbon Neutral',
    description: 'Achieved carbon neutrality',
    icon: '🌍',
    color: '#4CAF50',
    category: 'carbon',
    criteria: (m) => m.carbonNeutralityProgress >= 100,
  },
  {
    id: 'top-performer',
    name: 'Top Performer',
    description: 'Top 10% energy savings vs peers',
    icon: '🏆',
    color: '#FFD700',
    category: 'energy',
    criteria: (m) => m.energySavedVsPeers >= 90,
  },
  {
    id: 'ev-optimizer',
    name: 'EV Optimizer',
    description: '90+ EV charging efficiency',
    icon: '🚗',
    color: '#2196F3',
    category: 'device',
    criteria: (m) => m.evChargingEfficiency >= 90,
  },
  {
    id: 'lighting-expert',
    name: 'Lighting Expert',
    description: '95+ lighting efficiency score',
    icon: '💡',
    color: '#FFEB3B',
    category: 'device',
    criteria: (m) => m.lightingEfficiencyScore >= 95,
  },
]

/**
 * Get all certifications earned by user
 */
export function getEarnedCertifications(metrics: SustainabilityMetrics): Certification[] {
  return CERTIFICATIONS.filter(cert => cert.criteria(metrics))
}

/**
 * Get all badges earned by user
 */
export function getEarnedBadges(metrics: SustainabilityMetrics): Badge[] {
  return BADGES.filter(badge => badge.criteria(metrics))
}

/**
 * Get highest certification level
 */
export function getHighestCertification(metrics: SustainabilityMetrics): Certification | null {
  const earned = getEarnedCertifications(metrics)
  if (earned.length === 0) return null
  
  return earned.reduce((highest, current) => 
    current.level > highest.level ? current : highest
  )
}

/**
 * Calculate sustainability points
 */
export function calculateSustainabilityPoints(metrics: SustainabilityMetrics): number {
  let points = 0
  
  // Base points from overall score
  points += Math.round(metrics.overallSustainabilityScore * 10)
  
  // Bonus points for achievements
  const certifications = getEarnedCertifications(metrics)
  points += certifications.length * 100
  
  const badges = getEarnedBadges(metrics)
  points += badges.length * 50
  
  // Bonus for milestones
  if (metrics.treesSaved >= 10) points += 200
  if (metrics.treesSaved >= 50) points += 500
  if (metrics.treesSaved >= 100) points += 1000
  
  if (metrics.waterSaved >= 1000) points += 200
  if (metrics.waterSaved >= 5000) points += 500
  
  if (metrics.co2Avoided >= 100) points += 200
  if (metrics.co2Avoided >= 500) points += 500
  
  return points
}

/**
 * Calculate user level based on points
 */
export function calculateUserLevel(points: number): number {
  // Level 1: 0-500 points
  // Level 2: 500-1500 points
  // Level 3: 1500-3000 points
  // Level 4: 3000-5000 points
  // Level 5: 5000-7500 points
  // Level 6: 7500-10000 points
  // Level 7: 10000-15000 points
  // Level 8: 15000-20000 points
  // Level 9: 20000-30000 points
  // Level 10: 30000+ points
  
  if (points < 500) return 1
  if (points < 1500) return 2
  if (points < 3000) return 3
  if (points < 5000) return 4
  if (points < 7500) return 5
  if (points < 10000) return 6
  if (points < 15000) return 7
  if (points < 20000) return 8
  if (points < 30000) return 9
  return 10
}

