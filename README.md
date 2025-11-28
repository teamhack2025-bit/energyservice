# ⚡ Watts Next - Energy As A Service

<div align="center">



![Watts Next Logo](https://img.shields.io/badge/Watts%20Next-Energy%20Portal-blue?style=for-the-badge)

**AI-Powered Energy Management & Optimization Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.86-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

</div>

---

URL: https://energyservice.vercel.app

---

## 🎯 Overview

**Watts Next** is a comprehensive energy management platform that empowers users to monitor, analyze, and optimize their energy consumption and production. Built with Next.js 14, TypeScript, and modern web technologies, it provides real-time insights, AI-powered forecasts, cost optimization scenarios, and sustainability tracking.

### Key Capabilities

- **Real-time Energy Monitoring** - Live dashboard with energy flow visualization
- **AI-Powered Forecasting** - Predictive analytics for consumption and production
- **Cost Optimization** - Investment scenarios with ROI analysis
- **Sustainability Tracking** - CO₂ reduction, trees saved, and efficiency metrics
- **Smart Home Integration** - Device management and control
- **Community Features** - P2P energy trading and sharing groups
- **Weather Integration** - Weather-based energy insights

---

## ✨ Features

### 🏠 Dashboard & Analytics
- Real-time energy flow visualization
- Historical consumption and production charts
- Net balance tracking (import/export)
- Financial summaries and cost tracking
- Multi-site support for businesses

### 🤖 AI Features
- **AI Forecast** - Predictive energy consumption and production forecasts
- **AI Cost Optimization** - Investment scenario analysis with ROI projections
- **AI Recommendations** - Personalized energy optimization suggestions
- **Next Hour Predictions** - Hourly consumption and cost predictions

### 📊 Energy Management
- Consumption analytics with detailed breakdowns
- Production monitoring (solar, battery, grid)
- Device status and management
- Energy sharing groups
- P2P energy marketplace

### 🌱 Sustainability
- CO₂ reduction tracking
- Trees saved calculations
- Water saved metrics
- Efficiency scores
- Sustainability leaderboard
- Environmental impact visualization

### 🌤️ Weather Integration
- Current weather conditions
- 5-day forecast
- Air quality data
- Weather-based energy insights

### 👥 Community & Trading
- P2P energy marketplace
- Energy sharing groups
- Trading history
- Community dashboard

### ⚙️ Admin Features
- Customer management
- User administration
- System monitoring
- Support ticket management

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │          │
│  │  (Next.js)   │  │(First screen)│  │  (Next.js)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    NEXT.JS APPLICATION LAYER                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              App Router (Pages & API Routes)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│  │
│  │  │ Dashboard│  │ Forecast │  │ Devices  │  │  Admin  ││  │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘│  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │         API Routes (Server Components)           │  │  │
│  │  │  /api/dashboard  /api/predictions  /api/devices │  │  │
│  │  │  /api/ai/*       /api/energy/*    /api/auth/*   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Component Layer                              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│  │
│  │  │  Layout  │  │  Charts  │  │  Energy  │  │  UI     ││  │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Service Layer                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │External  │  │Dashboard │  │Data      │              │  │
│  │  │Energy    │  │Service   │  │Transformer│             │  │
│  │  │Service   │  └──────────┘  └──────────┘              │  │
│  │  └──────────┘                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼──────────────────┐
│         │                  │                  │                  │
│  ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐          │
│  │  Supabase   │  │ External API │  │  Weather API  │          │
│  │  Database   │  │ (Energy      │  │  (WeatherAPI) │          │
│  │  + Auth     │  │  Service)    │  │               │          │
│  └─────────────┘  └──────────────┘  └───────────────┘          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              External Services                           │  │
│  │  • Energy Service API (energyserviceapi.vercel.app)      │  │
│  │  • Weather API (weatherapi.com)                         │  │
│  │  • Sentry (Error Tracking)                              │  │
│  │  • n8n (AI Chatbot Webhook)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Flow                          │
└─────────────────────────────────────────────────────────────┘

User Request
    │
    ▼
┌─────────────────┐
│  App Router     │  (Next.js App Router)
│  - Pages        │
│  - API Routes   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
    ┌────▼────┐      ┌────▼────┐
    │  Pages  │      │ API      │
    │         │      │ Routes   │
    └────┬────┘      └────┬────┘
         │                 │
         │                 │
    ┌────▼─────────────────▼────┐
    │   Components              │
    │   - Layout                │
    │   - Charts                │
    │   - Energy Components     │
    │   - UI Components         │
    └────┬──────────────────────┘
         │
    ┌────▼────┐
    │ Services│
    │ - API   │
    │ - Data  │
    │ - Utils │
    └────┬────┘
         │
    ┌────▼────┐
    │ External│
    │ APIs    │
    └─────────┘
```

### Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│      Next.js API Route Handler      │
│  (app/api/*/route.ts)               │
└──────┬──────────────────────────────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│  Supabase    │    │  External API    │
│  Client      │    │  (Energy Service)│
└──────┬───────┘    └────────┬─────────┘
       │                     │
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Data Transform│
         │  & Validation  │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  JSON Response │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  React Component│
         │  (Rendered)    │
         └────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Charts:** Recharts 2.15
