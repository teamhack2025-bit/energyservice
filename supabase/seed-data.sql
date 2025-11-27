-- ============================================
-- SEED DATA: 1000 Customers with Complete Data
-- Run this in Supabase SQL Editor after schema.sql
-- ============================================

-- Generate 1000 customers
DO $$
DECLARE
    first_names TEXT[] := ARRAY['Jean', 'Marie', 'Pierre', 'Anne', 'Michel', 'Catherine', 'Paul', 'Françoise', 'André', 'Monique', 'Claude', 'Sylvie', 'Bernard', 'Martine', 'Robert', 'Nicole', 'Henri', 'Brigitte', 'Georges', 'Jacqueline', 'Marcel', 'Christiane', 'René', 'Denise', 'Roger', 'Simone', 'Louis', 'Jeanne', 'François', 'Yvette'];
    last_names TEXT[] := ARRAY['Muller', 'Schmidt', 'Weber', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 'Huber', 'Mayer'];
    streets TEXT[] := ARRAY['Rue de la Paix', 'Avenue de la Liberté', 'Rue du Commerce', 'Boulevard Royal', 'Rue de Strasbourg', 'Avenue Monterey', 'Rue de Hollerich', 'Boulevard de la Pétrusse', 'Rue de Bonnevoie', 'Avenue Gaston Diderich', 'Rue de Merl', 'Boulevard Prince Henri', 'Rue de Cessange', 'Avenue de la Faïencerie', 'Rue de Hamm'];
    cities TEXT[] := ARRAY['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck', 'Diekirch', 'Wiltz', 'Echternach', 'Remich', 'Grevenmacher'];
    postcodes TEXT[] := ARRAY['L-1009', 'L-1011', 'L-4001', 'L-4002', 'L-4501', 'L-3401', 'L-9001', 'L-9201', 'L-9501', 'L-6401', 'L-5501', 'L-6701'];
    
    customer_id TEXT;
    first_name TEXT;
    last_name TEXT;
    i INTEGER;
BEGIN
    FOR i IN 1..1000 LOOP
        first_name := first_names[1 + floor(random() * array_length(first_names, 1))];
        last_name := last_names[1 + floor(random() * array_length(last_names, 1))];
        customer_id := 'customer-' || LPAD(i::TEXT, 4, '0');
        
        INSERT INTO customers (id, email, name, address, postcode, city, country, created_at, updated_at)
        VALUES (
            customer_id,
            lower(first_name) || '.' || lower(last_name) || i || '@email.lu',
            first_name || ' ' || last_name,
            (floor(random() * 200) + 1)::TEXT || ' ' || streets[1 + floor(random() * array_length(streets, 1))],
            postcodes[1 + floor(random() * array_length(postcodes, 1))],
            cities[1 + floor(random() * array_length(cities, 1))],
            'Luxembourg',
            NOW() - (random() * INTERVAL '1460 days'),
            NOW()
        );
    END LOOP;
    
    RAISE NOTICE 'Created 1000 customers';
END $$;

-- Generate devices for all customers
DO $$
DECLARE
    customer_rec RECORD;
    customer_created_at TIMESTAMP;
