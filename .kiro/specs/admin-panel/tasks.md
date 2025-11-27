# Implementation Plan

- [ ] 1. Set up admin authentication infrastructure
- [x] 1.1 Create admin user table and RLS policies in Supabase
  - Add admin_users table with id, email, role, name, created_at
  - Create RLS policies for admin access
  - Add indexes for email lookups
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.2 Implement admin authentication service
  - Create AdminAuthService with login, logout, checkAuth methods
  - Implement JWT token handling
  - Add session management with httpOnly cookies
  - _Requirements: 1.2, 1.3, 1.5_

- [x] 1.3 Write property test for authentication
  - **Property 1: Valid credentials authenticate successfully**
  - **Validates: Requirements 1.2**

- [ ] 1.4 Write property test for invalid credentials
  - **Property 2: Invalid credentials are rejected**
  - **Validates: Requirements 1.3**

- [ ] 1.5 Write property test for authorization
  - **Property 3: Non-admin users cannot access admin routes**
  - **Validates: Requirements 1.4**

- [x] 2. Create admin panel layout and navigation
- [x] 2.1 Build AdminLayout component with sidebar
  - Create persistent sidebar navigation
  - Implement responsive mobile menu
  - Add active route highlighting
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 2.2 Create admin login page at /admin/login
  - Build login form with email and password fields
  - Implement form validation
  - Add error message display
  - Handle authentication flow and redirect
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2.3 Create admin dashboard page at /admin/dashboard
  - Build dashboard layout with stat cards
  - Display counts for users, customers, devices, communities
  - Show recent activity feed
  - Add navigation links to entity sections
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 3. Build reusable data grid component
- [x] 3.1 Create DataGrid component with core features
  - Implement table rendering with column definitions
  - Add pagination controls
  - Implement sorting by column
  - Add search input with debouncing
  - Include row click handling
  - _Requirements: 3.1, 11.1_

- [x] 3.2 Write property test for pagination
  - **Property 20: Pagination returns correct page**
  - **Validates: Requirements 11.1**

- [x] 3.3 Create EntityForm component for CRUD operations
  - Build dynamic form generator from field definitions
  - Implement validation display
  - Add loading states
  - Handle submit and cancel actions
  - _Requirements: 3.4, 3.5_

- [x] 4. Implement user management
- [x] 4.1 Create users list page at /admin/users
  - Display searchable, sortable user table
  - Implement search by name, email, ID
  - Add create new user button
  - Handle row click to view details
  - _Requirements: 3.1, 3.2_

- [x] 4.2 Write property test for user search
  - **Property 4: User search returns matching results**
  - **Validates: Requirements 3.2**

- [x] 4.3 Create user detail/edit page at /admin/users/[id]
  - Display detailed user information
  - Show linked accounts and devices
  - Implement edit form
  - Add delete confirmation dialog
  - _Requirements: 3.3, 3.5, 3.6_

- [x] 4.4 Build API routes for user operations
  - Create GET /api/admin/users (list with pagination, search, sort)
  - Create GET /api/admin/users/[id] (get single user)
  - Create POST /api/admin/users (create user)
  - Create PATCH /api/admin/users/[id] (update user)
  - Create DELETE /api/admin/users/[id] (delete user)
  - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6_

- [x] 4.5 Write property tests for user CRUD operations
  - **Property 5: User creation persists to database**
  - **Property 6: User updates preserve data integrity**
  - **Property 7: User deletion removes record**
  - **Validates: Requirements 3.4, 3.5, 3.6**

- [ ] 5. Implement customer management
- [ ] 5.1 Create customers list page at /admin/customers
  - Display customer table with associated sites
  - Implement search and filtering
  - Add create new customer button
  - _Requirements: 4.1_

- [ ] 5.2 Create customer detail/edit page at /admin/customers/[id]
  - Display customer information
  - Show linked contracts, invoices, payment methods
  - Implement edit form
  - Add link to auth user functionality
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 5.3 Build API routes for customer operations
  - Create GET /api/admin/customers (list with pagination)
  - Create GET /api/admin/customers/[id] (get with relationships)
  - Create POST /api/admin/customers (create customer)
  - Create PATCH /api/admin/customers/[id] (update customer)
  - Create DELETE /api/admin/customers/[id] (delete customer)
  - Create POST /api/admin/customers/[id]/link-user (link to auth user)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5.4 Write property tests for customer operations
  - **Property 8: Customer updates maintain referential integrity**
  - **Property 9: Customer-user linking creates association**
  - **Validates: Requirements 4.3, 4.4**

