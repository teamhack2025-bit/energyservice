# Implementation Plan

- [x] 1. Set up TypeScript interfaces and types
  - Create shared type definitions for external API response structure
  - Create internal dashboard data format interfaces
  - Export all types from a central types file
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Implement House ID Manager service
  - Create HouseIdManager class with house ID pool (H001-H006)
  - Implement getHouseIdForUser method to retrieve or assign house ID
  - Implement round-robin assignment logic when all IDs are used
  - Add database integration to persist house ID mappings
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 2.1 Write property test for house ID assignment
  - **Property 4: House ID Assignment Uniqueness**
  - **Validates: Requirements 2.1, 2.2**

- [ ]* 2.2 Write property test for round-robin logic
  - **Property 5: House ID Round-Robin**
  - **Validates: Requirements 2.4**

- [x] 3. Implement External Energy Service
  - Create ExternalEnergyService class with configurable base URL
  - Implement getDashboardData method to fetch from external API
  - Implement fetchWithRetry method with exponential backoff (2 retries max)
  - Add 5-second timeout for API requests
  - Implement response validation logic
  - Add structured error logging
  - _Requirements: 1.1, 1.4, 1.5, 7.1, 7.3_

- [ ]* 3.1 Write property test for API request construction
  - **Property 1: API Request Construction**
  - **Validates: Requirements 1.1**

- [ ]* 3.2 Write property test for response validation
  - **Property 2: Response Validation**
  - **Validates: Requirements 1.5**

- [ ]* 3.3 Write property test for retry logic
  - **Property 12: Retry Logic**
  - **Validates: Requirements 7.3**

- [ ]* 3.4 Write unit tests for timeout handling and network errors

- [x] 4. Implement Data Transformer service
  - Create DataTransformer class with static transformation methods
  - Implement transformExternalToInternal main method
  - Implement transformMetrics to map all 6 metrics
  - Implement transformConsumption to convert 7-day hourly data
  - Implement transformProduction to convert 7-day hourly data
  - Implement transformNetBalance to convert 30-day data
  - Implement transformEnergyBalance to map produced/consumed/net
  - Implement transformQuickActions to map action URLs to hrefs
  - Add validation for missing or invalid fields
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 4.1 Write property test for metric transformation
  - **Property 6: Metric Transformation Preservation**
  - **Validates: Requirements 3.1**

- [ ]* 4.2 Write property test for time-series transformation
  - **Property 7: Time-Series Data Transformation**
  - **Validates: Requirements 3.2, 3.3**

- [ ]* 4.3 Write property test for net balance calculation
  - **Property 8: Net Balance Calculation**
  - **Validates: Requirements 5.3**

- [ ]* 4.4 Write property test for daily average calculation
  - **Property 10: Daily Average Calculation**
  - **Validates: Requirements 4.3**

- [ ]* 4.5 Write property test for array completeness
  - **Property 11: Array Rendering Completeness**
  - **Validates: Requirements 1.2, 6.1**

- [ ]* 4.6 Write unit tests for edge cases (missing fields, null values, empty arrays)

- [x] 5. Create internal API route
  - Create /api/dashboard/overview route handler
  - Implement user authentication check
  - Integrate HouseIdManager to get user's house ID
  - Call ExternalEnergyService to fetch data
  - Call DataTransformer to transform response
  - Implement error handling with fallback to mock data
  - Add fallback indicator in response
  - Return transformed data as JSON
  - _Requirements: 1.1, 1.2, 1.3, 7.2, 7.4_

- [ ]* 5.1 Write property test for fallback behavior
  - **Property 3: Fallback on Failure**
  - **Validates: Requirements 1.3**

- [ ]* 5.2 Write property test for error logging
  - **Property 13: Error Logging**
  - **Validates: Requirements 7.1, 7.2**

- [ ]* 5.3 Write unit tests for authentication failure scenarios

- [x] 6. Update dashboard page to use new API
  - Update fetch call from /api/dashboard/real to /api/dashboard/overview
  - Remove dependency on old DashboardService
  - Update data mapping to use new transformed format
  - Add loading state handling
  - Add error state handling with fallback indicator display
  - Update metric cards to use new data structure
  - Update consumption chart to use last7DaysConsumption
  - Update production chart to use last7DaysProduction
  - Update net balance chart to use last30Days data
  - Update energy balance donut chart
  - Update quick actions rendering
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 5.1, 6.1, 6.3_

- [ ]* 6.1 Write property test for last 7 days filtering
  - **Property 9: Last 7 Days Filtering**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 6.2 Write property test for most recent value selection
  - **Property 14: Most Recent Value Selection**
  - **Validates: Requirements 5.4**

- [ ] 7. Add database schema for house ID mappings
  - Create user_house_mappings table with user_id, house_id, assigned_at columns
  - Add unique constraint on user_id
  - Add index on house_id for efficient lookups
  - Create migration script
  - _Requirements: 2.2_

- [ ]* 7.1 Write unit tests for database operations

- [ ] 8. Add environment configuration
  - Add EXTERNAL_ENERGY_API_URL to .env.local.example
  - Add EXTERNAL_ENERGY_API_TIMEOUT to .env.local.example
  - Update ExternalEnergyService to use environment variables
  - Document environment variables in README
  - _Requirements: 1.1, 1.4_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Add monitoring and logging
  - Add structured logging for all external API calls
  - Log response times for performance monitoring
  - Log fallback usage statistics
  - Add error rate tracking
  - _Requirements: 7.1, 7.2_

- [ ]* 10.1 Write unit tests for logging functionality

- [ ] 11. Implement caching layer (optional enhancement)
  - Add in-memory cache with 2-minute TTL
  - Cache external API responses by house ID
  - Implement cache invalidation logic
  - Add cache hit/miss logging
  - _Requirements: 1.1_

- [ ]* 11.1 Write unit tests for cache behavior

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
