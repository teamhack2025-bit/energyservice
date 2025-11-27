# Supabase Integration Setup

This document explains how to connect the frontend to your Supabase database.

## Prerequisites

1. Supabase project created at https://supabase.com
2. Database schema and seed data scripts executed in Supabase SQL Editor

## Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fzkocsfhlhhlinxqtybf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Replace `your_supabase_anon_key_here` with your actual anon key from Supabase

3. **Run Database Scripts**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run `supabase/schema.sql` first to create all tables
   - Then run `supabase/seed.sql` to populate test data

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Routes

The application uses Next.js API routes to fetch data from Supabase:

- `/api/data/consumption` - Get consumption data for a site
- `/api/data/production` - Get production data for a site
- `/api/data/net-balance` - Get net balance data (combines consumption and production)
- `/api/data/invoices` - Get invoices for a user
- `/api/data/devices` - Get devices for a site
- `/api/data/notifications` - Get notifications for a user
- `/api/data/contracts` - Get contracts for a user

## Data Hooks

React hooks are available in `lib/hooks/useSupabaseData.ts`:

- `useConsumptionData(days)` - Fetch consumption data
- `useProductionData(days)` - Fetch production data
- `useNetBalanceData(days)` - Fetch net balance data
- `useInvoices()` - Fetch invoices
- `useDevices(siteId)` - Fetch devices
- `useNotifications(unreadOnly)` - Fetch notifications
- `useContracts()` - Fetch contracts

All hooks automatically fall back to mock data if Supabase is unavailable.

## Current Implementation

The dashboard (`app/dashboard/page.tsx`) is now using `useNetBalanceData` hook to fetch real data from Supabase. Other pages can be updated similarly.

## Mock User/Site IDs

Currently using hardcoded IDs for testing:
- User ID: `00000000-0000-0000-0000-000000000001`
- Site ID: `20000000-0000-0000-0000-000000000001`

In production, these should come from authentication context.

## Row Level Security (RLS)

Make sure to configure Row Level Security policies in Supabase to restrict data access based on user authentication. The current implementation assumes RLS is properly configured.

