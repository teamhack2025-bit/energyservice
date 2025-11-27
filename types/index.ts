export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'customer' | 'prosumer' | 'business' | 'admin'
}

export interface Site {
  id: string
  name: string
  address: string
  isPrimary: boolean
}

export interface MetricCard {
  title: string
  value: string | number
  unit?: string
  trend?: {
    value: number
    period: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: string
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

export interface ConsumptionData {
  timestamp: Date
  consumptionKwh: number
  cost: number
}

export interface ProductionData {
  timestamp: Date
  productionKwh: number
  selfConsumedKwh: number
  exportedKwh: number
}

export interface NetBalanceData {
  timestamp: Date
  importKwh: number
  exportKwh: number
  netKwh: number
  cost: number
  revenue: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  periodStart: string
  periodEnd: string
  total: number
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidAt?: string
}

export interface Device {
  id: string
  name: string
  type: 'meter' | 'solar' | 'battery' | 'ev_charger' | 'smart_plug'
  status: 'online' | 'offline' | 'warning' | 'fault'
  siteId: string
  lastSeenAt?: string
  metadata?: Record<string, any>
}

export interface Notification {
  id: string
  type: 'alert' | 'billing' | 'contract' | 'device' | 'system'
  severity: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface Contract {
  id: string
  contractNumber: string
  siteId: string
  siteName: string
  tariff: {
    name: string
    type: string
    basePricePerKwh: number
  }
  status: 'active' | 'pending' | 'expired'
  startDate: string
  endDate?: string
  autoRenew: boolean
}

