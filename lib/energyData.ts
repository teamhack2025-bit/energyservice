import { EnergyFlow, Device, EnergyAlert, FinancialSummary, EnergyScore, TimelineData } from '@/types/energy'

export function generateLiveEnergyFlow(): EnergyFlow {
  const hour = new Date().getHours()
  const isDaytime = hour >= 6 && hour <= 20
  
  // Solar production (higher during day)
  const solarProduction = isDaytime 
    ? Math.random() * 5 + (Math.sin((hour - 6) / 14 * Math.PI) * 3)
    : 0
  
  // Base consumption (higher in morning and evening)
  const baseConsumption = hour >= 6 && hour <= 9 || hour >= 18 && hour <= 22
    ? Math.random() * 3 + 2
    : Math.random() * 1.5 + 0.5
  
  // EV charging (mostly at night)
  const evCharging = hour >= 23 || hour <= 6
  const evPower = evCharging ? Math.random() * 7 + 4 : 0
  
  const totalConsumption = baseConsumption + evPower
  
  // Battery logic
  const batterySoc = Math.random() * 40 + 30 // 30-70%
  const batteryPower = solarProduction > totalConsumption
    ? Math.min(solarProduction - totalConsumption, 5) // Charging
    : totalConsumption > solarProduction ? -Math.min(totalConsumption - solarProduction, 3) : 0 // Discharging
  
  // Grid interaction - FIXED: Only one direction at a time
  // Calculate net power: positive = excess (export), negative = deficit (import)
  const netPower = solarProduction - batteryPower - totalConsumption
  
  // At any given time, EITHER importing OR exporting, never both
  const gridImport = netPower < 0 ? Math.abs(netPower) : 0
  const gridExport = netPower > 0 ? netPower : 0
  
  // Gas usage (higher in winter months, morning/evening)
  const isHeatingTime = hour >= 6 && hour <= 9 || hour >= 18 && hour <= 23
  const gasFlowRate = isHeatingTime ? Math.random() * 2 + 0.5 : Math.random() * 0.3
  
  return {
    timestamp: new Date().toISOString(),
    solar: {
      production: Number(solarProduction.toFixed(2)),
      toHouse: Number(Math.min(solarProduction, totalConsumption).toFixed(2)),
      toGrid: Number(gridExport.toFixed(2)),
      toBattery: Number(Math.max(0, batteryPower).toFixed(2)),
    },
    battery: {
      soc: Number(batterySoc.toFixed(1)),
      power: Number(batteryPower.toFixed(2)),
      capacity: 13.5,
      estimatedRuntime: batteryPower < 0 ? Math.floor((batterySoc / 100 * 13.5) / Math.abs(batteryPower) * 60) : 0,
    },
    grid: {
      import: Number(gridImport.toFixed(2)),
      export: Number(gridExport.toFixed(2)),
      currentPrice: hour >= 7 && hour <= 22 ? 0.28 : 0.15,
      tariff: hour >= 7 && hour <= 22 ? 'peak' : 'offpeak',
    },
    consumption: {
      total: Number(totalConsumption.toFixed(2)),
      byRoom: {
        'Living Room': Number((Math.random() * 0.5 + 0.2).toFixed(2)),
        'Kitchen': Number((Math.random() * 1.2 + 0.3).toFixed(2)),
        'Bedroom': Number((Math.random() * 0.3 + 0.1).toFixed(2)),
        'Office': Number((Math.random() * 0.4 + 0.2).toFixed(2)),
        'Garage': evCharging ? Number(evPower.toFixed(2)) : 0,
      },
      byDevice: {
        'Heat Pump': Number((Math.random() * 1.5 + 0.5).toFixed(2)),
        'EV Charger': evCharging ? Number(evPower.toFixed(2)) : 0,
        'Refrigerator': 0.15,
        'Washing Machine': Math.random() > 0.8 ? 1.8 : 0,
        'Dishwasher': Math.random() > 0.9 ? 1.5 : 0,
        'Lights': Number((Math.random() * 0.3 + 0.1).toFixed(2)),
        'Electronics': Number((Math.random() * 0.5 + 0.2).toFixed(2)),
      },
    },
    ev: {
      charging: evCharging,
      power: Number(evPower.toFixed(2)),
      soc: evCharging ? Math.random() * 40 + 30 : Math.random() * 30 + 60,
      timeToFull: evCharging ? Math.floor(Math.random() * 180 + 60) : 0,
      cost: Number((evPower * 0.15).toFixed(2)),
    },
    gas: {
      flowRate: Number(gasFlowRate.toFixed(2)),
      todayUsage: Number((Math.random() * 5 + 2).toFixed(2)),
      heatingActive: isHeatingTime,
    },
    heatPump: {
      active: isHeatingTime,
      power: isHeatingTime ? Number((Math.random() * 1.5 + 0.5).toFixed(2)) : 0,
      mode: isHeatingTime ? 'heating' : 'off',
      targetTemp: 21,
      currentTemp: Number((Math.random() * 2 + 20).toFixed(1)),
    },
  }
}