- [ ] 6. Implement device and site management
- [ ] 6.1 Create sites list page at /admin/sites
  - Display sites table with customer associations
  - Show device counts per site
  - Implement search and filtering
  - _Requirements: 5.1_

- [ ] 6.2 Create site detail page at /admin/sites/[id]
  - Display site information
  - Show all connected devices by type
  - Add create device button
  - _Requirements: 5.2_

- [ ] 6.3 Create devices list page at /admin/devices
  - Display all devices with type, status, capacity
  - Implement filtering by device type and status
  - Add create device button
  - _Requirements: 5.3_

- [ ] 6.4 Create device detail/edit page at /admin/devices/[id]
  - Display device configuration
  - Show associated readings summary
  - Implement edit form with type-specific fields
  - Add delete with cascade handling
  - _Requirements: 5.4, 5.5_

- [ ] 6.5 Build API routes for site and device operations
  - Create GET /api/admin/sites (list sites)
  - Create GET /api/admin/sites/[id] (get site with devices)
  - Create GET /api/admin/devices (list devices with filters)
  - Create POST /api/admin/devices (create device)
  - Create PATCH /api/admin/devices/[id] (update device)
  - Create DELETE /api/admin/devices/[id] (delete with cascade)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6.6 Write property tests for device operations
  - **Property 10: Device creation validates and associates correctly**
  - **Property 11: Device updates persist correctly**
  - **Property 12: Device deletion handles cascading effects**
  - **Validates: Requirements 5.3, 5.4, 5.5**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement community and energy sharing management
- [ ] 8.1 Create communities list page at /admin/communities
  - Display communities with member counts
  - Show district and postcode zone
  - Implement search functionality
  - _Requirements: 6.1_

- [ ] 8.2 Create community detail page at /admin/communities/[id]
  - Display community information
  - Show all members with roles
  - Add member management controls
  - _Requirements: 6.2_

- [ ] 8.3 Create energy sharing groups list page at /admin/energy-sharing
  - Display groups with member counts and capacity
  - Show region and postcode
  - Add create group button
  - _Requirements: 6.3_

- [ ] 8.4 Create energy sharing group detail page at /admin/energy-sharing/[id]
  - Display group information
  - Show members with prosumer status
  - Implement add/remove member functionality
  - _Requirements: 6.4_

- [ ] 8.5 Build API routes for community and group operations
  - Create GET /api/admin/communities (list communities)
  - Create GET /api/admin/communities/[id] (get with members)
  - Create GET /api/admin/energy-sharing (list groups)
  - Create POST /api/admin/energy-sharing (create group)
  - Create PATCH /api/admin/energy-sharing/[id] (update group)
  - Create POST /api/admin/energy-sharing/[id]/members (add member)
  - Create DELETE /api/admin/energy-sharing/[id]/members/[memberId] (remove member)
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 8.6 Write property tests for group operations
  - **Property 13: Energy sharing group creation validates parameters**
  - **Property 14: Group membership operations maintain integrity**
  - **Validates: Requirements 6.3, 6.4**

- [ ] 9. Implement energy readings management
- [ ] 9.1 Create readings list page at /admin/readings
  - Display recent energy readings table
  - Implement date range filter
  - Add device filter
  - Add reading type filter (production, consumption, etc.)
  - Show timestamps, values, device info
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 9.2 Create reading detail/edit page at /admin/readings/[id]
  - Display full reading details
  - Allow correction of erroneous values
  - Add delete functionality
  - _Requirements: 7.4_

- [ ] 9.3 Build API routes for readings operations
  - Create GET /api/admin/readings (list with filters)
  - Create GET /api/admin/readings/[id] (get single reading)
  - Create PATCH /api/admin/readings/[id] (update reading)
  - Create DELETE /api/admin/readings/[id] (delete reading)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9.4 Write property test for reading filters
  - **Property 15: Reading filters return matching results**
  - **Validates: Requirements 7.2**

- [ ] 10. Implement financial data management
- [ ] 10.1 Create invoices list page at /admin/invoices
  - Display invoices with status and amounts
  - Show customer information
  - Implement filtering by status and date
  - _Requirements: 8.1_

- [ ] 10.2 Create invoice detail page at /admin/invoices/[id]
  - Display invoice header information
  - Show line items table
  - Display payment history
  - _Requirements: 8.2_

- [ ] 10.3 Create payments list page at /admin/payments
  - Display payment transactions
  - Show payment methods and statuses
  - Implement filtering
  - _Requirements: 8.3_

