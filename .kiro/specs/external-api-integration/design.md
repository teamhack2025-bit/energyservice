# Design Document: External API Integration

## Overview

This design document outlines the integration of the external energy service API (`https://energyserviceapi.vercel.app/api/dashboard/overview/{house_id}`) into the existing dashboard. The solution involves creating a new API route that proxies requests to the external API, implementing data transformation logic, and updating the dashboard to consume the transformed data.

## Architecture

### High-Level Architecture

```
User Browser
    ↓
Dashboard Page (app/dashboard/page.tsx)
    ↓
Internal API Route (/api/dashboard/overview)
    ↓
External API Service (lib/services/ExternalEnergyService.ts)
    ↓
External API (https://energyserviceapi.vercel.app)
```

### Component Responsibilities

1. **Dashboard Page**: React component that fetches and displays energy data
2. **Internal API Route**: Next.js API route that handles authentication and proxies requests
3. **External API Service**: Service layer that manages external API calls, retries, and error handling
4. **Data Transformer**: Utility that transforms external API responses to internal format
5. **House ID Manager**: Service that maps users to house IDs

## Components and Interfaces

### 1. External API Service

**File**: `lib/services/ExternalEnergyService.ts`

```typescript
interface ExternalAPIResponse {
  house_id: string
  timestamp: string
  last_updated: string
  metrics: {
    net_today: MetricData
    cost_this_month: MetricData
    revenue_this_month: MetricData
    efficiency: MetricData
    today_production: MetricData
    today_consumption: MetricData
  }
  consumption: ConsumptionData
  production: ProductionData
  net_balance: NetBalanceData
  energy_balance: EnergyBalanceData
  quick_actions: QuickAction[]
}

interface MetricData {
  value: number
  unit: string
  change: number
  change_direction: 'up' | 'down' | 'neutral'
  label: string
}

interface ConsumptionData {
  title: string
  subtitle: string
  dates: string[]
  data: DayData[]
  unit: string
}

interface DayData {
  date: string
  values: number[]  // 24 hourly values
  average: number
}

interface ProductionData {
  title: string
  subtitle: string
  dates: string[]
  data: DayData[]
  unit: string
}

interface NetBalanceData {
  title: string
  subtitle: string
  dates: string[]
  data: NetBalanceDayData[]
  unit: string
}

interface NetBalanceDayData {
  date: string
  import: number
  export: number
  net: number
}

interface EnergyBalanceData {
  title: string
  produced: { value: number; unit: string; percentage: number }
  consumed: { value: number; unit: string; percentage: number }
  net: { value: number; unit: string; percentage: number }
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: string
}

class ExternalEnergyService {
  private baseUrl = 'https://energyserviceapi.vercel.app'
  private maxRetries = 2
  private retryDelay = 1000

  async getDashboardData(houseId: string): Promise<ExternalAPIResponse>
  async fetchWithRetry(url: string, retries: number): Promise<Response>
  private validateResponse(data: any): boolean
}
```

### 2. Data Transformer

**File**: `lib/services/DataTransformer.ts`

```typescript
interface InternalDashboardData {
  todayStats: {
    netBalance: number
    production: number
    consumption: number
    efficiency: number
  }
  monthlyStats: {
    cost: number
    revenue: number
  }
  last30Days: Array<{
    timestamp: string
    importKwh: number
    exportKwh: number
    netKwh: number
  }>
  last7DaysConsumption: Array<{
    date: string
    hourlyValues: number[]
    average: number
  }>
  last7DaysProduction: Array<{
    date: string
    hourlyValues: number[]
    average: number
  }>
  energyBalance: {
    produced: number
    consumed: number
    net: number
  }
  quickActions: Array<{
    id: string
    title: string
    description: string
    icon: string
    href: string
  }>
}

class DataTransformer {
  static transformExternalToInternal(
    external: ExternalAPIResponse
  ): InternalDashboardData
  
  private static transformMetrics(metrics: any): any
  private static transformConsumption(consumption: ConsumptionData): any
  private static transformProduction(production: ProductionData): any
  private static transformNetBalance(netBalance: NetBalanceData): any
  private static transformEnergyBalance(energyBalance: EnergyBalanceData): any
  private static transformQuickActions(actions: QuickAction[]): any
}
```

### 3. House ID Manager

**File**: `lib/services/HouseIdManager.ts`

