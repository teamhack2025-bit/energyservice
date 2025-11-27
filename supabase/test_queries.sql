-- Test Queries for Energy Customer Portal Database
-- Use these queries to verify the database setup and test data

-- ============================================
-- BASIC QUERIES
-- ============================================

-- 1. Get all users
SELECT id, email, first_name, last_name, role FROM users;

-- 2. Get user with their account
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    a.account_number,
    a.account_type,
    a.status
FROM users u
JOIN accounts a ON a.user_id = u.id;

-- 3. Get sites for a user
SELECT 
    s.name,
    s.street || ' ' || s.street_number as address,
    s.city,
    s.postal_code,
    s.is_primary
FROM sites s
JOIN accounts a ON a.id = s.account_id
JOIN users u ON u.id = a.user_id
WHERE u.email = 'john.doe@example.com';

-- ============================================
-- CONSUMPTION QUERIES
-- ============================================

-- 4. Get consumption for last 30 days
SELECT 
    r.timestamp,
    r.value,
    r.delta as consumption_kwh,
    m.meter_number,
    s.name as site_name
FROM readings r
JOIN meters m ON m.id = r.meter_id
JOIN sites s ON s.id = m.site_id
WHERE r.timestamp >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY r.timestamp DESC;

-- 5. Daily consumption summary
SELECT 
    DATE(r.timestamp) as date,
    SUM(r.delta) as total_consumption_kwh,
    COUNT(*) as reading_count
FROM readings r
WHERE r.timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(r.timestamp)
ORDER BY date DESC;

-- 6. Consumption by site
SELECT 
    s.name as site_name,
    SUM(r.delta) as total_consumption_kwh,
    AVG(r.delta) as avg_daily_kwh
FROM readings r
JOIN meters m ON m.id = r.meter_id
JOIN sites s ON s.id = m.site_id
WHERE r.timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s.name;

-- ============================================
-- PRODUCTION QUERIES
-- ============================================

-- 7. Get production for last 30 days
SELECT 
    pr.timestamp,
    pr.energy_kwh,
    pr.delta_kwh as production_kwh,
    pr.self_consumed_kwh,
    pr.exported_kwh,
    ss.name as system_name,
    ss.capacity_kw
FROM production_readings pr
JOIN solar_systems ss ON ss.id = pr.solar_system_id
WHERE pr.timestamp >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY pr.timestamp DESC;

-- 8. Daily production summary
SELECT 
    DATE(pr.timestamp) as date,
    SUM(pr.delta_kwh) as total_production_kwh,
    SUM(pr.self_consumed_kwh) as total_self_consumed_kwh,
    SUM(pr.exported_kwh) as total_exported_kwh,
    ROUND(SUM(pr.self_consumed_kwh) / NULLIF(SUM(pr.delta_kwh), 0) * 100, 2) as self_consumption_ratio
FROM production_readings pr
WHERE pr.timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(pr.timestamp)
ORDER BY date DESC;

-- ============================================
-- NET BALANCE QUERIES
-- ============================================

-- 9. Net balance calculation (consumption - production)
WITH consumption_data AS (
    SELECT 
        DATE(r.timestamp) as date,
        SUM(r.delta) as consumption_kwh
    FROM readings r
    WHERE r.timestamp >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(r.timestamp)
),
production_data AS (
    SELECT 
        DATE(pr.timestamp) as date,
        SUM(pr.delta_kwh) as production_kwh,
        SUM(pr.exported_kwh) as exported_kwh
    FROM production_readings pr
    WHERE pr.timestamp >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(pr.timestamp)
)
SELECT 
    COALESCE(c.date, p.date) as date,
    COALESCE(c.consumption_kwh, 0) as consumption_kwh,
    COALESCE(p.production_kwh, 0) as production_kwh,
    COALESCE(p.exported_kwh, 0) as exported_kwh,
    COALESCE(c.consumption_kwh, 0) - COALESCE(p.production_kwh, 0) as net_kwh
FROM consumption_data c
FULL OUTER JOIN production_data p ON c.date = p.date
ORDER BY date DESC;

-- ============================================
-- BILLING QUERIES
-- ============================================

-- 10. Get invoices for a user
SELECT 
    i.invoice_number,
    i.period_start,
    i.period_end,
    i.total,
    i.status,
    i.due_date,
    c.contract_number,
    t.name as tariff_name
FROM invoices i
JOIN contracts c ON c.id = i.contract_id
JOIN tariffs t ON t.id = c.tariff_id
JOIN accounts a ON a.id = c.account_id
JOIN users u ON u.id = a.user_id
WHERE u.email = 'john.doe@example.com'
ORDER BY i.period_end DESC;

-- 11. Invoice line items breakdown
SELECT 
    i.invoice_number,
    ili.description,
    ili.quantity,
    ili.unit_price,
    ili.total,
    ili.category
FROM invoice_line_items ili
JOIN invoices i ON i.id = ili.invoice_id
WHERE i.invoice_number = 'INV-2025-001234'
ORDER BY ili.category;