- **Animations:** Framer Motion 12.23
- **Date Handling:** date-fns 3.0

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage

### External Services
- **Energy API:** energyserviceapi.vercel.app
- **Weather API:** weatherapi.com
- **Error Tracking:** Sentry
- **AI Chatbot:** n8n Webhook

### Development Tools
- **Package Manager:** npm
- **Testing:** Vitest
- **Linting:** ESLint
- **Type Checking:** TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and auth)
- Environment variables configured

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
EXTERNAL_ENERGY_API_URL=https://energyserviceapi.vercel.app
WEATHERAPI_KEY=your_weather_api_key

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
energyservice/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Public routes
│   │   ├── dashboard/            # Main dashboard
│   │   ├── ai-forecast/          # AI forecasting
│   │   ├── ai-cost-optimization/ # Cost optimization
│   │   ├── consumption/          # Consumption analytics
│   │   ├── energy-home/          # Smart home dashboard
│   │   ├── sustainability/      # Sustainability board
│   │   ├── weather/              # Weather integration
│   │   └── ...                   # Other pages
│   ├── api/                      # API routes
│   │   ├── dashboard/            # Dashboard APIs
│   │   ├── ai/                   # AI endpoints
│   │   ├── energy/               # Energy APIs
│   │   ├── devices/              # Device APIs
│   │   ├── sustainability/      # Sustainability APIs
│   │   └── ...                   # Other APIs
│   ├── admin/                    # Admin panel
│   ├── auth/                     # Auth pages
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── AppShell.tsx         # Main app shell
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── Header.tsx           # Top header
│   ├── charts/                  # Chart components
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   └── ForecastLineChart.tsx
│   ├── energy/                  # Energy components
│   ├── sustainability/          # Sustainability components
│   ├── common/                  # Common components
│   │   └── Logo.tsx            # App logo
│   └── ui/                      # UI components
│
├── lib/                         # Utilities and services
│   ├── services/                # Service classes
│   │   ├── ExternalEnergyService.ts
│   │   ├── DashboardService.ts
│   │   └── DataTransformer.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── useTheme.ts         # Theme management
│   ├── supabase/               # Supabase utilities
│   └── utils/                  # Helper functions
│
├── types/                       # TypeScript types
│   ├── energy.ts
│   ├── external-api.ts
│   └── index.ts
│
├── public/                     # Static assets
├── scripts/                    # Utility scripts
└── supabase/                   # Database migrations
```

---

## 📡 API Documentation

### Internal API Routes

The application provides Next.js API routes that proxy to external services:

#### Dashboard APIs
- `GET /api/dashboard/overview` - Dashboard overview data
- `GET /api/dashboard/realtime` - Real-time energy data

#### AI APIs
- `GET /api/predictions` - Energy predictions
- `GET /api/ai/energy-insights?date={date}` - AI insights and recommendations
- `POST /api/ai/optimize?scenario={scenario}` - Cost optimization analysis

#### Energy APIs
- `GET /api/energy/realtime` - Real-time energy flow
- `GET /api/energy/smart-home` - Smart home data

#### Device APIs
- `GET /api/devices` - List all devices

#### Sustainability APIs
- `GET /api/sustainability/metrics` - Sustainability metrics
- `GET /api/sustainability/devices` - Device sustainability data
- `GET /api/sustainability/leaderboard` - Leaderboard data

#### Weather APIs
- `GET /api/weather?q={location}` - Weather data

### External API Integration

The application integrates with:
- **Energy Service API:** `https://energyserviceapi.vercel.app`
- **Weather API:** `https://api.weatherapi.com`

For complete API documentation, see [energyserviceapi](https://github.com/teamhack2025-bit/energyserviceapi)

---

**Last Updated:** November 2025  
**Version:** 1.0.0
