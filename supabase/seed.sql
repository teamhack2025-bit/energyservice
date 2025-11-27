-- Test Data for Energy Customer Portal
-- Supabase PostgreSQL Seed Script

-- ============================================
-- USERS
-- ============================================

INSERT INTO users (id, email, email_verified, password_hash, first_name, last_name, phone, role, language, timezone, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'john.doe@example.com', TRUE, '$2a$10$example_hash_here', 'John', 'Doe', '+1234567890', 'prosumer', 'en', 'America/New_York', TRUE),
('00000000-0000-0000-0000-000000000002', 'jane.smith@example.com', TRUE, '$2a$10$example_hash_here', 'Jane', 'Smith', '+1234567891', 'customer', 'en', 'Europe/Berlin', TRUE),
('00000000-0000-0000-0000-000000000003', 'admin@energyportal.com', TRUE, '$2a$10$example_hash_here', 'Admin', 'User', '+1234567892', 'admin', 'en', 'UTC', TRUE);

-- ============================================
-- ACCOUNTS
-- ============================================

INSERT INTO accounts (id, user_id, account_number, account_type, status, billing_email, billing_street, billing_street_number, billing_city, billing_postal_code, billing_country) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ACC-2025-001234', 'residential', 'active', 'john.doe@example.com', 'Main Street', '123', 'Berlin', '10115', 'DE'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'ACC-2025-001235', 'residential', 'active', 'jane.smith@example.com', 'Oak Avenue', '456', 'Berlin', '10115', 'DE');

-- ============================================
-- SITES
-- ============================================

INSERT INTO sites (id, account_id, name, street, street_number, city, postal_code, country, property_type, is_primary, latitude, longitude) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Home', 'Main Street', '123', 'Berlin', '10115', 'DE', 'residential', TRUE, 52.5200, 13.4050),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Home', 'Oak Avenue', '456', 'Berlin', '10115', 'DE', 'residential', TRUE, 52.5300, 13.4100);

-- ============================================
-- METERS
-- ============================================

INSERT INTO meters (id, site_id, meter_number, meter_type, phase, manufacturer, model, installation_date, last_reading_date, last_reading_value, status, is_smart_meter, reading_frequency) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'MTR-2025-001234', 'electricity', 'single', 'Landis+Gyr', 'E650', '2020-01-15', CURRENT_DATE, 12345.5, 'active', TRUE, '15min'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'MTR-2025-001235', 'electricity', 'single', 'Itron', 'ACE6000', '2019-06-20', CURRENT_DATE, 9876.3, 'active', TRUE, 'hourly');

-- ============================================
-- READINGS (Last 30 days sample data)
-- ============================================

-- Generate sample readings for the last 30 days
DO $$
DECLARE
    meter_uuid UUID := '30000000-0000-0000-0000-000000000001';
    reading_date DATE;
    base_value DECIMAL := 12000.0;
    daily_consumption DECIMAL;
BEGIN
    FOR i IN 0..29 LOOP
        reading_date := CURRENT_DATE - i;
        daily_consumption := 12.0 + (RANDOM() * 8.0); -- Random between 12-20 kWh
        base_value := base_value - daily_consumption;
        
        INSERT INTO readings (meter_id, timestamp, value, delta, source, quality)
        VALUES (
            meter_uuid,
            reading_date + INTERVAL '23 hours 59 minutes',
            base_value,
            daily_consumption,
            'smart_meter',
            'valid'
        );
    END LOOP;
END $$;

-- ============================================
-- TARIFFS
-- ============================================

INSERT INTO tariffs (id, name, code, type, status, base_price_per_kwh, currency, monthly_fee, feed_in_tariff, grid_fee_per_kwh, tax_rate, valid_from) VALUES
('40000000-0000-0000-0000-000000000001', 'Standard Variable', 'STD-VAR-2025', 'variable', 'active', 0.30, 'EUR', 5.00, 0.10, 0.05, 0.19, '2025-01-01'),
('40000000-0000-0000-0000-000000000002', 'Fixed Rate', 'FIXED-2025', 'fixed', 'active', 0.28, 'EUR', 5.00, 0.10, 0.05, 0.19, '2025-01-01'),
('40000000-0000-0000-0000-000000000003', 'Time-of-Use', 'TOU-2025', 'tou', 'active', 0.25, 'EUR', 5.00, 0.12, 0.05, 0.19, '2025-01-01');

-- ============================================
-- CONTRACTS
-- ============================================

