import { 
  Community, 
  CommunityStats, 
  CommunityMember, 
  TradingOffer, 
  Trade, 
  TradingRule, 
  CommunityPriceSignal, 
  PersonalTradingStats, 
  CommunityInsights,
  CommunityAlert,
  CommunityDashboardData,
  P2PMarketData,
  TradingHistoryData
} from '@/types/community'

// Generate mock community data
export function generateCommunity(): Community {
  return {
    id: 'community-belval-1',
    name: 'Belval Energy Community',
    description: 'Local renewable energy sharing community in Belval, Luxembourg',
    type: 'citizen_energy_community',
    location: {
      district: 'Esch-sur-Alzette',
      postcode_zone: 'L-40xx',
      coordinates: { lat: 49.5022, lon: 5.9492 }
    },
    members: {
      total: 127,
      active: 89,
      prosumers: 45,
      consumers: 82
    },
    stats: generateCommunityStats(),
    created_at: '2023-03-15T00:00:00Z',
    regulatory_framework: 'EU_2019_944'
  }
}

export function generateCommunityStats(): CommunityStats {
  const hour = new Date().getHours()
  const isDaytime = hour >= 6 && hour <= 20
  
  return {
    period: 'today',
    production: {
      total: 1247.5,
      solar: 1180.2,
      wind: 45.8,
      other_renewable: 21.5
    },
    consumption: {
      total: 1156.8,
      self_consumed: 892.3,
      traded_p2p: 264.5,
      grid_imported: 0
    },
    trading: {
      total_volume: 264.5,
      total_value: 52.9,
      average_price: 0.20,
      transactions: 23,
      savings_vs_grid: 18.7
    },
    environmental: {
      co2_avoided: 587.2,
      renewable_share: 94.6,
      self_sufficiency: 107.8
    }
  }
}

