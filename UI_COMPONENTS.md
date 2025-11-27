# UI Components & Page Descriptions

## Component Library Overview

The portal uses a component-based architecture with reusable UI elements. All components are built with React and TypeScript, styled with Tailwind CSS.

## Core UI Components

### Layout Components

#### AppShell
Main application wrapper with sidebar navigation and header.

**Props:**
```typescript
interface AppShellProps {
  children: React.ReactNode;
  currentPath?: string;
  user: User;
}
```

**Features:**
- Collapsible sidebar (mobile: drawer)
- Top header with user menu
- Breadcrumb navigation
- Site selector dropdown (if multiple sites)
- Responsive breakpoints

#### Sidebar
Persistent navigation sidebar.

**Sections:**
- Main navigation (icon + label)
- User section (bottom)
- Collapse/expand toggle

**Navigation Items:**
- Dashboard (🏠)
- Consumption (📊)
- Production (☀️)
- Net Balance (💰)
- Billing (📄)
- Contracts (📋)
- Devices (🔌)
- Forecast (📈)
- Notifications (🔔)
- Support (🆘)
- Settings (⚙️)

#### Header
Top header bar.

**Components:**
- Logo/Brand
- Site selector (if multiple sites)
- Search bar (optional)
- Notifications bell (with badge)
- User menu dropdown
  - Profile
  - Settings
  - Logout

### Data Display Components

#### MetricCard
Display a single metric with optional trend indicator.

**Props:**
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number; // percentage change
    period: string; // "vs last month"
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  onClick?: () => void;
}
```

**Variants:**
- Default: White background, colored border
- Highlighted: Colored background, white text
- Minimal: No border, subtle background

#### ChartCard
Wrapper for charts with title, filters, and actions.

**Props:**
```typescript
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode[];
  loading?: boolean;
  error?: string;
}
```

#### LineChart
Time-series line chart for consumption/production data.

**Props:**
```typescript
interface LineChartProps {
  data: Array<{
    timestamp: Date;
    value: number;
    label?: string;
  }>;
  series?: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  xAxis: {
    type: 'time' | 'category';
    format?: string;
  };
  yAxis: {
    label: string;
    unit?: string;
    format?: (value: number) => string;
  };
  tooltip?: {
    formatter: (point: any) => string;
  };
  height?: number;
  showLegend?: boolean;
  interactive?: boolean;
}
```

**Features:**
- Zoom and pan (on desktop)
- Tooltip on hover
- Legend toggle
- Export as image
- Responsive

#### BarChart
Bar chart for comparisons.

**Props:**
```typescript
interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  horizontal?: boolean;
  stacked?: boolean;
  groupBy?: string;
  height?: number;
}
```

#### DonutChart
Donut/pie chart for breakdowns.

**Props:**
```typescript
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  centerLabel?: string;
  showPercentage?: boolean;
  size?: number;
}
```

#### Gauge
Gauge for live metrics (battery level, current power).

**Props:**
```typescript
interface GaugeProps {
  value: number;
  min: number;
  max: number;
  unit?: string;
  label: string;
  color?: string;
  thresholds?: Array<{
    value: number;
    color: string;
  }>;
}
```

#### Heatmap
Heatmap for usage patterns (hourly by day of week).

**Props:**
```typescript
interface HeatmapProps {
  data: Array<{
    day: number; // 0-6
    hour: number; // 0-23
    value: number;
  }>;
  colorScale: (value: number) => string;
  tooltip?: (day: number, hour: number, value: number) => string;
}
```

#### DataTable
Sortable, filterable data table.

**Props:**
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
  }>;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
  emptyMessage?: string;
}
```

**Features:**
- Column sorting
- Row selection (optional)
- Export to CSV
- Responsive (mobile: card view)

### Form Components

#### DateRangePicker
Date range selector for filtering data.

**Props:**
```typescript
interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  presets?: Array<{
    label: string;
    start: Date;
    end: Date;
  }>;
  maxRange?: number; // days
}
```

**Presets:**
- Today
- Yesterday
- Last 7 days
- Last 30 days
- This month
- Last month
- This year
- Custom range

#### Select
Dropdown select component.

**Props:**
```typescript
interface SelectProps {
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchable?: boolean;
  multi?: boolean;
}
```

