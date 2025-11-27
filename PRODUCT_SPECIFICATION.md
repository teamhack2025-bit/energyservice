# Customer Portal - Product Specification

## Executive Summary

This document defines the complete product specification for a Customer Portal serving residential and small business energy customers, prosumers, and hybrid users. The portal enables customers to monitor consumption, manage production assets, understand billing, and optimize their energy usage.

## 1. User Types & Roles

### 1.1 Customer (Consumer Only)
**Capabilities:**
- View consumption data and analytics
- Access billing and payment management
- Manage contracts and tariffs
- Configure alerts and notifications
- Access support tools
- View single or multiple sites

**Dashboard Focus:**
- Consumption metrics
- Cost tracking
- Billing status
- Usage comparisons

### 1.2 Prosumer (Consumer + Producer)
**Capabilities:**
- All Consumer capabilities
- View production/generation data
- Monitor solar/wind/battery systems
- Track feed-in revenue
- View net balance (import/export)
- Optimize self-consumption

**Dashboard Focus:**
- Net energy balance
- Production vs consumption
- Self-consumption ratio
- Feed-in revenue
- Device status (inverters, batteries)

### 1.3 Small Business Customer
**Capabilities:**
- All Consumer capabilities
- Multi-site management
- Business-specific tariffs
- Usage benchmarking vs similar businesses
- Export detailed reports
- Multiple user accounts (team access)

**Dashboard Focus:**
- Multi-site overview
- Cost per site
- Business efficiency metrics
- Tax reporting data

### 1.4 Admin / Support Agent (Internal)
**Capabilities:**
- Customer search and management
- Contract and tariff administration
- Manual meter reading adjustments
- Ticket management and assignment
- System monitoring (devices, billing anomalies)
- Role and permission management
- Bulk operations

**Dashboard Focus:**
- System health metrics
- Active tickets queue
- Payment failures
- Device offline alerts
- Customer activity overview

## 2. Sitemap & Navigation Structure

### 2.1 Main Navigation (Sidebar)

```
┌─────────────────────────────────┐
│ 🏠 Overview Dashboard           │
│ 📊 Consumption                  │
│ ☀️ Production                   │
│ 💰 Net Balance & Financials     │
│ 📄 Billing & Payments           │
│ 📋 Contracts & Tariffs          │
│ 🔌 Devices & Assets             │
│ 📈 Forecast & Insights          │
│ 🔔 Notifications                │
│ 🆘 Support & Help               │
│ ⚙️ Settings                     │
└─────────────────────────────────┘
```

### 2.2 Complete Site Structure

```
/ (root)
├── /dashboard (Overview Dashboard)
│   └── /dashboard/[siteId]? (site-specific view)
│
├── /consumption
│   ├── /consumption (main view)
│   ├── /consumption/[meterId] (meter-specific)
│   └── /consumption/export (export data)
│
├── /production
│   ├── /production (overview)
│   ├── /production/solar (solar details)
│   ├── /production/wind (wind details)
│   ├── /production/battery (battery details)
│   └── /production/export (export data)
│
├── /net-balance
│   ├── /net-balance (main view)
│   └── /net-balance/scenarios (what-if tools)
│
├── /billing
│   ├── /billing (invoice list)
│   ├── /billing/[invoiceId] (invoice detail)
│   ├── /billing/payments (payment methods)
│   └── /billing/history (payment history)
│
├── /contracts
│   ├── /contracts (active contracts)
│   ├── /contracts/[contractId] (contract detail)
│   ├── /contracts/compare (tariff comparison)
│   └── /contracts/renew (renewal flow)
│
├── /devices
│   ├── /devices (device list)
│   ├── /devices/[deviceId] (device detail)
│   ├── /devices/meters (meters overview)
│   ├── /devices/solar (solar systems)
│   ├── /devices/battery (batteries)
│   └── /devices/ev-chargers (EV chargers)
│
├── /forecast
│   ├── /forecast (forecast overview)
│   ├── /forecast/insights (recommendations)
│   └── /forecast/goals (goal tracking)
│
├── /notifications
│   ├── /notifications (notification center)
│   └── /notifications/settings (alert preferences)
│
├── /support
│   ├── /support (help center)
│   ├── /support/faq (FAQ)
│   ├── /support/tickets (my tickets)
│   ├── /support/tickets/new (create ticket)
│   └── /support/tickets/[ticketId] (ticket detail)
│
├── /settings
│   ├── /settings (settings overview)
│   ├── /settings/profile (user profile)
│   ├── /settings/addresses (sites & addresses)
│   ├── /settings/security (password, 2FA)
│   ├── /settings/preferences (language, timezone)
│   └── /settings/privacy (data & privacy)
│
└── /admin (Admin only)
    ├── /admin (admin dashboard)
    ├── /admin/customers (customer search)
    ├── /admin/contracts (contract management)
    ├── /admin/meters (meter readings)
    ├── /admin/tickets (ticket management)
    ├── /admin/monitoring (system monitoring)
    └── /admin/users (user management)
```