export function generateDevices(): Device[] {
  return [
    {
      id: 'solar-1',
      name: 'Solar Panels',
      type: 'solar',
      status: 'online',
      power: 4500,
      energy: 28.5,
      controllable: false,
      icon: 'Sun',
    },
    {
      id: 'battery-1',
      name: 'Home Battery',
      type: 'battery',
      status: 'online',
      power: -1200,
      energy: 8.5,
      controllable: true,
      icon: 'Battery',
    },
    {
      id: 'ev-1',
      name: 'EV Charger',
      type: 'ev',
      room: 'Garage',
      status: 'online',
      power: 7200,
      energy: 45.2,
      controllable: true,
      icon: 'Car',
    },
    {
      id: 'hp-1',
      name: 'Heat Pump',
      type: 'heatpump',
      status: 'online',
      power: 1200,
      energy: 12.5,
      controllable: true,
      icon: 'Thermometer',
    },
    {
      id: 'gas-1',
      name: 'Gas Meter',
      type: 'gas',
      status: 'online',
      power: 0,
      energy: 4.2,
      controllable: false,
      icon: 'Flame',
    },
  ]
}

export function generateAlerts(): EnergyAlert[] {
  return [
    {
      id: '1',
      type: 'success',
      title: 'High Solar Production',
      message: 'Solar forecast is excellent tomorrow. Consider charging battery to 100%.',
      timestamp: new Date().toISOString(),
      dismissed: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Peak Usage Detected',
      message: 'High usage between 19:00-20:00. Shift EV charging to save 40%.',
      action: {
        label: 'Optimize',
        onClick: () => console.log('Optimize charging'),
      },
      timestamp: new Date().toISOString(),
      dismissed: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Battery Optimization',
      message: 'Your battery could save €12/month with smart scheduling.',
      timestamp: new Date().toISOString(),
      dismissed: false,
    },
  ]
}

export function generateFinancialSummary(): FinancialSummary {
  return {
    today: {
      cost: 3.45,
      revenue: 1.85,
      netBalance: -1.60,
      co2Saved: 12.5,
    },
    month: {
      cost: 89.50,
      revenue: 42.30,
      netBalance: -47.20,
      savingsVsLastMonth: 15.80,
    },
  }
}

export function generateEnergyScore(): EnergyScore {
  return {
    score: 78,
    breakdown: {
      selfConsumption: 85,
      batteryEfficiency: 72,
      peakAvoidance: 68,
      costOptimization: 82,
      carbonReduction: 88,
    },
    badges: [
      {
        id: 'solar-day',
        name: '100% Solar Day',
        icon: '☀️',
        earned: true,
        earnedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'zero-grid',
        name: 'Zero Grid Import',
        icon: '🔌',
        earned: true,
        earnedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'efficient-week',
        name: 'Most Efficient Week',
        icon: '⭐',
        earned: false,
      },
      {
        id: 'carbon-hero',
        name: 'Carbon Hero',
        icon: '🌱',
        earned: true,
        earnedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
    ],
    streak: 12,
  }
}

export function generateTimelineData(): TimelineData[] {
  const data: TimelineData[] = []
  const currentHour = new Date().getHours()
  
  for (let hour = 0; hour <= currentHour; hour++) {
    const isDaytime = hour >= 6 && hour <= 20
    const solar = isDaytime ? Math.sin((hour - 6) / 14 * Math.PI) * 5 : 0
    const consumption = hour >= 6 && hour <= 9 || hour >= 18 && hour <= 22
      ? Math.random() * 3 + 2
      : Math.random() * 1.5 + 0.5
    
    const netPower = solar - consumption
    
    data.push({
      hour,
      solar: Number(solar.toFixed(2)),
      consumption: Number(consumption.toFixed(2)),
      export: netPower > 0 ? Number(netPower.toFixed(2)) : 0,
      import: netPower < 0 ? Number(Math.abs(netPower).toFixed(2)) : 0,
      batterySoc: Number((Math.random() * 40 + 30).toFixed(1)),
      gridPrice: hour >= 7 && hour <= 22 ? 0.28 : 0.15,
    })
  }
  
  return data
}
