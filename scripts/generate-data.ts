import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Luxembourg data
const luxembourgCities = [
  { city: 'Luxembourg City', postcodes: ['L-1009', 'L-1011', 'L-1012', 'L-1013', 'L-1014'] },
  { city: 'Esch-sur-Alzette', postcodes: ['L-4001', 'L-4002', 'L-4003', 'L-4004', 'L-4005'] },
  { city: 'Differdange', postcodes: ['L-4501', 'L-4502', 'L-4503', 'L-4504', 'L-4505'] },
  { city: 'Dudelange', postcodes: ['L-3401', 'L-3402', 'L-3403', 'L-3404', 'L-3405'] },
  { city: 'Ettelbruck', postcodes: ['L-9001', 'L-9002', 'L-9003', 'L-9004', 'L-9005'] },
  { city: 'Diekirch', postcodes: ['L-9201', 'L-9202', 'L-9203', 'L-9204', 'L-9205'] },
  { city: 'Wiltz', postcodes: ['L-9501', 'L-9502', 'L-9503', 'L-9504', 'L-9505'] },
  { city: 'Echternach', postcodes: ['L-6401', 'L-6402', 'L-6403', 'L-6404', 'L-6405'] },
  { city: 'Remich', postcodes: ['L-5501', 'L-5502', 'L-5503', 'L-5504', 'L-5505'] },
  { city: 'Grevenmacher', postcodes: ['L-6701', 'L-6702', 'L-6703', 'L-6704', 'L-6705'] }
]

const firstNames = [
  'Jean', 'Marie', 'Pierre', 'Anne', 'Michel', 'Catherine', 'Paul', 'Françoise', 'André', 'Monique',
  'Claude', 'Sylvie', 'Bernard', 'Martine', 'Robert', 'Nicole', 'Henri', 'Brigitte', 'Georges', 'Jacqueline',
  'Marcel', 'Christiane', 'René', 'Denise', 'Roger', 'Simone', 'Louis', 'Jeanne', 'François', 'Yvette'
]

const lastNames = [
  'Muller', 'Schmidt', 'Weber', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer',
  'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann',
  'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 'Huber', 'Mayer'
]