BEGIN
    FOR customer_rec IN SELECT id, created_at FROM customers LOOP
        customer_created_at := customer_rec.created_at;
        
        -- Smart meter (100%)
        INSERT INTO devices (id, customer_id, device_type, device_name, capacity_kw, installation_date, status)
        VALUES (
            'device-' || customer_rec.id || '-meter',
            customer_rec.id,
            'smart_meter',
            'Smart Meter',
            0,
            customer_created_at,
            'active'
        );
        
        -- Solar panels (80%)
        IF random() < 0.8 THEN
            INSERT INTO devices (id, customer_id, device_type, device_name, capacity_kw, installation_date, status)
            VALUES (
                'device-' || customer_rec.id || '-solar',
                customer_rec.id,
                'solar_panel',
                'Solar Panel System',
                ROUND((random() * 8 + 2)::NUMERIC, 1),
                customer_created_at + (random() * (NOW() - customer_created_at)),
                'active'
            );
        END IF;
        
        -- Battery (30%)
        IF random() < 0.3 THEN
            INSERT INTO devices (id, customer_id, device_type, device_name, capacity_kw, installation_date, status)
            VALUES (
                'device-' || customer_rec.id || '-battery',
                customer_rec.id,
                'battery',
                'Home Battery',
                ROUND((random() * 10 + 5)::NUMERIC, 1),
                customer_created_at + (random() * (NOW() - customer_created_at)),
                'active'
            );
        END IF;
        
        -- Heat pump (40%)
        IF random() < 0.4 THEN
            INSERT INTO devices (id, customer_id, device_type, device_name, capacity_kw, installation_date, status)
            VALUES (
                'device-' || customer_rec.id || '-heatpump',
                customer_rec.id,
                'heat_pump',
                'Heat Pump',
                ROUND((random() * 8 + 4)::NUMERIC, 1),
                customer_created_at + (random() * (NOW() - customer_created_at)),
                'active'
            );
        END IF;
        
        -- EV charger (25%)
        IF random() < 0.25 THEN
            INSERT INTO devices (id, customer_id, device_type, device_name, capacity_kw, installation_date, status)
            VALUES (
                'device-' || customer_rec.id || '-evcharger',
                customer_rec.id,
                'ev_charger',
                'EV Charger',
                ROUND((random() * 15 + 7)::NUMERIC, 1),
                customer_created_at + (random() * (NOW() - customer_created_at)),
                'active'
            );
        END IF;
        
        -- Wind turbine (10%)
        IF random() < 0.1 THEN
            INSERT INTO devices (id, customer_id, device_type, device_name, capacity_kw, installation_date, status)
            VALUES (
                'device-' || customer_rec.id || '-wind',
                customer_rec.id,
                'wind_turbine',
                'Small Wind Turbine',
                ROUND((random() * 3 + 1)::NUMERIC, 1),
                customer_created_at + (random() * (NOW() - customer_created_at)),
                'active'
            );
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Created devices for all customers';
END $$;

-- Generate energy readings for last 30 days (for first 100 customers)
DO $$
DECLARE
    customer_rec RECORD;
    device_rec RECORD;
    day_offset INTEGER;
    hour_offset INTEGER;
    reading_time TIMESTAMP;
    production NUMERIC;
    consumption NUMERIC;
    solar_capacity NUMERIC;
    wind_capacity NUMERIC;
    solar_factor NUMERIC;
    season_factor NUMERIC;
    cloud_factor NUMERIC;
    wind_factor NUMERIC;
    net_production NUMERIC;
    grid_import NUMERIC;
    grid_export NUMERIC;
BEGIN
    FOR customer_rec IN SELECT id FROM customers LIMIT 100 LOOP
        -- Get solar and wind capacity
        SELECT COALESCE(SUM(capacity_kw), 0) INTO solar_capacity
        FROM devices 
        WHERE customer_id = customer_rec.id AND device_type = 'solar_panel';
        
        SELECT COALESCE(SUM(capacity_kw), 0) INTO wind_capacity
        FROM devices 
        WHERE customer_id = customer_rec.id AND device_type = 'wind_turbine';
        
        -- Generate readings for last 30 days
        FOR day_offset IN 0..29 LOOP
            FOR hour_offset IN 0..23 LOOP
                reading_time := NOW() - (day_offset || ' days')::INTERVAL - (hour_offset || ' hours')::INTERVAL;
                
                -- Calculate production
                production := 0;
                
                -- Solar production (peaks at midday)
                IF solar_capacity > 0 AND hour_offset >= 6 AND hour_offset <= 20 THEN
                    solar_factor := GREATEST(0, sin((hour_offset - 6) * pi() / 12));
                    season_factor := 0.7 + 0.3 * sin((EXTRACT(MONTH FROM reading_time) - 3) * pi() / 6);
                    cloud_factor := 0.7 + 0.3 * random();
                    production := production + solar_capacity * solar_factor * season_factor * cloud_factor;
                END IF;
                
                -- Wind production (random)
                IF wind_capacity > 0 THEN
                    wind_factor := 0.3 + 0.7 * random();
                    production := production + wind_capacity * wind_factor;
                END IF;
                
                -- Calculate consumption (peaks morning and evening)
                consumption := 0.5 + 0.3 * random();
                IF hour_offset >= 6 AND hour_offset <= 9 THEN
                    consumption := consumption * 2.5;
                ELSIF hour_offset >= 17 AND hour_offset <= 22 THEN
                    consumption := consumption * 2.0;
                ELSIF hour_offset >= 0 AND hour_offset <= 6 THEN
                    consumption := consumption * 0.7;
                END IF;
                
                -- Calculate grid interaction
                net_production := production - consumption;
                grid_import := GREATEST(0, -net_production);
                grid_export := GREATEST(0, net_production);
                
                INSERT INTO energy_readings (
                    customer_id, 
                    timestamp, 
                    production_kwh, 
                    consumption_kwh, 
                    grid_import_kwh, 
                    grid_export_kwh,
                    battery_charge_kwh,
                    battery_discharge_kwh
                )
                VALUES (
                    customer_rec.id,
                    reading_time,
                    ROUND(production::NUMERIC, 2),
                    ROUND(consumption::NUMERIC, 2),
                    ROUND(grid_import::NUMERIC, 2),
                    ROUND(grid_export::NUMERIC, 2),
                    0,
                    0
                );
            END LOOP;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Created energy readings for 100 customers (30 days)';