#### Input
Text input with validation.

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

#### Button
Button component with variants.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}
```

### Status Components

#### StatusBadge
Status indicator badge.

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'warning' | 'error' | 'pending' | 'completed';
  label: string;
  size?: 'sm' | 'md' | 'lg';
}
```

#### DeviceStatus
Device status indicator with icon.

**Props:**
```typescript
interface DeviceStatusProps {
  status: 'online' | 'offline' | 'warning' | 'fault';
  lastSeen?: Date;
  label?: string;
}
```

### Notification Components

#### NotificationCenter
In-app notification center (dropdown/modal).

**Props:**
```typescript
interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (url: string) => void;
}
```

#### NotificationItem
Single notification item.

**Props:**
```typescript
interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
  onNavigate: (url: string) => void;
}
```

### Loading & Feedback

#### LoadingSpinner
Loading spinner component.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

#### Skeleton
Skeleton loader for content placeholders.

**Props:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave';
}
```

#### Toast
Toast notification for success/error messages.

**Props:**
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}
```

## Page Descriptions

### 1. Overview Dashboard (`/dashboard`)

**Purpose:** High-level snapshot of energy status, costs, and quick actions.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | Site Selector | Notifications | User    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Net kWh  │  │ Cost     │  │ Revenue  │  │ Status ││
│  │ Today    │  │ This Mo. │  │ This Mo. │  │ Live   ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Net Balance Chart (Last 30 Days)                  │ │
│  │ [Line Chart]                                      │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │ Consumption      │  │ Production                │ │
│  │ Today: 15 kWh    │  │ Today: 18.5 kWh          │ │
│  │ [Mini Chart]     │  │ [Mini Chart]              │ │
│  └──────────────────┘  └────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Quick Actions                                     │ │
│  │ [Download Invoice] [Change Tariff] [Report Issue] │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Recent Activity                                   │ │
│  │ • Invoice paid (2 days ago)                      │ │
│  │ • Solar inverter back online (5 days ago)        │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- 4-6 MetricCard components
- LineChart for net balance
- Mini sparkline charts
- QuickAction buttons
- ActivityFeed component

**Data Fetching:**
- Current day consumption/production
- Current month summary
- Last 30 days net balance
- Recent notifications
- Latest invoice status

**Interactions:**
- Click metric card → Navigate to detailed view
- Click chart → Navigate to Net Balance page
- Quick actions → Modal or navigation
- Site selector → Refresh data for selected site

### 2. Consumption Module (`/consumption`)

**Purpose:** Deep analytics on energy consumption patterns.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Consumption Analytics                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Filters: [Date Range] [Meter ▼] [Granularity ▼] [Export]│
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Consumption Over Time                             │ │
│  │ [Line Chart: kWh by hour/day/month]              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │ Total: 450 kWh│  │ Avg Daily: 15│  │ Peak: 5.2 kW││
│  │ Cost: €135   │  │ Cost: €4.50  │  │ @ 18:00     ││
│  └──────────────┘  └──────────────┘  └─────────────┘│
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Consumption by Hour (Heatmap)                    │ │
│  │ [Heatmap: Hour × Day of Week]                   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │ By Meter         │  │ Comparison                 │ │
│  │ [Donut Chart]    │  │ vs Last Month: -6.2%       │ │
│  │                  │  │ [Bar Chart]                │ │
│  └──────────────────┘  └────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Detailed Data Table                              │ │
│  │ [DataTable: Timestamp | Consumption | Cost]     │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Tabs:**
- Overview (default)
- By Meter
- By Phase (if 3-phase)
- By Appliance (if smart plugs)

**Key Components:**
- DateRangePicker
- Select (meter, granularity)
- LineChart
- Heatmap
- DonutChart
- BarChart (comparison)
- DataTable
- Export button (CSV/PDF)

**Interactions:**
- Change date range → Refresh chart
- Select meter → Filter data
- Change granularity → Update chart resolution
- Hover chart → Show tooltip with details
- Click export → Download CSV/PDF

### 3. Production Module (`/production`)

