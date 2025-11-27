-- Energy Customer Portal Database Schema
-- Supabase PostgreSQL Setup Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data (optional)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- CORE TABLES
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'prosumer', 'business', 'admin', 'support')),
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('residential', 'business')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
    billing_email VARCHAR(255),
    billing_street VARCHAR(255),
    billing_street_number VARCHAR(50),
    billing_city VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_state VARCHAR(100),
    billing_country VARCHAR(2),
    tax_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites Table
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    street_number VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(2) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('residential', 'commercial', 'industrial')),
    square_meters INTEGER,
    occupants INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meters Table
CREATE TABLE IF NOT EXISTS meters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    meter_number VARCHAR(100) UNIQUE NOT NULL,
    meter_type VARCHAR(20) NOT NULL CHECK (meter_type IN ('electricity', 'gas')),
    phase VARCHAR(20) CHECK (phase IN ('single', 'three')),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    installation_date DATE,
    last_reading_date DATE,
    last_reading_value DECIMAL(12, 3),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'faulty')),
    is_smart_meter BOOLEAN DEFAULT FALSE,
    reading_frequency VARCHAR(20) CHECK (reading_frequency IN ('15min', 'hourly', 'daily')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Readings Table
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(12, 3) NOT NULL,
    delta DECIMAL(12, 3),
    source VARCHAR(20) NOT NULL CHECK (source IN ('smart_meter', 'manual', 'estimated', 'adjusted')),
    quality VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (quality IN ('valid', 'estimated', 'questionable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meter_id, timestamp)
);

-- Tariffs Table
CREATE TABLE IF NOT EXISTS tariffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('fixed', 'variable', 'dynamic', 'tou')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    base_price_per_kwh DECIMAL(10, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    connection_fee DECIMAL(10, 2),
    feed_in_tariff DECIMAL(10, 4),
    feed_in_tariff_type VARCHAR(20) CHECK (feed_in_tariff_type IN ('fixed', 'dynamic')),
    grid_fee_per_kwh DECIMAL(10, 4),
    tax_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.19,
    valid_from DATE NOT NULL,
    valid_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    tariff_id UUID NOT NULL REFERENCES tariffs(id),
    contract_type VARCHAR(20) NOT NULL CHECK (contract_type IN ('fixed', 'variable', 'dynamic', 'tou')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'terminated')),
    start_date DATE NOT NULL,
    end_date DATE,
    termination_notice_days INTEGER DEFAULT 30,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    consumption_kwh DECIMAL(12, 3) NOT NULL DEFAULT 0,
    production_kwh DECIMAL(12, 3) DEFAULT 0,
    export_kwh DECIMAL(12, 3) DEFAULT 0,
    import_kwh DECIMAL(12, 3) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'cancelled')),
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method_id UUID,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice Line Items Table
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(12, 3) NOT NULL,
    unit_price DECIMAL(10, 4) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('consumption', 'production', 'feed_in', 'grid_fee', 'tax', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'sepa_direct_debit', 'bank_transfer')),
    is_default BOOLEAN DEFAULT FALSE,
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    card_expiry_month INTEGER,
    card_expiry_year INTEGER,
    iban VARCHAR(34),
    bic VARCHAR(11),
    account_holder VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'failed')),
    external_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCTION TABLES
-- ============================================

-- Solar Systems Table
CREATE TABLE IF NOT EXISTS solar_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity_kw DECIMAL(8, 2) NOT NULL,
    installation_date DATE NOT NULL,
    orientation VARCHAR(20) CHECK (orientation IN ('north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest')),
    tilt_angle INTEGER CHECK (tilt_angle >= 0 AND tilt_angle <= 90),
    panel_count INTEGER,
    panel_type VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    installer_name VARCHAR(255),
    installer_contact TEXT,
    warranty_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inverters Table
CREATE TABLE IF NOT EXISTS inverters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solar_system_id UUID NOT NULL REFERENCES solar_systems(id) ON DELETE CASCADE,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    max_power_kw DECIMAL(8, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'warning', 'fault')),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    firmware_version VARCHAR(50),
    api_endpoint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Production Readings Table
CREATE TABLE IF NOT EXISTS production_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solar_system_id UUID NOT NULL REFERENCES solar_systems(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    power_kw DECIMAL(8, 3) NOT NULL,
    energy_kwh DECIMAL(12, 3) NOT NULL,
    delta_kwh DECIMAL(12, 3),
    self_consumed_kwh DECIMAL(12, 3),
    exported_kwh DECIMAL(12, 3),
    source VARCHAR(20) NOT NULL CHECK (source IN ('inverter', 'meter', 'estimated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(solar_system_id, timestamp)
);

-- Batteries Table
CREATE TABLE IF NOT EXISTS batteries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    capacity_kwh DECIMAL(8, 2) NOT NULL,
    usable_capacity_kwh DECIMAL(8, 2) NOT NULL,
    installation_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'charging', 'discharging', 'idle', 'fault')),
    current_charge_kwh DECIMAL(8, 2),
    current_charge_percent INTEGER CHECK (current_charge_percent >= 0 AND current_charge_percent <= 100),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    api_endpoint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battery Readings Table