```typescript
interface HouseIdMapping {
  userId: string
  houseId: string
  assignedAt: Date
}

class HouseIdManager {
  private static availableHouseIds = ['H001', 'H002', 'H003', 'H004', 'H005', 'H006']
  
  static async getHouseIdForUser(userId: string): Promise<string>
  static async assignHouseId(userId: string): Promise<string>
  private static getNextAvailableHouseId(): string
  static async updateHouseIdMapping(userId: string, houseId: string): Promise<void>
}
```

### 4. API Route

**File**: `app/api/dashboard/overview/route.ts`

```typescript
export async function GET(request: Request) {
  // 1. Get authenticated user
  // 2. Get or assign house ID for user
  // 3. Fetch data from external API
  // 4. Transform data to internal format
  // 5. Return transformed data
  // 6. Handle errors and fallback to mock data
}
```

## Data Models

### External API Response Structure

The external API returns a comprehensive object with the following structure:

- **Metrics**: 6 key metrics with value, unit, change percentage, and direction
- **Consumption**: 7 days of hourly consumption data (24 values per day)
- **Production**: 7 days of hourly production data (24 values per day)
- **Net Balance**: 30 days of import/export/net data
- **Energy Balance**: Current day's produced/consumed/net summary
- **Quick Actions**: Array of actionable items with links

### Internal Dashboard Format

The dashboard expects:

- **Today Stats**: Single values for net, production, consumption, efficiency
- **Monthly Stats**: Cost and revenue totals
- **Last 30 Days**: Array of objects with timestamp, importKwh, exportKwh, netKwh
- **Last 7 Days**: Separate arrays for consumption and production with hourly breakdowns
- **Energy Balance**: Simple object with produced, consumed, net values
- **Quick Actions**: Array with id, title, description, icon, href

### Transformation Mapping

| External Field | Internal Field | Transformation |
|---------------|----------------|----------------|
| `metrics.net_today.value` | `todayStats.netBalance` | Direct mapping |
| `metrics.today_production.value` | `todayStats.production` | Direct mapping |
| `metrics.today_consumption.value` | `todayStats.consumption` | Direct mapping |
| `metrics.efficiency.value` | `todayStats.efficiency` | Direct mapping |
| `metrics.cost_this_month.value` | `monthlyStats.cost` | Direct mapping |
| `metrics.revenue_this_month.value` | `monthlyStats.revenue` | Direct mapping |
| `net_balance.data[]` | `last30Days[]` | Map date to timestamp, import/export/net to importKwh/exportKwh/netKwh |
| `consumption.data[]` | `last7DaysConsumption[]` | Take last 7 entries, map date and values |
| `production.data[]` | `last7DaysProduction[]` | Take last 7 entries, map date and values |
| `energy_balance` | `energyBalance` | Map produced/consumed/net values |
| `quick_actions[]` | `quickActions[]` | Map action URL to href, keep other fields |

## Error Handling

### Error Scenarios

1. **External API Unavailable**
   - Retry up to 2 times with exponential backoff (1s, 2s)
   - If all retries fail, fall back to mock data
   - Log error with details
   - Display warning indicator to user

2. **Invalid Response Structure**
   - Validate response against expected schema
   - If validation fails, log error and fall back to mock data
   - Return partial data if some fields are valid

3. **Timeout**
   - Set 5-second timeout for external API requests
   - If timeout occurs, cancel request and fall back to mock data
   - Log timeout event

4. **Authentication Failure**
   - If user is not authenticated, return 401
   - If house ID cannot be determined, assign new house ID

5. **Network Errors**
   - Catch network errors (DNS, connection refused, etc.)
   - Log error details
   - Fall back to mock data

### Error Response Format

```typescript
interface ErrorResponse {
  error: string
  message: string
  fallbackUsed: boolean
  timestamp: string
}
```

### Logging Strategy

- Log all external API requests with house ID and timestamp
- Log all errors with full stack trace
- Log fallback usage
- Log response validation failures
- Use structured logging for easy querying

## Testing Strategy

### Unit Tests

1. **ExternalEnergyService Tests**
   - Test successful API call
   - Test retry logic with failed requests
   - Test timeout handling
   - Test response validation

2. **DataTransformer Tests**
   - Test transformation of complete response
   - Test transformation with missing fields
   - Test transformation with invalid data types
   - Test edge cases (empty arrays, null values)

3. **HouseIdManager Tests**
   - Test house ID assignment for new user
   - Test house ID retrieval for existing user
   - Test round-robin assignment when all IDs are used
   - Test concurrent assignment requests

### Property-Based Tests

Before defining property-based tests, let me analyze the acceptance criteria:

**Acceptance Criteria Testing Prework:**

1.1 WHEN a user views the dashboard THEN the system SHALL fetch data from the external API using the user's assigned house ID
Thoughts: This is about the system behavior for all users. We can test that for any authenticated user, the system makes a request to the correct endpoint with their house ID.
Testable: yes - property

