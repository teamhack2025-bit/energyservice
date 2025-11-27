# Supabase Database Setup

This directory contains SQL scripts to set up the Energy Customer Portal database in Supabase PostgreSQL.

## Files

- `schema.sql` - Complete database schema with all tables, indexes, and triggers
- `seed.sql` - Test data for development and testing

## Setup Instructions

### Option 1: Using Supabase Dashboard

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be provisioned

2. **Run the schema script**
   - Go to SQL Editor in Supabase dashboard
   - Create a new query
   - Copy and paste the contents of `schema.sql`
   - Click "Run" to execute

3. **Add test data (optional)**
   - Create another query
   - Copy and paste the contents of `seed.sql`
   - Click "Run" to execute

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or run SQL files directly
supabase db execute -f supabase/schema.sql
supabase db execute -f supabase/seed.sql
```

### Option 3: Using psql (Direct PostgreSQL)

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run schema
\i supabase/schema.sql

# Run seed data
\i supabase/seed.sql
```

## Database Structure

### Core Tables
- `users` - Portal users (customers, prosumers, admins)
- `accounts` - Billing accounts
- `sites` - Physical locations (addresses)
- `meters` - Energy meters
- `readings` - Meter readings (consumption data)
- `tariffs` - Energy pricing structures
- `contracts` - Energy supply contracts
- `invoices` - Billing invoices
- `payments` - Payment transactions

### Production Tables
- `solar_systems` - Solar PV systems
- `inverters` - Solar inverters
- `production_readings` - Solar production data
- `batteries` - Battery storage systems
- `battery_readings` - Battery status data
- `ev_chargers` - EV charging stations
- `charging_sessions` - EV charging sessions
- `smart_plugs` - Smart plugs for appliance monitoring
- `smart_plug_readings` - Appliance-level consumption

### Support Tables
- `notifications` - User notifications
- `alert_preferences` - Alert configuration
- `tickets` - Support tickets
- `ticket_messages` - Ticket messages
- `ticket_attachments` - Ticket file attachments

### Analytics Tables
- `forecasts` - Energy forecasts
- `forecast_values` - Forecast data points
- `goals` - User energy/cost goals

## Test Data Included

The seed script includes:
- 3 users (prosumer, customer, admin)
- 2 accounts with sites
- 2 meters with 30 days of readings
- 3 tariff options
- 2 active contracts
- 3 invoices (2 paid, 1 unpaid)
- Payment methods and payment history
- 1 solar system with inverter and 30 days of production data
- 1 battery system
- 1 EV charger with charging sessions
- 2 smart plugs
- Sample notifications and alerts
- 1 support ticket
- 1 energy goal

## Environment Variables

After setting up the database, configure your Next.js app with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Indexes

The schema includes optimized indexes for:
- Time-series queries (readings, production_readings)
- User lookups (email, user_id)
- Status filtering (invoices, contracts, tickets)
- Foreign key relationships

## Triggers

Automatic `updated_at` timestamp updates are configured for all tables with an `updated_at` column.

## Security

For production, ensure you:
1. Set up Row Level Security (RLS) policies
2. Use service role key only on the server
3. Configure proper authentication
4. Set up API rate limiting

## Next Steps

1. Set up Supabase authentication
2. Create RLS policies for data access
3. Connect Next.js app to Supabase
4. Replace mock data with real database queries
5. Set up real-time subscriptions for live data

