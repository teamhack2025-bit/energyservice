# 🔧 Watts Next - Technical Documentation

Complete technical documentation for all technologies, integrations, and configurations used in the Watts Next energy management platform.

---

## 📋 Table of Contents

1. [Technology Stack](#technology-stack)
2. [Next.js Configuration](#nextjs-configuration)
3. [React Patterns](#react-patterns)
4. [Supabase & PostgreSQL](#supabase--postgresql)
5. [Vercel Deployment](#vercel-deployment)
6. [n8n Integration](#n8n-integration)
7. [OpenAI Integration](#openai-integration)
8. [Sentry Error Tracking](#sentry-error-tracking)
9. [External APIs](#external-apis)
10. [Development Tools](#development-tools)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## 🛠️ Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0.4 | React framework with App Router |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.3.3 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **Supabase** | 2.86.0 | Backend-as-a-Service (Database + Auth) |
| **PostgreSQL** | (via Supabase) | Relational database |
| **Vercel** | - | Hosting & deployment platform |
| **Sentry** | 10.27.0 | Error tracking & monitoring |
| **Recharts** | 2.15.4 | Chart library |
| **date-fns** | 3.0.6 | Date manipulation |
| **Lucide React** | 0.303.0 | Icon library |

### External Services

- **Energy Service API:** `energyserviceapi.vercel.app`
- **Weather API:** `weatherapi.com`
- **n8n:** `teamhack2025.app.n8n.cloud` (AI Chatbot)
- **OpenAI:** (via n8n workflow)

---

## ⚛️ Next.js Configuration

### App Router Structure

Watts Next uses Next.js 14 App Router pattern:

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Landing page
├── (routes)/               # Route groups
│   ├── dashboard/
│   ├── ai-forecast/
│   └── ...
└── api/                    # API routes
    └── [route]/
        └── route.ts
```

### Key Configuration Files

#### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com',
        pathname: '/weather/**',
      },
    ],
  },
}

// Sentry Configuration
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    org: "team-hack",
    project: "javascript-nextjs",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
```

### Server vs Client Components

**Server Components (Default):**
- No 'use client' directive
- Can directly access database/APIs
- Rendered on server
- Smaller bundle size

```typescript
// app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  const data = await fetch('/api/dashboard/overview')
  return <Dashboard data={data} />
}
```

**Client Components:**
- Requires 'use client' directive
- Interactive features (hooks, events)
- Browser-only APIs

```typescript
// app/ai-forecast/page.tsx (Client Component)
'use client'
export default function AIForecastPage() {
  const [data, setData] = useState(null)
  // ... interactive logic
}
```

### API Routes Pattern

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0 // Disable caching
export const dynamic = 'force-dynamic' // Force dynamic rendering

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ data: 'example' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Handle POST request
  return NextResponse.json({ success: true })
}
```

### Route Handlers

- **GET:** Fetch data
- **POST:** Create/update data
- **PUT:** Update data
- **DELETE:** Delete data
- **PATCH:** Partial update

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Auth check, redirects, etc.
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## ⚛️ React Patterns

### Component Patterns

#### Server Component Pattern
```typescript
// app/example/page.tsx
import { Suspense } from 'react'

export default async function ExamplePage() {
  return (
    <Suspense fallback={<Loading />}>
      <DataComponent />
    </Suspense>
  )
}
```

#### Client Component Pattern
```typescript
// components/Example.tsx
'use client'
import { useState, useEffect } from 'react'

export default function Example() {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // Side effects
  }, [])
  
  return <div>{/* UI */}</div>
}
```

### Custom Hooks

```typescript
// lib/hooks/useTheme.ts
'use client'
import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved as 'light' | 'dark')
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  return { theme, toggleTheme }
}
```

### State Management

**Local State:**
```typescript
const [data, setData] = useState(null)
```

**URL State:**
```typescript
const searchParams = useSearchParams()
const filter = searchParams.get('filter')
```

**Context (Shared State):**
```typescript
const ThemeContext = createContext()
```

### Performance Optimization

**Memoization:**
```typescript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
```

**Code Splitting:**
```typescript
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false
})
```

---

## 🗄️ Supabase & PostgreSQL

### Supabase Setup

#### 1. Project Configuration

```typescript
// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 2. Server-Side Client

```typescript
// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

#### 3. Browser Client (SSR)

```typescript
// lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Database Schema

#### Core Tables

```sql
-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own customer data"
ON customers FOR SELECT
USING (auth.uid() = auth_user_id);
```

### Authentication Patterns

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

#### Google OAuth
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

#### Sign Out
```typescript
await supabase.auth.signOut()
```

### Database Queries

#### Select Query
```typescript
const { data, error } = await supabase
  .from('customers')
  .select('*')
  .eq('email', 'user@example.com')
  .single()
```

#### Insert Query
```typescript
const { data, error } = await supabase
  .from('customers')
  .insert({ email: 'new@example.com', name: 'New User' })
  .select()
```

#### Update Query
```typescript
const { data, error } = await supabase
  .from('customers')
  .update({ name: 'Updated Name' })
  .eq('id', customerId)
```

#### Delete Query
```typescript
const { error } = await supabase
  .from('customers')
  .delete()
  .eq('id', customerId)
```

### Real-time Subscriptions

```typescript
const subscription = supabase
  .channel('customers')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'customers' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

---

## 🚀 Vercel Deployment

### Deployment Configuration

#### `vercel.json` (if needed)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### Environment Variables Setup

1. **Go to Vercel Dashboard**
2. **Select Project → Settings → Environment Variables**
3. **Add Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EXTERNAL_ENERGY_API_URL=https://energyserviceapi.vercel.app
WEATHERAPI_KEY=your_weather_api_key
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Deployment Process

1. **Connect Repository**
   - Link GitHub/GitLab/Bitbucket repository
   - Vercel auto-detects Next.js

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Deploy**
   - Automatic on push to main branch
   - Manual deployment available

### Vercel Features Used

- **Edge Functions:** For API routes
- **Serverless Functions:** Automatic scaling
- **CDN:** Static asset delivery
- **Preview Deployments:** For pull requests
- **Analytics:** Built-in performance monitoring

### Custom Domain Setup

1. **Add Domain in Vercel Dashboard**
2. **Configure DNS Records**
   - A Record: `@ → 76.76.21.21`
   - CNAME: `www → cname.vercel-dns.com`
3. **SSL Certificate:** Automatic via Vercel

---

## 🔄 n8n Integration

### n8n Workflow Setup

Watts Next integrates with n8n for AI chatbot functionality.

#### Webhook Configuration

```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { message } = await request.json()
  
  // Try multiple payload formats for n8n compatibility
  const payloads = [
    { chatInput: message },
    { message: message },
    { text: message },
    { query: message },
    { input: message }
  ]
  
  const webhookUrl = 'https://teamhack2025.app.n8n.cloud/webhook/a2dbb0bd-9d3e-4736-a5d4-bc97913a6aa0/chat'
  
  for (const payload of payloads) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const data = await response.json()
        // Extract message from various possible formats
        const botMessage = 
          data.output ||
          data.response ||
          data.message ||
          data.text ||
          data.reply ||
          data.result ||
          (typeof data === 'string' ? data : JSON.stringify(data))
        
        return NextResponse.json({ 
          success: true,
          message: botMessage 
        })
      }
    } catch (error) {
      // Try next payload format
      continue
    }
  }
  
  return NextResponse.json({ 
    success: false, 
    message: 'AI assistant unavailable' 
  }, { status: 500 })
}
```

#### n8n Workflow Structure

```
Webhook Trigger
  │
  ▼
