# API Design Specification

## API Architecture

The API follows RESTful principles with GraphQL as an alternative for complex queries. All endpoints require authentication via JWT tokens.

**Base URL:** `https://api.energyportal.com/v1`

**Authentication:** Bearer token in `Authorization` header

## REST API Endpoints

### Authentication & Sessions

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "language": "en",
  "timezone": "America/New_York"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token",
  "requiresEmailVerification": true
}
```

#### POST /auth/login
Authenticate user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": { /* User object */ },
  "token": "jwt_token",
  "expiresIn": 3600
}
```

#### POST /auth/logout
Invalidate current session.

**Response:** `200 OK`

#### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "token": "new_jwt_token",
  "expiresIn": 3600
}
```

#### POST /auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

#### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset_token",
  "newPassword": "newSecurePassword123"
}
```

**Response:** `200 OK`

#### POST /auth/verify-email
Verify email address.

**Request:**
```json
{
  "token": "verification_token"
}
```

**Response:** `200 OK`

### User & Profile

#### GET /user/me
Get current user profile.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "prosumer",
  "language": "en",
  "timezone": "America/New_York",
  "twoFactorEnabled": false,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### PATCH /user/me
Update user profile.

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "language": "de",
  "timezone": "Europe/Berlin"
}
```

**Response:** `200 OK` (updated user object)

#### POST /user/me/password
Change password.

**Request:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

**Response:** `200 OK`

#### POST /user/me/two-factor/enable
Enable 2FA.

**Response:** `200 OK`
```json
{
  "secret": "base32_secret",
  "qrCode": "data:image/png;base64,..."
}
```

#### POST /user/me/two-factor/verify
Verify and activate 2FA.

**Request:**
```json
{
  "token": "123456"
}
```

**Response:** `200 OK`

#### DELETE /user/me/two-factor
Disable 2FA.

**Response:** `200 OK`

### Accounts & Sites

#### GET /accounts
List user's accounts.

**Response:** `200 OK`
```json
{
  "accounts": [
    {
      "id": "uuid",
      "accountNumber": "ACC-2025-001234",
      "accountType": "residential",
      "status": "active",
      "sites": [ /* Site objects */ ]
    }
  ]
}
```

#### GET /accounts/:accountId
Get account details.

**Response:** `200 OK` (Account object)

#### GET /sites
List all sites for user.

**Query Parameters:**
- `accountId` (optional): Filter by account

**Response:** `200 OK`
```json
{
  "sites": [
    {
      "id": "uuid",
      "name": "Home",
      "address": { /* Address object */ },
      "isPrimary": true,
      "meters": [ /* Meter objects */ ],
      "contracts": [ /* Contract objects */ ]
    }
  ]
}
```

#### GET /sites/:siteId
Get site details.

**Response:** `200 OK` (Site object with full details)

#### POST /sites
Create new site.

**Request:**
```json
{
  "accountId": "uuid",
  "name": "Office",
  "address": {
    "street": "123 Main St",
    "streetNumber": "123",
    "city": "Berlin",
    "postalCode": "10115",
    "country": "DE"
  },
  "propertyType": "commercial"
}
```

**Response:** `201 Created` (Site object)

#### PATCH /sites/:siteId
Update site.

**Request:**
```json
{
  "name": "Updated Name",
  "address": { /* Address object */ }
}
```

**Response:** `200 OK` (updated Site object)

#### DELETE /sites/:siteId
Delete site (soft delete).

**Response:** `200 OK`

### Consumption Data

#### GET /consumption
Get consumption data.

**Query Parameters:**
- `siteId` (required)
- `meterId` (optional): Filter by specific meter
- `startDate` (required): ISO 8601 date
- `endDate` (required): ISO 8601 date
- `granularity`: `15min` | `hourly` | `daily` | `monthly` | `yearly`
- `groupBy`: `meter` | `phase` | `appliance` (optional)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "timestamp": "2025-01-15T00:00:00Z",
      "consumptionKwh": 2.5,
      "cost": 0.75,
      "co2Kg": 1.2,
      "meterId": "uuid",
      "meterName": "Main Meter"
    }
  ],
  "summary": {
    "totalKwh": 450.5,
    "totalCost": 135.15,
    "totalCo2Kg": 216.24,
    "averageDailyKwh": 15.0,
    "peakKwh": 5.2,
    "peakTimestamp": "2025-01-15T18:00:00Z"
  },
  "comparison": {
    "previousPeriodKwh": 480.0,
    "changePercent": -6.15
  }
}
```