END $$;

-- Generate financial data for last 12 months (for first 100 customers)
DO $$
DECLARE
    customer_rec RECORD;
    month_offset INTEGER;
    period_start TIMESTAMP;
    period_end TIMESTAMP;
    total_grid_import NUMERIC;
    total_grid_export NUMERIC;
    total_consumption NUMERIC;
    energy_cost NUMERIC;
    energy_revenue NUMERIC;
    grid_fees NUMERIC;
    net_cost NUMERIC;
    taxes NUMERIC;
    total_bill NUMERIC;
BEGIN
    FOR customer_rec IN SELECT id FROM customers LIMIT 100 LOOP
        FOR month_offset IN 0..11 LOOP
            period_start := date_trunc('month', NOW() - (month_offset || ' months')::INTERVAL);
            period_end := date_trunc('month', NOW() - ((month_offset - 1) || ' months')::INTERVAL);
            
            -- Calculate totals from energy readings
            SELECT 
                COALESCE(SUM(grid_import_kwh), 0),
                COALESCE(SUM(grid_export_kwh), 0),
                COALESCE(SUM(consumption_kwh), 0)
            INTO total_grid_import, total_grid_export, total_consumption
            FROM energy_readings
            WHERE customer_id = customer_rec.id
            AND timestamp >= period_start
            AND timestamp < period_end;
            
            -- Calculate costs (Luxembourg prices)
            energy_cost := total_grid_import * 0.28;
            energy_revenue := total_grid_export * 0.08;
            grid_fees := total_consumption * 0.05;
            net_cost := energy_cost - energy_revenue + grid_fees;
            taxes := net_cost * 0.17;
            total_bill := net_cost + taxes;
            
            INSERT INTO financial_data (
                customer_id,
                period_start,
                period_end,
                energy_cost_eur,
                energy_revenue_eur,
                grid_fees_eur,
                taxes_eur,
                total_bill_eur
            )
            VALUES (
                customer_rec.id,
                period_start,
                period_end,
                ROUND(energy_cost::NUMERIC, 2),
                ROUND(energy_revenue::NUMERIC, 2),
                ROUND(grid_fees::NUMERIC, 2),
                ROUND(taxes::NUMERIC, 2),
                ROUND(total_bill::NUMERIC, 2)
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Created financial data for 100 customers (12 months)';
END $$;

-- Summary
DO $$
DECLARE
    customer_count INTEGER;
    device_count INTEGER;
    reading_count INTEGER;
    financial_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO customer_count FROM customers;
    SELECT COUNT(*) INTO device_count FROM devices;
    SELECT COUNT(*) INTO reading_count FROM energy_readings;
    SELECT COUNT(*) INTO financial_count FROM financial_data;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATA GENERATION COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Customers: %', customer_count;
    RAISE NOTICE 'Devices: %', device_count;
    RAISE NOTICE 'Energy Readings: %', reading_count;
    RAISE NOTICE 'Financial Records: %', financial_count;
    RAISE NOTICE '========================================';
END $$;
