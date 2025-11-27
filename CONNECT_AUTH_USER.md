# Connect Auth User to Customer Data

## Quick Setup for jesubalan89@gmail.com

### Step 1: Run this SQL in Supabase

Copy and run `supabase/find-my-customer.sql` in Supabase SQL Editor to see your data.

### Step 2: Test the API

Visit these URLs after starting your dev server:

1. **Test API Page**: http://localhost:3000/test-api
   - Shows all your real data in a nice format
   - Displays customer info, devices, stats, and raw JSON

2. **Dashboard**: http://localhost:3000/dashboard
   - Now uses real data from Supabase
   - Falls back to mock data if API fails

### Step 3: Start Dev Server

```bash
npm run dev
```

Then visit http://localhost:3000/test-api to see your real data!

## How It Works

1. **Authentication**: Your Google auth (jesubalan89@gmail.com) is already set up
2. **Customer Lookup**: The API finds your customer record by email
3. **Data Fetch**: Gets all your devices, energy readings, and financial data
4. **Display**: Shows everything on the dashboard

## API Endpoint

- **URL**: `/api/dashboard/real`
- **Method**: GET
- **Auth**: Uses Supabase auth to get current user email
- **Response**: JSON with customer data, devices, stats

## What You'll See

- ✅ Customer information (name, address, city)
- ✅ Today's energy stats (production, consumption, net balance)
- ✅ Monthly financial data (cost, revenue, total bill)
- ✅ All your devices (solar panels, batteries, etc.)
- ✅ Last 30 days trends
- ✅ Last 7 days consumption/production

## Troubleshooting

### "No customer data found"
- Run `supabase/find-my-customer.sql` to check if your email exists
- Make sure you're logged in with jesubalan89@gmail.com

### "Failed to fetch"
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is active
- Check browser console for errors

### No data showing
- Run the seed data script to generate data
- Check Supabase Table Editor to verify data exists

## Next Steps

Once you see your data on `/test-api`:
1. All dashboard pages will automatically use your real data
2. No more mock data!
3. Everything is connected to your auth user

🎉 Your real data is now live!
