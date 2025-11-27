# Data Model Specification

## Entity Relationship Overview

```
User
  ├── Account (1:1)
  ├── Site (1:N)
  │     ├── Meter (1:N)
  │     ├── Contract (1:N)
  │     ├── SolarSystem (0:1)
  │     ├── Battery (0:N)
  │     ├── EVCharger (0:N)
  │     └── SmartPlug (0:N)
  ├── Notification (1:N)
  ├── Ticket (1:N)
  └── AlertPreference (1:1)

Contract
  ├── Tariff (N:1)
  └── Invoice (1:N)
      └── Payment (0:N)

Meter
  └── Reading (1:N)

SolarSystem
  ├── Inverter (1:N)
  └── ProductionReading (1:N)

Battery
  └── BatteryReading (1:N)

EVCharger
  └── ChargingSession (1:N)
```

## Core Entities

### User
Represents a portal user (customer, prosumer, admin).

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique, lowercase
  emailVerified: boolean;
  passwordHash: string; // bcrypt
  firstName: string;
  lastName: string;
  phone?: string;
  phoneVerified?: boolean;
  role: UserRole; // 'customer' | 'prosumer' | 'business' | 'admin' | 'support'
  language: string; // ISO 639-1 (e.g., 'en', 'de')
  timezone: string; // IANA timezone (e.g., 'Europe/Berlin')
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}
```

### Account
Billing account associated with a user. One user can have multiple accounts (e.g., personal + business).

```typescript
interface Account {
  id: string; // UUID
  userId: string; // FK to User
  accountNumber: string; // Unique, e.g., "ACC-2025-001234"
  accountType: 'residential' | 'business';
  status: 'active' | 'suspended' | 'closed';
  billingEmail?: string; // Can differ from user email
  billingAddress: Address;
  taxId?: string; // For business accounts
  createdAt: Date;
  updatedAt: Date;
}
```

### Site
Physical location where energy is consumed/produced (address, building).

```typescript
interface Site {
  id: string; // UUID
  accountId: string; // FK to Account
  name: string; // User-friendly name (e.g., "Home", "Office")
  address: Address;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  propertyType: 'residential' | 'commercial' | 'industrial';
  squareMeters?: number;
  occupants?: number; // For residential
  isPrimary: boolean; // Primary site for account
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  street: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  state?: string;
  country: string; // ISO 3166-1 alpha-2
}
```

### Meter
Energy meter (electricity, gas) at a site.

```typescript
interface Meter {
  id: string; // UUID
  siteId: string; // FK to Site
  meterNumber: string; // Unique identifier from utility
  meterType: 'electricity' | 'gas';
  phase: 'single' | 'three'; // For electricity
  manufacturer?: string;
  model?: string;
  installationDate?: Date;
  lastReadingDate?: Date;
  lastReadingValue?: number; // kWh or m³
  status: 'active' | 'inactive' | 'faulty';
  isSmartMeter: boolean;
  readingFrequency?: '15min' | 'hourly' | 'daily'; // For smart meters
  createdAt: Date;
  updatedAt: Date;
}
```

### Reading
Meter reading (consumption data point).

```typescript
interface Reading {
  id: string; // UUID
  meterId: string; // FK to Meter
  timestamp: Date; // ISO 8601
  value: number; // kWh or m³ (cumulative)
  delta?: number; // Difference from previous reading (kWh)
  source: 'smart_meter' | 'manual' | 'estimated' | 'adjusted';
  quality: 'valid' | 'estimated' | 'questionable';
  createdAt: Date;
  updatedAt: Date;
  
