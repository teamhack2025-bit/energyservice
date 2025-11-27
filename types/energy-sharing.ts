// Energy Sharing Group Types - Luxembourg Energy Communities Framework

export type GroupType = 'lane' | 'building' | 'village' | 'custom'
export type GroupStatus = 'pending' | 'active' | 'suspended'
export type MemberRole = 'member' | 'admin'
export type MemberStatus = 'pending' | 'active' | 'removed'
export type PricingModel = 'flat' | 'time_of_use' | 'p2p_rules'

export interface EnergySharingGroup {
  id: string
  name: string
  type: GroupType
  description: string
  region: string
  postcode: string
  status: GroupStatus
  created_at: string
  member_count: number
  admin_count: number
  total_capacity_kwh: number
  regulatory_framework: 'LU_ENERGY_SHARING' | 'EU_2019_944'
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  meter_id: string
  role: MemberRole
  status: MemberStatus
  joined_at: string
  display_name: string
  is_prosumer: boolean
}

export interface GroupRule {
  id: string
  group_id: string
  rule_type: 'pricing' | 'allocation' | 'trading'
  pricing_model?: PricingModel
  internal_buy_price?: number // €/kWh
  internal_sell_price?: number // €/kWh
  time_of_use_config?: TimeOfUseConfig
  valid_from: string
  valid_to?: string
  config_json: Record<string, any>
}

export interface TimeOfUseConfig {
  peak_hours: { start: string; end: string; price: number }[]
  off_peak_hours: { start: string; end: string; price: number }[]
}

export interface MemberTradingPreference {
  id: string
  member_id: string
  max_buy_kwh_per_day?: number
  max_buy_price_eur_per_kwh?: number
  max_sell_kwh_per_day?: number
  min_sell_price_eur_per_kwh?: number
  enabled: boolean
  auto_trading: boolean
}

export interface EnergyAllocationRecord {
  id: string
  group_id: string
  member_id: string
  period_start: string
  period_end: string
  energy_from_community_kwh: number
  energy_to_community_kwh: number
  energy_from_supplier_kwh: number
  energy_to_grid_kwh: number
  total_consumption_kwh: number
  total_production_kwh: number
}

export interface FinancialSettlement {
  id: string
  member_id: string
  group_id: string
  period_start: string
  period_end: string
  community_energy_cost_eur: number
  community_energy_revenue_eur: number
  baseline_cost_eur: number // What they would have paid without group
  baseline_revenue_eur: number // What they would have earned without group
  savings_eur: number
  net_balance_eur: number // Negative = profit, Positive = cost
  internal_price_avg: number
  grid_price_avg: number
}

export interface GroupKPIs {
  period: 'today' | 'week' | 'month' | 'year'
  total_production_kwh: number
  total_consumption_kwh: number
  internal_sharing_kwh: number
  internal_sharing_percentage: number
  grid_import_kwh: number
  grid_export_kwh: number
  co2_avoided_kg: number
  total_savings_eur: number
  average_internal_price: number
  self_sufficiency_ratio: number
}

export interface PersonalEnergyFlow {
  period_start: string
  period_end: string
  from_community: number // kWh
  to_community: number // kWh
  from_supplier: number // kWh
  to_grid: number // kWh
  total_consumption: number // kWh
  total_production: number // kWh
}

export interface PersonalFinancials {
  period: string
  community_cost: number // €
  community_revenue: number // €
  supplier_cost: number // €
  grid_revenue: number // €
  total_cost: number // €
  total_revenue: number // €
  net_cost: number // €
  savings_vs_baseline: number // €
  savings_percentage: number // %
}

export interface GroupInvitation {
  id: string
  group_id: string
  code: string
  created_by: string
  expires_at: string
  max_uses?: number
  current_uses: number
  status: 'active' | 'expired' | 'revoked'
}

export interface JoinRequest {
  id: string
  group_id: string
  user_id: string
  meter_id: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  processed_at?: string
  processed_by?: string
  message?: string
}

// API Response Types
export interface GroupOverviewData {
  group: EnergySharingGroup
  member: GroupMember
  kpis: GroupKPIs
  recent_allocations: EnergyAllocationRecord[]
  members: GroupMember[]
  rules: GroupRule[]
}

export interface PersonalDashboardData {
  member: GroupMember
  group: EnergySharingGroup
  energy_flow: PersonalEnergyFlow
  financials: PersonalFinancials
  trading_preferences: MemberTradingPreference
  monthly_history: Array<{
    month: string
    from_community: number
    to_community: number
    savings: number
    co2_avoided: number
  }>
}

export interface AdminDashboardData {
  group: EnergySharingGroup
  members: GroupMember[]
  pending_requests: JoinRequest[]
  kpis: GroupKPIs
  rules: GroupRule[]
  allocations: EnergyAllocationRecord[]
  settlements: FinancialSettlement[]
}

export interface CreateGroupRequest {
  name: string
  type: GroupType
  description: string
  region: string
  postcode: string
  initial_pricing: {
    buy_price: number
    sell_price: number
  }
}

export interface JoinGroupRequest {
  group_id: string
  meter_id: string
  invitation_code?: string
}

export interface UpdateRulesRequest {
  pricing_model: PricingModel
  internal_buy_price?: number
  internal_sell_price?: number
  time_of_use_config?: TimeOfUseConfig
  valid_from: string
}