INSERT INTO contracts (id, account_id, site_id, contract_number, tariff_id, contract_type, status, start_date, auto_renew) VALUES
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'CON-2025-001234', '40000000-0000-0000-0000-000000000001', 'variable', 'active', '2025-01-01', TRUE),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'CON-2025-001235', '40000000-0000-0000-0000-000000000002', 'fixed', 'active', '2024-12-01', TRUE);

-- ============================================
-- INVOICES
-- ============================================

INSERT INTO invoices (id, contract_id, invoice_number, period_start, period_end, issue_date, due_date, consumption_kwh, production_kwh, export_kwh, import_kwh, subtotal, tax, total, currency, status, paid_at) VALUES
('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'INV-2025-001234', '2025-01-01', '2025-01-31', '2025-02-01', '2025-02-15', 450.0, 320.5, 140.5, 310.0, 78.95, 15.00, 93.95, 'EUR', 'paid', '2025-02-10 10:30:00+00'),
('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'INV-2024-001233', '2024-12-01', '2024-12-31', '2025-01-01', '2025-01-15', 480.0, 0, 0, 480.0, 102.30, 19.44, 121.74, 'EUR', 'paid', '2025-01-10 14:20:00+00'),
('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'INV-2024-001232', '2024-11-01', '2024-11-30', '2024-12-01', '2024-12-15', 420.0, 0, 0, 420.0, 88.50, 16.82, 105.32, 'EUR', 'issued', NULL);

-- Invoice Line Items
INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total, category) VALUES
('60000000-0000-0000-0000-000000000001', 'Energy consumption: 310 kWh', 310.0, 0.30, 93.00, 'consumption'),
('60000000-0000-0000-0000-000000000001', 'Feed-in compensation: -140.5 kWh', 140.5, 0.10, -14.05, 'feed_in'),
('60000000-0000-0000-0000-000000000001', 'Grid fees', 310.0, 0.05, 15.50, 'grid_fee'),
('60000000-0000-0000-0000-000000000001', 'VAT (19%)', 78.95, 0.19, 15.00, 'tax');

-- ============================================
-- PAYMENT METHODS
-- ============================================

INSERT INTO payment_methods (id, account_id, type, is_default, card_last4, card_brand, card_expiry_month, card_expiry_year, status) VALUES
('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'card', TRUE, '4242', 'visa', 12, 2026, 'active'),
('70000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'sepa_direct_debit', FALSE, NULL, NULL, NULL, NULL, 'active');

-- ============================================
-- PAYMENTS
-- ============================================

INSERT INTO payments (id, invoice_id, payment_method_id, amount, currency, status, transaction_id, processed_at) VALUES
('80000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 93.95, 'EUR', 'completed', 'txn_123456789', '2025-02-10 10:30:00+00'),
('80000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001', 121.74, 'EUR', 'completed', 'txn_123456790', '2025-01-10 14:20:00+00');

-- ============================================
-- SOLAR SYSTEMS
-- ============================================

INSERT INTO solar_systems (id, site_id, name, capacity_kw, installation_date, orientation, tilt_angle, panel_count, panel_type, status, installer_name, warranty_until) VALUES
('90000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Home Solar', 5.0, '2020-01-15', 'south', 30, 20, 'monocrystalline', 'active', 'Solar Co.', '2030-01-15');

-- ============================================
-- INVERTERS
-- ============================================

INSERT INTO inverters (id, solar_system_id, manufacturer, model, serial_number, max_power_kw, status, last_seen_at, firmware_version) VALUES
('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', 'Fronius', 'Primo 5.0', 'FRN-ABC123', 5.0, 'online', NOW(), '1.2.3');

-- ============================================
-- PRODUCTION READINGS (Last 30 days)
-- ============================================

DO $$
DECLARE
    solar_uuid UUID := '90000000-0000-0000-0000-000000000001';
    reading_date DATE;
    base_energy DECIMAL := 5000.0;
    daily_production DECIMAL;
    self_consumed DECIMAL;
    exported DECIMAL;
BEGIN
    FOR i IN 0..29 LOOP
        reading_date := CURRENT_DATE - i;
        -- Production varies by day (more in summer, less in winter)
        daily_production := 15.0 + (RANDOM() * 10.0); -- Random between 15-25 kWh
        self_consumed := daily_production * 0.6; -- 60% self-consumed
        exported := daily_production - self_consumed;
        base_energy := base_energy + daily_production;
        
        INSERT INTO production_readings (solar_system_id, timestamp, power_kw, energy_kwh, delta_kwh, self_consumed_kwh, exported_kwh, source)
        VALUES (
            solar_uuid,
            reading_date + INTERVAL '12 hours',
            daily_production / 24, -- Average power
            base_energy,
            daily_production,
            self_consumed,
            exported,
            'inverter'
        );
    END LOOP;
END $$;

-- ============================================
-- BATTERIES
-- ============================================

INSERT INTO batteries (id, site_id, name, manufacturer, model, capacity_kwh, usable_capacity_kwh, installation_date, status, current_charge_kwh, current_charge_percent, last_seen_at) VALUES
('b0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Home Battery', 'Tesla', 'Powerwall 2', 10.0, 9.5, '2021-03-10', 'online', 7.5, 75, NOW());

-- ============================================
-- EV CHARGERS
-- ============================================

INSERT INTO ev_chargers (id, site_id, name, manufacturer, model, serial_number, max_power_kw, connector_type, status, last_seen_at) VALUES
('c0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'EV Charger', 'Wallbox', 'Pulsar Plus', 'WBX-123456', 7.4, 'type2', 'online', NOW());

-- ============================================
-- CHARGING SESSIONS
-- ============================================

INSERT INTO charging_sessions (id, ev_charger_id, start_time, end_time, energy_kwh, cost, vehicle_id) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '4 hours', 25.5, 7.65, 'MY-TESLA-001'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '3 hours', 18.2, 5.46, 'MY-TESLA-001');

-- ============================================
-- SMART PLUGS
-- ============================================

INSERT INTO smart_plugs (id, site_id, name, manufacturer, model, mac_address, location, status, current_power_w, last_seen_at) VALUES
('e0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Washing Machine', 'TP-Link', 'HS110', 'AA:BB:CC:DD:EE:01', 'Kitchen', 'online', 1200.0, NOW()),
('e0000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Dishwasher', 'TP-Link', 'HS110', 'AA:BB:CC:DD:EE:02', 'Kitchen', 'offline', 0, NOW() - INTERVAL '1 day');

-- ============================================
-- NOTIFICATIONS
-- ============================================

INSERT INTO notifications (id, user_id, type, severity, title, message, action_url, read, created_at) VALUES
('f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'alert', 'warning', 'High consumption detected', 'Your consumption today is 30% higher than average.', '/consumption', FALSE, NOW() - INTERVAL '2 hours'),
('f0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'device', 'success', 'Solar inverter back online', 'Your solar inverter is now online.', '/devices/90000000-0000-0000-0000-000000000001', FALSE, NOW() - INTERVAL '1 day'),
('f0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'billing', 'info', 'Invoice available', 'Your January invoice is ready.', '/billing/60000000-0000-0000-0000-000000000001', TRUE, NOW() - INTERVAL '2 days');

-- ============================================
-- ALERT PREFERENCES
-- ============================================

INSERT INTO alert_preferences (id, user_id, site_id, alert_type, email_enabled, sms_enabled, in_app_enabled, threshold_value, threshold_unit, is_active) VALUES
('a1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'high_consumption', TRUE, FALSE, TRUE, 20.0, 'kwh', TRUE),
('a1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'production_drop', TRUE, FALSE, TRUE, 50.0, 'percent', TRUE),
('a1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'device_offline', TRUE, FALSE, TRUE, NULL, NULL, TRUE);

-- ============================================
-- GOALS
-- ============================================

INSERT INTO goals (id, user_id, site_id, type, target_value, unit, period, start_date, end_date, current_value, progress_percent, is_active) VALUES
('a2000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'consumption', 300.0, 'kwh', 'monthly', '2025-02-01', '2025-02-28', 250.0, 83.33, TRUE);

-- ============================================
-- TICKETS (Optional - for support)
-- ============================================

INSERT INTO tickets (id, user_id, account_id, ticket_number, subject, category, priority, status, created_at) VALUES
('a3000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'TKT-2025-001234', 'Solar inverter offline', 'technical', 'high', 'in_progress', NOW() - INTERVAL '1 day');

INSERT INTO ticket_messages (ticket_id, author_id, content, is_internal, created_at) VALUES
('a3000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'My solar inverter has been offline since yesterday.', FALSE, NOW() - INTERVAL '1 day'),
('a3000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'We are investigating the issue. Please check your inverter connection.', FALSE, NOW() - INTERVAL '12 hours');