#### GET /consumption/live
Get current/live consumption.

**Query Parameters:**
- `siteId` (required)
- `meterId` (optional)

**Response:** `200 OK`
```json
{
  "currentPowerKw": 2.3,
  "currentCostPerHour": 0.69,
  "timestamp": "2025-01-15T14:30:00Z",
  "meterId": "uuid"
}
```

#### GET /consumption/export
Export consumption data as CSV/PDF.

**Query Parameters:**
- Same as `/consumption`
- `format`: `csv` | `pdf`

**Response:** `200 OK` (file download)

### Production Data

#### GET /production
Get production data.

**Query Parameters:**
- `siteId` (required)
- `solarSystemId` (optional): Filter by solar system
- `startDate` (required)
- `endDate` (required)
- `granularity`: `15min` | `hourly` | `daily` | `monthly` | `yearly`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "timestamp": "2025-01-15T12:00:00Z",
      "productionKwh": 3.5,
      "selfConsumedKwh": 2.0,
      "exportedKwh": 1.5,
      "revenue": 0.15,
      "solarSystemId": "uuid"
    }
  ],
  "summary": {
    "totalProductionKwh": 320.5,
    "totalSelfConsumedKwh": 180.0,
    "totalExportedKwh": 140.5,
    "totalRevenue": 14.05,
    "selfConsumptionRatio": 56.2,
    "autonomyRate": 45.8
  }
}
```

#### GET /production/live
Get current/live production.

**Query Parameters:**
- `siteId` (required)
- `solarSystemId` (optional)

**Response:** `200 OK`
```json
{
  "currentPowerKw": 4.2,
  "todayKwh": 18.5,
  "selfConsumedKwh": 10.0,
  "exportedKwh": 8.5,
  "timestamp": "2025-01-15T14:30:00Z",
  "solarSystemId": "uuid",
  "inverterStatus": "online"
}
```

### Net Balance

#### GET /net-balance
Get net import/export balance.

**Query Parameters:**
- `siteId` (required)
- `startDate` (required)
- `endDate` (required)
- `granularity`: `hourly` | `daily` | `monthly`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "timestamp": "2025-01-15T00:00:00Z",
      "importKwh": 2.0,
      "exportKwh": 0.0,
      "netKwh": 2.0,
      "cost": 0.60,
      "revenue": 0.0,
      "netCost": 0.60
    }
  ],
  "summary": {
    "totalImportKwh": 310.0,
    "totalExportKwh": 140.5,
    "netImportKwh": 169.5,
    "totalCost": 93.0,
    "totalRevenue": 14.05,
    "netCost": 78.95
  }
}
```

#### POST /net-balance/scenarios
Calculate "what-if" scenarios.

**Request:**
```json
{
  "siteId": "uuid",
  "scenario": "add_solar",
  "parameters": {
    "solarCapacityKw": 5.0,
    "orientation": "south",
    "tiltAngle": 30
  }
}
```

**Response:** `200 OK`
```json
{
  "estimatedMonthlyProductionKwh": 600.0,
  "estimatedMonthlySavings": 180.0,
  "paybackPeriodYears": 8.5,
  "projectedNetCost": -50.0
}
```

### Billing & Payments

#### GET /invoices
List invoices.

**Query Parameters:**
- `accountId` (optional)
- `siteId` (optional)
- `status` (optional): `paid` | `unpaid` | `overdue`
- `limit`: Number (default: 20)
- `offset`: Number (default: 0)