Process Input
  │
  ▼
OpenAI API Call
  │
  ▼
Format Response
  │
  ▼
Return to Client
```

### Webhook Endpoints

- **Chat Webhook:** `/webhook/[id]/chat`
- **Payload Format:** `{ chatInput: string }`
- **Response Format:** `{ output: string }`

### Error Handling

```typescript
// Try multiple payload formats
const payloads = [
  { chatInput: message },
  { message: message },
  { text: message }
]

for (const payload of payloads) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    // Try next format
  }
}
```

---

## 🤖 OpenAI Integration

### Integration via n8n

OpenAI is integrated through n8n workflows, not directly in the codebase.

#### n8n OpenAI Node Configuration

```json
{
  "node": "OpenAI",
  "parameters": {
    "operation": "createChatCompletion",
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are an energy management assistant."
      },
      {
        "role": "user",
        "content": "{{ $json.chatInput }}"
      }
    ],
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

### AI Features Using OpenAI

1. **AI Chatbot**
   - Energy-related Q&A
   - Usage recommendations
   - Troubleshooting help

2. **AI Forecast** (via Energy Service API)
   - Consumption predictions
   - Production forecasts
   - Cost estimates

3. **AI Cost Optimization**
   - Investment scenario analysis
   - ROI calculations
   - Recommendations

