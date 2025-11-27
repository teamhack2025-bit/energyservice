# Community Navigation Guide

## How to Access P2P Energy Trading Features

### Main Navigation
The Community section has been added to the main sidebar navigation menu. You can access it from:

**Sidebar Menu → Community** (4th item, after Weather)

### Available Pages

#### 1. Community Dashboard
**URL:** `/community`

**Features:**
- Community overview with key metrics
- Real-time production and consumption data
- Energy flow visualization charts
- Current market price and signals
- Personal trading summary
- Recent community trades
- Anonymized member list

**How to Access:**
1. Click "Community" in the sidebar
2. Or navigate directly to `http://localhost:3000/community`

#### 2. P2P Marketplace
**URL:** `/community/marketplace`

**Features:**
- Real-time buy and sell offers
- Advanced filtering (time, price, energy type, location)
- Current market price with trends
- Supply/demand indicators
- Quick trade actions

**How to Access:**
1. From Community Dashboard, click on any offer
2. Or navigate directly to `http://localhost:3000/community/marketplace`
3. Or add a "Marketplace" link to the dashboard (future enhancement)

### Testing the Features

#### Start the Development Server
```bash
npm run dev
```

#### Navigate to Community Pages
1. Open browser to `http://localhost:3000`
2. Login (if authentication is enabled)
3. Click "Community" in the sidebar
4. Explore the dashboard and marketplace

### What You'll See

#### Community Dashboard
- **Header:** Community name, location, member count
- **Alerts:** Important notifications (price spikes, surplus energy)
- **Metrics Cards:** 
  - Community Production (kWh)
  - Energy Traded (kWh)
  - Community Savings (€)
  - Renewable Share (%)
- **Charts:**
  - Energy Flow Overview (pie chart)
  - Production Sources (pie chart)
- **Market Conditions:**
  - Current P2P price
  - Grid import/export prices
  - Market signals (good time to buy/sell)
- **Personal Summary:**
  - Energy bought/sold this month
  - Net balance and savings
- **Recent Trades:** Last 5 community trades
- **Members:** Anonymized member cards with reputation

#### P2P Marketplace
- **Price Header:**
  - Current P2P price with trend
  - Price comparison with grid
  - 24-hour statistics
- **Filters:**
  - Time window (now, today, week)
  - Price range
  - Energy type
  - Location preference
- **Buy Offers:** List of members wanting to buy energy
- **Sell Offers:** List of members selling energy
- **Recent Trades:** Latest marketplace activity

### Mock Data

The system uses realistic mock data that includes:
- 127 community members (89 active)
- 20 visible members with anonymized IDs
- 8 buy offers
- 12 sell offers
- 15 recent trades
- Real-time price signals
- Market statistics

### Navigation Flow

```
Sidebar
  └─ Community
       ├─ Dashboard (default)
       │    ├─ View metrics
       │    ├─ See charts
       │    ├─ Check prices
       │    └─ Browse members
       │
       └─ Marketplace
            ├─ Filter offers
            ├─ View buy offers
            ├─ View sell offers
            └─ Execute trades
```

### Future Navigation Enhancements

Planned additions:
- Trading Rules page (`/community/rules`)
- Trading History page (`/community/history`)
- Community Insights page (`/community/insights`)
- Legal Information page (`/community/legal`)
- Quick links from dashboard to marketplace
- Breadcrumb navigation
- Mobile menu support

### Mobile Access

The community pages are fully responsive:
- Sidebar collapses to hamburger menu on mobile
- Charts adapt to smaller screens
- Cards stack vertically
- Touch-friendly controls

### Keyboard Navigation

All interactive elements support keyboard navigation:
- Tab through menu items
- Enter to activate links
- Arrow keys for filters
- Escape to close modals (future)

## Quick Start Testing

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Click "Community" in sidebar**

4. **Explore features:**
   - View community metrics
   - Check current prices
   - Browse member list
   - Navigate to marketplace
   - Filter offers
   - View trading activity

## Troubleshooting

### Can't see Community menu item?
- Refresh the page
- Clear browser cache
- Check that Sidebar.tsx was updated
- Verify the build completed successfully

### Page not loading?
- Check console for errors
- Verify API routes are working
- Check that all components are imported correctly

### Data not showing?
- Mock data generators should work automatically
- Check browser console for API errors
- Verify `/api/community/dashboard` returns data

## Next Steps

After testing the current features, you can:
1. Continue implementing remaining tasks (Trading Rules, History, Insights)
2. Add real database integration
3. Implement actual trading logic
4. Add user authentication
5. Connect to real energy data sources
6. Deploy to production

---

**Note:** The Community feature is currently using mock data. In production, this would connect to real community data, trading systems, and user accounts.