**Purpose:** Monitor and analyze energy generation.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Production & Generation                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Filters: [Date Range] [Source ▼] [Export]              │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Live Status                                       │ │
│  │ Current: 4.2 kW | Today: 18.5 kWh | Status: ✓   │ │
│  │ [Gauge: Current Power]                           │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Production Over Time                              │ │
│  │ [Line Chart: Production, Self-Consumed, Exported] │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │ Total: 320 kWh│ │ Self-Cons: 56%│ │ Revenue: €14││
│  │ Exported: 140 │ │ Autonomy: 46% │ │             ││
│  └──────────────┘  └──────────────┘  └─────────────┘│
│                                                         │
│  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │ By Source        │  │ Device Status               │ │
│  │ [Donut Chart]    │  │ Solar: ✓ Online            │ │
│  │                  │  │ Inverter 1: ✓ Online       │ │
│  └──────────────────┘  └────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Financial Summary                                 │ │
│  │ Feed-in Revenue: €14.05                          │ │
│  │ Applied Tariff: €0.10/kWh                        │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Tabs:**
- Overview
- Solar PV
- Wind (if applicable)
- Battery

**Key Components:**
- Gauge (live power)
- LineChart (multi-series: production, self-consumed, exported)
- DonutChart (by source)
- DeviceStatus list
- MetricCard (KPIs)

**Interactions:**
- Click device status → Navigate to device detail
- Hover chart → Show breakdown
- Click export → Download data

### 4. Net Balance & Financials (`/net-balance`)

**Purpose:** Unified view of consumption, production, and net financial impact.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Net Balance & Financials                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Filters: [Date Range] [View: Net | Cost | Both]        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Net Import/Export Over Time                      │ │
│  │ [Line Chart: Import (red), Export (green)]      │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │ Net Import:  │  │ Cost: €93    │  │ Revenue: €14││
│  │ 169.5 kWh    │  │              │  │             ││
│  └──────────────┘  └──────────────┘  └─────────────┘│
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Cost Breakdown                                   │ │
│  │ [Donut Chart: Consumption | Grid Fees | Tax]     │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Monthly Summary                                  │ │
│  │ [Bar Chart: Net Cost per Month]                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Scenario Tools                                   │ │
│  │ [Button: What if I add solar?]                   │ │
│  │ [Button: What if I shift usage?]                 │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- LineChart (dual-axis: import/export)
- DonutChart (cost breakdown)
- BarChart (monthly summary)
- ScenarioModal (what-if calculator)

**Interactions:**
- Click scenario tool → Open modal with calculator
- Toggle view → Switch between net kWh, cost, or both
- Hover breakdown → Show detailed costs

### 5. Billing & Payments (`/billing`)

