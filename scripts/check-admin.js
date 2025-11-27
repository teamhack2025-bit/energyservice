const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAdmin() {
  console.log('Checking admin setup...\n');

  // Check if admin_users table exists and has data
  const { data: adminUsers, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', 'admin@energyplatform.lu');

  if (adminError) {
    console.error('❌ Error querying admin_users table:', adminError.message);
    console.log('\n⚠️  The admin_users table may not exist. Run the SQL migration:');
    console.log('   supabase/admin-users.sql\n');
    return;
  }

  if (!adminUsers || adminUsers.length === 0) {
    console.log('❌ No admin user found in admin_users table');
    console.log('   Run: node scripts/setup-admin-user.js\n');
    return;
  }

  console.log('✅ Admin user found in admin_users table:');
  console.log('   ID:', adminUsers[0].id);
  console.log('   Email:', adminUsers[0].email);
  console.log('   Role:', adminUsers[0].role);
  console.log('   Name:', adminUsers[0].name);

  // Check if user exists in Supabase Auth
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const authUser = authUsers.users.find(u => u.email === 'admin@energyplatform.lu');

  if (!authUser) {
    console.log('\n❌ Admin user NOT found in Supabase Auth');
    console.log('   The user needs to be created in Supabase Auth\n');
    return;
  }

  console.log('\n✅ Admin user found in Supabase Auth:');
  console.log('   ID:', authUser.id);
  console.log('   Email:', authUser.email);

  // Check if IDs match
  if (adminUsers[0].id !== authUser.id) {
    console.log('\n❌ ID MISMATCH!');
    console.log('   admin_users ID:', adminUsers[0].id);
    console.log('   auth.users ID:', authUser.id);
    console.log('\n   Fixing...');
    
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ id: authUser.id })
      .eq('email', 'admin@energyplatform.lu');
    
    if (updateError) {
      console.log('   ❌ Failed to update:', updateError.message);
    } else {
      console.log('   ✅ Fixed! IDs now match.');
    }
  } else {
    console.log('\n✅ IDs match correctly!');
  }

  console.log('\n========================================');
  console.log('Login Credentials:');
  console.log('  Email: admin@energyplatform.lu');
  console.log('  Password: Admin123!@#');
  console.log('  URL: http://localhost:3000/admin/login');
  console.log('========================================\n');
}

checkAdmin();
