export interface EnergyFlow {
  timestamp: string
  solar: {
    production: number // kW
    toHouse: number
    toGrid: number
    toBattery: number
  }
  battery: {
    soc: number // %
    power: number // kW (+ charging, - discharging)
    capacity: number // kWh
    estimatedRuntime: number // minutes
  }
  grid: {
    import: number // kW
    export: number // kW
    currentPrice: number // €/kWh
    tariff: 'peak' | 'offpeak' | 'shoulder'
  }
  consumption: {
    total: number // kW
    byRoom: Record<string, number>
    byDevice: Record<string, number>
  }
  ev: {
    charging: boolean
    power: number // kW
    soc: number // %
    timeToFull: number // minutes
    cost: number // €
  }
  gas: {
    flowRate: number // m³/h
    todayUsage: number // m³
    heatingActive: boolean
  }
  heatPump: {
    active: boolean
    power: number // kW
    mode: 'heating' | 'cooling' | 'off'
    targetTemp: number
    currentTemp: number
  }
}

export interface Device {
  id: string
  name: string
  type: 'solar' | 'battery' | 'ev' | 'appliance' | 'hvac' | 'smartplug' | 'gas' | 'heatpump'
  room?: string
  status: 'online' | 'offline' | 'error'
  power: number // Current power (W)
  energy: number // Today's energy (kWh)
  controllable: boolean
  icon: string
}

export interface EnergyAlert {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  timestamp: string
  dismissed: boolean
}

export interface FinancialSummary {
  today: {
    cost: number
    revenue: number
    netBalance: number
    co2Saved: number // kg
  }
  month: {
    cost: number
    revenue: number
    netBalance: number
    savingsVsLastMonth: number
  }
}

export interface EnergyScore {
  score: number // 0-100
  breakdown: {
    selfConsumption: number
    batteryEfficiency: number
    peakAvoidance: number
    costOptimization: number
    carbonReduction: number
  }
  badges: Array<{
    id: string
    name: string
    icon: string
    earned: boolean
    earnedAt?: string
  }>
  streak: number // days
}

export interface TimelineData {
  hour: number
  solar: number
  consumption: number
  export: number
  import: number
  batterySoc: number
  gridPrice: number
}
