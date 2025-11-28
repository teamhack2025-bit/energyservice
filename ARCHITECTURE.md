# 🏗️ Watts Next - Architecture Documentation

## System Architecture Overview

Watts Next is built as a modern, scalable energy management platform using Next.js 14 with the App Router pattern. The architecture follows a layered approach with clear separation of concerns.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATIONS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      │
│  │   Web App    │      │  Mobile App  │      │  Admin Panel │      │
│  │  (Next.js)   │      │(React Native)│      │  (Next.js)  │      │
│  │              │      │              │      │              │      │
│  │ • Dashboard  │      │ • Dashboard  │      │ • Customer   │      │
│  │ • AI Forecast│      │ • Real-time  │      │   Management │      │
│  │ • Devices    │      │ • Alerts     │      │ • Analytics  │      │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘      │
│         │                      │                      │              │
└─────────┼──────────────────────┼──────────────────────┼──────────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   HTTPS/REST API       │
                    └────────────┬────────────┘
                                 │
┌────────────────────────────────┼──────────────────────────────────┐
│                    NEXT.JS APPLICATION SERVER                       │
├────────────────────────────────┼──────────────────────────────────┤
│                                 │                                  │
│  ┌──────────────────────────────▼──────────────────────────────┐  │
│  │              App Router (Next.js 14)                        │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │              Pages (Server Components)               │  │  │
│  │  │  • Dashboard Page                                    │  │  │
│  │  │  • AI Forecast Page                                  │  │  │
│  │  │  • Cost Optimization Page                            │  │  │
│  │  │  • Energy Home Page                                  │  │  │
│  │  │  • Sustainability Page                                │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │           API Routes (Server Actions)                │  │  │
│  │  │  /api/dashboard/*    /api/ai/*                      │  │  │
│  │  │  /api/energy/*      /api/devices/*                  │  │  │
│  │  │  /api/sustainability/*  /api/auth/*                 │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │         Client Components (React)                     │  │  │
│  │  │  • Interactive UI Components                          │  │  │
│  │  │  • Charts & Visualizations                            │  │  │
│  │  │  • Forms & Inputs                                     │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                 │                                  │
│  ┌──────────────────────────────▼──────────────────────────────┐  │
│  │              Service Layer                                  │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  External    │  │  Dashboard   │  │  Data        │   │  │
│  │  │  Energy      │  │  Service     │  │  Transformer │   │  │
│  │  │  Service     │  └──────────────┘  └──────────────┘   │  │
│  │  └──────────────┘                                         │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Supabase    │  │  House ID     │  │  Auth        │   │  │
│  │  │  Client      │  │  Manager      │  │  Service     │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┼──────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼──────────┐  ┌───────▼───────┐  ┌─────────▼──────────┐
│   Supabase          │  │  External API  │  │  Weather API      │
│   (PostgreSQL)      │  │  (Energy       │  │  (WeatherAPI.com) │
│                     │  │   Service)     │  │                    │
│  • Users            │  │                │  │  • Current        │
│  • Customers        │  │  • Dashboard   │  │    Weather         │
│  • Devices          │  │  • Devices    │  │  • Forecast        │
│  • Energy Data      │  │  • Predictions │  │  • Air Quality     │
│  • Auth             │  │  • AI Insights│  │                    │
└─────────────────────┘  └───────────────┘  └────────────────────┘
```

---

## Component Architecture

### Page Structure

```
app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Landing page
│
├── dashboard/
│   └── page.tsx                  # Dashboard (Server Component)
│
├── ai-forecast/
│   └── page.tsx                  # AI Forecast (Client Component)
│
├── ai-cost-optimization/
│   └── page.tsx                  # Cost Optimization (Client Component)
│
└── api/                          # API Routes
    ├── dashboard/
    │   └── route.ts              # Dashboard API
    ├── ai/
    │   ├── energy-insights/
    │   │   └── route.ts          # AI Insights API
    │   └── optimize/
    │       └── route.ts          # Cost Optimization API
    └── ...
```

### Component Hierarchy

```
AppShell (Layout)
├── Sidebar
│   ├── Logo
│   ├── Navigation Items
│   └── Theme Toggle
├── Header
│   ├── Notifications
│   └── User Menu
└── Main Content
    ├── Page Components
    │   ├── Dashboard
    │   ├── AI Forecast
    │   └── ...
    └── Shared Components
        ├── Charts
        ├── Cards
        └── Forms
```

---

## Data Flow Architecture

### Request Flow

```
1. User Action (Click, Form Submit)
   │
   ▼
2. Client Component Event Handler
   │
   ▼
3. API Route Call (fetch('/api/...'))
   │
   ▼
4. Next.js API Route Handler
   │
   ├─► Authentication Check
   │   └─► Supabase Auth
   │
   ├─► Service Layer
   │   ├─► External API Call
   │   ├─► Database Query
   │   └─► Data Transformation
   │
   ▼
5. Response Processing
   │
   ▼
6. Component State Update
   │
   ▼
7. UI Re-render
```

### Data Fetching Patterns

#### Server Components (Default)
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetch('/api/dashboard/overview')
  return <Dashboard data={data} />
}
```

#### Client Components (Interactive)
```typescript
// app/ai-forecast/page.tsx
'use client'
export default function AIForecastPage() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/predictions')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <ForecastChart data={data} />
}
```

#### API Routes (Server Actions)
```typescript
// app/api/dashboard/overview/route.ts
export async function GET() {
  const service = new DashboardService()
  const data = await service.getDashboardData()
  return NextResponse.json(data)
}
```

---

## Service Layer Architecture

### Service Classes

```
lib/services/
├── ExternalEnergyService.ts      # External API integration
│   ├── getDashboardData()
│   ├── fetchWithRetry()
│   └── validateResponse()
│
├── DashboardService.ts            # Dashboard data aggregation
│   └── getDashboardData()
│
├── DataTransformer.ts             # Data transformation
│   ├── transformExternalToInternal()
│   └── transformQuickActions()
│
└── HouseIdManager.ts             # House ID management
    └── getHouseIdForUser()
```

### Service Flow

```
API Route
  │
  ▼
Service Class
  │
  ├─► External API Call
  │   └─► Error Handling & Retry
  │
  ├─► Database Query
  │   └─► Supabase Client
  │
  └─► Data Transformation
      └─► Format for Frontend
```

---

## Authentication Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Authentication Flow                        │
└─────────────────────────────────────────────────────────┘

1. User Login
   │
   ▼
2. Supabase Auth
   │
   ├─► Email/Password
   ├─► Google OAuth
   └─► Magic Link
   │
   ▼
3. JWT Token Generation
   │
   ├─► Access Token (Short-lived)
   └─► Refresh Token (Long-lived)
   │
   ▼
4. Token Storage
   │
   ├─► Browser: localStorage/cookies
   └─► Server: Session validation
   │
   ▼
5. Protected Route Access
   │
   ├─► Middleware Check
   └─► API Route Validation
```

### Auth Middleware

```typescript
// lib/middleware/auth.ts
export async function requireAuth(request: Request) {
  const token = extractToken(request)
  const { data: { user } } = await supabase.auth.getUser(token)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
```

---

## State Management Architecture

### State Management Strategy

```
┌─────────────────────────────────────────────────────────┐
│              State Management Layers                    │
└─────────────────────────────────────────────────────────┘

1. Server State
   │
   ├─► Next.js Server Components
   ├─► API Routes
   └─► Database Queries
   │
2. Client State
   │
   ├─► React useState (Local)
   ├─► React Context (Shared)
   └─► URL State (Query Params)
   │
3. Form State
   │
   └─► React Hook Form
   │
4. Theme State
   │
   └─► Custom Hook (useTheme)
       └─► localStorage
```

### State Flow Example

```
Component Mount
  │
  ▼
useState Initialization
  │
  ▼
useEffect Data Fetching
  │
  ▼
API Call
  │
  ▼
State Update (setState)
  │
  ▼
Component Re-render
```

---

## API Integration Architecture

### External API Integration

```
┌─────────────────────────────────────────────────────────┐
│         External API Integration Pattern                │
└─────────────────────────────────────────────────────────┘

Client Component
  │
  ▼
Next.js API Route (/api/...)
  │
  ├─► Authentication
  ├─► Parameter Validation
  └─► Service Layer
      │
      ▼
External API Service
  │
  ├─► Request Construction
  ├─► Retry Logic
  ├─► Error Handling
  └─► Response Validation
      │
      ▼
Data Transformer
  │
  ├─► Format Conversion
  ├─► Field Mapping
  └─► Type Safety
      │
      ▼
Response to Client
```

### API Route Pattern

```typescript
// app/api/example/route.ts
export async function GET(request: NextRequest) {
  try {
    // 1. Authentication
    const user = await requireAuth(request)
    
    // 2. Parameter Extraction
    const { searchParams } = request.nextUrl
    const param = searchParams.get('param')
    
    // 3. Service Call
    const service = new ExampleService()
    const data = await service.getData(param)
    
    // 4. Response
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

## Database Architecture

### Supabase Schema

```
┌─────────────────────────────────────────────────────────┐
│              Database Schema (Simplified)               │
└─────────────────────────────────────────────────────────┘

auth.users (Supabase Auth)
  │
  ├─► customers (1:1)
  │   ├─► id
  │   ├─► email
  │   ├─► name
  │   └─► auth_user_id → auth.users.id
  │
  └─► sites (1:many)
      ├─► id
      ├─► customer_id
      └─► address
          │
          └─► devices (1:many)
              ├─► id
              ├─► site_id
              └─► type
```

### Data Access Pattern

```typescript
// lib/supabase-client.ts
export async function getCurrentCustomerId() {
  const user = await getCurrentUser()
  const { data } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  
  return data?.id
}
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│              Security Architecture                       │
└─────────────────────────────────────────────────────────┘

1. Network Layer
   ├─► HTTPS/TLS
   └─► CORS Configuration
   │
2. Authentication Layer
   ├─► JWT Tokens
   ├─► Refresh Tokens
   └─► Session Management
   │
3. Authorization Layer
   ├─► Role-Based Access Control (RBAC)
   ├─► Row Level Security (RLS)
   └─► API Route Guards
   │
4. Input Validation Layer
   ├─► TypeScript Types
   ├─► Runtime Validation
   └─► SQL Injection Prevention
   │
5. Output Sanitization
   ├─► XSS Prevention
   └─► Data Sanitization
```

---

## Performance Architecture

### Optimization Strategies

```
┌─────────────────────────────────────────────────────────┐
│              Performance Optimizations                   │
└─────────────────────────────────────────────────────────┘

1. Server-Side Rendering (SSR)
   └─► Next.js Server Components

2. Static Generation (SSG)
   └─► Pre-rendered pages

3. Incremental Static Regeneration (ISR)
   └─► Revalidate on interval

4. Client-Side Caching
   ├─► React Query
   └─► Browser Cache

5. Code Splitting
   ├─► Dynamic Imports
   └─► Route-based Splitting

6. Image Optimization
   └─► Next.js Image Component

7. API Response Caching
   ├─► HTTP Cache Headers
   └─► Service Worker Cache
```

---

## Error Handling Architecture

### Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│              Error Handling Strategy                     │
└─────────────────────────────────────────────────────────┘

1. API Errors
   │
   ├─► Try-Catch Blocks
   ├─► Error Logging (Sentry)
   └─► User-Friendly Messages
   │
2. Component Errors
   │
   ├─► Error Boundaries
   └─► Fallback UI
   │
3. Validation Errors
   │
   ├─► Form Validation
   └─► API Validation
   │
4. Network Errors
   │
   ├─► Retry Logic
   └─► Offline Handling
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────┐
│              Deployment Flow                            │
└─────────────────────────────────────────────────────────┘

Git Repository
  │
  ▼
Vercel (CI/CD)
  │
  ├─► Build Process
  │   ├─► npm install
  │   ├─► npm run build
  │   └─► Static Optimization
  │
  ├─► Environment Variables
  │   └─► .env.local → Vercel Config
  │
  └─► Deployment
      ├─► Edge Functions
      ├─► Serverless Functions
      └─► Static Assets (CDN)
```

---

## Monitoring & Observability

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────┐
│              Monitoring Architecture                     │
└─────────────────────────────────────────────────────────┘

1. Error Tracking
   └─► Sentry Integration

2. Performance Monitoring
   ├─► Vercel Analytics
   └─► Web Vitals

3. Logging
   ├─► Console Logs (Development)
   └─► Structured Logs (Production)

4. Analytics
   └─► User Behavior Tracking
```

---

## Future Architecture Considerations

### Scalability

- **Horizontal Scaling:** Stateless API routes enable easy scaling
- **Database Scaling:** Supabase handles database scaling
- **CDN:** Static assets served via Vercel CDN
- **Caching:** Implement Redis for session/data caching

### Microservices Migration

If needed, the architecture can be split into:
- User Service
- Energy Data Service
- AI/ML Service
- Notification Service
- Billing Service

---

**Last Updated:** November 2025  
**Version:** 1.0.0

