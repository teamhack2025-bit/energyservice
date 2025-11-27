-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    postcode TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Luxembourg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create device types enum
CREATE TYPE device_type AS ENUM (
    'solar_panel',
    'wind_turbine', 
    'battery',
    'heat_pump',
    'ev_charger',
    'smart_meter'
);

-- Create device status enum
CREATE TYPE device_status AS ENUM (
    'active',
    'inactive',
    'maintenance'
);

-- Create member role enum
CREATE TYPE member_role AS ENUM (
    'admin',
    'member'
);

-- Create offer type enum
CREATE TYPE offer_type AS ENUM (
    'buy',
    'sell'
);

-- Create offer status enum
CREATE TYPE offer_status AS ENUM (
    'active',
    'matched',
    'expired',
    'cancelled'
);

-- Create trade status enum
CREATE TYPE trade_status AS ENUM (
    'confirmed',
    'delivered',
    'settled',
    'disputed'
);

-- Create devices table
CREATE TABLE devices (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    device_type device_type NOT NULL,
    device_name TEXT NOT NULL,
    capacity_kw DECIMAL(10,2) NOT NULL DEFAULT 0,
    installation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status device_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create energy readings table
CREATE TABLE energy_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    device_id TEXT REFERENCES devices(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    production_kwh DECIMAL(10,3) NOT NULL DEFAULT 0,
    consumption_kwh DECIMAL(10,3) NOT NULL DEFAULT 0,
    grid_import_kwh DECIMAL(10,3) NOT NULL DEFAULT 0,
    grid_export_kwh DECIMAL(10,3) NOT NULL DEFAULT 0,
    battery_charge_kwh DECIMAL(10,3) NOT NULL DEFAULT 0,
    battery_discharge_kwh DECIMAL(10,3) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial data table
CREATE TABLE financial_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    energy_cost_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    energy_revenue_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    grid_fees_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    taxes_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_bill_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communities table
CREATE TABLE communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    district TEXT NOT NULL,
    postcode_zone TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community members table
CREATE TABLE community_members (
    id TEXT PRIMARY KEY,
    community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'member',
    anonymous_id TEXT NOT NULL,
    reputation_score INTEGER DEFAULT 70,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(community_id, customer_id)
);

-- Create trading offers table
CREATE TABLE trading_offers (
    id TEXT PRIMARY KEY,
    community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
    offer_type offer_type NOT NULL,
    status offer_status NOT NULL DEFAULT 'active',
    quantity_kwh DECIMAL(10,2) NOT NULL,
    remaining_kwh DECIMAL(10,2) NOT NULL,
    price_eur_per_kwh DECIMAL(10,4) NOT NULL,
    delivery_start TIMESTAMP WITH TIME ZONE NOT NULL,
    delivery_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create trades table
CREATE TABLE trades (
    id TEXT PRIMARY KEY,
    community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    buyer_id TEXT NOT NULL REFERENCES community_members(id),
    seller_id TEXT NOT NULL REFERENCES community_members(id),
    status trade_status NOT NULL DEFAULT 'confirmed',
    quantity_kwh DECIMAL(10,2) NOT NULL,
    price_eur_per_kwh DECIMAL(10,4) NOT NULL,
    total_value_eur DECIMAL(10,2) NOT NULL,
    delivery_start TIMESTAMP WITH TIME ZONE NOT NULL,
    delivery_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE
);

-- Create energy sharing groups table
CREATE TABLE energy_sharing_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    region TEXT NOT NULL,
    postcode TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    total_capacity_kwh DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sharing members table
CREATE TABLE sharing_members (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES energy_sharing_groups(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'member',
    meter_id TEXT NOT NULL,
    is_prosumer BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, customer_id)
);

-- Create sharing transactions table
CREATE TABLE sharing_transactions (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES energy_sharing_groups(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES sharing_members(id) ON DELETE CASCADE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    energy_from_community_kwh DECIMAL(10,3) DEFAULT 0,
    energy_to_community_kwh DECIMAL(10,3) DEFAULT 0,
    community_cost_eur DECIMAL(10,2) DEFAULT 0,
    community_revenue_eur DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_devices_customer_id ON devices(customer_id);
CREATE INDEX idx_devices_type ON devices(device_type);
CREATE INDEX idx_energy_readings_customer_id ON energy_readings(customer_id);
CREATE INDEX idx_energy_readings_timestamp ON energy_readings(timestamp);
CREATE INDEX idx_energy_readings_customer_timestamp ON energy_readings(customer_id, timestamp);
CREATE INDEX idx_financial_data_customer_id ON financial_data(customer_id);
CREATE INDEX idx_financial_data_period ON financial_data(period_start, period_end);
CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_customer_id ON community_members(customer_id);
CREATE INDEX idx_trading_offers_community_id ON trading_offers(community_id);
CREATE INDEX idx_trading_offers_status ON trading_offers(status);
CREATE INDEX idx_trades_community_id ON trades(community_id);
CREATE INDEX idx_trades_buyer_id ON trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON trades(seller_id);
CREATE INDEX idx_sharing_members_group_id ON sharing_members(group_id);
CREATE INDEX idx_sharing_members_customer_id ON sharing_members(customer_id);
CREATE INDEX idx_sharing_transactions_group_id ON sharing_transactions(group_id);
CREATE INDEX idx_sharing_transactions_member_id ON sharing_transactions(member_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_sharing_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (for demo, we'll allow all operations)
-- In production, you'd want more restrictive policies based on user authentication
CREATE POLICY "Allow all operations on customers" ON customers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on devices" ON devices
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on energy_readings" ON energy_readings
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on financial_data" ON financial_data
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on communities" ON communities
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on community_members" ON community_members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on trading_offers" ON trading_offers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on trades" ON trades
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on energy_sharing_groups" ON energy_sharing_groups
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on sharing_members" ON sharing_members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on sharing_transactions" ON sharing_transactions
    FOR ALL USING (true) WITH CHECK (true);
