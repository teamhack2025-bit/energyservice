# Admin Panel Design Document

## Overview

The admin panel is a comprehensive web-based administrative interface built with Next.js and TypeScript that provides system administrators with full control over the energy management platform. The panel will be accessible at `/admin/login` and will provide CRUD operations for all major entities including users, customers, sites, devices, communities, financial data, and support tickets.

The design follows a modular architecture with reusable components, server-side API routes for data operations, and Supabase for authentication and database access. The interface will feature a persistent sidebar navigation, data grids with search/filter/sort capabilities, and detailed entity views with relationship management.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Panel Frontend                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login      │  │  Dashboard   │  │ Entity Views │      │
│  │   Page       │  │    Page      │  │   (CRUD)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Admin Context │                        │
│                    │  & Auth State  │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   API Routes     │
                    │  /api/admin/*    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Supabase Client │
                    │  (Auth + DB)     │
                    └──────────────────┘
```

### Component Structure

- **Pages**: Next.js app router pages for routing
  - `/app/admin/login/page.tsx` - Admin authentication
  - `/app/admin/dashboard/page.tsx` - Overview dashboard
  - `/app/admin/[entity]/page.tsx` - Entity list views
  - `/app/admin/[entity]/[id]/page.tsx` - Entity detail views

- **Components**: Reusable UI components
  - `AdminLayout` - Main layout with sidebar navigation
  - `DataGrid` - Reusable table with pagination, search, sort
  - `EntityForm` - Dynamic form for create/edit operations
  - `StatsCard` - Dashboard metric cards
  - `ConfirmDialog` - Delete confirmation modal

- **API Routes**: Server-side endpoints
  - `/api/admin/auth/*` - Authentication endpoints
  - `/api/admin/[entity]/*` - CRUD operations per entity
  - `/api/admin/stats` - Dashboard statistics

- **Services**: Business logic layer
  - `AdminAuthService` - Authentication and authorization
  - `EntityService` - Generic CRUD operations
  - `ValidationService` - Input validation

## Components and Interfaces

### Authentication System

```typescript
// Admin user type
interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  created_at: string;
}

// Auth context
interface AdminAuthContext {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}
```

### Data Grid Component

```typescript
interface DataGridProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onSearch: (query: string) => void;
  onRowClick?: (row: T) => void;
  actions?: {
    label: string;
    onClick: (row: T) => void;
    icon?: React.ReactNode;
  }[];
}

interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}
```

### Entity Service Interface

```typescript
interface EntityService<T> {
  list(params: ListParams): Promise<ListResponse<T>>;
  get(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Data Models

### Core Entity Types

```typescript
// Customer
interface Customer {
  id: string;
  email: string;
  name: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
}

// Device
interface Device {
  id: string;
  customer_id: string;
  device_type: 'solar_panel' | 'wind_turbine' | 'battery' | 'heat_pump' | 'ev_charger' | 'smart_meter';
  device_name: string;
  capacity_kw: number;
  installation_date: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

// Energy Reading
interface EnergyReading {
  id: string;
  customer_id: string;
  device_id: string | null;
  timestamp: string;
  production_kwh: number;
  consumption_kwh: number;
  grid_import_kwh: number;
  grid_export_kwh: number;
  battery_charge_kwh: number;
  battery_discharge_kwh: number;
  created_at: string;
}

// Community
interface Community {
  id: string;
  name: string;
  description: string | null;
  district: string;
  postcode_zone: string;
  member_count: number;
  created_at: string;
}

// Trading Offer
interface TradingOffer {
  id: string;
  community_id: string;
  member_id: string;
  offer_type: 'buy' | 'sell';
  status: 'active' | 'matched' | 'expired' | 'cancelled';
  quantity_kwh: number;
  remaining_kwh: number;
  price_eur_per_kwh: number;
  delivery_start: string;
  delivery_end: string;
  created_at: string;
  expires_at: string;
}

// Trade
interface Trade {
  id: string;
  community_id: string;
  buyer_id: string;
  seller_id: string;
  status: 'confirmed' | 'delivered' | 'settled' | 'disputed';
  quantity_kwh: number;
  price_eur_per_kwh: number;
  total_value_eur: number;
  delivery_start: string;
  delivery_end: string;
  created_at: string;
  settled_at: string | null;
}
```

### Dashboard Statistics

```typescript
interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  customers: {
    total: number;
    with_devices: number;
  };
  devices: {
    total: number;
    by_type: Record<string, number>;
    active: number;
  };
  communities: {
    total: number;
    total_members: number;
  };
  trading: {
    active_offers: number;
    completed_trades_today: number;
    total_volume_kwh: number;
  };
  recent_activity: Activity[];
}

interface Activity {
  id: string;
  type: 'user_registered' | 'device_added' | 'trade_completed' | 'ticket_created';
  description: string;
  timestamp: string;
  entity_id: string;
}
```

## Correctne
ss Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After reviewing the prework analysis, many acceptance criteria are UI-specific examples that verify specific pages render correctly. These are important for integration testing but don't translate to universal properties. The following properties focus on the core business logic that should hold across all inputs:

**Property 1: Valid credentials authenticate successfully**
*For any* valid administrator credentials, submitting them through the login system should result in successful authentication and a valid session token.
**Validates: Requirements 1.2**

**Property 2: Invalid credentials are rejected**
*For any* invalid credentials (wrong password, non-existent email, malformed input), the authentication system should reject the login attempt and return an appropriate error.
**Validates: Requirements 1.3**

**Property 3: Non-admin users cannot access admin routes**
*For any* non-administrator user and any admin route, attempting to access the route should result in denial and redirect to login.
**Validates: Requirements 1.4**

**Property 4: User search returns matching results**
*For any* search query and user database, all returned results should match the search criteria (name, email, or ID contains the query string).
**Validates: Requirements 3.2**

**Property 5: User creation persists to database**
*For any* valid user data, creating a user should result in a database record that can be retrieved with the same data.
**Validates: Requirements 3.4**

**Property 6: User updates preserve data integrity**
*For any* existing user and valid update data, updating the user should persist the changes while maintaining referential integrity with related entities.
**Validates: Requirements 3.5**

**Property 7: User deletion removes record**
*For any* existing user, deleting the user should result in the user no longer being retrievable from the database.
**Validates: Requirements 3.6**

**Property 8: Customer updates maintain referential integrity**
*For any* customer with related entities (sites, devices, contracts), updating customer information should preserve all relationships and foreign key constraints.
**Validates: Requirements 4.3**

**Property 9: Customer-user linking creates association**
*For any* valid customer and auth user pair, linking them should create a record in the accounts table that associates the two entities.
**Validates: Requirements 4.4**

**Property 10: Device creation validates and associates correctly**
*For any* valid device data with a device type, creating the device should validate the type and create an association with the specified site.
**Validates: Requirements 5.3**

**Property 11: Device updates persist correctly**
*For any* existing device and valid update data, updating the device should persist changes to the correct device-specific table based on device type.
**Validates: Requirements 5.4**

**Property 12: Device deletion handles cascading effects**
*For any* device with associated readings, deleting the device should either cascade delete the readings or set the device_id to null, maintaining database consistency.
**Validates: Requirements 5.5**

**Property 13: Energy sharing group creation validates parameters**
*For any* energy sharing group data, creating the group should validate required parameters (name, region, postcode) and reject invalid data.
**Validates: Requirements 6.3**

**Property 14: Group membership operations maintain integrity**
*For any* group and member operations (add/remove), the group's member_count should accurately reflect the number of members in the sharing_members table.
**Validates: Requirements 6.4**

**Property 15: Reading filters return matching results**
*For any* filter criteria (date range, device, reading type) and readings database, all returned results should match all specified filter conditions.
**Validates: Requirements 7.2**

**Property 16: Offer moderation updates status**
*For any* trading offer and moderation action (approve/reject/remove), performing the action should update the offer's status appropriately.
**Validates: Requirements 9.3**

**Property 17: Ticket messages maintain chronological order**
*For any* support ticket with multiple messages, retrieving the ticket should return messages sorted by timestamp in ascending order.
**Validates: Requirements 10.2**

**Property 18: Ticket status updates persist**
*For any* ticket and valid status value, updating the ticket status should persist the change to the database.
**Validates: Requirements 10.3**

**Property 19: Ticket filters return matching results**
*For any* filter criteria (status, priority, customer) and tickets database, all returned results should match all specified filter conditions.
**Validates: Requirements 10.4**

**Property 20: Pagination returns correct page**
*For any* entity list with pagination parameters (page number, page size), the returned results should contain exactly pageSize items (or fewer on the last page) starting at the correct offset.
**Validates: Requirements 11.1**

## Error Handling

### Authentication Errors

- **Invalid Credentials**: Return 401 with clear error message
- **Session Expired**: Return 401 and redirect to login
- **Insufficient Permissions**: Return 403 with explanation
- **Rate Limiting**: Return 429 after too many failed login attempts

### Validation Errors

- **Missing Required Fields**: Return 400 with list of missing fields
- **Invalid Data Format**: Return 400 with specific format requirements
- **Duplicate Records**: Return 409 with conflict details
- **Foreign Key Violations**: Return 400 with relationship explanation

### Database Errors

- **Connection Failures**: Return 503 with retry guidance
- **Query Timeouts**: Return 504 with timeout information
- **Constraint Violations**: Return 400 with constraint details
- **Transaction Failures**: Rollback and return 500 with error details

### Error Response Format

All API errors should follow a consistent format:

```typescript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable error message',
    details: {
      field: 'specific_field',
      constraint: 'constraint_name'
    }
  }
}
```

### Error Logging

- Log all errors with context (user, action, timestamp)
- Include stack traces for 500-level errors
- Sanitize sensitive data before logging
- Implement error monitoring and alerting

## Testing Strategy

### Unit Testing

The admin panel will use **Vitest** as the testing framework for unit tests. Unit tests will cover:

- **Component Rendering**: Verify that key components render without errors
  - Login form displays email and password fields
  - Dashboard displays stat cards and navigation
  - Data grids render with correct columns
  - Entity forms render with appropriate fields

- **Form Validation**: Test client-side validation logic
  - Required field validation
  - Email format validation
  - Number range validation
  - Date validation

- **Utility Functions**: Test helper functions
  - Date formatting
  - Number formatting (currency, energy units)
  - Search query parsing
  - Filter building

- **API Route Handlers**: Test server-side logic
  - Request parsing
  - Response formatting
  - Error handling paths

### Property-Based Testing

The admin panel will use **fast-check** for property-based testing in TypeScript. Property-based tests will verify universal properties across many randomly generated inputs.

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Tagging**: Each property-based test MUST be tagged with a comment explicitly referencing the correctness property from this design document using the format: `**Feature: admin-panel, Property {number}: {property_text}**`

**Property Test Coverage**:

- **Property 1-3 (Authentication)**: Generate random valid/invalid credentials and verify authentication behavior
  - Valid credentials: random emails, passwords that meet requirements
  - Invalid credentials: wrong passwords, non-existent emails, malformed inputs
  - Non-admin users: generate users without admin role

- **Property 4 (User Search)**: Generate random users and search queries, verify all results match
  - Users with varied names, emails, IDs
  - Search queries: partial matches, case variations, special characters

- **Property 5-7 (User CRUD)**: Generate random user data and verify create/update/delete operations
  - User data: valid names, emails, roles
  - Updates: partial updates, full updates
  - Verify database state after each operation

- **Property 8-9 (Customer Operations)**: Generate customers with relationships and verify integrity
  - Customers with sites, devices, contracts
  - Updates that should preserve relationships
  - Linking operations between customers and auth users

- **Property 10-12 (Device Operations)**: Generate devices of various types and verify operations
  - All device types: solar_panel, battery, ev_charger, etc.
  - Device updates with different configurations
  - Deletion with and without associated readings

- **Property 13-14 (Group Management)**: Generate groups and members, verify integrity
  - Groups with various parameters
  - Member add/remove operations
  - Verify member_count accuracy

- **Property 15 (Reading Filters)**: Generate readings and filter combinations
  - Readings with various timestamps, devices, types
  - Date range filters, device filters, type filters
  - Verify all results match all filters

- **Property 16 (Offer Moderation)**: Generate offers and moderation actions
  - Offers with different statuses
  - Moderation actions: approve, reject, remove
  - Verify status transitions

- **Property 17-19 (Ticket Operations)**: Generate tickets with messages and verify operations
  - Tickets with multiple messages at different times
  - Status updates
  - Filter combinations

- **Property 20 (Pagination)**: Generate large datasets and verify pagination
  - Various page sizes: 10, 25, 50, 100
  - Different page numbers
  - Verify correct items returned and total count

### Integration Testing

Integration tests will verify end-to-end workflows:

- Complete authentication flow from login to dashboard
- CRUD operations that span multiple API calls
- Relationship management (linking customers to users, devices to sites)
- Search and filter operations with real database queries

### Test Data Generation

Use factories and generators to create realistic test data:

- Customer factory with valid Luxembourg addresses
- Device factory with appropriate capacity ranges per type
- Energy reading factory with realistic production/consumption patterns
- Trading offer factory with valid price ranges and quantities

## Security Considerations

### Authentication

- Use Supabase Auth for secure authentication
- Implement JWT token-based sessions
- Store tokens securely (httpOnly cookies)
- Implement token refresh mechanism
- Add rate limiting to login endpoint (max 5 attempts per 15 minutes)

### Authorization

- Verify admin role on every protected route
- Implement middleware for route protection
- Check permissions at both frontend and API level
- Use Supabase RLS policies for database-level security

### Data Protection

- Sanitize all user inputs to prevent XSS
- Use parameterized queries to prevent SQL injection
- Validate and sanitize file uploads (for ticket attachments)
- Implement CSRF protection for state-changing operations
- Encrypt sensitive data at rest

### Audit Logging

- Log all administrative actions with:
  - Admin user ID and email
  - Action type (create, update, delete)
  - Entity type and ID
  - Timestamp
  - IP address
  - Changes made (before/after values)

## Performance Optimization

### Database Queries

- Use indexes on frequently queried fields (already defined in schema)
- Implement query result caching for dashboard stats
- Use database views for complex joins
- Limit query results with pagination
- Use connection pooling

### Frontend Performance

- Implement virtual scrolling for large data grids
- Lazy load entity detail views
- Use React.memo for expensive components
- Debounce search inputs (300ms)
- Cache API responses with SWR or React Query

### API Optimization

- Implement response compression (gzip)
- Use HTTP caching headers appropriately
- Batch related queries when possible
- Implement request deduplication
- Set appropriate timeout values

## Deployment Considerations

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `ADMIN_SESSION_SECRET`: Secret for session encryption
- `RATE_LIMIT_REDIS_URL`: Redis URL for rate limiting (optional)

### Database Setup

- Run schema migrations
- Create admin user accounts
- Set up RLS policies for admin access
- Configure backup schedule
- Set up monitoring and alerts

### Monitoring

- Track API response times
- Monitor error rates by endpoint
- Track authentication failures
- Monitor database query performance
- Set up alerts for critical errors

## Future Enhancements

- **Bulk Operations**: Support bulk create/update/delete for entities
- **Advanced Filtering**: Add saved filter presets and complex filter combinations
- **Data Export**: Export entity data to CSV/Excel
- **Audit Trail Viewer**: Dedicated interface for viewing audit logs
- **Role-Based Access**: Support multiple admin roles with different permissions
- **Dashboard Customization**: Allow admins to customize dashboard widgets
- **Real-time Updates**: Use WebSockets for live data updates
- **Mobile App**: Native mobile app for admin panel
