# Energy Sharing Group (ESG) - Implementation Guide

## 🎯 Overview

The **Energy Sharing Group** feature is a Luxembourg-specific implementation of EU Energy Communities (Directive 2019/944). It enables groups of people (lane, village, building, friends) to form energy sharing communities with:

- **Group Management**: Admin-controlled membership and settings
- **Virtual Energy Allocation**: Smart meter-based energy sharing
- **Transparent Pricing**: Clear internal pricing and savings calculations
- **Full Compliance**: Luxembourg regulatory framework adherence
- **Privacy-First**: GDPR-compliant data handling

## 🆚 Difference from P2P Community Trading

| Feature | P2P Community Trading | Energy Sharing Group (ESG) |
|---------|----------------------|---------------------------|
| **Purpose** | Open marketplace for energy trading | Formal group with managed membership |
| **Structure** | Loose community, anyone can trade | Defined group with admins |
| **Membership** | Open participation | Admin-approved members |
| **Pricing** | Market-driven, dynamic offers | Group-set internal pricing |
| **Regulation** | General EU framework | Luxembourg-specific implementation |
| **Use Case** | Neighborhood trading | Lane/building/village sharing |
| **Management** | Self-service | Admin-controlled |

## 📍 Navigation

**Sidebar Menu:**
```
├─ 📊 Dashboard
├─ 🔌 Smart Home  
├─ ☁️  Weather
├─ 👥 Community (P2P Trading)
├─ 👥 Energy Sharing (ESG) ← NEW!
├─ 📊 Consumption
└─ ... (other items)
```

## 🏗️ Architecture

### Pages Structure
```
/energy-sharing/
├── page.tsx                    # Group Overview
├── my-group/page.tsx          # Personal Dashboard (TODO)
├── admin/page.tsx             # Admin Console (TODO)
├── history/page.tsx           # History & Reports (TODO)
└── settings/page.tsx          # Group Settings (TODO)
```

### API Routes
```
/api/energy-sharing/
├── overview/route.ts          # Group overview data ✅
├── my-group/route.ts          # Personal dashboard data ✅
├── admin/route.ts             # Admin dashboard data ✅
├── groups/route.ts            # List/create groups (TODO)
├── join/route.ts              # Join group (TODO)
└── rules/route.ts             # Manage pricing rules (TODO)
```

### Type Definitions
```
types/energy-sharing.ts        # Complete TypeScript interfaces ✅
```

### Mock Data
```
lib/energySharingData.ts       # Mock data generators ✅
```

## 👥 User Roles

### 1. Regular Member
**Can:**
- View personal energy flow (from/to community)
- See internal prices and costs
- View savings vs normal tariff
- Configure trading preferences
- View group-level stats (aggregated)
- Access history and reports

**Cannot:**
- Manage other members
- Change group pricing
- Approve join requests

### 2. Group Admin
**Can do everything a member can, plus:**
- Create energy sharing groups
- Invite and approve members
- Set internal pricing rules
- Configure group settings
- View full member allocations
- Export compliance reports
- Assign co-admins
- Remove members

## 📊 Current Implementation Status

### ✅ Completed
1. **Navigation**: Menu item added to sidebar
2. **Type System**: Complete TypeScript interfaces
3. **Mock Data**: Realistic data generators
4. **API Routes**: 3 core endpoints
5. **Group Overview Page**: Main dashboard with KPIs
6. **Build**: Successful compilation

### 🚧 To Be Implemented
1. **Personal Dashboard** (`/energy-sharing/my-group`)
   - Energy flow visualization
   - Financial breakdown
   - Savings calculator
   - Trading preferences

2. **Admin Console** (`/energy-sharing/admin`)
   - Member management
   - Pending join requests
   - Pricing rules editor
   - Allocation logs
   - Export reports

3. **History Page** (`/energy-sharing/history`)
   - Monthly allocation history
   - Financial settlements
   - Export functionality

4. **Group Creation Flow**
   - Create new group form
   - Initial setup wizard
   - Invitation system

