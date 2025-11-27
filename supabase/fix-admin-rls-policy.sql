-- ============================================
-- FIX ADMIN USERS RLS POLICY
-- Fixes infinite recursion in admin_users SELECT policy
-- ============================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admin users can read all admin users" ON admin_users;

-- Create a new policy that doesn't cause recursion
-- This policy allows any authenticated user to read from admin_users
-- if their user ID matches a row in the table (checked at the row level, not via subquery)
CREATE POLICY "Admin users can read all admin users" ON admin_users
    FOR SELECT
    USING (
        -- Allow reading if the authenticated user's ID exists as a row in this table
        -- This works because RLS evaluates the condition for each row individually
        -- without triggering another policy check
        auth.uid() IN (SELECT id FROM admin_users)
        OR
        -- Alternative: Allow reading your own row
        id = auth.uid()
    );

-- Even better approach: Use a security definer function to break the recursion
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
    );
END;
$$;

-- Drop the previous policy and create a new one using the function
DROP POLICY IF EXISTS "Admin users can read all admin users" ON admin_users;

CREATE POLICY "Admin users can read all admin users" ON admin_users
    FOR SELECT
    USING (is_admin_user());

-- Summary
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ADMIN USERS RLS POLICY FIXED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'The infinite recursion issue has been resolved';
    RAISE NOTICE 'Admin users can now authenticate successfully';
    RAISE NOTICE '========================================';
END $$;