### API Integration Pattern

```typescript
// The OpenAI integration happens server-side via n8n
// Client → Next.js API → n8n Webhook → OpenAI → Response
```

---

## 🐛 Sentry Error Tracking

### Sentry Setup

#### 1. Installation

```bash
npm install @sentry/nextjs
```

#### 2. Configuration Files

**`sentry.server.config.ts`**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7389bcd37332b844b99214cb32d7de82@o4510432991051776.ingest.de.sentry.io/4510439962837072",
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
```

**`sentry.edge.config.ts`**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7389bcd37332b844b99214cb32d7de82@o4510432991051776.ingest.de.sentry.io/4510439962837072",
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
```

**Note:** Edge config is used for middleware and edge runtime routes.

**`instrumentation.ts`**
```typescript
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
```

### Error Tracking

#### Automatic Error Capture

Sentry automatically captures:
- Unhandled exceptions
- Unhandled promise rejections
- React component errors

#### Manual Error Capture

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // Risky operation
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

#### Custom Context

```typescript
Sentry.setUser({ id: user.id, email: user.email })
Sentry.setContext('energy_data', { houseId: 'H001' })
Sentry.addBreadcrumb({
  message: 'User performed action',
  level: 'info'
})
```

### Performance Monitoring

```typescript
const transaction = Sentry.startTransaction({
  name: 'API Call',
  op: 'http'
})

// Your code here

transaction.finish()
```

### Source Maps

Sentry automatically uploads source maps during build:
- Configured in `next.config.js`
- Uploads happen in build process
- Enables readable stack traces

---

## 🌐 External APIs

### Energy Service API

**Base URL:** `https://energyserviceapi.vercel.app`

#### Integration Pattern

```typescript
// lib/services/ExternalEnergyService.ts
export class ExternalEnergyService {
  private baseUrl = 'https://energyserviceapi.vercel.app'
  
  async getDashboardData(houseId: string) {
    const response = await fetch(`${this.baseUrl}/api/dashboard/overview/${houseId}`)
    return response.json()
  }
}
```

#### Available Endpoints

- `GET /api/dashboard/overview/{house_id}`
- `GET /api/dashboard/realtime/{house_id}`
- `GET /api/devices?house_id={house_id}`
- `GET /api/predictions`
- `GET /api/ai/energy-insights/{house_id}?date={date}`
- `POST /api/ai/optimize/{house_id}?scenario={scenario}`

#### Error Handling

```typescript
private async fetchWithRetry(url: string, retriesLeft: number): Promise<Response> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response
  } catch (error) {
    if (retriesLeft > 0) {
      await this.delay(1000)
      return this.fetchWithRetry(url, retriesLeft - 1)
    }
    throw error
  }
}
```

### Weather API

**Provider:** WeatherAPI.com

#### Integration