5. **Join Group Flow**
   - Group discovery
   - Join request form
   - Approval workflow

## 🎨 Current Features (Group Overview)

### Header Section
- Group name and description
- Location (region, postcode)
- Group type (lane/building/village)
- Admin badge (if user is admin)
- Key metrics: Members, Self-Sufficiency, Internal Sharing, Savings

### Quick Actions
- **My Energy & Savings**: Personal dashboard link
- **Admin Console**: Admin tools (if admin)
- **History & Reports**: Allocation history

### Group KPIs
- **Production**: Total group production (kWh)
- **Internal Sharing**: Energy shared within group (kWh)
- **Avg Internal Price**: Current internal price (€/kWh)
- **CO₂ Avoided**: Environmental impact (kg)

### Info Box
- Luxembourg framework explanation
- Virtual allocation concept
- Transparency guarantee
- GDPR compliance notice

## 📋 Data Model

### Core Entities

**EnergySharingGroup**
```typescript
{
  id: string
  name: string
  type: 'lane' | 'building' | 'village' | 'custom'
  description: string
  region: string
  postcode: string
  status: 'pending' | 'active' | 'suspended'
  member_count: number
  regulatory_framework: 'LU_ENERGY_SHARING'
}
```

**GroupMember**
```typescript
{
  id: string
  group_id: string
  user_id: string
  meter_id: string
  role: 'member' | 'admin'
  status: 'pending' | 'active' | 'removed'
  is_prosumer: boolean
}
```

**EnergyAllocationRecord**
```typescript
{
  member_id: string
  period_start: string
  period_end: string
  energy_from_community_kwh: number
  energy_to_community_kwh: number
  energy_from_supplier_kwh: number
  energy_to_grid_kwh: number
}
```

**FinancialSettlement**
```typescript
{
  member_id: string
  period: string
  community_energy_cost_eur: number
  community_energy_revenue_eur: number
  baseline_cost_eur: number
  savings_eur: number
}
```

## 🧪 Testing

### How to Test

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Energy Sharing:**
   - Click "Energy Sharing" in the sidebar (5th item)
   - Or go to: `http://localhost:3000/energy-sharing`

3. **What you'll see:**
   - Group: "Rue des Pins Energy Sharing"
   - Location: Esch-sur-Alzette, L-4365
   - 24 members
   - 78.1% self-sufficiency
   - 68.2% internal sharing
   - €487 total savings
   - 1,456 kg CO₂ avoided

### Mock Data Details

**Group:**
- Name: Rue des Pins Energy Sharing
- Type: Lane community
- Members: 24 (2 admins, 22 members)
- Location: Belval, Luxembourg

**Monthly KPIs:**
- Production: 3,245.8 kWh
- Consumption: 4,156.2 kWh
- Internal Sharing: 2,834.5 kWh (68.2%)
- Grid Import: 1,321.7 kWh
- Grid Export: 411.3 kWh

**Pricing:**
- Internal Buy Price: €0.18/kWh
- Internal Sell Price: €0.16/kWh
- Grid Import Price: €0.28/kWh
- Grid Export Price: €0.08/kWh

## 🔄 User Journeys

### Journey 1: View Group Overview (Current)
1. User clicks "Energy Sharing" in sidebar
2. System loads group overview
3. User sees:
   - Group information
   - Key metrics
   - Quick action links
   - Group KPIs
   - Luxembourg framework info

### Journey 2: View Personal Dashboard (TODO)
1. User clicks "My Energy & Savings"
2. System shows:
   - Personal energy flow chart
   - Energy from/to community
   - Financial breakdown
   - Savings vs baseline
   - Monthly history

### Journey 3: Admin Management (TODO)
1. Admin clicks "Admin Console"
2. System shows:
   - Pending join requests
   - Member list with actions
   - Pricing rules editor
   - Allocation logs
   - Export tools

### Journey 4: Create New Group (TODO)
1. User clicks "Create Group"
2. Fills form:
   - Group name
   - Type (lane/building/village)
   - Description
   - Location
   - Initial pricing
3. System creates group
4. User becomes admin