**Response:** `200 OK`
```json
{
  "invoices": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-2025-001234",
      "periodStart": "2025-01-01",
      "periodEnd": "2025-01-31",
      "total": 78.95,
      "status": "paid",
      "dueDate": "2025-02-15",
      "paidAt": "2025-02-10T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 24,
    "limit": 20,
    "offset": 0
  }
}
```

#### GET /invoices/:invoiceId
Get invoice details.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "invoiceNumber": "INV-2025-001234",
  "periodStart": "2025-01-01",
  "periodEnd": "2025-01-31",
  "issueDate": "2025-02-01",
  "dueDate": "2025-02-15",
  "lineItems": [
    {
      "description": "Energy consumption: 310 kWh",
      "quantity": 310,
      "unitPrice": 0.30,
      "total": 93.0,
      "category": "consumption"
    },
    {
      "description": "Feed-in compensation: 140.5 kWh",
      "quantity": 140.5,
      "unitPrice": 0.10,
      "total": -14.05,
      "category": "feed_in"
    }
  ],
  "subtotal": 78.95,
  "tax": 15.00,
  "total": 93.95,
  "status": "paid",
  "pdfUrl": "https://cdn.example.com/invoices/INV-2025-001234.pdf"
}
```

#### GET /invoices/:invoiceId/pdf
Download invoice PDF.

**Response:** `200 OK` (PDF file)

#### GET /invoices/estimated-next
Get estimated next invoice.

**Query Parameters:**
- `siteId` (required)

**Response:** `200 OK`
```json
{
  "estimatedConsumptionKwh": 320.0,
  "estimatedProductionKwh": 150.0,
  "estimatedNetKwh": 170.0,
  "estimatedCost": 51.0,
  "estimatedRevenue": 15.0,
  "estimatedTotal": 36.0,
  "periodStart": "2025-02-01",
  "periodEnd": "2025-02-28"
}
```

#### GET /payment-methods
List payment methods.

**Response:** `200 OK`
```json
{
  "paymentMethods": [
    {
      "id": "uuid",
      "type": "card",
      "cardLast4": "4242",
      "cardBrand": "visa",
      "isDefault": true
    }
  ]
}
```

#### POST /payment-methods
Add payment method.

**Request:**
```json
{
  "type": "card",
  "token": "stripe_payment_method_token",
  "isDefault": false
}
```

**Response:** `201 Created` (PaymentMethod object)

#### DELETE /payment-methods/:paymentMethodId
Delete payment method.

**Response:** `200 OK`

#### POST /invoices/:invoiceId/pay
Pay invoice.

**Request:**
```json
{
  "paymentMethodId": "uuid",
  "amount": 93.95
}
```

**Response:** `200 OK`
```json
{
  "paymentId": "uuid",
  "status": "processing",
  "transactionId": "txn_123456"
}
```

#### GET /payments
List payment history.

**Query Parameters:**
- `invoiceId` (optional)
- `limit`, `offset`

**Response:** `200 OK`
```json
{
  "payments": [
    {
      "id": "uuid",
      "invoiceId": "uuid",
      "invoiceNumber": "INV-2025-001234",
      "amount": 93.95,
      "status": "completed",
      "processedAt": "2025-02-10T10:30:00Z",
      "paymentMethod": {
        "type": "card",
        "cardLast4": "4242"
      }
    }
  ]
}
```

#### POST /payment-methods/:paymentMethodId/auto-pay
Configure auto-pay.

**Request:**
```json
{
  "enabled": true,
  "maxAmount": 200.0,
  "notifyOnPayment": true
}
```

**Response:** `200 OK`

### Contracts & Tariffs

#### GET /contracts
List contracts.

**Query Parameters:**
- `siteId` (optional)
- `status` (optional): `active` | `pending` | `expired`

**Response:** `200 OK`
```json
{
  "contracts": [
    {
      "id": "uuid",
      "contractNumber": "CON-2025-001234",
      "siteId": "uuid",
      "siteName": "Home",
      "tariff": {
        "id": "uuid",
        "name": "Standard Variable",
        "type": "variable",
        "basePricePerKwh": 0.30
      },
      "status": "active",
      "startDate": "2025-01-01",
      "endDate": null,
      "autoRenew": true
    }
  ]
}
```

#### GET /contracts/:contractId
Get contract details.

**Response:** `200 OK` (Contract object with full tariff details)

#### GET /tariffs
List available tariffs.

**Query Parameters:**
- `type` (optional): `fixed` | `variable` | `dynamic` | `tou`
- `siteId` (optional): For personalized estimates

**Response:** `200 OK`
```json
{
  "tariffs": [
    {
      "id": "uuid",
      "name": "Standard Variable",
      "code": "STD-VAR-2025",
      "type": "variable",
      "basePricePerKwh": 0.30,
      "monthlyFee": 5.0,
      "feedInTariff": 0.10,
      "validFrom": "2025-01-01",
      "validTo": null
    }
  ]
}
```

#### POST /tariffs/compare
Compare tariffs with user's historical data.

**Request:**
```json
{
  "siteId": "uuid",
  "tariffIds": ["uuid1", "uuid2", "uuid3"],
  "period": "monthly"
}
```

**Response:** `200 OK`
```json
{
  "comparison": [
    {
      "tariffId": "uuid1",
      "tariffName": "Standard Variable",
      "estimatedMonthlyCost": 78.95,
      "estimatedYearlyCost": 947.40,
      "savingsVsCurrent": 0
    }
  ],
  "currentTariff": {
    "tariffId": "uuid1",
    "estimatedMonthlyCost": 78.95
  }
}
```

#### POST /contracts/:contractId/renew
Renew contract.

**Request:**
```json
{
  "tariffId": "uuid",
  "startDate": "2025-02-01"
}
```

**Response:** `201 Created` (new Contract object)

#### POST /contracts/:contractId/switch-tariff
Switch to different tariff.

**Request:**
```json
{
  "tariffId": "uuid",
  "effectiveDate": "2025-02-01",
  "confirm": true
}
```

**Response:** `200 OK` (updated Contract object)

### Devices & Assets

#### GET /devices
List all devices for user.

**Query Parameters:**
- `siteId` (optional)
- `type` (optional): `meter` | `solar` | `battery` | `ev_charger` | `smart_plug`

**Response:** `200 OK`
```json
{
  "devices": [
    {
      "id": "uuid",
      "type": "meter",
      "name": "Main Meter",
      "siteId": "uuid",
      "status": "active",
      "lastReading": {
        "timestamp": "2025-01-15T14:30:00Z",
        "value": 12345.5
      }
    }
  ]
}
```

#### GET /devices/:deviceId
Get device details.

**Response:** `200 OK` (Device object with full details)

#### GET /devices/meters
List meters.

**Response:** `200 OK` (Meter objects)

#### GET /devices/solar-systems
List solar systems.

**Response:** `200 OK`
```json
{
  "solarSystems": [
    {
      "id": "uuid",
      "name": "Home Solar",
      "siteId": "uuid",
      "capacityKw": 5.0,
      "status": "active",
      "inverters": [
        {
          "id": "uuid",
          "manufacturer": "Fronius",
          "model": "Primo 5.0",
          "status": "online",
          "lastSeenAt": "2025-01-15T14:30:00Z"
        }
      ],
      "todayProductionKwh": 18.5,
      "monthProductionKwh": 320.5
    }
  ]
}
```

#### GET /devices/batteries
List batteries.

**Response:** `200 OK`
```json
{
  "batteries": [
    {
      "id": "uuid",
      "name": "Home Battery",
      "siteId": "uuid",
      "capacityKwh": 10.0,
      "status": "online",
      "currentChargeKwh": 7.5,
      "currentChargePercent": 75,
      "lastSeenAt": "2025-01-15T14:30:00Z"
    }
  ]
}
```

#### GET /devices/ev-chargers
List EV chargers.

**Response:** `200 OK` (EVCharger objects)

#### PATCH /devices/:deviceId
Update device (name, location, etc.).

**Request:**
```json
{
  "name": "Updated Name",
  "location": "Garage"
}
```

**Response:** `200 OK` (updated Device object)

### Forecast & Insights

#### GET /forecast
Get energy forecast.

**Query Parameters:**
- `siteId` (required)
- `type`: `consumption` | `production` | `net`
- `period`: `hourly` | `daily` | `weekly`
- `days`: Number (default: 7)

**Response:** `200 OK`
```json
{
  "forecast": [
    {
      "timestamp": "2025-01-16T00:00:00Z",
      "value": 15.5,
      "lowerBound": 12.0,
      "upperBound": 19.0
    }
  ],
  "confidence": 0.85,
  "source": "ml_model"
}
```

#### GET /insights
Get optimization insights.

**Query Parameters:**
- `siteId` (required)

**Response:** `200 OK`
```json
{
  "insights": [
    {
      "id": "uuid",
      "type": "usage_shift",
      "severity": "medium",
      "title": "Shift usage to off-peak hours",
      "description": "You could save €15/month by shifting 20% of your peak usage to off-peak hours.",
      "actionUrl": "/forecast/insights",
      "estimatedSavings": 15.0
    }
  ],
  "efficiencyScore": 72,
  "efficiencyRating": "good"
}
```

#### GET /goals
List user goals.

**Response:** `200 OK` (Goal objects)

#### POST /goals
Create goal.

**Request:**
```json
{
  "siteId": "uuid",
  "type": "consumption",
  "targetValue": 300,
  "unit": "kwh",
  "period": "monthly",
  "startDate": "2025-02-01",
  "endDate": "2025-02-28"
}
```

**Response:** `201 Created` (Goal object)

#### PATCH /goals/:goalId
Update goal.

**Request:**
```json
{
  "targetValue": 280,
  "isActive": true
}
```

**Response:** `200 OK` (updated Goal object)

### Notifications & Alerts

#### GET /notifications
List notifications.

**Query Parameters:**
- `read` (optional): `true` | `false`
- `type` (optional)
- `limit`, `offset`

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "alert",
      "severity": "warning",
      "title": "High consumption detected",
      "message": "Your consumption today is 30% higher than average.",
      "read": false,
      "actionUrl": "/consumption",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

#### PATCH /notifications/:notificationId/read
Mark notification as read.

**Response:** `200 OK`

#### PATCH /notifications/read-all
Mark all notifications as read.

**Response:** `200 OK`

#### GET /alert-preferences
Get alert preferences.

**Response:** `200 OK` (AlertPreference objects)

#### POST /alert-preferences
Create alert preference.

**Request:**
```json
{
  "siteId": "uuid",
  "alertType": "high_consumption",
  "emailEnabled": true,
  "smsEnabled": false,
  "inAppEnabled": true,
  "thresholdValue": 20,
  "thresholdUnit": "kwh"
}
```

**Response:** `201 Created` (AlertPreference object)

#### PATCH /alert-preferences/:preferenceId
Update alert preference.

**Request:**
```json
{
  "thresholdValue": 25,
  "isActive": true
}
```

**Response:** `200 OK` (updated AlertPreference object)

### Support & Tickets

#### GET /tickets
List user's tickets.

**Query Parameters:**
- `status` (optional)
- `category` (optional)
- `limit`, `offset`

**Response:** `200 OK`
```json
{
  "tickets": [
    {
      "id": "uuid",
      "ticketNumber": "TKT-2025-001234",
      "subject": "Solar inverter offline",
      "category": "technical",
      "priority": "high",
      "status": "in_progress",
      "createdAt": "2025-01-15T09:00:00Z",
      "lastMessageAt": "2025-01-15T14:00:00Z"
    }
  ]
}
```

#### GET /tickets/:ticketId
Get ticket details with messages.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "ticketNumber": "TKT-2025-001234",
  "subject": "Solar inverter offline",
  "category": "technical",
  "priority": "high",
  "status": "in_progress",
  "messages": [
    {
      "id": "uuid",
      "content": "My solar inverter has been offline since yesterday.",
      "authorId": "uuid",
      "authorName": "John Doe",
      "isInternal": false,
      "createdAt": "2025-01-15T09:00:00Z"
    }
  ],
  "attachments": []
}
```

