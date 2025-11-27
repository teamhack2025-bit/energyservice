export interface Community {
  id: string
  name: string
  description: string
  district: string
  postcode_zone: string
  created_at: string
  member_count: number
  total_capacity_kwh: number
  is_active: boolean
}

export interface CommunityMember {
  id: string
  community_id: string
  user_id: string
  anonymized_id: string
  role: 'prosumer' | 'consumer'
  joined_at: string
  reputation_score: number
  is_active: boolean
  approximate_location?: string
}

export interface TradingOffer {
  id: string
  community_id: string
  member_id: string
  anonymized_id: string
  type: 'buy' | 'sell'
  quantity_kwh: number
  price_per_kwh: number
  time_window_start: string
  time_window_end: string
  status: 'active' | 'matched' | 'expired' | 'cancelled'
  created_at: string
}

export interface TradingRule {
  id: string
  user_id: string
  type: 'buy' | 'sell'
  max_quantity_kwh?: number
  max_price?: number
  min_price?: number
  min_battery_soc?: number
  time_windows: string[]
  is_enabled: boolean
  created_at: string
  last_matched_at?: string
  matches_count: number
}

export interface Trade {
  id: string
  community_id: string
  buyer_id: string
  buyer_anonymized: string
  seller_id: string
  seller_anonymized: string
  quantity_kwh: number
  price_per_kwh: number
  total_amount: number
  executed_at: string
  settlement_status: 'pending' | 'settled' | 'failed'
}

export interface PricingSignal {
  id: string
  community_id: string
  timestamp: string
  p2p_price: number
  grid_import_price: number
  grid_export_price: number
  forecast_next_hour: number
  signal: 'buy' | 'sell' | 'neutral'
  reason: string
}

export interface CommunityStats {
  period: 'today' | 'week' | 'month'
  total_production_kwh: number
  total_consumption_kwh: number
  self_consumption_kwh: number
  p2p_traded_kwh: number
  grid_import_kwh: number
  grid_export_kwh: number
  total_savings_eur: number
  co2_avoided_kg: number
  active_members: number
  total_trades: number
  self_sufficiency_ratio: number
  participation_rate: number
}

export interface TradingHistory {
  trades: Trade[]
  summary: {
    total_bought_kwh: number
    total_sold_kwh: number
    avg_buy_price: number
    avg_sell_price: number
    savings_vs_grid: number
    earnings_vs_feedin: number
    net_balance_eur: number
  }
}

export interface Leaderboard {
  top_sharers: Array<{
    anonymized_id: string
    total_shared_kwh: number
    rank: number
  }>
  top_green_consumers: Array<{
    anonymized_id: string
    local_consumption_percent: number
    rank: number
  }>
}
