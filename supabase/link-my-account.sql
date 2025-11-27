-- This script links your Google auth account to the customer record
-- Replace 'YOUR_AUTH_USER_ID' with your actual auth user ID from the debug endpoint

-- First, let's see what we have:
SELECT 
    'Auth Users' as table_name,
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name
FROM auth.users
WHERE email = 'teamhack2025@gmail.com';

SELECT 
    'Customers' as table_name,
    id,
    email,
    name,
    auth_user_id
FROM customers
WHERE email = 'teamhack2025@gmail.com';

-- To link them, run this (replace YOUR_AUTH_USER_ID with the actual UUID from above):
-- UPDATE customers 
-- SET auth_user_id = 'YOUR_AUTH_USER_ID'
-- WHERE email = 'teamhack2025@gmail.com';
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
