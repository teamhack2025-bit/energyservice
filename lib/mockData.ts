import { format, subDays, subMonths } from 'date-fns'
import type { 
  ConsumptionData, 
  ProductionData, 
  NetBalanceData, 
  Invoice, 
  Device, 
  Notification,
  Contract 
} from '@/types'

// Generate mock consumption data
export function generateConsumptionData(days: number = 30): ConsumptionData[] {
  const data: ConsumptionData[] = []
  const baseConsumption = 15 // kWh per day
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i)
    // Add some randomness
    const variation = (Math.random() - 0.5) * 5
    const consumption = Math.max(5, baseConsumption + variation)
    const cost = consumption * 0.30 // €0.30 per kWh
    
    data.push({
      timestamp: date,
      consumptionKwh: Math.round(consumption * 100) / 100,
      cost: Math.round(cost * 100) / 100,
    })
  }
  
  return data
}

// Generate mock production data
export function generateProductionData(days: number = 30): ProductionData[] {
  const data: ProductionData[] = []
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i)
    // Production varies by day (more in summer)
    const baseProduction = 18 + Math.sin(i / 10) * 5
    const production = Math.max(0, baseProduction + (Math.random() - 0.5) * 3)
    const selfConsumed = production * 0.6 // 60% self-consumed
    const exported = production - selfConsumed
    
    data.push({
      timestamp: date,
      productionKwh: Math.round(production * 100) / 100,
      selfConsumedKwh: Math.round(selfConsumed * 100) / 100,
      exportedKwh: Math.round(exported * 100) / 100,
    })
  }
  
  return data
}

// Generate mock net balance data
export function generateNetBalanceData(days: number = 30): NetBalanceData[] {
  const consumption = generateConsumptionData(days)
  const production = generateProductionData(days)
  
  return consumption.map((cons, i) => {
    const prod = production[i] || { productionKwh: 0, selfConsumedKwh: 0, exportedKwh: 0 }
    const importKwh = Math.max(0, cons.consumptionKwh - prod.selfConsumedKwh)
    const exportKwh = prod.exportedKwh
    const netKwh = importKwh - exportKwh
    const cost = importKwh * 0.30
    const revenue = exportKwh * 0.10
    
    return {
      timestamp: cons.timestamp,
      importKwh: Math.round(importKwh * 100) / 100,
      exportKwh: Math.round(exportKwh * 100) / 100,
      netKwh: Math.round(netKwh * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
    }
  })
}

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001234',
    periodStart: '2025-01-01',
    periodEnd: '2025-01-31',
    total: 93.95,
    status: 'paid',
    dueDate: '2025-02-15',
    paidAt: '2025-02-10',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-001233',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    total: 102.30,
    status: 'paid',
    dueDate: '2025-01-15',
    paidAt: '2025-01-10',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-001232',
    periodStart: '2024-11-01',
    periodEnd: '2024-11-30',
    total: 88.50,
    status: 'unpaid',
    dueDate: '2024-12-15',
  },
]

// Mock devices
export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Main Meter',
    type: 'meter',
    status: 'online',
    siteId: '1',
    lastSeenAt: new Date().toISOString(),
    metadata: { reading: 12345.5, unit: 'kWh' },
  },
  {
    id: '2',
    name: 'Home Solar',
    type: 'solar',
    status: 'online',
    siteId: '1',
    lastSeenAt: new Date().toISOString(),
    metadata: { capacityKw: 5.0, todayKwh: 18.5 },
  },
  {
    id: '3',
    name: 'Home Battery',
    type: 'battery',
    status: 'online',
    siteId: '1',
    lastSeenAt: new Date().toISOString(),
    metadata: { capacityKwh: 10.0, chargePercent: 75 },
  },
  {
    id: '4',
    name: 'EV Charger',
    type: 'ev_charger',
    status: 'online',
    siteId: '1',
    lastSeenAt: new Date().toISOString(),
    metadata: { maxPowerKw: 7.4 },
  },
]

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    severity: 'warning',
    title: 'High consumption detected',
    message: 'Your consumption today is 30% higher than average.',
    read: false,
    createdAt: subDays(new Date(), 0).toISOString(),
    actionUrl: '/consumption',
  },
  {
    id: '2',
    type: 'device',
    severity: 'success',
    title: 'Solar inverter back online',
    message: 'Your solar inverter is now online.',
    read: false,
    createdAt: subDays(new Date(), 1).toISOString(),
    actionUrl: '/devices/2',
  },
  {
    id: '3',
    type: 'billing',
    severity: 'info',
    title: 'Invoice available',
    message: 'Your January invoice is ready.',
    read: true,
    createdAt: subDays(new Date(), 2).toISOString(),
    actionUrl: '/billing/1',
  },
]

// Mock contracts
export const mockContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'CON-2025-001234',
    siteId: '1',
    siteName: 'Home',
    tariff: {
      name: 'Standard Variable',
      type: 'variable',
      basePricePerKwh: 0.30,
    },
    status: 'active',
    startDate: '2025-01-01',
    autoRenew: true,
  },
]

// Mock user
export const mockUser = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'prosumer' as const,
}

// Mock sites
export const mockSites = [
  {
    id: '1',
    name: 'Home',
    address: '123 Main St, Berlin, 10115',
    isPrimary: true,
  },
]

