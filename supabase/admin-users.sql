-- ============================================
-- ADMIN USERS TABLE AND POLICIES
-- Run this in Supabase SQL Editor
-- ============================================

-- Create admin role enum
CREATE TYPE admin_role AS ENUM (
    'admin',
    'super_admin'
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role admin_role NOT NULL DEFAULT 'admin',
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create index for email lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- Create updated_at trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
-- Policy 1: Allow authenticated admin users to read all admin users
CREATE POLICY "Admin users can read all admin users" ON admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

-- Policy 2: Allow super_admin to insert new admin users
CREATE POLICY "Super admins can create admin users" ON admin_users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid() AND au.role = 'super_admin'
        )
    );

-- Policy 3: Allow super_admin to update admin users
CREATE POLICY "Super admins can update admin users" ON admin_users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid() AND au.role = 'super_admin'
        )
    );

-- Policy 4: Allow admin users to update their own record (except role)
CREATE POLICY "Admin users can update their own profile" ON admin_users
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        role = (SELECT role FROM admin_users WHERE id = auth.uid())
    );

-- Policy 5: Only super_admin can delete admin users
CREATE POLICY "Super admins can delete admin users" ON admin_users
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid() AND au.role = 'super_admin'
        )
    );

-- Create audit_logs table for tracking admin actions
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    changes JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Enable RLS for audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin users can read all audit logs
CREATE POLICY "Admin users can read audit logs" ON audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

-- Policy: Allow inserting audit logs (will be done server-side)
CREATE POLICY "Allow inserting audit logs" ON audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Insert a default super admin user (you should change this!)
-- Note: This creates a user in the admin_users table, but you'll need to
-- create the corresponding auth user in Supabase Auth separately
INSERT INTO admin_users (id, email, role, name)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@energyplatform.lu',
    'super_admin',
    'System Administrator'
);

-- Summary
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ADMIN USERS TABLE CREATED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Default super admin email: admin@energyplatform.lu';
    RAISE NOTICE 'You must create this user in Supabase Auth';
    RAISE NOTICE 'with the same email and UUID';
    RAISE NOTICE '========================================';
END $$;
