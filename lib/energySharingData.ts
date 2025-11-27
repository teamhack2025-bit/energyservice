import {
  EnergySharingGroup,
  GroupMember,
  GroupKPIs,
  EnergyAllocationRecord,
  FinancialSettlement,
  GroupRule,
  PersonalEnergyFlow,
  PersonalFinancials,
  MemberTradingPreference,
  GroupOverviewData,
  PersonalDashboardData,
  AdminDashboardData,
  JoinRequest,
} from '@/types/energy-sharing'

// Generate mock Energy Sharing Group
export function generateEnergySharingGroup(): EnergySharingGroup {
  return {
    id: 'esg-belval-001',
    name: 'Rue des Pins Energy Sharing',
    type: 'lane',
    description: 'Local energy sharing community for Rue des Pins residents in Belval',
    region: 'Esch-sur-Alzette',
    postcode: 'L-4365',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z',
    member_count: 24,
    admin_count: 2,
    total_capacity_kwh: 180,
    regulatory_framework: 'LU_ENERGY_SHARING',
  }
}

// Generate group members
export function generateGroupMembers(isAdmin: boolean = false): GroupMember[] {
  const members: GroupMember[] = []
  
  for (let i = 1; i <= 24; i++) {
    members.push({
      id: `member-${i}`,
      group_id: 'esg-belval-001',
      user_id: `user-${i}`,
      meter_id: `LU-METER-${1000 + i}`,
      role: i <= 2 ? 'admin' : 'member',
      status: 'active',
      joined_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      display_name: `Household ${i}`,
      is_prosumer: Math.random() > 0.4,
    })
  }
  
  return members
}

// Generate group KPIs
export function generateGroupKPIs(): GroupKPIs {
  return {
    period: 'month',
    total_production_kwh: 3245.8,
    total_consumption_kwh: 4156.2,
    internal_sharing_kwh: 2834.5,
    internal_sharing_percentage: 68.2,
    grid_import_kwh: 1321.7,
    grid_export_kwh: 411.3,
    co2_avoided_kg: 1456.8,
    total_savings_eur: 487.30,
    average_internal_price: 0.18,
    self_sufficiency_ratio: 78.1,
  }
}

// Generate group rules
export function generateGroupRules(): GroupRule[] {
  return [
    {
      id: 'rule-1',
      group_id: 'esg-belval-001',
      rule_type: 'pricing',
      pricing_model: 'flat',
      internal_buy_price: 0.18,
      internal_sell_price: 0.16,
      valid_from: '2024-01-01T00:00:00Z',
      config_json: {
        description: 'Flat rate pricing for all members',
        currency: 'EUR',
      },
    },
  ]
}

// Generate energy allocation records
export function generateEnergyAllocations(): EnergyAllocationRecord[] {
  const allocations: EnergyAllocationRecord[] = []
  const members = generateGroupMembers()
  
  for (let i = 0; i < 10; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    const production = member.is_prosumer ? Math.random() * 200 + 50 : 0
    const consumption = Math.random() * 150 + 80
    const fromCommunity = Math.min(consumption * 0.7, 100)
    const toCommunity = Math.max(0, production - consumption * 0.3)
    
    allocations.push({
      id: `alloc-${i + 1}`,
      group_id: 'esg-belval-001',
      member_id: member.id,
      period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      energy_from_community_kwh: fromCommunity,
      energy_to_community_kwh: toCommunity,
      energy_from_supplier_kwh: consumption - fromCommunity,
      energy_to_grid_kwh: Math.max(0, production - toCommunity - consumption),
      total_consumption_kwh: consumption,
      total_production_kwh: production,
    })
  }
  
  return allocations
}

