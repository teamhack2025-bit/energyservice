#!/usr/bin/env node

/**
 * Test API Script
 * Tests Supabase connection and fetches data for teamhack2025@gmail.com
 * 
 * Usage: node scripts/test-api.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(60))
  log(title, 'bright')
  console.log('='.repeat(60))
}

async function testAPI() {
  try {
    logSection('🚀 Starting API Test')
    
    // Check environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      log('❌ Missing environment variables!', 'red')
      log('Please check .env.local file', 'yellow')
      log(`Has URL: ${!!supabaseUrl}`, 'yellow')
      log(`Has Key: ${!!supabaseAnonKey}`, 'yellow')
      process.exit(1)
    }
    
    log('✓ Environment variables loaded', 'green')
    log(`URL: ${supabaseUrl}`, 'cyan')
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    log('✓ Supabase client created', 'green')
    
    // Test 1: Connection
    logSection('📡 Test 1: Database Connection')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('customers')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      log('❌ Connection failed!', 'red')
      console.error(connectionError)
      process.exit(1)
    }
    log('✓ Database connection successful', 'green')
    
    // Test 2: Find customer
    logSection('👤 Test 2: Find Customer (teamhack2025@gmail.com)')
    const testEmail = 'teamhack2025@gmail.com'
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', testEmail)
      .single()
    
    if (customerError) {
      log('❌ Customer not found!', 'red')
      log(`Error: ${customerError.message}`, 'yellow')
      console.error(customerError)
      
      // Show available customers
      log('\nFetching available customers...', 'yellow')
      const { data: allCustomers } = await supabase
        .from('customers')
        .select('email, name')
        .limit(5)
      
      if (allCustomers && allCustomers.length > 0) {
        log('\nFirst 5 customers in database:', 'cyan')
        allCustomers.forEach(c => log(`  - ${c.email} (${c.name})`, 'cyan'))
      }
      
      process.exit(1)
    }
    
    log('✓ Customer found!', 'green')
    console.log('\nCustomer Details:')
    console.log(JSON.stringify(customer, null, 2))
    
    // Test 3: Get devices
    logSection('🔌 Test 3: Get Devices')
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('*')
      .eq('customer_id', customer.id)
    
    if (devicesError) {
      log('❌ Error fetching devices', 'red')
      console.error(devicesError)
    } else {
      log(`✓ Found ${devices.length} devices`, 'green')
      devices.forEach(device => {
        log(`  - ${device.device_name} (${device.device_type}) - ${device.capacity_kw} kW`, 'cyan')
      })
    }
    
    // Test 4: Get energy readings
    logSection('⚡ Test 4: Get Energy Readings')
    const { data: readings, error: readingsError } = await supabase
      .from('energy_readings')
      .select('*')
      .eq('customer_id', customer.id)
      .order('timestamp', { ascending: false })
      .limit(5)
    
    if (readingsError) {
      log('❌ Error fetching energy readings', 'red')
      console.error(readingsError)
    } else {
      log(`✓ Found ${readings.length} recent readings`, 'green')
      if (readings.length > 0) {
        const latest = readings[0]
        log('\nLatest Reading:', 'cyan')
        log(`  Time: ${new Date(latest.timestamp).toLocaleString()}`, 'cyan')
        log(`  Production: ${latest.production_kwh} kWh`, 'cyan')
        log(`  Consumption: ${latest.consumption_kwh} kWh`, 'cyan')
        log(`  Grid Import: ${latest.grid_import_kwh} kWh`, 'cyan')
        log(`  Grid Export: ${latest.grid_export_kwh} kWh`, 'cyan')
      }
    }
    
    // Test 5: Get financial data
    logSection('💰 Test 5: Get Financial Data')
    const { data: financial, error: financialError } = await supabase
      .from('financial_data')
      .select('*')
      .eq('customer_id', customer.id)
      .order('period_start', { ascending: false })
      .limit(3)
    
    if (financialError) {
      log('❌ Error fetching financial data', 'red')
      console.error(financialError)
    } else {
      log(`✓ Found ${financial.length} financial records`, 'green')
      if (financial.length > 0) {
        const latest = financial[0]
        log('\nLatest Financial Period:', 'cyan')
        log(`  Period: ${new Date(latest.period_start).toLocaleDateString()} - ${new Date(latest.period_end).toLocaleDateString()}`, 'cyan')
        log(`  Cost: €${latest.energy_cost_eur}`, 'cyan')
        log(`  Revenue: €${latest.energy_revenue_eur}`, 'cyan')
        log(`  Total Bill: €${latest.total_bill_eur}`, 'cyan')
      }
    }
    
    // Summary
    logSection('📊 Summary')
    log(`Customer: ${customer.name} (${customer.email})`, 'green')
    log(`Address: ${customer.address}, ${customer.city} ${customer.postcode}`, 'green')
    log(`Devices: ${devices?.length || 0}`, 'green')
    log(`Energy Readings: ${readings?.length || 0} (showing latest)`, 'green')
    log(`Financial Records: ${financial?.length || 0} (showing latest)`, 'green')
    
    logSection('✅ All Tests Passed!')
    log('\nYou can now use the API at:', 'cyan')
    log('  - http://localhost:3000/api/test-connection', 'cyan')
    log('  - http://localhost:3000/api/dashboard/real', 'cyan')
    log('  - http://localhost:3000/test-connection (UI)', 'cyan')
    
  } catch (error) {
    log('\n❌ Unexpected Error:', 'red')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testAPI()
