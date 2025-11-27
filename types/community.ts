// Local Energy Community and P2P Trading Types

export interface Community {
  id: string
  name: string
  description: string
  type: 'citizen_energy_community' | 'renewable_energy_community'
  location: {
    district: string
    postcode_zone: string
    coordinates?: { lat: number; lon: number }
  }
  members: {
    total: number
    active: number
    prosumers: number
    consumers: number
  }
  stats: CommunityStats
  created_at: string
  regulatory_framework: 'EU_2019_944' | 'national_implementation'
}

export interface CommunityStats {
  period: 'today' | 'week' | 'month' | 'year'
  production: {
    total: number // kWh
    solar: number
    wind: number
    other_renewable: number
  }
  consumption: {
    total: number // kWh
    self_consumed: number
    traded_p2p: number
    grid_imported: number
  }
  trading: {
    total_volume: number // kWh
    total_value: number // €
    average_price: number // €/kWh
    transactions: number
    savings_vs_grid: number // €
  }
  environmental: {
    co2_avoided: number // kg
    renewable_share: number // %
    self_sufficiency: number // %
  }
}

export interface CommunityMember {
  id: string
  anonymous_id: string // "House A17", "Prosumer #23"
  type: 'prosumer' | 'consumer' | 'storage_operator'
  role: 'member' | 'coordinator' | 'admin'
  location: {
    district: string
    approximate_address?: string // "Near Main St", "District Center"
  }
  reputation: {
    score: number // 0-100
    reliability: number // 0-100
    total_trades: number
    successful_trades: number
  }
  privacy_settings: {
    show_location: boolean
    show_production_capacity: boolean
    show_trading_history: boolean
  }
  joined_at: string
}

export interface TradingOffer {
  id: string
  community_id: string
  member_id: string
  anonymous_id: string
  type: 'buy' | 'sell'
  status: 'active' | 'matched' | 'expired' | 'cancelled'
  energy: {
    quantity: number // kWh
    remaining: number // kWh
    energy_type?: 'solar' | 'wind' | 'battery' | 'mixed'
    green_certificate?: boolean
  }
  pricing: {
    price: number // €/kWh
    price_type: 'fixed' | 'market_linked' | 'negotiable'
    min_price?: number
    max_price?: number
  }
  timing: {
    delivery_start: string // ISO datetime
    delivery_end: string // ISO datetime
    flexibility: 'none' | 'low' | 'medium' | 'high'
    time_window: string // "next 2 hours", "today", "this evening"
  }
  conditions: {
    min_quantity?: number // kWh
    max_quantity?: number // kWh
    location_preference?: 'neighborhood' | 'district' | 'any'
    green_only?: boolean
  }
  created_at: string
  expires_at: string
}

export interface Trade {
  id: string
  community_id: string
  buyer_id: string
  seller_id: string
  buyer_anonymous_id: string
  seller_anonymous_id: string
  status: 'pending' | 'confirmed' | 'delivered' | 'settled' | 'disputed'
  energy: {
    quantity: number // kWh
    delivered: number // kWh
    energy_type: string
    green_certificate: boolean
  }
  pricing: {
    agreed_price: number // €/kWh
    total_value: number // €
    platform_fee: number // €
    net_amount: number // €
  }
  timing: {
    agreed_at: string
    delivery_start: string
    delivery_end: string
    settled_at?: string
  }
  grid_impact: {
    avoided_grid_import: number // kWh
    avoided_grid_export: number // kWh
    grid_fees_saved: number // €
  }
  created_at: string
}

export interface TradingRule {
  id: string
  user_id: string
  community_id: string
  name: string
  type: 'buy' | 'sell'
  status: 'active' | 'paused' | 'expired'
  conditions: {
    max_energy_per_day?: number // kWh
    max_energy_per_week?: number // kWh
    max_price?: number // €/kWh (for buy rules)
    min_price?: number // €/kWh (for sell rules)
    min_battery_soc?: number // % (for sell rules)
    time_windows?: Array<{
      start: string // "09:00"
      end: string // "17:00"
      days: string[] // ["monday", "tuesday"]
    }>
    energy_type_preference?: 'solar' | 'wind' | 'any'
    green_only?: boolean
    location_preference?: 'neighborhood' | 'district' | 'any'
  }
  limits: {
    daily_limit: number // kWh or €
    weekly_limit: number // kWh or €
    monthly_limit: number // kWh or €
  }
  performance: {
    total_matched: number // kWh
    total_value: number // €
    average_price: number // €/kWh
    success_rate: number // %
    estimated_monthly_savings?: number // €
  }
  created_at: string
  last_triggered?: string
}

