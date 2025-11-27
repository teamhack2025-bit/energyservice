#!/usr/bin/env node

/**
 * Setup Admin User Script
 * 
 * This script creates an admin user in Supabase Auth and links it to the admin_users table.
 * Run this after executing the admin-users.sql migration.
 * 
 * Usage: node scripts/setup-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');
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

async function setupAdminUser() {
  console.log('🚀 Setting up admin user...\n');

  const adminEmail = 'admin@energyplatform.lu';
  const adminPassword = 'Admin123!@#'; // Change this!
  const adminUserId = '00000000-0000-0000-0000-000000000001';

  try {
    // Step 1: Create auth user with specific UUID
    console.log('📝 Creating admin user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: 'System Administrator',
        role: 'super_admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Admin user already exists in Auth');
        
        // Get the existing user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === adminEmail);
        
        if (existingUser) {
          console.log(`✅ Found existing admin user: ${existingUser.id}`);
          
          // Update admin_users table with correct UUID
          const { error: updateError } = await supabase
            .from('admin_users')
            .update({ id: existingUser.id })
            .eq('email', adminEmail);
          
          if (updateError) {
            console.error('❌ Error updating admin_users table:', updateError.message);
          } else {
            console.log('✅ Updated admin_users table with correct UUID');
          }
        }
      } else {
        throw authError;
      }
    } else {
      console.log(`✅ Created admin user in Auth: ${authData.user.id}`);
      
      // Update admin_users table with the actual UUID from Auth
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ id: authData.user.id })
        .eq('email', adminEmail);
      
      if (updateError) {
        console.error('❌ Error updating admin_users table:', updateError.message);
      } else {
        console.log('✅ Updated admin_users table with Auth UUID');
      }
    }

    // Step 2: Verify the setup
    console.log('\n🔍 Verifying setup...');
    const { data: adminUser, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (verifyError) {
      throw verifyError;
    }

    console.log('\n✅ Admin user setup complete!');
    console.log('========================================');
    console.log('Admin Credentials:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  Role: ${adminUser.role}`);
    console.log(`  UUID: ${adminUser.id}`);
    console.log('========================================');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('   You can log in at: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    process.exit(1);
  }
}

setupAdminUser();