1.2 WHEN the external API returns data THEN the system SHALL display all metrics
Thoughts: This is about ensuring all required fields are present in the response. We can generate random API responses and verify all metrics are displayed.
Testable: yes - property

1.3 WHEN the external API request fails THEN the system SHALL fall back to mock data
Thoughts: This is about error handling behavior that should work for any failure scenario.
Testable: yes - property

1.4 WHEN the dashboard loads THEN the system SHALL complete the API request within 5 seconds
Thoughts: This is a performance requirement that's difficult to test consistently in unit tests.
Testable: no

1.5 WHEN the API response is received THEN the system SHALL validate the response structure
Thoughts: This is about validation logic that should work for any response structure.
Testable: yes - property

2.1 WHEN a user authenticates THEN the system SHALL assign or retrieve their associated house ID
Thoughts: This should work for any user. We can test that every user gets a valid house ID.
Testable: yes - property

2.2 WHEN retrieving user data THEN the system SHALL store the house ID mapping
Thoughts: This is about persistence behavior that should work for any user/house ID pair.
Testable: yes - property

2.3 WHEN a house ID is not assigned THEN the system SHALL assign the next available house ID
Thoughts: This is about assignment logic that should work consistently.
Testable: yes - property

2.4 WHEN all house IDs are assigned THEN the system SHALL reuse house IDs in a round-robin fashion
Thoughts: This is about the round-robin algorithm that should work for any number of users.
Testable: yes - property

3.1 WHEN the external API returns metrics data THEN the system SHALL map each metric correctly
Thoughts: This is about data transformation that should work for any valid metric data.
Testable: yes - property

3.2 WHEN the external API returns consumption data THEN the system SHALL transform hourly values correctly
Thoughts: This is about array transformation that should preserve data integrity.
Testable: yes - property

3.3 WHEN the external API returns production data THEN the system SHALL transform hourly values correctly
Thoughts: This is about array transformation that should preserve data integrity.
Testable: yes - property

3.4 WHEN the external API returns net balance data THEN the system SHALL transform 30-day data correctly
Thoughts: This is about data transformation that should work for any valid net balance data.
Testable: yes - property

3.5 WHEN the external API returns energy balance data THEN the system SHALL map values correctly
Thoughts: This is about data transformation that should preserve values.
Testable: yes - property

4.1 WHEN the dashboard displays consumption data THEN the system SHALL show hourly values for last 7 days
Thoughts: This is about data filtering and display that should work for any consumption dataset.
Testable: yes - property

4.2 WHEN the dashboard displays production data THEN the system SHALL show hourly values for last 7 days
Thoughts: This is about data filtering and display that should work for any production dataset.
Testable: yes - property

4.3 WHEN rendering daily charts THEN the system SHALL calculate and display daily average
Thoughts: This is about average calculation that should be correct for any set of hourly values.
Testable: yes - property

4.4 WHEN a day has incomplete data THEN the system SHALL display available data points
Thoughts: This is about handling partial data that should work for any incomplete dataset.
Testable: yes - property

5.1 WHEN the dashboard displays net balance THEN the system SHALL show import, export, and net for 30 days
Thoughts: This is about data display that should work for any 30-day dataset.
Testable: yes - property

5.2 WHEN rendering net balance chart THEN the system SHALL use distinct colors
Thoughts: This is a UI requirement about color coding that's not easily testable as a property.
Testable: no

5.3 WHEN calculating net balance THEN the system SHALL compute net as export minus import
Thoughts: This is a calculation that should be correct for any import/export values.
Testable: yes - property

5.4 WHEN displaying net balance metrics THEN the system SHALL show the most recent day's net value
Thoughts: This is about selecting the correct data point that should work for any dataset.
Testable: yes - property

6.1 WHEN the external API returns quick actions THEN the system SHALL display each action
Thoughts: This is about rendering all items in an array that should work for any quick actions array.
Testable: yes - property

6.2 WHEN a user clicks a quick action THEN the system SHALL navigate to the specified URL
Thoughts: This is a UI interaction that's better tested with integration tests.
Testable: no

6.3 WHEN quick actions are not provided THEN the system SHALL display default quick actions
Thoughts: This is a specific edge case with a known expected output.
Testable: yes - example

7.1 WHEN an API request fails THEN the system SHALL log the error
Thoughts: This is about logging behavior that should work for any error.
Testable: yes - property

7.2 WHEN the API returns invalid data THEN the system SHALL log validation error
Thoughts: This is about error handling that should work for any invalid data.
Testable: yes - property