**Purpose:** Complete billing center with payment management.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Billing & Payments                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tabs: [Invoices] [Payment Methods] [History]           │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Invoices                                            │ │
│ │                                                      │ │
│ │ [DataTable]                                          │ │
│ │ ┌──────┬──────────┬────────┬────────┬──────────┐   │ │
│ │ │Period│Amount    │Status  │Due Date│Actions   │   │ │
│ │ ├──────┼──────────┼────────┼────────┼──────────┤   │ │
│ │ │Jan   │€93.95    │Paid ✓  │Feb 15  │[View PDF]│   │ │
│ │ │Dec   │€102.30   │Paid ✓  │Jan 15  │[View PDF]│   │ │
│ │ │Nov   │€88.50    │Unpaid  │Dec 15  │[Pay Now] │   │ │
│ │ └──────┴──────────┴────────┴────────┴──────────┘   │ │
│ │                                                      │ │
│ │ Estimated Next Invoice: €36.00                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Payment Methods                                     │ │
│ │ • Visa •••• 4242 (Default) [Edit] [Remove]         │ │
│ │ • SEPA Direct Debit (IBAN: DE89...) [Edit]         │ │
│ │ [+ Add Payment Method]                              │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Auto-Pay Settings                                   │ │
│ │ [Toggle] Enable automatic payments                  │ │
│ │ Max Amount: €200 [Edit]                             │ │
│ │ Notify me before payment: [Toggle]                  │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Invoice Detail Page (`/billing/[invoiceId]`):**
```
┌─────────────────────────────────────────────────────────┐
│ Invoice INV-2025-001234                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Period: Jan 1 - Jan 31, 2025                            │
│ Issue Date: Feb 1, 2025                                │
│ Due Date: Feb 15, 2025                                 │
│ Status: Paid ✓                                          │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Line Items                                          │ │
│ │ • Energy consumption: 310 kWh × €0.30 = €93.00     │ │
│ │ • Feed-in compensation: -140.5 kWh × €0.10 = -€14.05││
│ │ • Grid fees: €5.00                                  │ │
│ │ • VAT (19%): €15.00                                 │ │
│ │ ────────────────────────────────────────────────  │ │
│ │ Total: €93.95                                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Download PDF] [Pay Now] (if unpaid)                   │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- DataTable (invoices)
- InvoiceDetailCard
- PaymentMethodList
- PaymentMethodForm (add/edit)
- AutoPaySettings
- PaymentForm (pay invoice)

**Interactions:**
- Click invoice row → View detail
- Click "Pay Now" → Open payment modal
- Add payment method → Form modal
- Toggle auto-pay → Update settings

### 6. Contracts & Tariffs (`/contracts`)

**Purpose:** Manage energy contracts and tariff selection.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Contracts & Tariffs                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Active Contracts                                    │ │
│ │                                                      │ │
│ │ Home (123 Main St)                                 │ │
│ │ Contract: CON-2025-001234                          │ │
│ │ Tariff: Standard Variable                          │ │
│ │ Status: Active | Start: Jan 1, 2025 | Auto-renew: ✓││
│ │ [View Details] [Renew] [Switch Tariff]             │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Current Tariff Details                             │ │
│ │                                                      │ │
│ │ Base Price: €0.30/kWh                              │ │
│ │ Monthly Fee: €5.00                                  │ │
│ │ Feed-in Tariff: €0.10/kWh                          │ │
│ │ Grid Fees: €0.05/kWh                               │ │
│ │ VAT: 19%                                            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Compare Tariffs]                                       │
└─────────────────────────────────────────────────────────┘
```

**Tariff Comparison Page (`/contracts/compare`):**
```
┌─────────────────────────────────────────────────────────┐
│ Compare Tariffs                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Based on your usage (Jan 2025):                        │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [DataTable: Comparison]                             │ │
│ │ ┌──────────────┬──────────┬──────────┬──────────┐ │ │
│ │ │Tariff        │Monthly   │Yearly    │Savings   │ │ │
│ │ ├──────────────┼──────────┼──────────┼──────────┤ │ │
│ │ │Standard Var. │€78.95    │€947.40   │-         │ │ │
│ │ │Fixed Rate    │€82.50    │€990.00   │-€42.60   │ │ │
│ │ │Time-of-Use   │€72.30    │€867.60   │+€79.80   │ │ │
│ │ └──────────────┴──────────┴──────────┴──────────┘ │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Switch to Time-of-Use Tariff]                         │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- ContractCard
- TariffDetailCard
- TariffComparisonTable
- ContractRenewalForm
- TariffSwitchForm (with warnings)

**Interactions:**
- Click "Compare Tariffs" → Show comparison table
- Click "Switch Tariff" → Confirmation modal with details
- Click "Renew" → Renewal form

### 7. Devices & Assets (`/devices`)

**Purpose:** Manage all connected energy assets.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Devices & Assets                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tabs: [All] [Meters] [Solar] [Battery] [EV Chargers]  │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Device Grid                                          │ │
│ │                                                      │ │
│ │ ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│ │ │Main Meter│  │Solar PV  │  │Battery   │          │ │
│ │ │✓ Online  │  │✓ Online  │  │✓ Online  │          │ │
│ │ │12345 kWh │  │5.0 kWp   │  │10 kWh    │          │ │
│ │ │[View]    │  │18.5 kWh  │  │75%       │          │ │
│ │ └──────────┘  │[View]    │  │[View]    │          │ │
│ │               └──────────┘  └──────────┘          │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Device Detail Page (`/devices/[deviceId]`):**
```
┌─────────────────────────────────────────────────────────┐
│ Solar PV System: Home Solar                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Status: ✓ Online | Last Seen: 2 min ago                │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ System Details                                      │ │
│ │ Capacity: 5.0 kWp                                   │ │
│ │ Installation Date: Jan 1, 2020                      │ │
│ │ Orientation: South                                  │ │
│ │ Tilt: 30°                                           │ │
│ │ Installer: Solar Co.                               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Inverters                                           │ │
│ │ • Fronius Primo 5.0 (Serial: ABC123) ✓ Online      │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Production Today                                    │ │
│ │ [Line Chart]                                        │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Edit] [Configure]                                      │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- DeviceGrid
- DeviceCard
- DeviceDetailView
- DeviceStatus
- DeviceConfigurationForm