#### POST /tickets
Create ticket.

**Request:**
```json
{
  "subject": "Solar inverter offline",
  "category": "technical",
  "priority": "high",
  "message": "My solar inverter has been offline since yesterday.",
  "siteId": "uuid",
  "deviceId": "uuid"
}
```

**Response:** `201 Created` (Ticket object)

#### POST /tickets/:ticketId/messages
Add message to ticket.

**Request:**
```json
{
  "content": "I've checked the inverter and it's still offline.",
  "attachments": ["file_id_1", "file_id_2"]
}
```

**Response:** `201 Created` (TicketMessage object)

#### POST /tickets/:ticketId/attachments
Upload attachment.

**Request:** Multipart form data with file

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "fileName": "inverter_photo.jpg",
  "fileUrl": "https://cdn.example.com/attachments/uuid.jpg",
  "fileSize": 245678,
  "mimeType": "image/jpeg"
}
```

#### GET /support/faq
Get FAQ articles.

**Query Parameters:**
- `category` (optional)
- `search` (optional): Search query

**Response:** `200 OK`
```json
{
  "faqs": [
    {
      "id": "uuid",
      "category": "billing",
      "question": "How do I pay my invoice?",
      "answer": "You can pay your invoice online...",
      "tags": ["payment", "invoice"]
    }
  ]
}
```

### Settings

#### GET /settings
Get user settings.

**Response:** `200 OK`
```json
{
  "profile": { /* User profile */ },
  "addresses": [ /* Site addresses */ ],
  "preferences": {
    "language": "en",
    "timezone": "America/New_York",
    "dateFormat": "MM/DD/YYYY",
    "currency": "EUR"
  },
  "privacy": {
    "dataSharing": false,
    "marketingEmails": true
  }
}
```

#### POST /settings/data-export
Request data export.

**Request:**
```json
{
  "format": "json",
  "includeData": ["consumption", "production", "invoices"]
}
```

**Response:** `202 Accepted`
```json
{
  "exportId": "uuid",
  "status": "processing",
  "estimatedCompletion": "2025-01-15T15:00:00Z"
}
```

#### GET /settings/data-export/:exportId
Get export status and download URL.

**Response:** `200 OK`
```json
{
  "exportId": "uuid",
  "status": "completed",
  "downloadUrl": "https://cdn.example.com/exports/uuid.zip",
  "expiresAt": "2025-01-22T00:00:00Z"
}
```

### Admin Endpoints

#### GET /admin/customers
Search customers (admin only).

**Query Parameters:**
- `search`: Email, name, account number
- `role` (optional)
- `status` (optional)
- `limit`, `offset`

**Response:** `200 OK` (Customer list with accounts)

#### GET /admin/customers/:customerId
Get customer details (admin only).

**Response:** `200 OK` (Full customer data)

#### POST /admin/meters/:meterId/readings
Add manual meter reading (admin only).

**Request:**
```json
{
  "timestamp": "2025-01-15T00:00:00Z",
  "value": 12345.5,
  "source": "manual",
  "notes": "Customer reported reading"
}
```

**Response:** `201 Created` (Reading object)

#### GET /admin/tickets
List all tickets (admin only).

**Query Parameters:**
- `status` (optional)
- `assignedTo` (optional)
- `priority` (optional)

**Response:** `200 OK` (Ticket list)

#### PATCH /admin/tickets/:ticketId/assign
Assign ticket (admin only).

**Request:**
```json
{
  "assignedTo": "admin_user_id"
}
```

**Response:** `200 OK` (updated Ticket object)

#### GET /admin/monitoring
Get system monitoring data (admin only).

**Response:** `200 OK`
```json
{
  "devicesOffline": 12,
  "paymentFailures": 5,
  "billingAnomalies": 2,
  "activeTickets": 23,
  "recentAlerts": [ /* Alert objects */ ]
}
```

## GraphQL Schema (Alternative)

For complex queries requiring multiple related entities, GraphQL provides a more flexible alternative.

```graphql
type Query {
  me: User
  site(id: ID!): Site
  sites: [Site!]!
  consumption(
    siteId: ID!
    startDate: DateTime!
    endDate: DateTime!
    granularity: Granularity!
  ): ConsumptionData!
  production(
    siteId: ID!
    startDate: DateTime!
    endDate: DateTime!
    granularity: Granularity!
  ): ProductionData!
  netBalance(
    siteId: ID!
    startDate: DateTime!
    endDate: DateTime!
  ): NetBalanceData!
  invoices(filter: InvoiceFilter): [Invoice!]!
  invoice(id: ID!): Invoice
  contracts(siteId: ID): [Contract!]!
  tariffs: [Tariff!]!
  devices(siteId: ID, type: DeviceType): [Device!]!
  forecast(
    siteId: ID!
    type: ForecastType!
    days: Int!
  ): ForecastData!
  notifications(unreadOnly: Boolean): [Notification!]!
  tickets(status: TicketStatus): [Ticket!]!
  ticket(id: ID!): Ticket
}

