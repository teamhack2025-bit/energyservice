require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAuthLink() {
  console.log('============================================================')
  console.log('🔗 Setting up Auth Link')
  console.log('============================================================\n')

  try {
    // Step 1: Check if auth_user_id column exists
    console.log('Step 1: Checking if auth_user_id column exists...')
    const { data: columns, error: columnError } = await supabase
      .from('customers')
      .select('auth_user_id')
      .limit(1)
    
    if (columnError && columnError.message.includes('column')) {
      console.log('⚠️  Column does not exist. Creating it...')
      
      // Add the column using RPC or direct SQL
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE customers 
          ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
          
          CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
        `
      })
      
      if (alterError) {
        console.log('⚠️  Could not add column via RPC. Please run this SQL manually in Supabase:')
        console.log(`
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
        `)
      } else {
        console.log('✓ Column created successfully')
      }
    } else {
      console.log('✓ Column already exists')
    }

    // Step 2: Get all auth users
    console.log('\nStep 2: Getting auth users...')
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error getting users:', usersError)
      return
    }
    
    console.log(`✓ Found ${users.length} auth user(s)`)
    
    // Step 3: Link each auth user to their customer record
    console.log('\nStep 3: Linking auth users to customers...')
    
    for (const user of users) {
      console.log(`\n  Processing: ${user.email}`)
      
      // Find customer by email
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .maybeSingle()
      
      if (customerError) {
        console.log(`  ❌ Error finding customer: ${customerError.message}`)
        continue
      }
      
      if (!customer) {
        console.log(`  ⚠️  No customer record found for ${user.email}`)
        continue
      }
      
      // Check if already linked
      if (customer.auth_user_id === user.id) {
        console.log(`  ✓ Already linked to customer: ${customer.name} (${customer.id})`)
        continue
      }
      
      // Link them
      const { error: updateError } = await supabase
        .from('customers')
        .update({ auth_user_id: user.id })
        .eq('id', customer.id)
      
      if (updateError) {
        console.log(`  ❌ Error linking: ${updateError.message}`)
      } else {
        console.log(`  ✓ Linked to customer: ${customer.name} (${customer.id})`)
      }
    }
    
    // Step 4: Verify links
    console.log('\n============================================================')
    console.log('📊 Verification')
    console.log('============================================================\n')
    
    const { data: linkedCustomers, error: verifyError } = await supabase
      .from('customers')
      .select('id, email, name, auth_user_id')
      .not('auth_user_id', 'is', null)
    
    if (verifyError) {
      console.error('❌ Error verifying:', verifyError)
      return
    }
    
    console.log(`✓ ${linkedCustomers.length} customer(s) linked to auth users:\n`)
    linkedCustomers.forEach(c => {
      console.log(`  • ${c.name} (${c.email})`)
      console.log(`    Customer ID: ${c.id}`)
      console.log(`    Auth User ID: ${c.auth_user_id}\n`)
    })
    
    console.log('============================================================')
    console.log('✅ Setup Complete!')
    console.log('============================================================')
    console.log('\nYou can now:')
    console.log('1. Refresh your dashboard')
    console.log('2. Check your profile at /settings/profile')
    console.log('3. All data should now display correctly')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

setupAuthLink()
