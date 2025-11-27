# Implementation Plan

- [ ] 1. Set up Supabase project and database schema
- [ ] 1.1 Create Supabase project and configure environment variables
  - Create new Supabase project at supabase.com
  - Copy project URL and API keys to `.env.local`
  - Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  - _Requirements: 12.1, 12.2_

- [ ] 1.2 Create complete database schema with all tables
  - Create SQL file `supabase/schema.sql` with all table definitions
  - Include customers, devices, energy_readings, financial_data tables
  - Include communities, community_members, trading_offers, trades tables
  - Include energy_sharing_groups, sharing_members, sharing_transactions tables
  - Define enums: device_type, device_status, member_role, offer_type, offer_status, trade_status
  - Add foreign key constraints with CASCADE delete
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 1.3 Add database indexes for performance optimization
  - Create indexes on customer_id for all related tables
  - Create indexes on timestamp fields for time-series queries
  - Create composite indexes for frequently joined columns
  - _Requirements: 1.2_

- [ ] 1.4 Configure Row Level Security (RLS) policies
  - Enable RLS on all tables
  - Create policies for multi-tenant data isolation
  - Test policies with different customer IDs
  - _Requirements: 1.3_

- [ ] 1.5 Execute schema in Supabase SQL Editor
  - Run schema.sql in Supabase dashboard
  - Verify all tables, indexes, and policies are created
  - _Requirements: 1.1, 13.2_

- [ ] 2. Generate TypeScript types and configure Supabase client
- [ ] 2.1 Install Supabase dependencies
  - Install @supabase/supabase-js package
  - Install TypeScript types
  - _Requirements: 4.1_

- [ ] 2.2 Generate TypeScript types from database schema
  - Create `lib/database.types.ts` with Database interface
  - Include Row, Insert, Update types for each table
  - Generate enum union types
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 2.3 Write property test for TypeScript type completeness
  - **Property 9: TypeScript type completeness**
  - **Validates: Requirements 3.2**

- [ ] 2.4 Create Supabase client configuration
  - Create `lib/supabase.ts` with typed client
  - Add getCurrentCustomerId() helper function
  - Export singleton client instance
  - _Requirements: 4.1, 4.2, 4.3, 4.4_


- [ ] 3. Create data generation script for 1000 customers
- [ ] 3.1 Create data generation script structure
  - Create `scripts/generate-synthetic-data.ts`
  - Set up Supabase service role client
  - Add command-line interface with progress logging
  - _Requirements: 11.1, 11.4_

- [ ] 3.2 Implement customer data generation
  - Generate 1000 customers with Luxembourg names, addresses, postcodes
  - Use realistic Luxembourg cities and street names
  - Ensure unique IDs and email addresses
  - _Requirements: 2.1_

- [ ] 3.3 Write property test for customer uniqueness
  - **Property 2: Customer uniqueness**
  - **Validates: Requirements 2.1**

- [ ] 3.4 Implement device data generation
  - Assign 3-8 devices per customer
  - 80% solar panels, 30% batteries, 40% heat pumps, 25% EV chargers, 10% wind turbines
  - Generate realistic capacity values for each device type
  - _Requirements: 2.2_

- [ ] 3.5 Write property test for device distribution
  - **Property 3: Device distribution per customer**
  - **Validates: Requirements 2.2**

- [ ] 3.6 Implement energy readings generation
  - Generate hourly readings for last 30 days
  - Model solar production based on time of day and season
  - Model consumption with morning/evening peaks and nighttime reduction
  - Calculate grid import/export and battery charging/discharging
  - _Requirements: 2.3, 2.4_

- [ ] 3.7 Write property test for hourly reading completeness
  - **Property 4: Hourly reading completeness**
  - **Validates: Requirements 2.3**

- [ ] 3.8 Write property test for consumption patterns
  - **Property 5: Consumption pattern validation**
  - **Validates: Requirements 2.4**

- [ ] 3.9 Implement financial data generation
  - Calculate monthly bills using Luxembourg prices (€0.28/kWh import, €0.08/kWh export)
  - Apply 17% VAT and grid fees
  - Generate 12 months of financial records
  - _Requirements: 2.5_

