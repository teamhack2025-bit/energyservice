# Design Document

## Overview

This design document outlines the architecture for migrating the Energy Customer Portal from client-side mock data to a production-ready Supabase PostgreSQL database. The system will support 1000 synthetic Luxembourg customers with complete energy monitoring data including devices, hourly readings, financial records, community trading, and energy sharing groups.

The migration involves:
- Comprehensive database schema design with proper indexing and relationships
- TypeScript type generation for type-safe database operations
- Service layer architecture for business logic encapsulation
- RESTful API routes for all dashboard pages
- Data generation scripts for realistic test data
- Complete replacement of mock data generators with database queries

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│  Dashboard Pages                                             │
│  ├── /dashboard (Main Overview)                              │
│  ├── /energy-home (Smart Home)                               │
│  ├── /community (P2P Trading)                                │
│  └── /energy-sharing (Sharing Groups)                        │
├─────────────────────────────────────────────────────────────┤
│  API Routes (Next.js API)                                    │
│  ├── /api/dashboard                                          │
│  ├── /api/energy/live                                        │
│  ├── /api/community/dashboard                                │
│  └── /api/energy-sharing/overview                            │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                               │
│  ├── DashboardService                                        │
│  ├── EnergyService                                           │
│  ├── CommunityService                                        │
│  └── EnergySharingService                                    │
├─────────────────────────────────────────────────────────────┤
│  Supabase Client (lib/supabase.ts)                          │
│  └── Type-safe database client with auth helpers             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL                       │
├─────────────────────────────────────────────────────────────┤
│  Tables:                                                     │
│  ├── customers (1000 records)                                │
│  ├── devices (~4000 records)                                 │
│  ├── energy_readings (~72,000 records)                       │
│  ├── financial_data (~12,000 records)                        │
│  ├── communities (~10 groups)                                │
│  ├── community_members (~500 members)                        │
│  ├── trading_offers (~100 active)                            │
│  ├── trades (~1000 completed)                                │
│  ├── energy_sharing_groups (~5 groups)                       │
│  ├── sharing_members (~100 members)                          │
│  └── sharing_transactions (~500 records)                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Request** → Dashboard page loads
2. **Page Component** → Calls API route (e.g., `/api/dashboard`)
3. **API Route** → Invokes service method (e.g., `DashboardService.getData()`)
4. **Service Layer** → Executes Supabase queries with filters
5. **Supabase Client** → Fetches data from PostgreSQL
6. **Database** → Returns filtered, aggregated data
7. **Service Layer** → Transforms and calculates derived metrics
8. **API Route** → Returns JSON response
9. **Page Component** → Renders data in UI


## Components and Interfaces

### Database Schema

#### Core Tables

**customers**
```sql
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
```

**devices**
```sql
CREATE TYPE device_type AS ENUM (
    'solar_panel', 'wind_turbine', 'battery', 
    'heat_pump', 'ev_charger', 'smart_meter'
);

CREATE TYPE device_status AS ENUM ('active', 'inactive', 'maintenance');

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
```

**energy_readings**
```sql
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
```


**financial_data**
```sql
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
```

#### Community Trading Tables

