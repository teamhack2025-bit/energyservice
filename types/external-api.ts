// External API Response Types
export interface ExternalAPIResponse {
  house_id: string
  timestamp: string
  last_updated: string
  metrics: ExternalMetrics
  consumption: ConsumptionData
  production: ProductionData
  net_balance: NetBalanceData
  energy_balance: EnergyBalanceData
  quick_actions: QuickAction[]
}

export interface ExternalMetrics {
  net_today: MetricData
  cost_this_month: MetricData
  revenue_this_month: MetricData
  efficiency: MetricData
  today_production: MetricData
  today_consumption: MetricData
}

export interface MetricData {
  value: number
  unit: string
  change: number
  change_direction: 'up' | 'down' | 'neutral'
  label: string
}

export interface ConsumptionData {
  title: string
  subtitle: string
  dates: string[]
  data: DayData[]
  unit: string
}

export interface ProductionData {
  title: string
  subtitle: string
  dates: string[]
  data: DayData[]
  unit: string
}

export interface DayData {
  date: string
  values: number[]  // 24 hourly values
  average: number
}

export interface NetBalanceData {
  title: string
  subtitle: string
  dates: string[]
  data: NetBalanceDayData[]
  unit: string
}

export interface NetBalanceDayData {
  date: string
  import: number
  export: number
  net: number
}

export interface EnergyBalanceData {
  title: string
  produced: {
    value: number
    unit: string
    percentage: number
  }
  consumed: {
    value: number
    unit: string
    percentage: number
  }
  net: {
    value: number
    unit: string
    percentage: number
  }
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: string
}

// Internal Dashboard Data Types
export interface InternalDashboardData {
  todayStats: {
    netBalance: number
    production: number
    consumption: number
    efficiency: number
  }
  monthlyStats: {
    cost: number
    revenue: number
  }
  metrics: {
    netToday: {
      value: number
      change: number
      direction: 'up' | 'down' | 'neutral'
    }
    costThisMonth: {
      value: number
      change: number
      direction: 'up' | 'down' | 'neutral'
    }
    revenueThisMonth: {
      value: number
      change: number
      direction: 'up' | 'down' | 'neutral'
    }
    efficiency: {
      value: number
      change: number
      direction: 'up' | 'down' | 'neutral'
    }
    todayProduction: {
      value: number
      change: number
      direction: 'up' | 'down' | 'neutral'
    }
    todayConsumption: {
      value: number
      change: number
      direction: 'up' | 'down' | 'neutral'
    }
  }
  last30Days: Array<{
    timestamp: string
    importKwh: number
    exportKwh: number
    netKwh: number
  }>
  last7DaysConsumption: Array<{
    date: string
    hourlyValues: number[]
    average: number
  }>
  last7DaysProduction: Array<{
    date: string
    hourlyValues: number[]
    average: number
  }>
  energyBalance: {
    produced: number
    consumed: number
    net: number
  }
  quickActions: Array<{
    id: string
    title: string
    description: string
    icon: string
    href: string
  }>
}