7.3 WHEN network errors occur THEN the system SHALL retry up to 2 times
Thoughts: This is about retry logic that should work consistently.
Testable: yes - property

7.4 WHEN all retries fail THEN the system SHALL display error message and use cached data
Thoughts: This is about fallback behavior after retries that should work consistently.
Testable: yes - property

**Property Reflection:**

After reviewing all properties, I've identified some redundancy:

- Properties 3.2 and 3.3 (consumption and production transformation) can be combined into a single property about transforming time-series data
- Properties 4.1 and 4.2 (displaying consumption and production for 7 days) can be combined into a single property about filtering time-series data
- Properties 1.2 and 6.1 (displaying all metrics and quick actions) can be combined into a property about rendering all array items
- Property 2.1 is redundant with 2.2 and 2.3 - if we test assignment and storage, we've covered retrieval
- Property 7.1 and 7.2 can be combined into a single property about error logging

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: API Request Construction
*For any* authenticated user with an assigned house ID, the system should construct the external API URL as `https://energyserviceapi.vercel.app/api/dashboard/overview/{house_id}` where {house_id} matches the user's assigned house ID.
**Validates: Requirements 1.1**

### Property 2: Response Validation
*For any* response from the external API, if the response contains all required fields (metrics, consumption, production, net_balance, energy_balance), then validation should pass; otherwise validation should fail.
**Validates: Requirements 1.5**

### Property 3: Fallback on Failure
*For any* failed external API request (network error, timeout, invalid response), the system should return mock data and set a fallback indicator to true.
**Validates: Requirements 1.3**

### Property 4: House ID Assignment Uniqueness
*For any* user without an assigned house ID, calling the assignment function should return a house ID from the set {H001, H002, H003, H004, H005, H006}, and subsequent calls for the same user should return the same house ID.
**Validates: Requirements 2.1, 2.2**

### Property 5: House ID Round-Robin
*For any* sequence of 7 or more new user assignments, the system should reuse house IDs, and the 7th assignment should reuse one of the first 6 assigned house IDs.
**Validates: Requirements 2.4**

### Property 6: Metric Transformation Preservation
*For any* valid external API metrics object, transforming it to internal format and then extracting the values should yield the same numeric values as the original metrics.
**Validates: Requirements 3.1**

### Property 7: Time-Series Data Transformation
*For any* valid consumption or production data with hourly values, transforming to internal format should preserve the number of data points, the date labels, and the sum of all hourly values.
**Validates: Requirements 3.2, 3.3**

### Property 8: Net Balance Calculation
*For any* day's import and export values, the calculated net balance should equal export minus import.
**Validates: Requirements 5.3**

### Property 9: Last 7 Days Filtering
*For any* time-series dataset with 7 or more days, filtering to the last 7 days should return exactly 7 data points with the most recent dates.
**Validates: Requirements 4.1, 4.2**

### Property 10: Daily Average Calculation
*For any* array of hourly values for a day, the calculated average should equal the sum of all values divided by the number of values.
**Validates: Requirements 4.3**

### Property 11: Array Rendering Completeness
*For any* array of items (metrics, quick actions) in the API response, the transformed data should contain the same number of items.
**Validates: Requirements 1.2, 6.1**

### Property 12: Retry Logic
*For any* failed API request, the system should attempt the request at most 3 times total (1 initial + 2 retries) before falling back to mock data.
**Validates: Requirements 7.3**

### Property 13: Error Logging
*For any* error condition (API failure, validation failure, network error), the system should create a log entry containing the error type, timestamp, and relevant context (house ID, user ID).
**Validates: Requirements 7.1, 7.2**

### Property 14: Most Recent Value Selection
*For any* non-empty array of time-series data sorted by date, selecting the most recent value should return the last element in the array.
**Validates: Requirements 5.4**

## Implementation Notes

1. **Caching Strategy**: Consider implementing a short-lived cache (1-2 minutes) for external API responses to reduce load and improve performance.

2. **Rate Limiting**: Implement rate limiting on the internal API route to prevent abuse of the external API.

3. **Monitoring**: Add monitoring for external API response times, error rates, and fallback usage.

4. **House ID Storage**: Store house ID mappings in the database (users table or separate mapping table) for persistence across sessions.

5. **Environment Configuration**: Make the external API base URL configurable via environment variable for testing and flexibility.

6. **TypeScript Types**: Export all interfaces for use across the application to ensure type safety.

7. **Mock Data**: Ensure mock data structure exactly matches the transformed internal format for seamless fallback.