const streetNames = [
  'Rue de la Paix', 'Avenue de la Liberté', 'Rue du Commerce', 'Boulevard Royal', 'Rue de Strasbourg',
  'Avenue Monterey', 'Rue de Hollerich', 'Boulevard de la Pétrusse', 'Rue de Bonnevoie', 'Avenue Gaston Diderich',
  'Rue de Merl', 'Boulevard Prince Henri', 'Rue de Cessange', 'Avenue de la Faïencerie', 'Rue de Hamm'
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function generateCustomers(count: number) {
  console.log(`\n📝 Generating ${count} customers...`)
  const customers = []
  
  for (let i = 1; i <= count; i++) {
    const cityData = getRandomElement(luxembourgCities)
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const streetName = getRandomElement(streetNames)
    const houseNumber = Math.floor(Math.random() * 200) + 1
    
    customers.push({
      id: `customer-${i.toString().padStart(4, '0')}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.lu`,
      name: `${firstName} ${lastName}`,
      address: `${houseNumber} ${streetName}`,
      postcode: getRandomElement(cityData.postcodes),
      city: cityData.city,
      country: 'Luxembourg',
      created_at: generateRandomDate(new Date('2020-01-01'), new Date('2024-01-01')).toISOString(),
      updated_at: new Date().toISOString()
    })
  }
  
  // Insert in batches
  for (let i = 0; i < customers.length; i += 100) {
    const batch = customers.slice(i, i + 100)
    const { error } = await supabase.from('customers').insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting customers batch ${i/100 + 1}:`, error.message)
    } else {
      console.log(`✅ Inserted customers batch ${i/100 + 1} (${batch.length} records)`)
    }
  }
  
  return customers
}

async function generateDevices(customers: any[]) {
  console.log(`\n🔌 Generating devices for customers...`)
  const devices = []
  
  for (const customer of customers) {
    // Always include smart meter
    devices.push({
      id: `device-${customer.id}-meter`,
      customer_id: customer.id,
      device_type: 'smart_meter',
      device_name: 'Smart Meter',
      capacity_kw: 0,
      installation_date: customer.created_at,
      status: 'active'
    })
    
    // 80% chance of solar panels
    if (Math.random() < 0.8) {
      devices.push({
        id: `device-${customer.id}-solar`,
        customer_id: customer.id,
        device_type: 'solar_panel',
        device_name: 'Solar Panel System',
        capacity_kw: Math.round((Math.random() * 8 + 2) * 10) / 10,
        installation_date: generateRandomDate(new Date(customer.created_at), new Date()).toISOString(),
        status: 'active'
      })
    }
    
    // 30% chance of battery
    if (Math.random() < 0.3) {
      devices.push({
        id: `device-${customer.id}-battery`,
        customer_id: customer.id,
        device_type: 'battery',
        device_name: 'Home Battery',
        capacity_kw: Math.round((Math.random() * 10 + 5) * 10) / 10,
        installation_date: generateRandomDate(new Date(customer.created_at), new Date()).toISOString(),
        status: 'active'
      })
    }
    
    // 40% chance of heat pump
    if (Math.random() < 0.4) {
      devices.push({
        id: `device-${customer.id}-heatpump`,
        customer_id: customer.id,
        device_type: 'heat_pump',
        device_name: 'Heat Pump',
        capacity_kw: Math.round((Math.random() * 8 + 4) * 10) / 10,
        installation_date: generateRandomDate(new Date(customer.created_at), new Date()).toISOString(),
        status: 'active'
      })
    }
    
    // 25% chance of EV charger
    if (Math.random() < 0.25) {
      devices.push({
        id: `device-${customer.id}-evcharger`,
        customer_id: customer.id,
        device_type: 'ev_charger',
        device_name: 'EV Charger',
        capacity_kw: Math.round((Math.random() * 15 + 7) * 10) / 10,
        installation_date: generateRandomDate(new Date(customer.created_at), new Date()).toISOString(),
        status: 'active'
      })
    }
    
    // 10% chance of wind turbine
    if (Math.random() < 0.1) {
      devices.push({
        id: `device-${customer.id}-wind`,
        customer_id: customer.id,
        device_type: 'wind_turbine',
        device_name: 'Small Wind Turbine',
        capacity_kw: Math.round((Math.random() * 3 + 1) * 10) / 10,
        installation_date: generateRandomDate(new Date(customer.created_at), new Date()).toISOString(),
        status: 'active'
      })
    }
  }
  
  // Insert devices in batches
  for (let i = 0; i < devices.length; i += 100) {
    const batch = devices.slice(i, i + 100)
    const { error } = await supabase.from('devices').insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting devices batch ${i/100 + 1}:`, error.message)
    } else {
      console.log(`✅ Inserted devices batch ${i/100 + 1} (${batch.length} records)`)
    }
  }
  
  return devices
}

