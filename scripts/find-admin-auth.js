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

async function findAdminAuth() {
  console.log('🔍 Searching for admin user in Supabase Auth...\n');

  const adminEmail = 'admin@energyplatform.lu';

  // Try to get all users with pagination
  let page = 1;
  let allUsers = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000
    });

    if (error) {
      console.error('Error:', error);
      break;
    }

    allUsers = allUsers.concat(data.users);
    hasMore = data.users.length === 1000;
    page++;
  }

  console.log(`Total users in Auth: ${allUsers.length}\n`);

  const adminUser = allUsers.find(u => u.email === adminEmail);

  if (adminUser) {
    console.log('✅ Found admin user:');
    console.log('   ID:', adminUser.id);
    console.log('   Email:', adminUser.email);
    console.log('   Created:', adminUser.created_at);
    console.log('   Confirmed:', adminUser.confirmed_at ? 'Yes' : 'No');
    
    // Now check admin_users table
    const { data: adminTableUser, error: tableError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (tableError) {
      console.log('\n❌ Not found in admin_users table');
    } else {
      console.log('\n✅ Found in admin_users table:');
      console.log('   ID:', adminTableUser.id);
      console.log('   Role:', adminTableUser.role);
      
      if (adminUser.id !== adminTableUser.id) {
        console.log('\n⚠️  ID MISMATCH - Fixing...');
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ id: adminUser.id })
          .eq('email', adminEmail);
        
        if (updateError) {
          console.log('   ❌ Failed:', updateError.message);
        } else {
          console.log('   ✅ Fixed!');
        }
      } else {
        console.log('\n✅ IDs match!');
      }
    }
  } else {
    console.log('❌ Admin user NOT found in Supabase Auth');
    console.log('   Email searched:', adminEmail);
    console.log('\nAll users:');
    allUsers.forEach(u => console.log(`   - ${u.email} (${u.id})`));
  }
}

findAdminAuth();