CREATE TABLE IF NOT EXISTS battery_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battery_id UUID NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    charge_kwh DECIMAL(8, 2) NOT NULL,
    charge_percent INTEGER NOT NULL CHECK (charge_percent >= 0 AND charge_percent <= 100),
    power_kw DECIMAL(8, 3) NOT NULL,
    state VARCHAR(20) NOT NULL CHECK (state IN ('charging', 'discharging', 'idle')),
    temperature DECIMAL(5, 2),
    cycles INTEGER,
    health_percent INTEGER CHECK (health_percent >= 0 AND health_percent <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(battery_id, timestamp)
);

-- EV Chargers Table
CREATE TABLE IF NOT EXISTS ev_chargers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    max_power_kw DECIMAL(6, 2) NOT NULL,
    connector_type VARCHAR(20) NOT NULL CHECK (connector_type IN ('type1', 'type2', 'ccs', 'chademo', 'tesla')),
    status VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'charging', 'available', 'fault')),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charging Sessions Table
CREATE TABLE IF NOT EXISTS charging_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ev_charger_id UUID NOT NULL REFERENCES ev_chargers(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    energy_kwh DECIMAL(8, 3) NOT NULL,
    cost DECIMAL(10, 2),
    vehicle_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart Plugs Table
CREATE TABLE IF NOT EXISTS smart_plugs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    location VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'on', 'off')),
    current_power_w DECIMAL(8, 2),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart Plug Readings Table
CREATE TABLE IF NOT EXISTS smart_plug_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smart_plug_id UUID NOT NULL REFERENCES smart_plugs(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    power_w DECIMAL(8, 2) NOT NULL,
    energy_kwh DECIMAL(12, 3) NOT NULL,
    delta_kwh DECIMAL(12, 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(smart_plug_id, timestamp)
);

-- ============================================
-- SUPPORT & NOTIFICATIONS
-- ============================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('alert', 'billing', 'contract', 'device', 'system', 'support')),
    severity VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'success')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert Preferences Table
CREATE TABLE IF NOT EXISTS alert_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('high_consumption', 'production_drop', 'device_offline', 'bill_available', 'payment_due', 'contract_expiring', 'price_spike')),
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    threshold_value DECIMAL(12, 3),
    threshold_unit VARCHAR(20),
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, site_id, alert_type)
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('billing', 'technical', 'contract', 'device', 'other')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Attachments Table
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FORECAST & GOALS
-- ============================================

-- Forecasts Table
CREATE TABLE IF NOT EXISTS forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('consumption', 'production', 'net')),
    forecast_date DATE NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('hourly', 'daily', 'weekly')),
    confidence DECIMAL(3, 2) CHECK (confidence >= 0 AND confidence <= 1),
    source VARCHAR(20) NOT NULL CHECK (source IN ('ml_model', 'weather_api', 'historical_average')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(site_id, type, forecast_date, period)
);

-- Forecast Values Table
CREATE TABLE IF NOT EXISTS forecast_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forecast_id UUID NOT NULL REFERENCES forecasts(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(12, 3) NOT NULL,
    lower_bound DECIMAL(12, 3),
    upper_bound DECIMAL(12, 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('consumption', 'cost', 'production', 'self_consumption')),
    target_value DECIMAL(12, 3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    current_value DECIMAL(12, 3),
    progress_percent DECIMAL(5, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Accounts indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);

-- Sites indexes
CREATE INDEX IF NOT EXISTS idx_sites_account_id ON sites(account_id);
CREATE INDEX IF NOT EXISTS idx_sites_is_primary ON sites(is_primary);

-- Meters indexes
CREATE INDEX IF NOT EXISTS idx_meters_site_id ON meters(site_id);
CREATE INDEX IF NOT EXISTS idx_meters_meter_number ON meters(meter_number);

-- Readings indexes (critical for time-series queries)
CREATE INDEX IF NOT EXISTS idx_readings_meter_id_timestamp ON readings(meter_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp DESC);

-- Contracts indexes
CREATE INDEX IF NOT EXISTS idx_contracts_account_id ON contracts(account_id);
CREATE INDEX IF NOT EXISTS idx_contracts_site_id ON contracts(site_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Invoices indexes
CREATE INDEX IF NOT EXISTS idx_invoices_contract_id ON invoices(contract_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Production indexes
CREATE INDEX IF NOT EXISTS idx_production_readings_solar_system_id_timestamp ON production_readings(solar_system_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_battery_readings_battery_id_timestamp ON battery_readings(battery_id, timestamp DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, read, created_at DESC);

-- Tickets indexes
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meters_updated_at BEFORE UPDATE ON meters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solar_systems_updated_at BEFORE UPDATE ON solar_systems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inverters_updated_at BEFORE UPDATE ON inverters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batteries_updated_at BEFORE UPDATE ON batteries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ev_chargers_updated_at BEFORE UPDATE ON ev_chargers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charging_sessions_updated_at BEFORE UPDATE ON charging_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_plugs_updated_at BEFORE UPDATE ON smart_plugs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alert_preferences_updated_at BEFORE UPDATE ON alert_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

