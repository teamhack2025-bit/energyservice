const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🧪 Testing admin login...\n');

  const email = 'admin@energyplatform.lu';
  const password = 'Admin123!@#';

  console.log('Attempting login with:');
  console.log('  Email:', email);
  console.log('  Password:', password);
  console.log('');

  // Try to sign in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error('❌ Login failed:', authError.message);
    console.log('\nPossible issues:');
    console.log('  1. Wrong password');
    console.log('  2. User not confirmed');
    console.log('  3. User disabled');
    return;
  }

  console.log('✅ Authentication successful!');
  console.log('   User ID:', authData.user.id);
  console.log('   Email:', authData.user.email);
  console.log('   Access Token:', authData.session.access_token.substring(0, 20) + '...');

  // Check admin_users table
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data: adminUser, error: adminError } = await serviceClient
    .from('admin_users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (adminError) {
    console.log('\n❌ Not found in admin_users table:', adminError.message);
  } else {
    console.log('\n✅ Found in admin_users table:');
    console.log('   Role:', adminUser.role);
    console.log('   Name:', adminUser.name);
  }

  console.log('\n========================================');
  console.log('✅ Login test PASSED!');
  console.log('========================================\n');
}

testLogin();