export function generateCommunityMembers(): CommunityMember[] {
  const members = []
  const districts = ['Center', 'North', 'South', 'East', 'West']
  const types = ['prosumer', 'consumer', 'storage_operator'] as const
  
  for (let i = 1; i <= 20; i++) {
    members.push({
      id: `member-${i}`,
      anonymous_id: `House ${String.fromCharCode(65 + Math.floor(i / 10))}${i % 10 || 10}`,
      type: types[Math.floor(Math.random() * types.length)],
      role: 'member' as const,
      location: {
        district: districts[Math.floor(Math.random() * districts.length)],
        approximate_address: Math.random() > 0.5 ? `Near ${['Main St', 'Park Ave', 'Oak Rd', 'Hill Dr'][Math.floor(Math.random() * 4)]}` : undefined
      },
      reputation: {
        score: Math.floor(Math.random() * 30) + 70,
        reliability: Math.floor(Math.random() * 20) + 80,
        total_trades: Math.floor(Math.random() * 100) + 10,
        successful_trades: Math.floor(Math.random() * 95) + 5
      },
      privacy_settings: {
        show_location: Math.random() > 0.3,
        show_production_capacity: Math.random() > 0.4,
        show_trading_history: Math.random() > 0.6
      },
      joined_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return members
}

export function generateTradingOffers(): TradingOffer[] {
  const offers = []
  const members = generateCommunityMembers()
  const energyTypes = ['solar', 'wind', 'battery', 'mixed'] as const
  const timeWindows = ['next 2 hours', 'today', 'this evening', 'tomorrow morning']
  
  // Generate buy offers
  for (let i = 0; i < 8; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    offers.push({
      id: `buy-offer-${i + 1}`,
      community_id: 'community-belval-1',
      member_id: member.id,
      anonymous_id: member.anonymous_id,
      type: 'buy' as const,
      status: 'active' as const,
      energy: {
        quantity: Math.floor(Math.random() * 15) + 2,
        remaining: Math.floor(Math.random() * 15) + 2,
        energy_type: energyTypes[Math.floor(Math.random() * energyTypes.length)],
        green_certificate: Math.random() > 0.3
      },
      pricing: {
        price: Math.round((Math.random() * 0.1 + 0.15) * 100) / 100,
        price_type: 'fixed' as const
      },
      timing: {
        delivery_start: new Date(Date.now() + Math.random() * 8 * 60 * 60 * 1000).toISOString(),
        delivery_end: new Date(Date.now() + (Math.random() * 16 + 8) * 60 * 60 * 1000).toISOString(),
        flexibility: ['none', 'low', 'medium', 'high'][Math.floor(Math.random() * 4)] as any,
        time_window: timeWindows[Math.floor(Math.random() * timeWindows.length)]
      },
      conditions: {
        min_quantity: Math.floor(Math.random() * 3) + 1,
        location_preference: ['neighborhood', 'district', 'any'][Math.floor(Math.random() * 3)] as any,
        green_only: Math.random() > 0.4
      },
      created_at: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  // Generate sell offers
  for (let i = 0; i < 12; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    offers.push({
      id: `sell-offer-${i + 1}`,
      community_id: 'community-belval-1',
      member_id: member.id,
      anonymous_id: member.anonymous_id,
      type: 'sell' as const,
      status: 'active' as const,
      energy: {
        quantity: Math.floor(Math.random() * 25) + 5,
        remaining: Math.floor(Math.random() * 25) + 5,
        energy_type: energyTypes[Math.floor(Math.random() * energyTypes.length)],
        green_certificate: Math.random() > 0.2
      },
      pricing: {
        price: Math.round((Math.random() * 0.08 + 0.18) * 100) / 100,
        price_type: 'fixed' as const,
        min_price: Math.round((Math.random() * 0.05 + 0.15) * 100) / 100
      },
      timing: {
        delivery_start: new Date(Date.now() + Math.random() * 4 * 60 * 60 * 1000).toISOString(),
        delivery_end: new Date(Date.now() + (Math.random() * 12 + 4) * 60 * 60 * 1000).toISOString(),
        flexibility: ['none', 'low', 'medium', 'high'][Math.floor(Math.random() * 4)] as any,
        time_window: timeWindows[Math.floor(Math.random() * timeWindows.length)]
      },
      conditions: {
        max_quantity: Math.floor(Math.random() * 10) + 5,
        location_preference: ['neighborhood', 'district', 'any'][Math.floor(Math.random() * 3)] as any
      },
      created_at: new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + Math.random() * 18 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return offers
}

export function generateRecentTrades(): Trade[] {
  const trades = []
  const members = generateCommunityMembers()
  
  for (let i = 0; i < 15; i++) {
    const buyer = members[Math.floor(Math.random() * members.length)]
    const seller = members[Math.floor(Math.random() * members.length)]
    
    if (buyer.id === seller.id) continue
    
    const quantity = Math.floor(Math.random() * 20) + 2
    const price = Math.round((Math.random() * 0.08 + 0.16) * 100) / 100
    
    trades.push({
      id: `trade-${i + 1}`,
      community_id: 'community-belval-1',
      buyer_id: buyer.id,
      seller_id: seller.id,
      buyer_anonymous_id: buyer.anonymous_id,
      seller_anonymous_id: seller.anonymous_id,
      status: ['confirmed', 'delivered', 'settled'][Math.floor(Math.random() * 3)] as any,
      energy: {
        quantity,
        delivered: quantity,
        energy_type: 'solar',
        green_certificate: Math.random() > 0.2
      },
      pricing: {
        agreed_price: price,
        total_value: Math.round(quantity * price * 100) / 100,
        platform_fee: Math.round(quantity * price * 0.02 * 100) / 100,
        net_amount: Math.round(quantity * price * 0.98 * 100) / 100
      },
      timing: {
        agreed_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        delivery_start: new Date(Date.now() - Math.random() * 20 * 60 * 60 * 1000).toISOString(),
        delivery_end: new Date(Date.now() - Math.random() * 16 * 60 * 60 * 1000).toISOString(),
        settled_at: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString()
      },
      grid_impact: {
        avoided_grid_import: quantity * 0.8,
        avoided_grid_export: quantity * 0.2,
        grid_fees_saved: Math.round(quantity * 0.05 * 100) / 100
      },
      created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return trades.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function generateTradingRules(): TradingRule[] {
  return [
    {
      id: 'rule-1',
      user_id: 'current-user',
      community_id: 'community-belval-1',
      name: 'Buy Cheap Solar',
      type: 'buy',
      status: 'active',
      conditions: {
        max_energy_per_day: 10,
        max_price: 0.20,
        time_windows: [{ start: '10:00', end: '16:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }],
        energy_type_preference: 'solar',
        green_only: true,
        location_preference: 'neighborhood'
      },
      limits: {
        daily_limit: 10,
        weekly_limit: 50,
        monthly_limit: 200
      },
      performance: {
        total_matched: 156.5,
        total_value: 31.3,
        average_price: 0.19,
        success_rate: 87,
        estimated_monthly_savings: 12.50
      },
      created_at: '2024-01-15T10:00:00Z',
      last_triggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rule-2',
      user_id: 'current-user',
      community_id: 'community-belval-1',
      name: 'Sell Excess Solar',
      type: 'sell',
      status: 'active',
      conditions: {
        min_price: 0.18,
        min_battery_soc: 80,
        time_windows: [{ start: '11:00', end: '15:00', days: ['saturday', 'sunday'] }],
        location_preference: 'district'
      },
      limits: {
        daily_limit: 15,
        weekly_limit: 75,
        monthly_limit: 300
      },
      performance: {
        total_matched: 89.2,
        total_value: 16.8,
        average_price: 0.188,
        success_rate: 92,
        estimated_monthly_savings: 8.20
      },
      created_at: '2024-01-20T14:30:00Z',
      last_triggered: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ]
}

export function generateCommunityPriceSignal(): CommunityPriceSignal {
  const hour = new Date().getHours()
  const basePrice = 0.19
  const variation = Math.sin((hour - 12) / 24 * 2 * Math.PI) * 0.03
  
  return {
    timestamp: new Date().toISOString(),
    community_id: 'community-belval-1',
    pricing: {
      current_p2p_price: Math.round((basePrice + variation) * 100) / 100,
      grid_import_price: 0.28,
      grid_export_price: 0.08,
      dynamic_tariff: hour >= 7 && hour <= 22 ? 0.32 : 0.18
    },
    market_conditions: {
      supply: 45.8,
      demand: 38.2,
      balance: 'surplus',
      price_trend: hour < 12 ? 'rising' : 'falling'
    },
    forecast: {
      next_hour_price: Math.round((basePrice + variation * 1.1) * 100) / 100,
      next_4h_trend: hour < 14 ? 'up' : 'down',
      peak_expected_at: '19:00',
      surplus_expected_at: '13:00'
    },
    signals: {
      good_time_to_buy: hour >= 11 && hour <= 15,
      good_time_to_sell: hour >= 10 && hour <= 14,
      price_above_grid: false,
      high_renewable_availability: hour >= 9 && hour <= 17
    }
  }
}

export function generatePersonalTradingStats(): PersonalTradingStats {
  return {
    user_id: 'current-user',
    community_id: 'community-belval-1',
    period: 'month',
    trading: {
      energy_bought: 89.5,
      energy_sold: 156.8,
      net_balance: -67.3,
      total_spent: 17.9,
      total_earned: 29.5,
      net_cost: -11.6,
      average_buy_price: 0.20,
      average_sell_price: 0.188,
      total_trades: 23
    },
    savings: {
      vs_standard_tariff: 25.1,
      vs_feed_in_tariff: 12.5,
      grid_fees_avoided: 4.8,
      total_savings: 42.4,
      savings_percentage: 18.5
    },
    environmental: {
      renewable_energy_consumed: 234.6,
      co2_avoided: 110.5,
      local_energy_share: 73.2
    },
    performance: {
      active_rules: 2,
      successful_matches: 21,
      match_rate: 91.3,
      reliability_score: 94
    }
  }
}

export function generateCommunityInsights(): CommunityInsights {
  return {
    community_id: 'community-belval-1',
    period: 'month',
    participation: {
      active_traders: 89,
      participation_rate: 70.1,
      new_members: 8,
      trading_frequency: 2.3
    },
    market_efficiency: {
      price_volatility: 0.12,
      supply_demand_balance: 0.15,
      average_trade_size: 12.5,
      market_liquidity: 78
    },
    sustainability: {
      renewable_share: 94.6,
      grid_independence: 87.3,
      co2_intensity: 0.05,
      circular_economy_score: 82
    },
    leaderboards: {
      top_sharers: [
        { anonymous_id: 'House A7', energy_shared: 245.8, rank: 1 },
        { anonymous_id: 'Prosumer #23', energy_shared: 198.2, rank: 2 },
        { anonymous_id: 'House B12', energy_shared: 176.5, rank: 3 },
        { anonymous_id: 'House C4', energy_shared: 165.1, rank: 4 },
        { anonymous_id: 'Prosumer #8', energy_shared: 152.9, rank: 5 }
      ],
      top_green_consumers: [
        { anonymous_id: 'House D15', renewable_share: 98.5, rank: 1 },
        { anonymous_id: 'House A3', renewable_share: 96.8, rank: 2 },
        { anonymous_id: 'Prosumer #19', renewable_share: 95.2, rank: 3 },
        { anonymous_id: 'House B8', renewable_share: 94.1, rank: 4 },
        { anonymous_id: 'House C11', renewable_share: 92.7, rank: 5 }
      ],
      most_reliable: [
        { anonymous_id: 'Prosumer #23', reliability_score: 98, rank: 1 },
        { anonymous_id: 'House A7', reliability_score: 97, rank: 2 },
        { anonymous_id: 'House B12', reliability_score: 96, rank: 3 },
        { anonymous_id: 'House D15', reliability_score: 95, rank: 4 },
        { anonymous_id: 'House C4', reliability_score: 94, rank: 5 }
      ]
    }
  }
}

export function generateCommunityAlerts(): CommunityAlert[] {
  return [
    {
      id: 'alert-1',
      community_id: 'community-belval-1',
      type: 'surplus_available',
      severity: 'info',
      title: 'High Solar Production Expected',
      message: 'Weather forecast shows excellent solar conditions for the next 3 days. Great opportunity for energy trading!',
      action_required: false,
      affects_trading: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'alert-2',
      community_id: 'community-belval-1',
      type: 'price_spike',
      severity: 'warning',
      title: 'Grid Prices Rising',
      message: 'Grid import prices are 15% higher than usual. Consider buying from community members instead.',
      action_required: false,
      affects_trading: true,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
    }
  ]
}

// Main data aggregation functions
export function generateCommunityDashboardData(): CommunityDashboardData {
  return {
    community: generateCommunity(),
    member: generateCommunityMembers()[0],
    stats: generateCommunityStats(),
    price_signals: generateCommunityPriceSignal(),
    recent_trades: generateRecentTrades().slice(0, 5),
    active_offers: generateTradingOffers().slice(0, 8),
    alerts: generateCommunityAlerts(),
    personal_stats: generatePersonalTradingStats()
  }
}

export function generateP2PMarketData(): P2PMarketData {
  const offers = generateTradingOffers()
  return {
    community_id: 'community-belval-1',
    current_price: generateCommunityPriceSignal(),
    buy_offers: offers.filter(o => o.type === 'buy'),
    sell_offers: offers.filter(o => o.type === 'sell'),
    recent_trades: generateRecentTrades().slice(0, 10),
    market_stats: {
      total_volume_24h: 264.5,
      average_price_24h: 0.195,
      active_offers: offers.length,
      price_range: { min: 0.15, max: 0.25 }
    }
  }
}

export function generateTradingHistoryData(): TradingHistoryData {
  return {
    trades: generateRecentTrades(),
    stats: generatePersonalTradingStats(),
    monthly_summary: [
      { month: '2024-01', energy_bought: 67.2, energy_sold: 123.5, net_savings: 28.4, co2_avoided: 89.2 },
      { month: '2024-02', energy_bought: 78.9, energy_sold: 145.8, net_savings: 35.1, co2_avoided: 102.7 },
      { month: '2024-03', energy_bought: 89.5, energy_sold: 156.8, net_savings: 42.4, co2_avoided: 110.5 }
    ]
  }
}
