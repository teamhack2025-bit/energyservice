# Design Document - P2P Energy Trading & Local Energy Communities

## Overview

The P2P Energy Trading system enables customers to participate in Local Energy Communities, trade energy with neighbors, and optimize their energy costs through automated rules. The system maintains privacy through anonymization while providing transparency in pricing and trading activity.

## Architecture

### System Components

```
Frontend (Next.js)
├── Community Dashboard
├── P2P Marketplace
├── Trading Rules Manager
├── Trading History
├── Community Insights
└── Legal Information

Backend APIs
├── /api/community/stats
├── /api/community/members
├── /api/trading/offers
├── /api/trading/rules
├── /api/trading/history
├── /api/trading/execute
└── /api/pricing/signals

Database (Supabase)
├── communities
├── community_members
├── trading_offers
├── trading_rules
├── trades
├── pricing_signals
└── community_stats
```

## Data Models

### Community
```typescript
interface Community {
  id: string
  name: string
  description: string
  district: string
  postcode_zone: string
  created_at: string
  member_count: number
  total_capacity_kwh: number
  is_active: boolean
}
```

### CommunityMember
```typescript
interface CommunityMember {
  id: string
  community_id: string
  user_id: string
  anonymized_id: string // e.g., "House A17"
  role: 'prosumer' | 'consumer'
  joined_at: string
  reputation_score: number
  is_active: boolean
}
```

### TradingOffer
```typescript
interface TradingOffer {
  id: string
  community_id: string
  member_id: string
  type: 'buy' | 'sell'
  quantity_kwh: number
  price_per_kwh: number
  time_window_start: string
  time_window_end: string
  status: 'active' | 'matched' | 'expired' | 'cancelled'
  created_at: string
}
```

### TradingRule
```typescript
interface TradingRule {
  id: string
  user_id: string
  type: 'buy' | 'sell'
  max_quantity_kwh?: number
  max_price?: number
  min_price?: number
  min_battery_soc?: number
  time_windows: string[]
  is_enabled: boolean
  created_at: string
  last_matched_at?: string
}
```

### Trade
```typescript
interface Trade {
  id: string
  community_id: string
  buyer_id: string
  seller_id: string
  quantity_kwh: number
  price_per_kwh: number
  total_amount: number
  executed_at: string
  settlement_status: 'pending' | 'settled' | 'failed'
}
```

### PricingSignal
```typescript
interface PricingSignal {
  id: string
  community_id: string
  timestamp: string
  p2p_price: number
  grid_import_price: number
  grid_export_price: number
  forecast_next_hour: number
  signal: 'buy' | 'sell' | 'neutral'
}
```

## Components and Interfaces

### 1. Community Dashboard (`/community`)

**Components:**
- `CommunityOverview.tsx` - Key metrics cards
- `CommunityCharts.tsx` - Production/consumption charts
- `CommunityMap.tsx` - Visual member map
- `CommunityMembers.tsx` - Member list

**Features:**
- Period selector (today/week/month)
- Real-time metric updates
- Interactive charts
- Member anonymization

### 2. P2P Marketplace (`/community/marketplace`)

**Components:**
- `MarketplaceHeader.tsx` - Current price display
- `BuyOffers.tsx` - Active buy offers list
- `SellOffers.tsx` - Active sell offers list
- `OfferFilters.tsx` - Filter controls
- `CreateOffer.tsx` - New offer form

**Features:**
- Real-time offer updates
- Filter by time/price/type
- Quick trade execution
- Offer creation wizard

### 3. Trading Rules (`/community/rules`)

**Components:**
- `RulesList.tsx` - Active rules display
- `RuleEditor.tsx` - Create/edit rules
- `RuleSimulator.tsx` - Outcome predictions
- `RuleToggle.tsx` - Enable/disable controls

**Features:**
- Rule templates
- Simulation engine
- Historical analysis
- One-click enable/disable

### 4. Trading History (`/community/history`)

**Components:**
- `TradesList.tsx` - Trade history table
- `TradingStats.tsx` - Aggregated statistics
- `SavingsCalculator.tsx` - Savings display
- `TradingCharts.tsx` - Historical charts

**Features:**
- Filterable trade list
- Export to CSV
- Savings calculations
- Comparison charts

### 5. Community Insights (`/community/insights`)

**Components:**
- `CommunityMetrics.tsx` - Aggregate stats
- `Leaderboards.tsx` - Anonymous rankings
- `ImpactDisplay.tsx` - CO₂ and savings
- `ParticipationRate.tsx` - Engagement metrics

**Features:**
- Anonymized leaderboards
- Environmental impact
- Participation tracking
- Community achievements

## Error Handling

### Trading Errors
- Insufficient balance
- Rule conflicts
- Offer expiration
- Network failures
- Price validation errors

### Privacy Errors
- Anonymization failures
- Data exposure risks
- Consent violations

### System Errors
- API timeouts
- Database connection issues
- Real-time update failures

## Testing Strategy

### Unit Tests
- Trading rule matching logic
- Price calculation functions
- Anonymization utilities
- Savings calculations
- Data transformations

### Integration Tests
- API endpoint responses
- Database operations
- Real-time updates
- Trading execution flow

### Property-Based Tests
- Trading rule matching
- Price calculations
- Anonymization consistency
- Data privacy guarantees

## Security Considerations

- All trading data encrypted in transit and at rest
- Anonymization applied at database query level
- Rate limiting on API endpoints
- Authentication required for all trading operations
- Audit logging for regulatory compliance
- GDPR-compliant data retention policies