```typescript
// app/api/weather/route.ts
const apiKey = process.env.WEATHERAPI_KEY
const response = await fetch(
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=yes&alerts=yes`
)
```

#### Features

- Current weather conditions
- 5-day forecast
- Air quality data
- Weather alerts
- Astronomical data (sunrise/sunset)

---

## 🛠️ Development Tools

### TypeScript Configuration

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Note:** The `@/*` path alias allows importing from the root directory:
```typescript
import Logo from '@/components/common/Logo'
import { useTheme } from '@/lib/hooks/useTheme'
```

### Tailwind CSS Configuration

**`tailwind.config.js`**
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          dark: '#0052A3',
          light: '#3385D6',
        },
        success: '#00AA44',
        warning: '#FF8800',
        danger: '#CC0000',
      },
    },
  },
  plugins: [],
}
```

**`postcss.config.js`**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### ESLint Configuration

**`.eslintrc.json`**
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### Testing Setup

**Vitest Configuration**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      TEST_ADMIN_EMAIL: 'admin@energyplatform.lu',
      TEST_ADMIN_PASSWORD: 'Admin123!@#',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Running Tests:**
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # UI mode (if configured)
```

---

## 📦 Package Management

### Key Dependencies

#### Core Dependencies
```json
{
  "next": "^14.0.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@supabase/supabase-js": "^2.86.0",
  "@supabase/ssr": "^0.8.0"
}
```

#### UI Dependencies
```json
{
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.303.0",
  "recharts": "^2.15.4",
  "framer-motion": "^12.23.24",
  "clsx": "^2.1.0"
}
```

#### Utility Dependencies
```json
{
  "date-fns": "^3.0.6",
  "dotenv": "^17.2.3"
}
```

#### Monitoring
```json
{
  "@sentry/nextjs": "^10.27.0"
}
```

### Dependency Management

**Update Dependencies:**
```bash
npm update
```

**Check for Vulnerabilities:**
```bash
npm audit
```

**Fix Vulnerabilities:**
```bash
npm audit fix
```

---

## 🔒 Security Best Practices

### Environment Variables

**Never commit sensitive data:**
- Add `.env.local` to `.gitignore`
- Use Vercel environment variables for production
- Rotate keys regularly

### Authentication Security

```typescript
// Always validate tokens server-side
const { data: { user } } = await supabase.auth.getUser(token)
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### SQL Injection Prevention

```typescript
// ✅ Good: Parameterized queries (Supabase handles this)
const { data } = await supabase
  .from('customers')
  .select('*')
  .eq('id', customerId) // Safe

// ❌ Bad: String concatenation
// Never do: `SELECT * FROM customers WHERE id = '${id}'`
```

### XSS Prevention

- React automatically escapes content
- Use `dangerouslySetInnerHTML` only when necessary
- Sanitize user input

### CORS Configuration

```typescript
// API routes automatically handle CORS
// For custom CORS:
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    }
  })
}
```

---

## 🎨 Styling Architecture

### Tailwind CSS Patterns

#### Utility Classes
```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
```

#### Custom Components
```css
/* globals.css */
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
  
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark;
  }
}
```

#### Dark Mode
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### CSS-in-JS (Not Used)

This project uses Tailwind CSS exclusively, no CSS-in-JS libraries.

---

## 📊 Data Fetching Patterns

### Server-Side Fetching

```typescript
// Server Component
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store' // Force dynamic
  })
  return <Component data={await data.json()} />
}
```

### Client-Side Fetching

```typescript
// Client Component
'use client'
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
}, [])
```

### Caching Strategies

```typescript
// Revalidate every 60 seconds
fetch(url, { next: { revalidate: 60 } })

// Cache forever (until revalidation)
fetch(url, { next: { revalidate: false } })

// Force dynamic (no cache)
fetch(url, { cache: 'no-store' })
```

---

## 🔄 State Management Patterns

### Local State
```typescript
const [value, setValue] = useState(initialValue)
```

### URL State
```typescript
const searchParams = useSearchParams()
const filter = searchParams.get('filter')
```

### Server State
```typescript
// Data fetched on server, passed as props
export default async function Page() {
  const data = await getData()
  return <Component data={data} />
}
```

### Global State (Context)
```typescript
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

---

## 🧪 Testing

### Unit Tests

```typescript
// __tests__/utils.test.ts
import { describe, it, expect } from 'vitest'

describe('Utility Functions', () => {
  it('should format date correctly', () => {
    expect(formatDate(new Date())).toBe('2025-11-28')
  })
})
```