-- 12. Payment history
SELECT 
    p.amount,
    p.currency,
    p.status,
    p.processed_at,
    i.invoice_number,
    pm.type as payment_method_type,
    pm.card_last4
FROM payments p
JOIN invoices i ON i.id = p.invoice_id
JOIN payment_methods pm ON pm.id = p.payment_method_id
ORDER BY p.processed_at DESC;

-- ============================================
-- DEVICE QUERIES
-- ============================================

-- 13. Get all devices for a site
SELECT 
    'meter' as device_type,
    m.meter_number as identifier,
    m.status,
    m.last_reading_date as last_seen
FROM meters m
WHERE m.site_id = '20000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
    'solar' as device_type,
    ss.name as identifier,
    ss.status,
    i.last_seen_at as last_seen
FROM solar_systems ss
LEFT JOIN inverters i ON i.solar_system_id = ss.id
WHERE ss.site_id = '20000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
    'battery' as device_type,
    b.name as identifier,
    b.status,
    b.last_seen_at as last_seen
FROM batteries b
WHERE b.site_id = '20000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
    'ev_charger' as device_type,
    ev.name as identifier,
    ev.status,
    ev.last_seen_at as last_seen
FROM ev_chargers ev
WHERE ev.site_id = '20000000-0000-0000-0000-000000000001';

-- 14. Device status summary
SELECT 
    COUNT(*) FILTER (WHERE status = 'online') as online_count,
    COUNT(*) FILTER (WHERE status = 'offline') as offline_count,
    COUNT(*) FILTER (WHERE status IN ('warning', 'fault')) as warning_count
FROM (
    SELECT status FROM meters WHERE site_id = '20000000-0000-0000-0000-000000000001'
    UNION ALL
    SELECT status FROM solar_systems WHERE site_id = '20000000-0000-0000-0000-000000000001'
    UNION ALL
    SELECT status FROM batteries WHERE site_id = '20000000-0000-0000-0000-000000000001'
    UNION ALL
    SELECT status FROM ev_chargers WHERE site_id = '20000000-0000-0000-0000-000000000001'
) all_devices;

-- ============================================
-- NOTIFICATIONS QUERIES
-- ============================================

-- 15. Get unread notifications for a user
SELECT 
    n.type,
    n.severity,
    n.title,
    n.message,
    n.action_url,
    n.created_at
FROM notifications n
WHERE n.user_id = '00000000-0000-0000-0000-000000000001'
AND n.read = FALSE
ORDER BY n.created_at DESC;

-- 16. Notification count by type
SELECT 
    type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE read = FALSE) as unread_count
FROM notifications
WHERE user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY type;

-- ============================================
-- ANALYTICS QUERIES
-- ============================================

-- 17. Monthly consumption trend
SELECT 
    DATE_TRUNC('month', r.timestamp) as month,
    SUM(r.delta) as total_consumption_kwh,
    COUNT(*) as reading_count,
    AVG(r.delta) as avg_daily_kwh
FROM readings r
WHERE r.timestamp >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', r.timestamp)
ORDER BY month DESC;

-- 18. Production vs Consumption comparison
SELECT 
    DATE_TRUNC('month', r.timestamp) as month,
    SUM(r.delta) as consumption_kwh,
    (SELECT SUM(pr.delta_kwh) 
     FROM production_readings pr 
     WHERE DATE_TRUNC('month', pr.timestamp) = DATE_TRUNC('month', r.timestamp)
    ) as production_kwh
FROM readings r
WHERE r.timestamp >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', r.timestamp)
ORDER BY month DESC;

-- 19. Cost calculation (example)
SELECT 
    DATE_TRUNC('month', r.timestamp) as month,
    SUM(r.delta) as consumption_kwh,
    SUM(r.delta) * 0.30 as estimated_cost_eur,
    (SELECT SUM(pr.exported_kwh) * 0.10
     FROM production_readings pr
     WHERE DATE_TRUNC('month', pr.timestamp) = DATE_TRUNC('month', r.timestamp)
    ) as estimated_revenue_eur
FROM readings r
WHERE r.timestamp >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', r.timestamp)
ORDER BY month DESC;

-- ============================================
-- VALIDATION QUERIES
-- ============================================

-- 20. Check data integrity
SELECT 
    'users' as table_name,
    COUNT(*) as record_count
FROM users
UNION ALL
SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'sites', COUNT(*) FROM sites
UNION ALL
SELECT 'meters', COUNT(*) FROM meters
UNION ALL
SELECT 'readings', COUNT(*) FROM readings
UNION ALL
SELECT 'solar_systems', COUNT(*) FROM solar_systems
UNION ALL
SELECT 'production_readings', COUNT(*) FROM production_readings
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;

-- 21. Check for orphaned records
SELECT 
    'readings without meter' as issue,
    COUNT(*) as count
FROM readings r
LEFT JOIN meters m ON m.id = r.meter_id
WHERE m.id IS NULL
UNION ALL
SELECT 
    'sites without account',
    COUNT(*)
FROM sites s
LEFT JOIN accounts a ON a.id = s.account_id
WHERE a.id IS NULL;