type Mutation {
  updateProfile(input: ProfileInput!): User!
  addSite(input: SiteInput!): Site!
  updateSite(id: ID!, input: SiteInput!): Site!
  payInvoice(invoiceId: ID!, paymentMethodId: ID!): Payment!
  createTicket(input: TicketInput!): Ticket!
  addTicketMessage(ticketId: ID!, content: String!): TicketMessage!
  createGoal(input: GoalInput!): Goal!
  updateAlertPreference(id: ID!, input: AlertPreferenceInput!): AlertPreference!
}

type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  role: UserRole!
  accounts: [Account!]!
  sites: [Site!]!
  notifications(unreadOnly: Boolean): [Notification!]!
}

type Site {
  id: ID!
  name: String!
  address: Address!
  meters: [Meter!]!
  contracts: [Contract!]!
  solarSystems: [SolarSystem!]!
  batteries: [Battery!]!
  consumption(
    startDate: DateTime!
    endDate: DateTime!
    granularity: Granularity!
  ): ConsumptionData!
  production(
    startDate: DateTime!
    endDate: DateTime!
    granularity: Granularity!
  ): ProductionData!
}

type ConsumptionData {
  data: [ConsumptionPoint!]!
  summary: ConsumptionSummary!
  comparison: ConsumptionComparison
}