### 2.3 Navigation Patterns

**Primary Navigation:**
- Persistent sidebar (collapsible on mobile)
- Breadcrumbs for deep navigation
- Site selector dropdown (if multiple sites)
- User menu (top right): Profile, Settings, Logout

**Secondary Navigation:**
- Tab navigation within modules (e.g., Consumption: Overview, By Meter, By Appliance)
- Filter bar (date range, site, meter)
- Quick actions (floating action button on mobile)

## 3. Module Overview

### 3.1 Overview Dashboard
**Purpose:** Single-page snapshot of energy status, costs, and quick actions

**Key Metrics:**
- Net energy today/this month
- Current cost/revenue
- Live status indicators
- Comparison vs previous periods

**Components:**
- Metric cards (4-6 tiles)
- Live status widget
- Mini charts (sparklines)
- Quick action buttons
- Recent activity feed

### 3.2 Consumption Module
**Purpose:** Deep analytics on energy consumption patterns

**Key Features:**
- Time-series charts (15-min to yearly)
- Multi-meter support
- Appliance-level breakdown (if available)
- Cost analysis
- Peak usage identification
- Benchmarking

**Views:**
- Overview (aggregate)
- By Meter
- By Phase (3-phase)
- By Appliance (smart plugs)
- Comparison view

### 3.3 Production Module
**Purpose:** Monitor and analyze energy generation

**Key Features:**
- Real-time generation
- Historical production
- Self-consumption vs export
- Device status monitoring
- Financial tracking (feed-in revenue)
- Performance KPIs

**Views:**
- Overview (all sources)
- Solar PV detail
- Wind detail
- Battery detail
- Financial summary

### 3.4 Net Balance & Financials
**Purpose:** Unified view of consumption, production, and net financial impact

**Key Features:**
- Net import/export visualization
- Cost breakdown
- Revenue from feed-in
- Net bill/credit calculation
- Trend analysis
- Scenario modeling

**Views:**
- Net balance chart
- Financial breakdown
- Monthly summary cards
- Scenario tools

### 3.5 Billing & Payments
**Purpose:** Complete billing center with payment management

**Key Features:**
- Invoice list and detail
- PDF download
- Payment methods management
- Auto-pay configuration
- Payment history
- Estimated next bill

**Views:**
- Invoice list (table)
- Invoice detail (line items)
- Payment methods
- Payment history timeline
- Auto-pay settings

### 3.6 Contracts & Tariffs
**Purpose:** Manage energy contracts and tariff selection

**Key Features:**
- Active contract display
- Tariff details and comparison
- Contract renewal
- Tariff switching (with warnings)
- Estimated cost calculator

**Views:**
- Active contracts list
- Contract detail
- Tariff comparison table
- Renewal flow
- Change request form

### 3.7 Devices & Assets
**Purpose:** Manage all connected energy assets

**Key Features:**
- Device inventory
- Status monitoring
- Configuration management
- Maintenance information
- Device grouping

**Views:**
- Device list (grid)
- Device detail (single device)
- Meters overview
- Solar systems
- Batteries
- EV chargers

### 3.8 Forecast & Insights
**Purpose:** Predictive analytics and optimization recommendations

**Key Features:**
- Consumption forecast
- Production forecast (weather-based)
- Optimization tips
- Efficiency scoring
- Goal tracking

**Views:**
- Forecast dashboard
- Insights list
- Goal progress
- Efficiency scorecard

### 3.9 Notifications & Alerts
**Purpose:** Centralized notification management

**Key Features:**
- Notification center (inbox)
- Alert preferences
- Threshold configuration
- Multi-channel support (email, SMS, in-app)

**Views:**
- Notification list
- Notification detail
- Alert settings
- Threshold configuration

### 3.10 Support & Help
**Purpose:** Self-service support and ticketing

**Key Features:**
- FAQ search
- Ticket creation and tracking
- File attachments
- Live chat (optional)
- Outage map

