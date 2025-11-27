# Admin Panel Setup Guide

This guide walks you through setting up the admin panel for the energy management platform.

## Prerequisites

- Supabase project set up and running
- Environment variables configured in `.env.local`
- Node.js and npm installed

## Step 1: Create Admin Users Table

Run the SQL migration to create the admin users table and audit logs:

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase/admin-users.sql`
4. Click "Run" to execute the migration

This will create:
- `admin_users` table with role-based access
- `audit_logs` table for tracking admin actions
- Row Level Security (RLS) policies
- Indexes for performance
- A default super admin user entry

## Step 2: Create Admin Auth User

Run the setup script to create the admin user in Supabase Auth:

```bash
node scripts/setup-admin-user.js
```

This script will:
- Create an admin user in Supabase Auth
- Link the auth user to the admin_users table
- Display the login credentials

**Default Credentials:**
- Email: `admin@energyplatform.lu`
- Password: `Admin123!@#`

⚠️ **IMPORTANT:** Change the password after your first login!

## Step 3: Access the Admin Panel

Once the setup is complete, you can access the admin panel at:

```
http://localhost:3000/admin/login
```

## Admin User Roles

The system supports two admin roles:

### Admin
- Can view all entities
- Can create, update, and delete most entities
- Can view audit logs
- Cannot manage other admin users

### Super Admin
- All admin permissions
- Can create, update, and delete admin users
- Can assign roles to other admins
- Full system access

## Security Features

### Authentication
- JWT token-based sessions
- HttpOnly cookies for token storage
- Automatic token refresh
- Session expiration handling

### Authorization
- Role-based access control (RBAC)
- Row Level Security (RLS) policies
- Middleware protection on all admin routes
- API-level permission checks

### Audit Logging
All admin actions are logged with:
- Admin user ID and email
- Action type (create, update, delete)
- Entity type and ID
- Changes made (before/after values)
- Timestamp and IP address

## Creating Additional Admin Users

### Via Admin Panel (Recommended)
1. Log in as a super admin
2. Navigate to Admin Users section
3. Click "Create New Admin"
4. Fill in the details and assign a role
5. The new admin will receive an email to set their password

### Via Script
You can modify `scripts/setup-admin-user.js` to create additional users programmatically.

## Troubleshooting

### "User already exists" error
If you see this error when running the setup script, it means the admin user already exists in Supabase Auth. The script will automatically link the existing user to the admin_users table.

### Cannot log in
1. Verify the admin user exists in both Supabase Auth and admin_users table
2. Check that the UUIDs match between the two tables
3. Ensure RLS policies are enabled and correct
4. Check browser console for error messages

### RLS Policy errors
If you get permission denied errors:
1. Verify you're logged in as an admin user
2. Check that the admin_users table has the correct RLS policies
3. Ensure your auth token is valid and not expired

## Database Schema

### admin_users table
```sql
- id: UUID (primary key, matches Supabase Auth user ID)
- email: TEXT (unique, matches Supabase Auth email)
- role: admin_role ('admin' or 'super_admin')
- name: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- last_login_at: TIMESTAMP
```

### audit_logs table
```sql
- id: UUID (primary key)
- admin_user_id: UUID (foreign key to admin_users)
- admin_email: TEXT
- action: TEXT (e.g., 'create', 'update', 'delete')
- entity_type: TEXT (e.g., 'customer', 'device')
- entity_id: TEXT
- changes: JSONB (before/after values)
- ip_address: TEXT
- user_agent: TEXT
- created_at: TIMESTAMP
```

## Next Steps

After completing the setup:

1. Change the default admin password
2. Create additional admin users as needed
3. Review and customize RLS policies for your needs
4. Set up monitoring and alerts for admin actions
5. Configure backup schedules for audit logs

## Support

For issues or questions, refer to:
- Supabase documentation: https://supabase.com/docs
- Project README: `README.md`
- Implementation guide: `IMPLEMENTATION_GUIDE.md`
