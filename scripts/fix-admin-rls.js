#!/usr/bin/env node

/**
 * Fix Admin RLS Policy Script
 * 
 * This script fixes the infinite recursion issue in the admin_users RLS policy.
 * 
 * Usage: node scripts/fix-admin-rls.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixAdminRLS() {
  console.log('🔧 Fixing admin_users RLS policy...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'fix-admin-rls-policy.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    console.log('📝 Executing SQL migration...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

    if (error) {
      // If exec_sql doesn't exist, we need to run the SQL manually
      console.log('⚠️  Cannot execute SQL via RPC. Please run the SQL manually:');
      console.log('   1. Open your Supabase project dashboard');
      console.log('   2. Go to the SQL Editor');
      console.log('   3. Copy and paste the contents of supabase/fix-admin-rls-policy.sql');
      console.log('   4. Click "Run" to execute the migration\n');
      console.log('SQL file location:', sqlPath);
      process.exit(1);
    }

    console.log('✅ RLS policy fixed successfully!\n');
    console.log('You can now run the authentication tests.');

  } catch (error) {
    console.error('❌ Error fixing RLS policy:', error.message);
    console.log('\n⚠️  Please run the SQL manually:');
    console.log('   1. Open your Supabase project dashboard');
    console.log('   2. Go to the SQL Editor');
    console.log('   3. Copy and paste the contents of supabase/fix-admin-rls-policy.sql');
    console.log('   4. Click "Run" to execute the migration');
    process.exit(1);
  }
}

fixAdminRLS();