- [ ] 3.10 Write property test for financial calculations
  - **Property 6: Financial calculation accuracy**
  - **Validates: Requirements 2.5**

- [ ] 3.11 Implement community data generation
  - Create 5-10 community groups
  - Assign 20-50 members per group
  - Generate trading offers and completed trades
  - _Requirements: 2.6_

- [ ] 3.12 Write property test for community group sizes
  - **Property 7: Community group size constraints**
  - **Validates: Requirements 2.6**

- [ ] 3.13 Implement energy sharing data generation
  - Create 3-5 energy sharing groups
  - Assign 5-15 members per group
  - Generate sharing transactions and allocations
  - _Requirements: 2.7_

- [ ] 3.14 Write property test for sharing group sizes
  - **Property 8: Energy sharing group size constraints**
  - **Validates: Requirements 2.7**

- [ ] 3.15 Add batch insertion with error handling
  - Insert data in batches of 100-1000 records
  - Log errors and continue on failure
  - Handle duplicate key conflicts gracefully
  - Output summary statistics on completion
  - _Requirements: 11.2, 11.3, 11.5_

- [ ] 3.16 Write property test for error recovery
  - **Property 23: Data generation error recovery**
  - **Validates: Requirements 11.3**

- [ ] 3.17 Write property test for duplicate key handling
  - **Property 24: Duplicate key handling**
  - **Validates: Requirements 11.5**

- [ ] 3.18 Add npm script to run data generation
  - Add "generate-data" script to package.json
  - Install tsx for TypeScript execution
  - _Requirements: 11.1_


- [ ] 4. Create service layer for database operations
- [ ] 4.1 Create DashboardService for main dashboard data
  - Implement getDashboardData() method
  - Fetch customer info, devices, today's stats
  - Calculate monthly financial data
  - Aggregate last 30 days and last 7 days trends
  - _Requirements: 5.1, 7.1, 7.2, 7.3_

- [ ] 4.2 Write property test for dashboard API response structure
  - **Property 11: API response structure completeness**
  - **Validates: Requirements 5.1**

- [ ] 4.3 Write property test for dashboard calculation accuracy
  - **Property 19: Dashboard calculation accuracy**
  - **Validates: Requirements 7.3**

- [ ] 4.4 Create EnergyService for smart home data
  - Implement getLiveEnergyFlow() method
  - Fetch current energy readings
  - Calculate solar, battery, grid, and consumption metrics
  - Get device-specific data
  - _Requirements: 5.2, 8.1, 8.2, 8.4_

- [ ] 4.5 Write property test for energy home API response structure
  - **Property 12: Energy home API response structure**
  - **Validates: Requirements 5.2**

- [ ] 4.6 Write property test for financial summary accuracy
  - **Property 20: Financial summary calculation accuracy**
  - **Validates: Requirements 8.3**

- [ ] 4.7 Create CommunityService for P2P trading data
  - Implement getCommunityDashboard() method
  - Fetch community info and member list
  - Get trading offers and recent trades
  - Calculate community statistics
  - _Requirements: 5.3, 9.1, 9.2, 9.3, 9.4_

- [ ] 4.8 Write property test for community API response structure
  - **Property 13: Community API response structure**
  - **Validates: Requirements 5.3**

- [ ] 4.9 Write property test for community statistics aggregation
  - **Property 21: Community statistics aggregation**
  - **Validates: Requirements 9.4**

- [ ] 4.10 Create EnergySharingService for sharing group data
  - Implement getGroupOverview() method
  - Fetch group info and member list
  - Calculate group KPIs and member contributions
  - Get pricing rules and recent allocations
  - _Requirements: 5.4, 10.1, 10.2, 10.3, 10.4_

- [ ] 4.11 Write property test for energy sharing API response structure
  - **Property 14: Energy sharing API response structure**
  - **Validates: Requirements 5.4**

- [ ] 4.12 Write property test for energy sharing contribution accuracy
  - **Property 22: Energy sharing contribution accuracy**
  - **Validates: Requirements 10.3**

- [ ] 4.13 Add error handling to all service methods
  - Wrap Supabase errors in descriptive exceptions
  - Add logging for debugging
  - Throw custom error types (DatabaseError, NotFoundError, ValidationError)
  - _Requirements: 6.4_