**Interactions:**
- Click device card → View detail
- Click "Edit" → Edit name/location
- Click "Configure" → Device-specific settings

### 8. Forecast & Insights (`/forecast`)

**Purpose:** Predictive analytics and optimization recommendations.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Forecast & Insights                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Consumption Forecast (Next 7 Days)                  │ │
│ │ [Line Chart with confidence bands]                  │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Production Forecast (Next 7 Days)                    │ │
│ │ [Line Chart with weather data]                      │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Optimization Insights                                │ │
│ │                                                      │ │
│ │ ⚡ Shift usage to off-peak hours                    │ │
│ │    Save €15/month by shifting 20% of peak usage    │ │
│ │    [Learn More]                                      │ │
│ │                                                      │ │
│ │ 🔋 Optimize battery charging                        │ │
│ │    Charge during low-price hours for better savings │ │
│ │    [Configure]                                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Efficiency Score                                    │ │
│ │ Score: 72/100 (Good)                                │ │
│ │ [Donut Chart]                                       │ │
│ │ • Consumption efficiency: 80%                       │ │
│ │ • Production optimization: 65%                      │ │
│ │ • Tariff optimization: 70%                          │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Goals                                                │ │
│ │ Monthly Consumption: 300 kWh                        │ │
│ │ Progress: 250/300 kWh (83%)                        │ │
│ │ [Progress Bar]                                      │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- ForecastChart (with confidence bands)
- InsightCard
- EfficiencyScorecard
- GoalProgressCard
- GoalForm (create/edit)

**Interactions:**
- Click insight → Show detailed recommendation
- Click "Create Goal" → Goal form
- Click goal → Edit/delete goal

### 9. Notifications (`/notifications`)

**Purpose:** Centralized notification management.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Notifications                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Mark All as Read] [Settings]                          │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Unread (5)                                          │ │
│ │                                                      │ │
│ │ ⚠️ High consumption detected                        │ │
│ │    Your consumption today is 30% higher than avg.   │ │
│ │    2 hours ago | [View Consumption]                 │ │
│ │                                                      │ │
│ │ ☀️ Solar inverter back online                       │ │
│ │    Your solar inverter is now online.              │ │
│ │    5 hours ago | [View Device]                      │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Read                                                │ │
│ │                                                      │ │
│ │ ✓ Invoice available                                 │ │
│ │    Your January invoice is ready.                   │ │
│ │    2 days ago | [View Invoice]                     │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Alert Settings Page (`/notifications/settings`):**
```
┌─────────────────────────────────────────────────────────┐
│ Alert Preferences                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ High Consumption Alert                              │ │
│ │ [Toggle] Enabled                                    │ │
│ │ Threshold: [Input] 20 kWh/day                      │ │
│ │ Channels: [✓] Email [✓] In-App [ ] SMS             │ │
│ │ Quiet Hours: 22:00 - 08:00                         │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Production Drop Alert                               │ │
│ │ [Toggle] Enabled                                    │ │
│ │ Threshold: [Input] 50% drop                        │ │
│ │ Channels: [✓] Email [✓] In-App [ ] SMS             │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- NotificationList
- NotificationItem
- AlertPreferenceForm
- Toggle switches

**Interactions:**
- Click notification → Navigate to relevant page
- Mark as read → Update status
- Configure alerts → Update preferences

### 10. Support & Help (`/support`)

**Purpose:** Self-service support and ticketing.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Support & Help                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Search FAQ]                                            │
│                                                         │
│ Categories: [Billing] [Contracts] [Devices] [Technical]│
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Popular Articles                                    │ │
│ │ • How do I pay my invoice?                         │ │
│ │ • How to read my meter?                            │ │
│ │ • What is feed-in tariff?                          │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Create Support Ticket]                                │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ My Tickets                                          │ │
│ │ [DataTable: Tickets]                                │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Create Ticket Page (`/support/tickets/new`):**
```
┌─────────────────────────────────────────────────────────┐
│ Create Support Ticket                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Subject: [Input]                                        │
│ Category: [Select: Billing | Technical | Contract]      │
│ Priority: [Select: Low | Medium | High | Urgent]       │
│ Site: [Select: Home | Office]                           │
│ Device: [Select: None | Meter | Solar | Battery]        │
│                                                         │
│ Message:                                                │
│ [Textarea]                                              │
│                                                         │
│ Attachments: [Upload Files]                             │
│                                                         │
│ [Submit Ticket]                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- FAQSearch
- FAQCategoryList
- FAQArticle
- TicketForm
- TicketList
- TicketDetail

