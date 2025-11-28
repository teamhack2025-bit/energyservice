# ⚡ Watts Next - Energy Management Platform

<div align="center">



![Watts Next Logo](https://img.shields.io/badge/Watts%20Next-Energy%20Portal-blue?style=for-the-badge)

**AI-Powered Energy Management & Optimization Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.86-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

</div>

---

URL: https://energyserviceapi.vercel.app

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

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
│  │  (Next.js)   │  │ (React Native)│  │  (Next.js)  │          │
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
cd hacathon-customer-2025
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

4. **Run database migrations** (if using Supabase)
```bash
# Follow instructions in SUPABASE_SETUP.md
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

### Quick Setup Script

For first-time setup, run:
```bash
npm run setup  # If available, or follow manual steps above
```

---

## 📁 Project Structure

```
hacathon-customer-2025/
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

For complete API documentation, see [MOBILE_API_DOCUMENTATION.md](./MOBILE_API_DOCUMENTATION.md)

---

## 🔐 Environment Variables

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External Energy API
EXTERNAL_ENERGY_API_URL=https://energyserviceapi.vercel.app

# Weather API (Optional)
WEATHERAPI_KEY=your_weather_api_key
```

### Optional Variables

```env
# Sentry Error Tracking
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Default Location
NEXT_PUBLIC_DEFAULT_LOCATION=49.5022,5.9492
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Utilities
npm run generate-data # Generate mock data
npm run test-api     # Test API endpoints
```

### Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow TypeScript types
   - Use existing component patterns
   - Add proper error handling

3. **Test your changes**
```bash
npm run lint
npm test
npm run build
```

4. **Commit and push**
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Use Tailwind CSS for styling
- Follow the existing file structure
- Add JSDoc comments for complex functions

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup

Ensure all environment variables are set in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Other platforms: Follow their environment variable configuration

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Structure

```
__tests__/
├── components/      # Component tests
├── lib/            # Utility tests
└── api/            # API route tests
```

---

## 📚 Additional Documentation

- [Product Specification](./PRODUCT_SPECIFICATION.md) - Complete product spec
- [API Design](./API_DESIGN.md) - API documentation
- [Data Model](./DATA_MODEL.md) - Database schema
- [Mobile API Docs](./MOBILE_API_DOCUMENTATION.md) - Mobile app API reference
- [Setup Guide](./SUPABASE_SETUP.md) - Supabase setup instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

Built with ⚡ by the Watts Next team

---

## 🔗 Links

- **Production:** [Your production URL]
- **Staging:** [Your staging URL]
- **Documentation:** [Your docs URL]
- **API Docs:** [MOBILE_API_DOCUMENTATION.md](./MOBILE_API_DOCUMENTATION.md)

---

## 📞 Support

For support, email support@wattsnext.com or create an issue in the repository.

---

**Last Updated:** November 2025  
**Version:** 1.0.0