- [ ] 4.14 Write property test for service error descriptiveness
  - **Property 18: Service error descriptiveness**
  - **Validates: Requirements 6.4**

- [ ] 4.15 Implement time-series data grouping
  - Add methods to group readings by hour or day
  - Aggregate values correctly
  - _Requirements: 6.3_

- [ ] 4.16 Write property test for time-series grouping
  - **Property 17: Time-series grouping accuracy**
  - **Validates: Requirements 6.3**

- [ ] 4.17 Implement multi-tenant data filtering
  - Ensure all queries filter by customer_id
  - Add tests to verify data isolation
  - _Requirements: 5.6_

- [ ] 4.18 Write property test for multi-tenant data isolation
  - **Property 16: Multi-tenant data isolation**
  - **Validates: Requirements 5.6**


- [ ] 5. Create API routes for all dashboard pages
- [ ] 5.1 Create dashboard API route
  - Create `app/api/dashboard/route.ts`
  - Call DashboardService.getDashboardData()
  - Return JSON response with proper error handling
  - _Requirements: 5.1, 5.5_

- [ ] 5.2 Write property test for API error handling
  - **Property 15: API error handling**
  - **Validates: Requirements 5.5**

- [ ] 5.3 Create energy home API route
  - Create `app/api/energy/live/route.ts`
  - Call EnergyService.getLiveEnergyFlow()
  - Return JSON response with proper error handling
  - _Requirements: 5.2, 5.5_

- [ ] 5.4 Create community API route
  - Create `app/api/community/dashboard/route.ts`
  - Call CommunityService.getCommunityDashboard()
  - Return JSON response with proper error handling
  - _Requirements: 5.3, 5.5_

- [ ] 5.5 Create energy sharing API route
  - Create `app/api/energy-sharing/overview/route.ts`
  - Call EnergySharingService.getGroupOverview()
  - Return JSON response with proper error handling
  - _Requirements: 5.4, 5.5_

- [ ] 5.6 Add environment variable validation
  - Check required variables at API startup
  - Throw clear errors for missing variables
  - _Requirements: 12.3, 12.4_

- [ ] 5.7 Write property test for environment variable validation
  - **Property 25: Environment variable validation**
  - **Validates: Requirements 12.3**

- [ ] 6. Update dashboard pages to use real data
- [ ] 6.1 Update main dashboard page
  - Replace mock data generators with API call to `/api/dashboard`
  - Remove imports of mock data functions
  - Update state management to handle API responses
  - Add loading and error states
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 6.2 Update energy home page
  - Replace mock data with API call to `/api/energy/live`
  - Remove generateLiveEnergyFlow() calls
  - Update components to use real data
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 6.3 Update community page
  - Replace mock data with API call to `/api/community/dashboard`
  - Remove generateCommunityDashboardData() calls
  - Update components to use real data
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 6.4 Update energy sharing page
  - Replace mock data with API call to `/api/energy-sharing/overview`
  - Remove generateGroupOverviewData() calls
  - Update components to use real data
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 6.5 Remove unused mock data files
  - Delete or deprecate lib/energyData.ts mock functions
  - Delete or deprecate lib/communityData.ts mock functions
  - Delete or deprecate lib/energySharingData.ts mock functions
  - Keep only functions needed for fallback/demo purposes
  - _Requirements: 7.4_

- [ ] 7. Create comprehensive documentation
- [ ] 7.1 Create setup guide
  - Document Supabase project creation steps
  - Explain environment variable configuration
  - Provide schema setup instructions
  - Include data generation guide
  - _Requirements: 13.1, 13.2, 13.3_

- [ ] 7.2 Create API integration guide
  - Document each API endpoint
  - Explain request/response formats
  - Show example usage in pages
  - _Requirements: 13.5_

- [ ] 7.3 Create troubleshooting guide
  - Document common issues and solutions
  - Include debugging tips
  - Provide error message reference
  - _Requirements: 13.4_

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Verify data generation script works
  - Test all API endpoints
  - Verify all dashboard pages display real data
  - Ensure all tests pass, ask the user if questions arise.

