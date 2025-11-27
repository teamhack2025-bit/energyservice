import { supabase } from './client'

// ============================================
// USER QUERIES
// ============================================

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function getUserSites(userId: string) {
  // First get accounts for the user
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId)
  
  if (accountsError) throw accountsError
  if (!accounts || accounts.length === 0) return []
  
  const accountIds = accounts.map(a => a.id)
  
  // Then get sites for those accounts
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .in('account_id', accountIds)
  
  if (error) throw error
  return data || []
}

// ============================================
// CONSUMPTION QUERIES
// ============================================

export async function getConsumptionData(siteId: string, startDate: Date, endDate: Date, granularity: '15min' | 'hourly' | 'daily' | 'monthly' = 'daily') {
  // Get meters for the site
  const { data: meters, error: metersError } = await supabase
    .from('meters')
    .select('id')
    .eq('site_id', siteId)
    .eq('status', 'active')
  
  if (metersError) throw metersError
  if (!meters || meters.length === 0) return []
  
  const meterIds = meters.map(m => m.id)
  
  // Get readings
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .in('meter_id', meterIds)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: true })
  
  if (error) throw error
  
  // Aggregate by granularity
  return aggregateReadings(data || [], granularity)
}

function aggregateReadings(readings: any[], granularity: string) {
  if (granularity === 'daily') {
    const dailyMap = new Map<string, { timestamp: Date; consumptionKwh: number; cost: number }>()
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || { timestamp: new Date(date), consumptionKwh: 0, cost: 0 }
      existing.consumptionKwh += reading.delta || 0
      existing.cost += (reading.delta || 0) * 0.30 // Base price
      dailyMap.set(date, existing)
    })
    
    return Array.from(dailyMap.values())
  }
  
  // For other granularities, return as-is for now
  return readings.map(r => ({
    timestamp: new Date(r.timestamp),
    consumptionKwh: r.delta || 0,
    cost: (r.delta || 0) * 0.30,
  }))
}

// ============================================
// PRODUCTION QUERIES
// ============================================

export async function getProductionData(siteId: string, startDate: Date, endDate: Date) {
  // Get solar systems for the site
  const { data: solarSystems, error: systemsError } = await supabase
    .from('solar_systems')
    .select('id')
    .eq('site_id', siteId)
    .eq('status', 'active')
  
  if (systemsError) throw systemsError
  if (!solarSystems || solarSystems.length === 0) return []
  
  const systemIds = solarSystems.map(s => s.id)
  
  const { data, error } = await supabase
    .from('production_readings')
    .select('*')
    .in('solar_system_id', systemIds)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: true })
  
  if (error) throw error
  
  return (data || []).map(r => ({
    timestamp: new Date(r.timestamp),
    productionKwh: r.delta_kwh || 0,
    selfConsumedKwh: r.self_consumed_kwh || 0,
    exportedKwh: r.exported_kwh || 0,
  }))
}

// ============================================
// NET BALANCE QUERIES
// ============================================