  // Indexes: meterId + timestamp (unique), timestamp
}
```

### Contract
Energy supply contract between account and provider.

```typescript
interface Contract {
  id: string; // UUID
  accountId: string; // FK to Account
  siteId: string; // FK to Site
  contractNumber: string; // Unique, e.g., "CON-2025-001234"
  tariffId: string; // FK to Tariff
  contractType: 'fixed' | 'variable' | 'dynamic' | 'tou'; // Time-of-use
  status: 'active' | 'pending' | 'expired' | 'terminated';
  startDate: Date;
  endDate?: Date; // null for indefinite contracts
  terminationNoticeDays: number; // e.g., 30
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Tariff
Pricing structure for energy supply.

```typescript
interface Tariff {
  id: string; // UUID
  name: string; // e.g., "Standard Variable"
  code: string; // Unique code, e.g., "STD-VAR-2025"
  type: 'fixed' | 'variable' | 'dynamic' | 'tou';
  status: 'active' | 'archived';
  
  // Pricing structure
  basePricePerKwh: number; // Base price in currency unit
  currency: string; // ISO 4217 (e.g., 'EUR', 'USD')
  
  // Time-of-use pricing (if applicable)
  timeBands?: TimeBand[];
  
  // Fixed fees
  monthlyFee: number;
  connectionFee?: number;
  
  // Feed-in tariff (for production)
  feedInTariff?: number; // Price per kWh exported
  feedInTariffType?: 'fixed' | 'dynamic';
  
  // Grid fees
  gridFeePerKwh?: number;
  
  // Taxes
  taxRate: number; // e.g., 0.19 for 19% VAT
  
  // Validity
  validFrom: Date;
  validTo?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

interface TimeBand {
  name: string; // e.g., "Peak", "Off-Peak"
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  pricePerKwh: number;
  multiplier?: number; // Multiplier for base price
}
```

### Invoice
Billing invoice for a contract period.

```typescript
interface Invoice {
  id: string; // UUID
  contractId: string; // FK to Contract
  invoiceNumber: string; // Unique, e.g., "INV-2025-001234"
  periodStart: Date;
  periodEnd: Date;
  issueDate: Date;
  dueDate: Date;
  
  // Consumption data
  consumptionKwh: number;
  productionKwh?: number; // For prosumers
  exportKwh?: number; // Energy exported to grid
  importKwh: number; // Net import
  
  // Financials
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  
  // Payment
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  paidAt?: Date;
  paymentMethodId?: string; // FK to PaymentMethod
  
  // PDF
  pdfUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceLineItem {
  id: string;
  description: string; // e.g., "Energy consumption: 450 kWh"
  quantity: number; // kWh
  unitPrice: number; // Price per kWh
  total: number;
  category: 'consumption' | 'production' | 'feed_in' | 'grid_fee' | 'tax' | 'other';
}
```

### PaymentMethod
Saved payment methods for invoices.

```typescript
interface PaymentMethod {
  id: string; // UUID
  accountId: string; // FK to Account
  type: 'card' | 'sepa_direct_debit' | 'bank_transfer';
  isDefault: boolean;
  
  // Card
  cardLast4?: string;
  cardBrand?: string; // 'visa', 'mastercard', etc.
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  
  // SEPA
  iban?: string;
  bic?: string;
  accountHolder?: string;
  
  // Status
  status: 'active' | 'expired' | 'failed';
  
  // External payment provider ID (e.g., Stripe payment method ID)
  externalId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment
Payment transaction for an invoice.

```typescript
interface Payment {
  id: string; // UUID
  invoiceId: string; // FK to Invoice
  paymentMethodId: string; // FK to PaymentMethod
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string; // External payment provider transaction ID
  failureReason?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### SolarSystem
Solar PV system at a site.

```typescript
interface SolarSystem {
  id: string; // UUID
  siteId: string; // FK to Site
  name: string; // User-friendly name
  capacityKw: number; // Installed capacity in kWp
  installationDate: Date;
  orientation: 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest';
  tiltAngle: number; // Degrees (0-90)
  panelCount: number;
  panelType?: string; // e.g., "monocrystalline"
  inverterIds: string[]; // FK to Inverter
  status: 'active' | 'inactive' | 'maintenance';
  installerName?: string;
  installerContact?: string;
  warrantyUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Inverter
Solar inverter device.

```typescript
interface Inverter {
  id: string; // UUID
  solarSystemId: string; // FK to SolarSystem
  manufacturer: string; // e.g., "Fronius", "SMA"
  model: string;
  serialNumber: string; // Unique
  maxPowerKw: number;
  status: 'online' | 'offline' | 'warning' | 'fault';
  lastSeenAt?: Date;
  firmwareVersion?: string;
  apiEndpoint?: string; // For fetching real-time data
  createdAt: Date;
  updatedAt: Date;
}
```

### ProductionReading
Solar production data point.

```typescript
interface ProductionReading {
  id: string; // UUID
  solarSystemId: string; // FK to SolarSystem
  timestamp: Date;
  powerKw: number; // Instantaneous power
  energyKwh: number; // Cumulative energy produced
  deltaKwh?: number; // Energy since last reading
  selfConsumedKwh?: number; // Energy consumed on-site
  exportedKwh?: number; // Energy exported to grid
  source: 'inverter' | 'meter' | 'estimated';
  createdAt: Date;
}
```

### Battery
Battery storage system.

```typescript
interface Battery {
  id: string; // UUID
  siteId: string; // FK to Site
  name: string;
  manufacturer: string; // e.g., "Tesla", "Sonnen"
  model: string;
  capacityKwh: number; // Total capacity
  usableCapacityKwh: number; // Usable capacity (after depth of discharge)
  installationDate: Date;
  status: 'online' | 'offline' | 'charging' | 'discharging' | 'idle' | 'fault';
  currentChargeKwh?: number; // Current charge level
  currentChargePercent?: number; // 0-100
  lastSeenAt?: Date;
  apiEndpoint?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BatteryReading
Battery status data point.

```typescript
interface BatteryReading {
  id: string; // UUID
  batteryId: string; // FK to Battery
  timestamp: Date;
  chargeKwh: number;
  chargePercent: number;
  powerKw: number; // Positive = charging, negative = discharging
  state: 'charging' | 'discharging' | 'idle';
  temperature?: number; // Celsius
  cycles?: number; // Total charge cycles
  healthPercent?: number; // Battery health (0-100)
  createdAt: Date;
}
```

### EVCharger
Electric vehicle charger.

```typescript
interface EVCharger {
  id: string; // UUID
  siteId: string; // FK to Site
  name: string;
  manufacturer: string; // e.g., "Wallbox", "ChargePoint"
  model: string;
  serialNumber: string;
  maxPowerKw: number;
  connectorType: 'type1' | 'type2' | 'ccs' | 'chademo' | 'tesla';
  status: 'online' | 'offline' | 'charging' | 'available' | 'fault';
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### ChargingSession
EV charging session.

```typescript
interface ChargingSession {
  id: string; // UUID
  evChargerId: string; // FK to EVCharger
  startTime: Date;
  endTime?: Date;
  energyKwh: number;
  cost?: number; // Calculated cost
  vehicleId?: string; // User-defined vehicle identifier
  createdAt: Date;
  updatedAt: Date;
}
```

### SmartPlug
Smart plug for appliance-level monitoring.

```typescript
interface SmartPlug {
  id: string; // UUID
  siteId: string; // FK to Site
  name: string; // User-defined (e.g., "Washing Machine")
  manufacturer: string; // e.g., "TP-Link", "Shelly"
  model: string;
  macAddress: string; // Unique identifier
  location?: string; // Room/location
  status: 'online' | 'offline' | 'on' | 'off';
  currentPowerW?: number;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### SmartPlugReading
Appliance-level consumption data.

```typescript
interface SmartPlugReading {
  id: string; // UUID
  smartPlugId: string; // FK to SmartPlug
  timestamp: Date;
  powerW: number; // Instantaneous power
  energyKwh: number; // Cumulative
  deltaKwh?: number;
  createdAt: Date;
}
```

### Notification
In-app notification.

```typescript
interface Notification {
  id: string; // UUID
  userId: string; // FK to User
  type: 'alert' | 'billing' | 'contract' | 'device' | 'system' | 'support';
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actionUrl?: string; // Link to relevant page
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}
```

### AlertPreference
User's alert configuration.

```typescript
interface AlertPreference {
  id: string; // UUID
  userId: string; // FK to User
  siteId?: string; // FK to Site (null for global)
  
  // Alert types
  alertType: 'high_consumption' | 'production_drop' | 'device_offline' | 'bill_available' | 'payment_due' | 'contract_expiring' | 'price_spike';
  
  // Channels
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  
  // Thresholds
  thresholdValue?: number; // e.g., kWh for consumption alerts
  thresholdUnit?: string; // 'kwh', 'percent', 'currency'
  
  // Quiet hours
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string; // HH:mm
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Ticket
Support ticket.

```typescript
interface Ticket {
  id: string; // UUID
  userId: string; // FK to User
  accountId: string; // FK to Account
  ticketNumber: string; // Unique, e.g., "TKT-2025-001234"
  subject: string;
  category: 'billing' | 'technical' | 'contract' | 'device' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assignedTo?: string; // FK to User (admin/support)
  messages: TicketMessage[];
  attachments: TicketAttachment[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

interface TicketMessage {
  id: string;
  ticketId: string; // FK to Ticket
  authorId: string; // FK to User
  content: string;
  isInternal: boolean; // Internal note (not visible to customer)
  createdAt: Date;
}

interface TicketAttachment {
  id: string;
  ticketId: string; // FK to Ticket
  fileName: string;
  fileUrl: string;
  fileSize: number; // bytes
  mimeType: string;
  uploadedAt: Date;
}
```

### Forecast
Energy forecast data.

```typescript
interface Forecast {
  id: string; // UUID
  siteId: string; // FK to Site
  type: 'consumption' | 'production' | 'net';
  forecastDate: Date; // Date being forecasted
  period: 'hourly' | 'daily' | 'weekly';
  values: ForecastValue[];
  confidence?: number; // 0-1
  source: 'ml_model' | 'weather_api' | 'historical_average';
  createdAt: Date;
}

interface ForecastValue {
  timestamp: Date;
  value: number; // kWh
  lowerBound?: number; // Confidence interval
  upperBound?: number;
}
```

### Goal
User-defined energy/cost goal.

```typescript
interface Goal {
  id: string; // UUID
  userId: string; // FK to User
  siteId?: string; // FK to Site (null for account-wide)
  type: 'consumption' | 'cost' | 'production' | 'self_consumption';
  targetValue: number;
  unit: string; // 'kwh', 'currency', 'percent'
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  currentValue?: number;
  progressPercent?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Indexes

### Critical Indexes

**Readings:**
- `(meterId, timestamp)` - Unique, for time-series queries
- `(timestamp)` - For date range queries across meters
- `(meterId, timestamp DESC)` - For latest reading per meter

**ProductionReadings:**
- `(solarSystemId, timestamp)` - Unique
- `(timestamp)` - Date range queries

**Invoices:**
- `(contractId, periodStart DESC)` - Latest invoice per contract
- `(accountId, status, dueDate)` - Payment queries

**Notifications:**
- `(userId, read, createdAt DESC)` - Unread notifications

**Tickets:**
- `(userId, status, createdAt DESC)` - User's tickets
- `(assignedTo, status)` - Admin ticket queue

## Data Relationships Summary

- **User** → **Account** (1:1 or 1:N for business)
- **Account** → **Site** (1:N)
- **Site** → **Meter** (1:N)
- **Site** → **Contract** (1:N, but typically 1 active)
- **Site** → **SolarSystem** (0:1)
- **Site** → **Battery** (0:N)
- **Site** → **EVCharger** (0:N)
- **Site** → **SmartPlug** (0:N)
- **Contract** → **Tariff** (N:1)
- **Contract** → **Invoice** (1:N)
- **Invoice** → **Payment** (1:N, but typically 1)
- **Meter** → **Reading** (1:N)
- **SolarSystem** → **Inverter** (1:N)
- **SolarSystem** → **ProductionReading** (1:N)
- **Battery** → **BatteryReading** (1:N)
- **EVCharger** → **ChargingSession** (1:N)
- **SmartPlug** → **SmartPlugReading** (1:N)
- **User** → **Notification** (1:N)
- **User** → **AlertPreference** (1:N)
- **User** → **Ticket** (1:N)
- **User** → **Goal** (1:N)