**Views:**
- Help center (search)
- FAQ categories
- Ticket list
- Ticket detail
- Create ticket form

### 3.11 Settings & Profile
**Purpose:** User account and preference management

**Key Features:**
- Profile editing
- Address/site management
- Security settings (password, 2FA)
- Privacy controls
- Data export

**Views:**
- Settings overview
- Profile form
- Addresses list
- Security settings
- Privacy settings

### 3.12 Admin Console
**Purpose:** Internal tools for support staff

**Key Features:**
- Customer search
- Contract management
- Manual meter readings
- Ticket assignment
- System monitoring
- User management

**Views:**
- Admin dashboard
- Customer search results
- Customer detail
- Contract editor
- Meter reading form
- Ticket queue
- Monitoring dashboard

## 4. User Journeys

### 4.1 New Customer Onboarding
1. Registration → Email verification
2. Add first site/address
3. Link meter(s) (manual entry or automatic)
4. Select initial tariff
5. Configure payment method
6. Set up alerts
7. Dashboard tour (optional)

### 4.2 Daily Usage Check
1. Login → Dashboard
2. View today's consumption
3. Check net balance
4. Review alerts
5. Quick action if needed (e.g., adjust usage)

### 4.3 Monthly Bill Review
1. Navigate to Billing
2. View latest invoice
3. Download PDF
4. Review line items
5. Check payment status
6. Set up auto-pay if needed

### 4.4 Tariff Comparison & Switch
1. Navigate to Contracts
2. View current tariff
3. Click "Compare Tariffs"
4. Review comparison table
5. See estimated savings
6. Initiate switch (with confirmation)
7. Receive confirmation email

### 4.5 Production Issue Report
1. Notice production drop on Dashboard
2. Navigate to Production → Solar
3. Check device status (offline warning)
4. Navigate to Support → Create Ticket
5. Select "Device Issue" category
6. Attach screenshot
7. Submit ticket
8. Receive ticket confirmation

### 4.6 Admin: Customer Support
1. Login as Admin
2. Search customer by email/meter ID
3. View customer overview
4. Check active contracts
5. Review recent invoices
6. Check device status
7. Create/assign ticket if needed
8. Add notes to customer account

## 5. Design Principles

### 5.1 Visual Design
- **Color Scheme:**
  - Primary: Energy blue (#0066CC)
  - Success: Green (#00AA44)
  - Warning: Orange (#FF8800)
  - Danger: Red (#CC0000)
  - Consumption: Red/Orange tones
  - Production: Green/Yellow tones
  - Net: Blue tones

- **Typography:**
  - Headings: Inter, system-ui
  - Body: Inter, system-ui
  - Monospace: For numbers/metrics

- **Icons:**
  - Consistent icon set (Heroicons or similar)
  - Clear visual distinction between consumption/production/net

### 5.2 UX Principles
- **Progressive Disclosure:** Show summary first, details on demand
- **Contextual Actions:** Actions available where relevant
- **Feedback:** Clear loading states, success/error messages
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsive:** Mobile-first approach
- **Performance:** Fast initial load, lazy loading for charts

### 5.3 Data Visualization
- **Line Charts:** Time-series data (consumption, production over time)
- **Bar Charts:** Comparisons (month-to-month, site-to-site)
- **Donut/Pie Charts:** Breakdowns (consumption by appliance, cost breakdown)
- **Gauges:** Live metrics (current power, battery level)
- **Heatmaps:** Usage patterns (hourly by day of week)
- **Sparklines:** Mini trends in cards

## 6. Responsive Breakpoints

- **Mobile:** < 640px (single column, stacked cards)
- **Tablet:** 640px - 1024px (2 columns, adapted navigation)
- **Desktop:** > 1024px (full layout, sidebar navigation)
- **Large Desktop:** > 1440px (optimized spacing)

## 7. Key Performance Indicators (KPIs)

### For Customers:
- Time to find information
- Self-service resolution rate
- Payment success rate
- Alert effectiveness

### For Business:
- Portal adoption rate
- Support ticket reduction
- Payment collection efficiency
- Customer satisfaction (CSAT)

## 8. Future Enhancements (Phase 2+)

- Mobile app (React Native)
- Voice assistant integration
- AI-powered recommendations
- Community features (neighborhood comparisons)
- Energy trading marketplace
- Integration with smart home systems
- Advanced analytics (ML-based anomaly detection)

