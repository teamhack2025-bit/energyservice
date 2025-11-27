-- ============================================
-- Find Your Customer Data
-- Run this in Supabase SQL Editor
-- ============================================

-- Find your customer by email
SELECT 
    id,
    email,
    name,
    address,
    city,
    postcode,
    created_at
FROM customers 
WHERE email = 'teamhack2025@gmail.com';

-- If you want to update the name (optional)
-- UPDATE customers 
-- SET name = 'Team Hack',
--     updated_at = NOW()
-- WHERE email = 'teamhack2025@gmail.com';

-- Show all devices for your customer
SELECT 
    c.email,
    c.name,
    d.id as device_id,
    d.device_type,
    d.device_name,
    d.capacity_kw,
    d.status
FROM customers c
LEFT JOIN devices d ON d.customer_id = c.id
WHERE c.email = 'teamhack2025@gmail.com'
ORDER BY d.device_type;

-- Show recent energy readings (last 24 hours)
SELECT 
    c.email,
    er.timestamp,
    er.production_kwh,
    er.consumption_kwh,
    er.grid_import_kwh,
    er.grid_export_kwh
FROM customers c
LEFT JOIN energy_readings er ON er.customer_id = c.id
WHERE c.email = 'teamhack2025@gmail.com'
  AND er.timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY er.timestamp DESC
LIMIT 20;

-- Show financial summary (last 3 months)
SELECT 
    c.email,
    c.name,
    fd.period_start,
    fd.period_end,
    fd.energy_cost_eur,
    fd.energy_revenue_eur,
    fd.total_bill_eur
FROM customers c
LEFT JOIN financial_data fd ON fd.customer_id = c.id
WHERE c.email = 'teamhack2025@gmail.com'
ORDER BY fd.period_start DESC
LIMIT 3;

-- Summary: Count all your data
SELECT 
    c.email,
    c.name,
    COUNT(DISTINCT d.id) as total_devices,
    COUNT(DISTINCT er.id) as total_readings,
    COUNT(DISTINCT fd.id) as total_financial_records
FROM customers c
LEFT JOIN devices d ON d.customer_id = c.id
LEFT JOIN energy_readings er ON er.customer_id = c.id
LEFT JOIN financial_data fd ON fd.customer_id = c.id
WHERE c.email = 'teamhack2025@gmail.com'
GROUP BY c.email, c.name;
