-- ============================================
-- Link Auth User to Customer Data
-- Run this in Supabase SQL Editor
-- ============================================

-- Update customer-0001 to match your auth email
UPDATE customers 
SET email = 'teamhack2025@gmail.com',
    name = 'Jesu Balan',
    updated_at = NOW()
WHERE id = 'customer-0001';

-- Verify the update
SELECT id, email, name, address, city, postcode
FROM customers 
WHERE email = 'teamhack2025@gmail.com';

-- Show devices for this customer
SELECT d.id, d.device_type, d.device_name, d.capacity_kw, d.status
FROM devices d
WHERE d.customer_id = 'customer-0001';

-- Show recent energy readings
SELECT 
    timestamp,
    production_kwh,
    consumption_kwh,
    grid_import_kwh,
    grid_export_kwh
FROM energy_readings
WHERE customer_id = 'customer-0001'
ORDER BY timestamp DESC
LIMIT 10;

-- Show financial data
SELECT 
    period_start,
    period_end,
    energy_cost_eur,
    energy_revenue_eur,
    total_bill_eur
FROM financial_data
WHERE customer_id = 'customer-0001'
ORDER BY period_start DESC
LIMIT 3;