- [ ] 10.4 Create contracts list page at /admin/contracts
  - Display customer energy contracts
  - Show contract terms and status
  - Implement view and edit functionality
  - _Requirements: 8.4_

- [ ] 10.5 Build API routes for financial operations
  - Create GET /api/admin/invoices (list invoices)
  - Create GET /api/admin/invoices/[id] (get with line items and payments)
  - Create GET /api/admin/payments (list payments)
  - Create GET /api/admin/contracts (list contracts)
  - Create PATCH /api/admin/contracts/[id] (update contract)
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 11. Implement trading marketplace management
- [ ] 11.1 Create trading offers list page at /admin/trading/offers
  - Display buy and sell offers
  - Show status, quantity, price
  - Implement filtering by type and status
  - Add moderation controls
  - _Requirements: 9.1, 9.3_

- [ ] 11.2 Create trades list page at /admin/trading/trades
  - Display completed transactions
  - Show buyer, seller, energy amounts
  - Display transaction history
  - Show pricing trends chart
  - _Requirements: 9.2, 9.4_

- [ ] 11.3 Build API routes for trading operations
  - Create GET /api/admin/trading/offers (list offers with filters)
  - Create PATCH /api/admin/trading/offers/[id] (moderate offer)
  - Create DELETE /api/admin/trading/offers/[id] (remove offer)
  - Create GET /api/admin/trading/trades (list trades)
  - Create GET /api/admin/trading/stats (get pricing trends)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 11.4 Write property test for offer moderation
  - **Property 16: Offer moderation updates status**
  - **Validates: Requirements 9.3**

- [ ] 12. Implement support ticket management
- [ ] 12.1 Create tickets list page at /admin/tickets
  - Display tickets with status and priority
  - Show customer information
  - Implement filtering by status, priority, customer
  - _Requirements: 10.1, 10.4_

- [ ] 12.2 Create ticket detail page at /admin/tickets/[id]
  - Display ticket information
  - Show messages in chronological order
  - Display attachments
  - Add status update controls
  - Add reply functionality
  - _Requirements: 10.2, 10.3_

- [ ] 12.3 Build API routes for ticket operations
  - Create GET /api/admin/tickets (list with filters)
  - Create GET /api/admin/tickets/[id] (get with messages and attachments)
  - Create PATCH /api/admin/tickets/[id] (update status)
  - Create POST /api/admin/tickets/[id]/messages (add message)
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 12.4 Write property tests for ticket operations
  - **Property 17: Ticket messages maintain chronological order**
  - **Property 18: Ticket status updates persist**
  - **Property 19: Ticket filters return matching results**
  - **Validates: Requirements 10.2, 10.3, 10.4**

- [ ] 13. Implement dashboard statistics API
- [ ] 13.1 Create dashboard stats API route
  - Calculate total counts for users, customers, devices, communities
  - Aggregate device counts by type
  - Get active offers and completed trades
  - Fetch recent activity events
  - Implement caching for performance
  - _Requirements: 2.1, 2.2_

- [ ] 14. Add security and error handling
- [ ] 14.1 Implement authentication middleware
  - Create middleware to verify admin JWT tokens
  - Add role checking for admin access
  - Implement session refresh logic
  - Add rate limiting for login endpoint
  - _Requirements: 1.4, 1.5_

- [ ] 14.2 Add comprehensive error handling
  - Implement consistent error response format
  - Add validation error handling
  - Handle database errors appropriately
  - Add error logging with context
  - Sanitize error messages for security
  - _Requirements: All_

- [ ] 14.3 Implement audit logging
  - Create audit_logs table
  - Log all admin actions (create, update, delete)
  - Include user, action, entity, timestamp, changes
  - Add API route to view audit logs
  - _Requirements: All_

- [ ] 15. Add performance optimizations
- [ ] 15.1 Implement response caching
  - Add caching for dashboard stats
  - Cache frequently accessed entity lists
  - Implement cache invalidation on updates
  - _Requirements: 11.2_

- [ ] 15.2 Optimize database queries
  - Add database indexes for common queries
  - Implement query result pagination
  - Use select specific fields instead of *
  - Batch related queries where possible
  - _Requirements: 11.1, 11.2_

- [ ] 15.3 Add frontend performance features
  - Implement debounced search inputs
  - Add loading indicators for all async operations
  - Use React.memo for expensive components
  - Implement virtual scrolling for large lists
  - _Requirements: 11.3_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