**communities**
```sql
CREATE TABLE communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    district TEXT NOT NULL,
    postcode_zone TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**community_members**
```sql
CREATE TYPE member_role AS ENUM ('admin', 'member');

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
```

**trading_offers**
```sql
CREATE TYPE offer_type AS ENUM ('buy', 'sell');
CREATE TYPE offer_status AS ENUM ('active', 'matched', 'expired', 'cancelled');

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
```


**trades**
```sql
CREATE TYPE trade_status AS ENUM ('confirmed', 'delivered', 'settled', 'disputed');

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
```

#### Energy Sharing Tables

**energy_sharing_groups**
```sql
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
```

**sharing_members**
```sql
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
```

**sharing_transactions**
```sql
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
```

### Indexes

```sql
-- Performance indexes
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
```


## Data Models

### TypeScript Interfaces

The system will generate TypeScript types from the Supabase schema using the Supabase CLI:

```typescript
// lib/database.types.ts
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer
        Insert: CustomerInsert
        Update: CustomerUpdate
      }
      devices: {
        Row: Device
        Insert: DeviceInsert
        Update: DeviceUpdate
      }
      energy_readings: {
        Row: EnergyReading
        Insert: EnergyReadingInsert
        Update: EnergyReadingUpdate
      }
      // ... other tables
    }
    Enums: {
      device_type: 'solar_panel' | 'wind_turbine' | 'battery' | 'heat_pump' | 'ev_charger' | 'smart_meter'
      device_status: 'active' | 'inactive' | 'maintenance'
      member_role: 'admin' | 'member'
      offer_type: 'buy' | 'sell'
      offer_status: 'active' | 'matched' | 'expired' | 'cancelled'
      trade_status: 'confirmed' | 'delivered' | 'settled' | 'disputed'
    }
  }
}
```

### Service Layer Interfaces

```typescript
// lib/services/DashboardService.ts
export interface DashboardData {
  customer: Customer
  devices: Device[]
  todayStats: {
    production: number
    consumption: number
    netBalance: number
    efficiency: number
  }
  monthlyStats: {
    cost: number
    revenue: number
    totalBill: number
  }
  last30Days: Array<{
    date: string
    import: number
    export: number
  }>
  last7Days: {
    consumption: Array<{ date: string; value: number }>
    production: Array<{ date: string; value: number }>
  }
}

// lib/services/EnergyService.ts
export interface EnergyFlowData {
  timestamp: string
  solar: {
    production: number
    toHouse: number
    toGrid: number
    toBattery: number
  }
  battery: {
    soc: number
    power: number
    capacity: number
    estimatedRuntime: number
  }
  grid: {
    import: number
    export: number
    currentPrice: number
    tariff: string
  }
  consumption: {
    total: number
    byRoom: Record<string, number>
  }
}

// lib/services/CommunityService.ts
export interface CommunityDashboardData {
  community: Community
  member: CommunityMember
  stats: CommunityStats
  recentTrades: Trade[]
  activeOffers: TradingOffer[]
  personalStats: PersonalTradingStats
}