### Journey 5: Join Existing Group (TODO)
1. User receives invitation link/code
2. Clicks "Join Group"
3. Selects meter to associate
4. Submits request
5. Waits for admin approval
6. Gets access to group

## 🎯 Next Implementation Steps

### Priority 1: Personal Dashboard
Create `/energy-sharing/my-group/page.tsx`:
- Energy flow visualization (Sankey diagram)
- Financial breakdown table
- Savings calculator
- Trading preferences form
- Monthly history chart

### Priority 2: Admin Console
Create `/energy-sharing/admin/page.tsx`:
- Member management table
- Join request approval interface
- Pricing rules editor
- Allocation logs viewer
- Export functionality

### Priority 3: History & Reports
Create `/energy-sharing/history/page.tsx`:
- Monthly allocation table
- Financial settlement history
- Export to CSV/Excel
- Filtering and search

### Priority 4: Group Creation
Create `/energy-sharing/create/page.tsx`:
- Multi-step form
- Group type selection
- Location input
- Pricing setup
- Confirmation

### Priority 5: Join Flow
Create `/energy-sharing/join/page.tsx`:
- Group discovery
- Invitation code input
- Meter selection
- Request submission

## 🔐 Privacy & Compliance

### GDPR Compliance
- Member data anonymized in group views
- Personal data only visible to owner
- Admin sees necessary data only
- Explicit consent for data sharing
- Right to export personal data
- Right to be forgotten

### Luxembourg Regulatory Framework
- Follows LU implementation of EU 2019/944
- Virtual allocation (no physical changes)
- Smart meter-based calculations
- Transparent pricing
- Audit trail for compliance
- Supplier/operator coordination

## 📈 Calculation Logic

### Energy Allocation (Monthly)
```
For each member:
1. Read smart meter data (production, consumption)
2. Calculate group surplus at each interval
3. Allocate surplus to members based on:
   - Demand at that time
   - Trading preferences
   - Group rules
4. Compute:
   - Energy from community
   - Energy to community
   - Residual from supplier
   - Residual to grid
```

### Financial Settlement
```
For each member:
1. Apply internal prices:
   - Cost = energy_from_community × internal_buy_price
   - Revenue = energy_to_community × internal_sell_price

2. Calculate baseline (without group):
   - Baseline cost = consumption × grid_tariff
   - Baseline revenue = production × feed_in_tariff

3. Compute savings:
   - Savings = (baseline_cost - community_cost) + 
               (community_revenue - baseline_revenue)
```

## 🚀 Deployment Checklist

### Before Production
- [ ] Connect to real database (PostgreSQL)
- [ ] Implement authentication
- [ ] Add real smart meter integration
- [ ] Set up regulatory compliance logging
- [ ] Configure email notifications
- [ ] Add data export functionality
- [ ] Implement audit trails
- [ ] Set up monitoring and alerts
- [ ] Complete all TODO pages
- [ ] User acceptance testing
- [ ] Security audit
- [ ] Performance testing
- [ ] GDPR compliance review

## 📚 Additional Resources

### Luxembourg Energy Framework
- [Luxembourg Energy Sharing Regulations](https://gouvernement.lu)
- [EU Directive 2019/944](https://eur-lex.europa.eu)
- [GDPR Compliance Guide](https://cnpd.public.lu)

### Technical Documentation
- Next.js App Router
- TypeScript Best Practices
- PostgreSQL Schema Design
- Smart Meter Integration APIs

## 🎉 Summary

The Energy Sharing Group feature is now accessible via the sidebar menu! 

**Current Status:**
- ✅ Navigation added
- ✅ Type system complete
- ✅ Mock data ready
- ✅ API routes functional
- ✅ Group overview page live
- ✅ Build successful

**To Access:**
1. Start dev server: `npm run dev`
2. Click "Energy Sharing" in sidebar
3. View group overview at `/energy-sharing`

**Next Steps:**
- Implement personal dashboard
- Build admin console
- Add history page
- Create group creation flow
- Implement join workflow

The foundation is solid and ready for the remaining features!