export async function getNetBalanceData(siteId: string, startDate: Date, endDate: Date) {
  const [consumption, production] = await Promise.all([
    getConsumptionData(siteId, startDate, endDate, 'daily'),
    getProductionData(siteId, startDate, endDate),
  ])
  
  // Combine consumption and production data
  const consumptionMap = new Map<string, typeof consumption[0]>()
  consumption.forEach(c => {
    const date = (c.timestamp instanceof Date ? c.timestamp : new Date(c.timestamp)).toISOString().split('T')[0]
    consumptionMap.set(date, c)
  })
  
  const productionMap = new Map<string, typeof production[0]>()
  production.forEach(p => {
    const date = (p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp)).toISOString().split('T')[0]
    productionMap.set(date, p)
  })
  
  // Get all unique dates
  const allDates = new Set([...consumptionMap.keys(), ...productionMap.keys()])
  
  return Array.from(allDates).map(date => {
    const cons = consumptionMap.get(date) || { consumptionKwh: 0, cost: 0 }
    const prod = productionMap.get(date) || { productionKwh: 0, exportedKwh: 0, selfConsumedKwh: 0 }
    
    const importKwh = Math.max(0, cons.consumptionKwh - prod.selfConsumedKwh)
    const exportKwh = prod.exportedKwh
    const netKwh = importKwh - exportKwh
    const cost = importKwh * 0.30
    const revenue = exportKwh * 0.10
    
    return {
      timestamp: new Date(date),
      importKwh: Math.round(importKwh * 100) / 100,
      exportKwh: Math.round(exportKwh * 100) / 100,
      netKwh: Math.round(netKwh * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
    }
  }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// ============================================
// INVOICE QUERIES
// ============================================

export async function getInvoices(userId: string) {
  // First get accounts for the user
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId)
  
  if (accountsError) throw accountsError
  if (!accounts || accounts.length === 0) return []
  
  const accountIds = accounts.map(a => a.id)
  
  // Then get contracts for those accounts
  const { data: contracts, error: contractsError } = await supabase
    .from('contracts')
    .select('id')
    .in('account_id', accountIds)
  
  if (contractsError) throw contractsError
  if (!contracts || contracts.length === 0) return []
  
  const contractIds = contracts.map(c => c.id)
  
  // Finally get invoices for those contracts
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .in('contract_id', contractIds)
    .order('period_end', { ascending: false })
  
  if (error) throw error
  
  return (data || []).map(invoice => ({
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    periodStart: invoice.period_start,
    periodEnd: invoice.period_end,
    total: parseFloat(invoice.total),
    status: invoice.status,
    dueDate: invoice.due_date,
    paidAt: invoice.paid_at,
  }))
}

// ============================================
// DEVICE QUERIES
// ============================================

export async function getDevices(siteId: string) {
  const [meters, solarSystems, batteries, evChargers, smartPlugs] = await Promise.all([
    supabase.from('meters').select('*').eq('site_id', siteId),
    supabase.from('solar_systems').select('*').eq('site_id', siteId),
    supabase.from('batteries').select('*').eq('site_id', siteId),
    supabase.from('ev_chargers').select('*').eq('site_id', siteId),
    supabase.from('smart_plugs').select('*').eq('site_id', siteId),
  ])
  
  const devices: any[] = []
  
  if (meters.data) {
    meters.data.forEach(m => {
      devices.push({
        id: m.id,
        name: m.meter_number,
        type: 'meter' as const,
        status: m.status === 'active' ? 'online' : 'offline',
        siteId: m.site_id,
        lastSeenAt: m.last_reading_date,
        metadata: {
          reading: m.last_reading_value,
          unit: 'kWh',
        },
      })
    })
  }
  
  if (solarSystems.data) {
    solarSystems.data.forEach(s => {
      devices.push({
        id: s.id,
        name: s.name,
        type: 'solar' as const,
        status: s.status === 'active' ? 'online' : 'offline',
        siteId: s.site_id,
        metadata: {
          capacityKw: parseFloat(s.capacity_kw),
        },
      })
    })
  }
  
  if (batteries.data) {
    batteries.data.forEach(b => {
      devices.push({
        id: b.id,
        name: b.name,
        type: 'battery' as const,
        status: b.status === 'online' ? 'online' : 'offline',
        siteId: b.site_id,
        lastSeenAt: b.last_seen_at,
        metadata: {
          capacityKwh: parseFloat(b.capacity_kwh),
          chargePercent: b.current_charge_percent,
        },
      })
    })
  }
  
  if (evChargers.data) {
    evChargers.data.forEach(ev => {
      devices.push({
        id: ev.id,
        name: ev.name,
        type: 'ev_charger' as const,
        status: ev.status === 'online' ? 'online' : 'offline',
        siteId: ev.site_id,
        lastSeenAt: ev.last_seen_at,
        metadata: {
          maxPowerKw: parseFloat(ev.max_power_kw),
        },
      })
    })
  }
  
  if (smartPlugs.data) {
    smartPlugs.data.forEach(sp => {
      devices.push({
        id: sp.id,
        name: sp.name,
        type: 'smart_plug' as const,
        status: sp.status === 'online' ? 'online' : 'offline',
        siteId: sp.site_id,
        lastSeenAt: sp.last_seen_at,
        metadata: {
          currentPowerW: sp.current_power_w,
        },
      })
    })
  }
  
  return devices
}

// ============================================
// NOTIFICATION QUERIES
// ============================================

export async function getNotifications(userId: string, unreadOnly: boolean = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (unreadOnly) {
    query = query.eq('read', false)
  }
  
  const { data, error } = await query.limit(50)
  
  if (error) throw error
  
  return (data || []).map(n => ({
    id: n.id,
    type: n.type,
    severity: n.severity,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.created_at,
    actionUrl: n.action_url,
  }))
}

// ============================================
// CONTRACT QUERIES
// ============================================

export async function getContracts(userId: string) {
  // First get accounts for the user
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId)
  
  if (accountsError) throw accountsError
  if (!accounts || accounts.length === 0) return []
  
  const accountIds = accounts.map(a => a.id)
  
  // Then get contracts for those accounts
  const { data: contracts, error: contractsError } = await supabase
    .from('contracts')
    .select('*, sites(name), tariffs(*)')
    .in('account_id', accountIds)
    .eq('status', 'active')
  
  if (contractsError) throw contractsError
  
  return (contracts || []).map(c => ({
    id: c.id,
    contractNumber: c.contract_number,
    siteId: c.site_id,
    siteName: (c.sites as any)?.name || 'Unknown',
    tariff: {
      name: (c.tariffs as any)?.name || 'Unknown',
      type: (c.tariffs as any)?.type || 'variable',
      basePricePerKwh: parseFloat((c.tariffs as any)?.base_price_per_kwh || '0'),
    },
    status: c.status,
    startDate: c.start_date,
    endDate: c.end_date,
    autoRenew: c.auto_renew,
  }))
}

