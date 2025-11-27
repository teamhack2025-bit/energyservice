# Energy Customer Portal - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will automatically redirect to `/dashboard`.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── consumption/        # Consumption analytics
│   ├── production/         # Production monitoring
│   ├── net-balance/        # Net balance & financials
│   ├── billing/            # Billing & payments
│   ├── contracts/          # Contracts & tariffs
│   ├── devices/            # Devices & assets
│   ├── forecast/           # Forecast & insights
│   ├── notifications/      # Notifications center
│   ├── support/            # Support & help
│   └── settings/          # Settings
├── components/             # React components
│   ├── layout/            # Layout components (Sidebar, Header, AppShell)
│   ├── ui/                # UI components (Cards, Buttons, etc.)
│   └── charts/            # Chart components
├── lib/                   # Utilities
│   └── mockData.ts        # Mock data generators
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Features

### ✅ Implemented (UI Only)

- **Dashboard**: Overview with metrics, charts, and quick actions
- **Consumption**: Analytics with charts, filters, and breakdowns
- **Production**: Production monitoring with live status and charts
- **Net Balance**: Unified view of import/export and financials
- **Billing**: Invoice list, payment methods, and auto-pay settings
- **Contracts**: Contract details and tariff information
- **Devices**: Device grid with status indicators
- **Forecast**: Forecast charts and optimization insights
- **Notifications**: Notification center with read/unread states
- **Support**: FAQ categories and ticket creation
- **Settings**: Settings overview page

### 🎨 Design System

- **Colors**: Primary blue (#0066CC), Success green, Warning orange, Danger red
- **Typography**: Inter font family
- **Components**: Reusable card, chart, and metric components
- **Responsive**: Mobile-first design with breakpoints

### 📊 Charts

- Line charts for time-series data
- Bar charts for comparisons
- Donut charts for breakdowns
- All charts use Recharts library

## Mock Data

The app uses mock data generators in `lib/mockData.ts`:
- Consumption data (30 days)
- Production data (30 days)
- Net balance calculations
- Sample invoices, devices, notifications, contracts

## Weather Integration

The app includes weather data from OpenWeatherMap API:
- Current weather conditions
- 5-day forecast
- Sunrise/sunset times
- Weather widget on Dashboard and Production pages

**Setup:** See [WEATHER_SETUP.md](./WEATHER_SETUP.md) for detailed instructions.

**Note:** The app works with mock weather data if no API key is configured.

## Next Steps

To connect to a real backend:

1. Replace mock data calls with API calls
2. Implement authentication
3. Add form handling for user inputs
4. Connect to real-time data sources (WebSocket)
5. Add error handling and loading states

## Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`

## Technologies Used

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (charts)
- **Lucide React** (icons)
- **date-fns** (date formatting)