export interface CommunityPriceSignal {
  timestamp: string
  community_id: string
  pricing: {
    current_p2p_price: number // €/kWh
    grid_import_price: number // €/kWh
    grid_export_price: number // €/kWh
    dynamic_tariff?: number // €/kWh
  }
  market_conditions: {
    supply: number // kWh available
    demand: number // kWh requested
    balance: 'surplus' | 'deficit' | 'balanced'
    price_trend: 'rising' | 'falling' | 'stable'
  }
  forecast: {
    next_hour_price: number
    next_4h_trend: 'up' | 'down' | 'stable'
    peak_expected_at?: string
    surplus_expected_at?: string
  }
  signals: {
    good_time_to_buy: boolean
    good_time_to_sell: boolean
    price_above_grid: boolean
    high_renewable_availability: boolean
  }
}

export interface PersonalTradingStats {
  user_id: string
  community_id: string
  period: 'today' | 'week' | 'month' | 'year'
  trading: {
    energy_bought: number // kWh
    energy_sold: number // kWh
    net_balance: number // kWh (positive = net buyer)
    total_spent: number // €
    total_earned: number // €
    net_cost: number // € (positive = net cost)
    average_buy_price: number // €/kWh
    average_sell_price: number // €/kWh
    total_trades: number
  }
  savings: {
    vs_standard_tariff: number // €
    vs_feed_in_tariff: number // €
    grid_fees_avoided: number // €
    total_savings: number // €
    savings_percentage: number // %
  }
  environmental: {
    renewable_energy_consumed: number // kWh
    co2_avoided: number // kg
    local_energy_share: number // %
  }
  performance: {
    active_rules: number
    successful_matches: number
    match_rate: number // %
    reliability_score: number // 0-100
  }
}

export interface CommunityInsights {
  community_id: string
  period: string
  participation: {
    active_traders: number
    participation_rate: number // %
    new_members: number
    trading_frequency: number // trades per member per period
  }
  market_efficiency: {
    price_volatility: number
    supply_demand_balance: number // -1 to 1
    average_trade_size: number // kWh
    market_liquidity: number // 0-100
  }
  sustainability: {
    renewable_share: number // %
    grid_independence: number // %
    co2_intensity: number // kg/kWh
    circular_economy_score: number // 0-100
  }
  leaderboards: {
    top_sharers: Array<{
      anonymous_id: string
      energy_shared: number // kWh
      rank: number
    }>
    top_green_consumers: Array<{
      anonymous_id: string
      renewable_share: number // %
      rank: number
    }>
    most_reliable: Array<{
      anonymous_id: string
      reliability_score: number
      rank: number
    }>
  }
}

export interface CommunityAlert {
  id: string
  community_id: string
  type: 'price_spike' | 'surplus_available' | 'high_demand' | 'grid_outage' | 'regulatory_update'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  action_required: boolean
  action_url?: string
  affects_trading: boolean
  created_at: string
  expires_at?: string
}

// API Response Types
export interface CommunityDashboardData {
  community: Community
  member: CommunityMember
  stats: CommunityStats
  price_signals: CommunityPriceSignal
  recent_trades: Trade[]
  active_offers: TradingOffer[]
  alerts: CommunityAlert[]
  personal_stats: PersonalTradingStats
}

export interface P2PMarketData {
  community_id: string
  current_price: CommunityPriceSignal
  buy_offers: TradingOffer[]
  sell_offers: TradingOffer[]
  recent_trades: Trade[]
  market_stats: {
    total_volume_24h: number
    average_price_24h: number
    active_offers: number
    price_range: { min: number; max: number }
  }
}

export interface TradingHistoryData {
  trades: Trade[]
  stats: PersonalTradingStats
  monthly_summary: Array<{
    month: string
    energy_bought: number
    energy_sold: number
    net_savings: number
    co2_avoided: number
  }>
}