// Generate financial settlements
export function generateFinancialSettlements(): FinancialSettlement[] {
  const settlements: FinancialSettlement[] = []
  const members = generateGroupMembers()
  
  for (let i = 0; i < 5; i++) {
    const member = members[i]
    const communityCost = Math.random() * 30 + 10
    const communityRevenue = member.is_prosumer ? Math.random() * 25 + 5 : 0
    const baselineCost = communityCost * 1.4
    const baselineRevenue = communityRevenue * 0.6
    
    settlements.push({
      id: `settlement-${i + 1}`,
      member_id: member.id,
      group_id: 'esg-belval-001',
      period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      community_energy_cost_eur: communityCost,
      community_energy_revenue_eur: communityRevenue,
      baseline_cost_eur: baselineCost,
      baseline_revenue_eur: baselineRevenue,
      savings_eur: (baselineCost - communityCost) + (communityRevenue - baselineRevenue),
      net_balance_eur: communityCost - communityRevenue,
      internal_price_avg: 0.18,
      grid_price_avg: 0.28,
    })
  }
  
  return settlements
}

// Generate personal energy flow
export function generatePersonalEnergyFlow(): PersonalEnergyFlow {
  return {
    period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    period_end: new Date().toISOString(),
    from_community: 145.8,
    to_community: 89.2,
    from_supplier: 67.3,
    to_grid: 12.5,
    total_consumption: 213.1,
    total_production: 101.7,
  }
}

// Generate personal financials
export function generatePersonalFinancials(): PersonalFinancials {
  return {
    period: 'This Month',
    community_cost: 26.24,
    community_revenue: 14.27,
    supplier_cost: 18.84,
    grid_revenue: 1.00,
    total_cost: 45.08,
    total_revenue: 15.27,
    net_cost: 29.81,
    savings_vs_baseline: 18.45,
    savings_percentage: 38.2,
  }
}

// Generate trading preferences
export function generateTradingPreferences(): MemberTradingPreference {
  return {
    id: 'pref-1',
    member_id: 'member-1',
    max_buy_kwh_per_day: 15,
    max_buy_price_eur_per_kwh: 0.22,
    max_sell_kwh_per_day: 10,
    min_sell_price_eur_per_kwh: 0.15,
    enabled: true,
    auto_trading: true,
  }
}

// Generate join requests
export function generateJoinRequests(): JoinRequest[] {
  return [
    {
      id: 'req-1',
      group_id: 'esg-belval-001',
      user_id: 'user-25',
      meter_id: 'LU-METER-1025',
      status: 'pending',
      requested_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'I live at Rue des Pins 45 and would like to join the energy sharing group',
    },
    {
      id: 'req-2',
      group_id: 'esg-belval-001',
      user_id: 'user-26',
      meter_id: 'LU-METER-1026',
      status: 'pending',
      requested_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'New resident interested in sustainable energy sharing',
    },
  ]
}

// Aggregate data functions
export function generateGroupOverviewData(): GroupOverviewData {
  const members = generateGroupMembers()
  return {
    group: generateEnergySharingGroup(),
    member: members[0],
    kpis: generateGroupKPIs(),
    recent_allocations: generateEnergyAllocations().slice(0, 5),
    members: members,
    rules: generateGroupRules(),
  }
}

export function generatePersonalDashboardData(): PersonalDashboardData {
  const members = generateGroupMembers()
  return {
    member: members[0],
    group: generateEnergySharingGroup(),
    energy_flow: generatePersonalEnergyFlow(),
    financials: generatePersonalFinancials(),
    trading_preferences: generateTradingPreferences(),
    monthly_history: [
      { month: '2024-01', from_community: 132.5, to_community: 78.3, savings: 15.20, co2_avoided: 67.8 },
      { month: '2024-02', from_community: 145.8, to_community: 89.2, savings: 18.45, co2_avoided: 74.2 },
      { month: '2024-03', from_community: 156.2, to_community: 95.7, savings: 21.30, co2_avoided: 81.5 },
    ],
  }
}

export function generateAdminDashboardData(): AdminDashboardData {
  return {
    group: generateEnergySharingGroup(),
    members: generateGroupMembers(true),
    pending_requests: generateJoinRequests(),
    kpis: generateGroupKPIs(),
    rules: generateGroupRules(),
    allocations: generateEnergyAllocations(),
    settlements: generateFinancialSettlements(),
  }
}