type ConsumptionPoint {
  timestamp: DateTime!
  consumptionKwh: Float!
  cost: Float!
  co2Kg: Float!
}

enum Granularity {
  MINUTE_15
  HOURLY
  DAILY
  MONTHLY
  YEARLY
}

enum UserRole {
  CUSTOMER
  PROSUMER
  BUSINESS
  ADMIN
  SUPPORT
}

enum DeviceType {
  METER
  SOLAR
  BATTERY
  EV_CHARGER
  SMART_PLUG
}

enum ForecastType {
  CONSUMPTION
  PRODUCTION
  NET
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING_CUSTOMER
  RESOLVED
  CLOSED
}
```

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid date range",
    "details": {
      "field": "endDate",
      "reason": "End date must be after start date"
    }
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Missing or invalid authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `CONFLICT` (409): Resource conflict (e.g., duplicate email)
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

- **Authenticated users:** 1000 requests/hour
- **Admin users:** 5000 requests/hour
- **Public endpoints:** 100 requests/hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642233600
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit`: Number of items (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

**Response:**
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## Webhooks (Future)

For real-time updates, webhooks can be configured:

- `consumption.high` - High consumption detected
- `production.drop` - Production drop detected
- `device.offline` - Device went offline
- `invoice.issued` - New invoice issued
- `payment.completed` - Payment completed
- `ticket.updated` - Ticket status changed

