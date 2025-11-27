# 🚀 START HERE - Supabase Setup

## Quick Setup (5 minutes)

### Option 1: Automated (Recommended)

```bash
./setup-supabase.sh
```

### Option 2: Manual

```bash
# 1. Copy environment template
cp .env.local.example .env.local

# 2. Edit .env.local with your Supabase credentials
# Get them from: https://supabase.com → Your Project → Settings → API

# 3. Install dependencies
npm install @supabase/supabase-js tsx

# 4. Create database schema
# - Go to Supabase SQL Editor
# - Copy contents of supabase/schema.sql
# - Run it

# 5. Generate data
npm run generate-data
```

## What You Need

1. **Supabase Account** (free): https://supabase.com
2. **3 Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## What You Get

- ✅ 1,000 Luxembourg customers
- ✅ 4,000+ devices (solar, batteries, EV chargers)
- ✅ 72,000+ hourly energy readings (30 days)
- ✅ 1,200+ financial records (12 months)
- ✅ Community trading data
- ✅ Energy sharing groups

## Files You Need

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Database structure |
| `scripts/generate-data.ts` | Data generator |
| `.env.local` | Your credentials |

## After Setup

```bash
npm run dev
```

Visit: http://localhost:3000/dashboard

## Need Help?

- **Quick Guide**: `SUPABASE_QUICK_START.md`
- **Full Guide**: `SUPABASE_MIGRATION_README.md`
- **Troubleshooting**: See guides above

## Time Required

- Supabase project creation: 2 minutes
- Schema setup: 1 minute
- Data generation: 2-3 minutes
- **Total: ~5 minutes**

---

**Ready?** Run `./setup-supabase.sh` or follow manual steps above! 🎉