**Interactions:**
- Search FAQ → Filter articles
- Click article → View full content
- Create ticket → Form submission
- View ticket → Detail page with messages

### 11. Settings (`/settings`)

**Purpose:** User account and preference management.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Settings                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tabs: [Profile] [Addresses] [Security] [Preferences]   │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Profile                                             │ │
│ │                                                      │ │
│ │ First Name: [Input]                                 │ │
│ │ Last Name: [Input]                                  │ │
│ │ Email: [Input] [Verify]                             │ │
│ │ Phone: [Input] [Verify]                             │ │
│ │                                                      │ │
│ │ [Save Changes]                                      │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Addresses & Sites                                   │ │
│ │                                                      │ │
│ │ • Home (123 Main St) [Edit] [Remove]                │ │
│ │ • Office (456 Oak Ave) [Edit] [Remove]             │ │
│ │                                                      │ │
│ │ [+ Add Site]                                        │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Security                                            │ │
│ │                                                      │ │
│ │ Password: [Change Password]                         │ │
│ │ Two-Factor Auth: [Toggle] Enabled                   │ │
│ │ Active Sessions: [View]                            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Privacy & Data                                      │ │
│ │                                                      │ │
│ │ [Export My Data]                                    │ │
│ │ [Request Account Deletion]                         │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- ProfileForm
- AddressList
- AddressForm
- PasswordChangeForm
- TwoFactorSettings
- ActiveSessionsList
- DataExportForm

**Interactions:**
- Update profile → Save changes
- Add/edit address → Form modal
- Change password → Password form
- Enable 2FA → QR code modal
- Export data → Request export

### 12. Admin Console (`/admin`)

**Purpose:** Internal tools for support staff.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Admin Dashboard                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│ │Customers │  │Tickets    │  │Devices   │  │Payments││
│ │1,234     │  │23 Open    │  │12 Offline│  │5 Failed││
│ └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Customer Search                                     │ │
│ │ [Search: Email | Name | Account #]                  │ │
│ │ [Search Button]                                     │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Recent Activity                                     │ │
│ │ • Customer registered (5 min ago)                   │ │
│ │ • Payment failed (10 min ago)                      │ │
│ │ • Device offline (15 min ago)                      │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- AdminDashboard
- CustomerSearch
- CustomerDetailView
- TicketQueue
- MeterReadingForm
- SystemMonitoring

**Interactions:**
- Search customer → View customer detail
- Assign ticket → Update assignment
- Add meter reading → Form submission
- Monitor system → View alerts

## Responsive Behavior

### Mobile (< 640px)
- Sidebar becomes drawer (slide-in)
- Cards stack vertically
- Tables become card lists
- Charts adapt to smaller width
- Filters collapse into modal

### Tablet (640px - 1024px)
- Sidebar can be collapsed
- 2-column layouts where appropriate
- Charts maintain readability
- Tables scroll horizontally if needed

### Desktop (> 1024px)
- Full sidebar navigation
- Multi-column layouts
- Hover interactions enabled
- Larger chart sizes

## Accessibility Features

- **Keyboard Navigation:** All interactive elements keyboard accessible
- **Screen Readers:** ARIA labels and roles
- **Color Contrast:** WCAG AA compliant
- **Focus Indicators:** Visible focus states
- **Skip Links:** Skip to main content
- **Alt Text:** Images have descriptive alt text
- **Form Labels:** All inputs have associated labels