### Component Tests

```typescript
// __tests__/components/Logo.test.tsx
import { render, screen } from '@testing-library/react'
import Logo from '@/components/common/Logo'

describe('Logo Component', () => {
  it('renders correctly', () => {
    render(<Logo />)
    expect(screen.getByText('WATTS NEXT')).toBeInTheDocument()
  })
})
```

### API Route Tests

```typescript
// __tests__/api/route.test.ts
import { GET } from '@/app/api/example/route'

describe('API Route', () => {
  it('returns data', async () => {
    const response = await GET(new Request('http://localhost/api/example'))
    const data = await response.json()
    expect(data).toHaveProperty('data')
  })
})
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Errors

**Issue:** TypeScript errors during build
```bash
npm run build
```

**Solution:**
- Check `tsconfig.json` configuration
- Ensure all types are properly defined
- Run `npm run lint` to identify issues

#### 2. Environment Variables Not Working

**Issue:** `process.env.VARIABLE` is undefined

**Solution:**
- Ensure variable starts with `NEXT_PUBLIC_` for client-side
- Restart dev server after adding variables
- Check `.env.local` file exists

#### 3. Supabase Connection Issues

**Issue:** Cannot connect to Supabase

**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify network connectivity

#### 4. API Route Errors

**Issue:** API routes returning 500 errors

**Solution:**
- Check server logs in Vercel dashboard
- Verify environment variables are set
- Check external API connectivity
- Review error handling in route handlers

#### 5. Dark Mode Not Working

**Issue:** Theme toggle not persisting

**Solution:**
- Check `useTheme` hook implementation
- Verify `localStorage` is available
- Ensure `darkMode: 'class'` in Tailwind config

### Debugging Tips

1. **Check Browser Console:** Client-side errors
2. **Check Server Logs:** Vercel function logs
3. **Use Sentry:** Error tracking dashboard
4. **Network Tab:** Inspect API requests/responses
5. **React DevTools:** Component state inspection

---

## 📈 Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={200}
  priority // For above-the-fold images
/>
```

### Code Splitting

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false // Disable SSR if not needed
})
```

### Bundle Analysis

```bash
npm run build
# Check .next/analyze for bundle sizes
```

### Caching Strategies

- **Static Pages:** Pre-render at build time
- **ISR:** Revalidate on interval
- **API Routes:** Use cache headers
- **Client-Side:** React Query caching

---

## 🔐 Environment Variables Reference

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# External APIs
EXTERNAL_ENERGY_API_URL=https://energyserviceapi.vercel.app
```

### Optional Variables

```env
# Weather API
WEATHERAPI_KEY=your_key_here

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Defaults
NEXT_PUBLIC_DEFAULT_LOCATION=49.5022,5.9492
```

### Variable Naming

- **Client-side:** Must start with `NEXT_PUBLIC_`
- **Server-side:** No prefix required
- **Sensitive:** Never commit to git

---

## 📚 Additional Resources

### Official Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Sentry Docs](https://docs.sentry.io)

### Project-Specific Docs

- [API Documentation](./MOBILE_API_DOCUMENTATION.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Product Specification](./PRODUCT_SPECIFICATION.md)
- [Setup Guide](./SUPABASE_SETUP.md)

---

## 🎓 Best Practices

### Code Organization

1. **Component Structure:**
   - One component per file
   - Co-locate related files
   - Use index files for exports

2. **Type Safety:**
   - Define interfaces for all data structures
   - Use TypeScript strictly
   - Avoid `any` type

3. **Error Handling:**
   - Always handle errors
   - Provide user-friendly messages
   - Log errors to Sentry

4. **Performance:**
   - Use Server Components when possible
   - Implement code splitting
   - Optimize images
   - Cache API responses

5. **Accessibility:**
   - Use semantic HTML
   - Add ARIA labels
   - Ensure keyboard navigation
   - Test with screen readers

---

## 🔄 Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Conventions

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

---

**Last Updated:** November 2025  
**Version:** 1.0.0

