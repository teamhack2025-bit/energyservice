# Supabase Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `energy-portal`
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)
   - **service_role** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### Step 3: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (bottom right)
6. Wait for "Success. No rows returned" message

### Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js tsx
```

### Step 6: Generate Data

```bash
npm run generate-data
```

This will create:
- ✅ 1000 customers
- ✅ ~4000 devices
- ✅ ~72,000 energy readings
- ✅ ~1200 financial records

Takes about 2-3 minutes to complete.

### Step 7: Verify Data

1. In Supabase dashboard, go to **Table Editor**
2. Check these tables have data:
   - `customers` → 1000 rows
   - `devices` → ~4000 rows
   - `energy_readings` → ~72,000 rows
   - `financial_data` → ~1200 rows

## ✅ You're Done!

Your database is now ready with 1000 customers and realistic energy data!

## 🔧 Troubleshooting

### "Missing environment variables"
- Make sure `.env.local` exists and has all three variables
- Restart your terminal after creating `.env.local`

### "Failed to fetch"
- Check your Supabase project is active (not paused)
- Verify the URL and keys are correct
- Check your internet connection

### "Permission denied"
- Make sure you're using the **service_role** key (not anon key) for data generation
- Check RLS policies are created in the schema

### "Duplicate key error"
- The script can be run multiple times safely
- Existing records will be skipped

## 📚 Next Steps

Now you can:
1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000/dashboard`
3. See real data from Supabase!

## 🆘 Need Help?

- Check the full guide: `SUPABASE_SETUP.md`
- Supabase docs: https://supabase.com/docs
- Check browser console for errors
