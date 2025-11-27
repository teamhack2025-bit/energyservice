import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Check environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        }
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test 1: Check Supabase connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('customers')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: connectionError
      }, { status: 500 })
    }
    
    // Test 2: Get auth user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Test 3: Find customer by email (teamhack2025@gmail.com)
    const testEmail = 'teamhack2025@gmail.com'
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', testEmail)
      .single()
    
    // Test 4: Get devices for this customer
    let devices = []
    if (customer) {
      const { data: deviceData } = await supabase
        .from('devices')
        .select('*')
        .eq('customer_id', customer.id)
      devices = deviceData || []
    }
    
    // Test 5: Get recent energy readings
    let recentReadings = []
    if (customer) {
      const { data: readingData } = await supabase
        .from('energy_readings')
        .select('*')
        .eq('customer_id', customer.id)
        .order('timestamp', { ascending: false })
        .limit(5)
      recentReadings = readingData || []
    }
    
    // Test 6: Get financial data
    let financialData = []
    if (customer) {
      const { data: finData } = await supabase
        .from('financial_data')
        .select('*')
        .eq('customer_id', customer.id)
        .order('period_start', { ascending: false })
        .limit(3)
      financialData = finData || []
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        connection: {
          status: 'passed',
          message: 'Supabase connection successful'
        },
        auth: {
          status: user ? 'authenticated' : 'not authenticated',
          user: user ? {
            email: user.email,
            id: user.id
          } : null,
          error: authError?.message
        },
        customer: {
          status: customer ? 'found' : 'not found',
          email: testEmail,
          data: customer,
          error: customerError?.message
        },
        devices: {
          status: 'success',
          count: devices.length,
          data: devices
        },
        energyReadings: {
          status: 'success',
          count: recentReadings.length,
          latest: recentReadings[0] || null
        },
        financialData: {
          status: 'success',
          count: financialData.length,
          latest: financialData[0] || null
        }
      },
      summary: {
        customerFound: !!customer,
        deviceCount: devices.length,
        hasEnergyData: recentReadings.length > 0,
        hasFinancialData: financialData.length > 0
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
