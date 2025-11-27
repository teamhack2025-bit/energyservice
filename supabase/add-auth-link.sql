-- Add auth_user_id column to customers table to link with auth.users
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create unique index on auth_user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);

-- Add comment
COMMENT ON COLUMN customers.auth_user_id IS 'Links customer to Supabase auth user';
