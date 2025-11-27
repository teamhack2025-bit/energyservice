#!/usr/bin/env node

/**
 * Create Admin Auth User Script
 * 
 * This script creates the admin user in Supabase Auth and syncs with admin_users table.
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

async function createAdminAuth() {
  console.log('🚀 Creating admin user in Supabase Auth...\n');

  const adminEmail = 'admin@energyplatform.lu';
  const adminPassword = 'Admin123!@#';

  try {
    // Check if admin_users record exists
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (adminError) {
      console.error('❌ Error: admin_users table not found or no admin user exists');
      console.log('   Please run the SQL migration first: supabase/admin-users.sql\n');
      process.exit(1);
    }

    console.log('✅ Found admin user in admin_users table');
    console.log('   ID:', adminUsers.id);
    console.log('   Email:', adminUsers.email);
    console.log('   Role:', adminUsers.role);

    // Check if auth user already exists
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers.users.find(u => u.email === adminEmail);

    if (existingAuthUser) {
      console.log('\n⚠️  Admin user already exists in Supabase Auth');
      console.log('   Auth ID:', existingAuthUser.id);
      
      // Sync IDs if they don't match
      if (adminUsers.id !== existingAuthUser.id) {
        console.log('\n🔧 Syncing IDs...');
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ id: existingAuthUser.id })
          .eq('email', adminEmail);
        
        if (updateError) {
          console.error('   ❌ Failed to sync IDs:', updateError.message);
        } else {
          console.log('   ✅ IDs synced successfully!');
        }
      } else {
        console.log('   ✅ IDs already match');
      }
    } else {
      // Create new auth user
      console.log('\n📝 Creating admin user in Supabase Auth...');
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: adminUsers.name,
          role: adminUsers.role
        }
      });

      if (authError) {
        console.error('❌ Error creating auth user:', authError.message);
        process.exit(1);
      }

      console.log('✅ Created admin user in Supabase Auth');
      console.log('   Auth ID:', authData.user.id);

      // Update admin_users table with correct ID
      console.log('\n🔧 Syncing IDs...');
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ id: authData.user.id })
        .eq('email', adminEmail);

      if (updateError) {
        console.error('   ❌ Failed to sync IDs:', updateError.message);
      } else {
        console.log('   ✅ IDs synced successfully!');
      }
    }

    console.log('\n========================================');
    console.log('✅ Admin Setup Complete!');
    console.log('========================================');
    console.log('Login Credentials:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('  URL: http://localhost:3000/admin/login');
    console.log('========================================');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminAuth();