// lib/services/EnergySharingService.ts
export interface GroupOverviewData {
  group: EnergySharingGroup
  member: SharingMember
  kpis: GroupKPIs
  recentAllocations: SharingTransaction[]
  members: SharingMember[]
  rules: GroupRule[]
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CASCADE delete maintains referential integrity

*For any* customer deletion, all associated devices, energy readings, financial data, community memberships, and sharing memberships should also be deleted from the database.
**Validates: Requirements 1.4**

### Property 2: Customer uniqueness

*For any* set of generated customers, all customer IDs and email addresses should be unique across the entire dataset.
**Validates: Requirements 2.1**

### Property 3: Device distribution per customer

*For any* customer in the generated dataset, the number of devices assigned should be between 3 and 8 inclusive.
**Validates: Requirements 2.2**

### Property 4: Hourly reading completeness

*For any* customer with energy readings, there should be approximately 720 readings (30 days × 24 hours) with timestamps spaced roughly 1 hour apart.
**Validates: Requirements 2.3**

### Property 5: Consumption pattern validation

*For any* day of energy readings, consumption values during morning hours (6-9 AM) and evening hours (5-10 PM) should be higher on average than nighttime hours (0-6 AM).
**Validates: Requirements 2.4**

### Property 6: Financial calculation accuracy

*For any* financial record, the total_bill_eur should equal (energy_cost_eur - energy_revenue_eur + grid_fees_eur) × (1 + tax_rate).
**Validates: Requirements 2.5**

### Property 7: Community group size constraints

*For any* generated community group, the number of members should be between 20 and 50 inclusive.
**Validates: Requirements 2.6**

### Property 8: Energy sharing group size constraints

*For any* generated energy sharing group, the number of members should be between 5 and 15 inclusive.
**Validates: Requirements 2.7**

### Property 9: TypeScript type completeness

*For any* database table, the generated TypeScript types should include Row, Insert, and Update type variants.
**Validates: Requirements 3.2**

### Property 10: Enum type generation

*For any* database enum type, a corresponding TypeScript union type should be generated.
**Validates: Requirements 3.4**

### Property 11: API response structure completeness

*For any* dashboard API call, the response should contain all required fields: customer, devices, todayStats, monthlyStats, last30Days, and last7Days.
**Validates: Requirements 5.1**

### Property 12: Energy home API response structure

*For any* energy home API call, the response should contain solar, battery, grid, consumption, ev, gas, and heatPump data.
**Validates: Requirements 5.2**

### Property 13: Community API response structure

*For any* community API call, the response should contain community, member, stats, recentTrades, activeOffers, and personalStats.
**Validates: Requirements 5.3**

### Property 14: Energy sharing API response structure

*For any* energy sharing API call, the response should contain group, member, kpis, recentAllocations, members, and rules.
**Validates: Requirements 5.4**

### Property 15: API error handling

*For any* API error condition (database unavailable, invalid customer ID, etc.), the response should include an appropriate HTTP status code (4xx or 5xx) and an error message.
**Validates: Requirements 5.5**

### Property 16: Multi-tenant data isolation

*For any* API call with a customer ID, the returned data should only include records where customer_id matches the authenticated customer, ensuring no data leakage between customers.
**Validates: Requirements 5.6**

### Property 17: Time-series grouping accuracy

*For any* request for daily aggregated data, readings should be grouped by date with all readings for the same date summed together.
**Validates: Requirements 6.3**

### Property 18: Service error descriptiveness

*For any* service method error, the thrown exception should include a descriptive message indicating what went wrong and which operation failed.
**Validates: Requirements 6.4**

### Property 19: Dashboard calculation accuracy

*For any* dashboard energy balance calculation, the net value should equal produced minus consumed.
**Validates: Requirements 7.3**

### Property 20: Financial summary calculation accuracy

*For any* financial summary, costs and savings should be calculated from actual database transaction records, not estimated values.
**Validates: Requirements 8.3**

### Property 21: Community statistics aggregation

*For any* community statistics calculation, the total should equal the sum of all individual member contributions.
**Validates: Requirements 9.4**

### Property 22: Energy sharing contribution accuracy

*For any* member's energy contribution calculation, the total energy shared should equal the sum of all sharing transactions for that member.
**Validates: Requirements 10.3**

### Property 23: Data generation error recovery

*For any* batch insertion error during data generation, the script should log the error and continue processing remaining batches without terminating.
**Validates: Requirements 11.3**

### Property 24: Duplicate key handling

*For any* attempt to insert a customer with an existing ID or email, the system should handle the conflict gracefully without crashing.
**Validates: Requirements 11.5**

### Property 25: Environment variable validation

*For any* missing required environment variable, the system should throw a clear error message indicating which variable is missing and where it should be set.
**Validates: Requirements 12.3**


## Error Handling

### Database Connection Errors

- **Connection Failure**: If Supabase is unreachable, API routes should return HTTP 503 with message "Database temporarily unavailable"
- **Authentication Failure**: If API keys are invalid, return HTTP 401 with message "Database authentication failed"
- **Timeout**: If queries exceed 30 seconds, cancel and return HTTP 504 with message "Database query timeout"

### Data Validation Errors

- **Invalid Customer ID**: Return HTTP 404 with message "Customer not found"
- **Invalid Date Range**: Return HTTP 400 with message "Invalid date range specified"
- **Missing Required Fields**: Return HTTP 400 with message "Missing required field: {field_name}"

### Data Generation Errors

- **Duplicate Key**: Log warning and skip record, continue with next batch
- **Constraint Violation**: Log error with details, continue with next batch
- **Batch Failure**: Log entire batch, retry once, then skip if still failing

### Environment Variable Errors

- **Missing Variable**: Throw error at startup with message "Required environment variable {VAR_NAME} is not set. Please add it to .env.local"
- **Invalid Format**: Throw error with message "Environment variable {VAR_NAME} has invalid format. Expected: {format}"

### Service Layer Errors

All service methods should:
1. Catch Supabase errors and wrap them in descriptive exceptions
2. Include context about which operation failed
3. Log errors with stack traces for debugging
4. Re-throw as custom error types (DatabaseError, ValidationError, NotFoundError)

Example:
```typescript
try {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()
  
  if (error) throw error
  if (!data) throw new NotFoundError(`Customer ${customerId} not found`)
  
  return data
} catch (error) {
  console.error('Failed to fetch customer:', error)
  throw new DatabaseError(`Failed to fetch customer ${customerId}: ${error.message}`)
}
```


## Testing Strategy

### Unit Testing

Unit tests will verify specific functionality of individual components:

**Service Layer Tests**
- Test each service method with known inputs
- Verify correct Supabase queries are constructed
- Test error handling for various failure scenarios
- Mock Supabase client to isolate service logic

**API Route Tests**
- Test each endpoint with valid requests
- Verify correct HTTP status codes
- Test error responses for invalid inputs
- Verify response structure matches expected format

**Data Generation Tests**
- Test customer generation produces valid data
- Test device distribution logic
- Test energy reading calculation formulas
- Test financial calculation accuracy

Example unit test:
```typescript
describe('DashboardService', () => {
  it('should calculate today stats correctly', async () => {
    const mockReadings = [
      { production_kwh: 5.0, consumption_kwh: 3.0 },
      { production_kwh: 6.0, consumption_kwh: 4.0 }
    ]
    
    const stats = calculateTodayStats(mockReadings)
    
    expect(stats.production).toBe(11.0)
    expect(stats.consumption).toBe(7.0)
    expect(stats.netBalance).toBe(4.0)
  })
})
```

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using **fast-check** library for TypeScript.

Each property test will:
- Run a minimum of 100 iterations with random inputs
- Be tagged with a comment referencing the design document property
- Verify the property holds for all generated test cases

**Property Test Framework**: fast-check (npm package)

**Property Test Examples**:

```typescript
import fc from 'fast-check'

/**
 * Feature: supabase-data-migration, Property 2: Customer uniqueness
 * Validates: Requirements 2.1
 */
describe('Property 2: Customer uniqueness', () => {
  it('should generate unique customer IDs and emails', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        async (count) => {
          const customers = await generateCustomers(count)
          const ids = customers.map(c => c.id)
          const emails = customers.map(c => c.email)
          
          const uniqueIds = new Set(ids)
          const uniqueEmails = new Set(emails)
          
          expect(uniqueIds.size).toBe(count)
          expect(uniqueEmails.size).toBe(count)
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: supabase-data-migration, Property 3: Device distribution per customer
 * Validates: Requirements 2.2
 */
describe('Property 3: Device distribution', () => {
  it('should assign 3-8 devices per customer', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ id: fc.string(), name: fc.string() }), { minLength: 1, maxLength: 50 }),
        async (customers) => {
          const devices = await generateDevices(customers)
          
          for (const customer of customers) {
            const customerDevices = devices.filter(d => d.customer_id === customer.id)
            expect(customerDevices.length).toBeGreaterThanOrEqual(3)
            expect(customerDevices.length).toBeLessThanOrEqual(8)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: supabase-data-migration, Property 6: Financial calculation accuracy
 * Validates: Requirements 2.5
 */
describe('Property 6: Financial calculations', () => {
  it('should calculate total bill correctly', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1000 }),
        fc.float({ min: 0, max: 500 }),
        fc.float({ min: 0, max: 100 }),
        fc.float({ min: 0.1, max: 0.3 }),
        (cost, revenue, fees, taxRate) => {
          const totalBill = calculateTotalBill(cost, revenue, fees, taxRate)
          const expected = (cost - revenue + fees) * (1 + taxRate)
          
          expect(totalBill).toBeCloseTo(expected, 2)
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: supabase-data-migration, Property 16: Multi-tenant data isolation
 * Validates: Requirements 5.6
 */
describe('Property 16: Data isolation', () => {
  it('should only return data for authenticated customer', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        async (customerId1, customerId2) => {
          fc.pre(customerId1 !== customerId2)
          
          const data1 = await DashboardService.getData(customerId1)
          const data2 = await DashboardService.getData(customerId2)
          
          // Verify no overlap in returned data
          expect(data1.customer.id).toBe(customerId1)
          expect(data2.customer.id).toBe(customerId2)
          expect(data1.devices.every(d => d.customer_id === customerId1)).toBe(true)
          expect(data2.devices.every(d => d.customer_id === customerId2)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Integration Testing

Integration tests will verify end-to-end functionality:

- Test complete data generation script execution
- Test API routes with real Supabase connection (test database)
- Verify data flows correctly from database through services to API responses
- Test page components fetch and display real data

### Test Data Management

- Use separate Supabase project for testing
- Reset test database before each test suite
- Use transactions for tests that modify data
- Clean up test data after test completion