async function generateEnergyReadings(customers: any[], devices: any[]) {
  console.log(`\n⚡ Generating energy readings (this may take a while)...`)
  const readings = []
  const now = new Date()
  
  // Generate readings for the last 30 days, every hour
  // Limit to first 100 customers for reasonable data size
  const customersToProcess = customers.slice(0, 100)
  
  for (let day = 0; day < 30; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now.getTime() - (day * 24 + hour) * 60 * 60 * 1000)
      
      for (const customer of customersToProcess) {
        const customerDevices = devices.filter(d => d.customer_id === customer.id)
        const solarDevice = customerDevices.find(d => d.device_type === 'solar_panel')
        const windDevice = customerDevices.find(d => d.device_type === 'wind_turbine')
        
        // Calculate production
        let production = 0
        if (solarDevice) {
          const solarFactor = Math.max(0, Math.sin((hour - 6) * Math.PI / 12))
          const seasonFactor = 0.7 + 0.3 * Math.sin((now.getMonth() - 3) * Math.PI / 6)
          const cloudFactor = 0.7 + 0.3 * Math.random()
          production += solarDevice.capacity_kw * solarFactor * seasonFactor * cloudFactor
        }
        if (windDevice) {
          const windFactor = 0.3 + 0.7 * Math.random()
          production += windDevice.capacity_kw * windFactor
        }
        
        // Calculate consumption
        let consumption = 0.5 + 0.3 * Math.random()
        if (hour >= 6 && hour <= 9) consumption *= 2.5
        if (hour >= 17 && hour <= 22) consumption *= 2.0
        if (hour >= 0 && hour <= 6) consumption *= 0.7
        
        const netProduction = production - consumption
        const gridImport = Math.max(0, -netProduction)
        const gridExport = Math.max(0, netProduction)
        
        readings.push({
          customer_id: customer.id,
          timestamp: timestamp.toISOString(),
          production_kwh: Math.round(production * 100) / 100,
          consumption_kwh: Math.round(consumption * 100) / 100,
          grid_import_kwh: Math.round(gridImport * 100) / 100,
          grid_export_kwh: Math.round(gridExport * 100) / 100,
          battery_charge_kwh: 0,
          battery_discharge_kwh: 0
        })
      }
    }
  }
  
  // Insert readings in batches
  for (let i = 0; i < readings.length; i += 1000) {
    const batch = readings.slice(i, i + 1000)
    const { error } = await supabase.from('energy_readings').insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting readings batch ${i/1000 + 1}:`, error.message)
    } else {
      console.log(`✅ Inserted readings batch ${i/1000 + 1} (${batch.length} records)`)
    }
  }
  
  return readings
}

async function generateFinancialData(customers: any[]) {
  console.log(`\n💰 Generating financial data...`)
  const financialData = []
  const now = new Date()
  
  // Generate monthly bills for the last 12 months
  const customersToProcess = customers.slice(0, 100)
  
  for (let month = 0; month < 12; month++) {
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - month, 0)
    const periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1)
    
    for (const customer of customersToProcess) {
      // Get energy readings for this period
      const { data: readings } = await supabase
        .from('energy_readings')
        .select('*')
        .eq('customer_id', customer.id)
        .gte('timestamp', periodStart.toISOString())
        .lt('timestamp', periodEnd.toISOString())
      
      if (readings && readings.length > 0) {
        const totalGridImport = readings.reduce((sum: number, r: any) => sum + parseFloat(r.grid_import_kwh), 0)
        const totalGridExport = readings.reduce((sum: number, r: any) => sum + parseFloat(r.grid_export_kwh), 0)
        const totalConsumption = readings.reduce((sum: number, r: any) => sum + parseFloat(r.consumption_kwh), 0)
        
        const importPrice = 0.28
        const exportPrice = 0.08
        const gridFeeRate = 0.05
        const taxRate = 0.17
        
        const energyCost = totalGridImport * importPrice
        const energyRevenue = totalGridExport * exportPrice
        const gridFees = totalConsumption * gridFeeRate
        const netCost = energyCost - energyRevenue + gridFees
        const taxes = netCost * taxRate
        const totalBill = netCost + taxes
        
        financialData.push({
          customer_id: customer.id,
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          energy_cost_eur: Math.round(energyCost * 100) / 100,
          energy_revenue_eur: Math.round(energyRevenue * 100) / 100,
          grid_fees_eur: Math.round(gridFees * 100) / 100,
          taxes_eur: Math.round(taxes * 100) / 100,
          total_bill_eur: Math.round(totalBill * 100) / 100
        })
      }
    }
  }
  
  // Insert financial data in batches
  for (let i = 0; i < financialData.length; i += 100) {
    const batch = financialData.slice(i, i + 100)
    const { error } = await supabase.from('financial_data').insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting financial data batch ${i/100 + 1}:`, error.message)
    } else {
      console.log(`✅ Inserted financial data batch ${i/100 + 1} (${batch.length} records)`)
    }
  }
  
  return financialData
}

async function main() {
  console.log('🚀 Starting synthetic data generation...\n')
  console.log('📊 This will create:')
  console.log('   - 1000 customers')
  console.log('   - ~4000 devices')
  console.log('   - ~72,000 energy readings (30 days × 24 hours × 100 customers)')
  console.log('   - ~1200 financial records (12 months × 100 customers)\n')
  
  try {
    const customers = await generateCustomers(1000)
    console.log(`✅ Generated ${customers.length} customers`)
    
    const devices = await generateDevices(customers)
    console.log(`✅ Generated ${devices.length} devices`)
    
    const readings = await generateEnergyReadings(customers, devices)
    console.log(`✅ Generated ${readings.length} energy readings`)
    
    const financialData = await generateFinancialData(customers)
    console.log(`✅ Generated ${financialData.length} financial records`)
    
    console.log('\n🎉 Synthetic data generation completed successfully!')
    console.log('\n📈 Summary:')
    console.log(`   Customers: ${customers.length}`)
    console.log(`   Devices: ${devices.length}`)
    console.log(`   Energy Readings: ${readings.length}`)
    console.log(`   Financial Records: ${financialData.length}`)
    
  } catch (error) {
    console.error('\n❌ Error generating synthetic data:', error)
    process.exit(1)
  }
}

main()
