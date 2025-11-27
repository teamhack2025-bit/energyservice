# 🧪 API Testing Guide

## Quick Test with Node.js

### Run the test script:

```bash
npm run test-api
```

This will:
1. ✅ Check environment variables
2. ✅ Test Supabase connection
3. ✅ Find customer (teamhack2025@gmail.com)
4. ✅ Get all devices
5. ✅ Get energy readings
6. ✅ Get financial data
7. ✅ Show summary

### Expected Output:

```
============================================================
🚀 Starting API Test
============================================================
✓ Environment variables loaded
✓ Supabase client created

============================================================
📡 Test 1: Database Connection
============================================================
✓ Database connection successful

============================================================
👤 Test 2: Find Customer (teamhack2025@gmail.com)
============================================================
✓ Customer found!

Customer Details:
{
  "id": "customer-0001",
  "email": "teamhack2025@gmail.com",
  "name": "Team Hack",
  ...
}

============================================================
🔌 Test 3: Get Devices
============================================================
✓ Found 5 devices
  - Smart Meter (smart_meter) - 0 kW
  - Solar Panel System (solar_panel) - 8.5 kW
  - Home Battery (battery) - 10.2 kW
  ...

============================================================
⚡ Test 4: Get Energy Readings
============================================================
✓ Found 5 recent readings

Latest Reading:
  Time: 11/27/2024, 10:30:00 AM
  Production: 4.5 kWh
  Consumption: 2.8 kWh
  ...

============================================================
💰 Test 5: Get Financial Data
============================================================
✓ Found 3 financial records

Latest Financial Period:
  Period: 11/1/2024 - 11/30/2024
  Cost: €78.95
  Revenue: €14.05
  Total Bill: €64.90

============================================================
📊 Summary
============================================================
Customer: Team Hack (teamhack2025@gmail.com)
Address: 165 Boulevard de la Pétrusse, Luxembourg City L-1009
Devices: 5
Energy Readings: 5 (showing latest)
Financial Records: 3 (showing latest)

============================================================
✅ All Tests Passed!
============================================================
```

## Web UI Tests

### 1. Test Connection Page
```
http://localhost:3000/test-connection
```
- Beautiful UI showing all test results
- Green checkmarks for success
- Detailed information for each test

### 2. Test API Page
```
http://localhost:3000/test-api
```
- Shows customer data in formatted view
- Displays devices, stats, and raw JSON

### 3. Dashboard with Real Data
```
http://localhost:3000/dashboard
```
- Now uses real data from Supabase
- Falls back to mock data if API fails

## Direct API Endpoints

### Test Connection
```bash
curl http://localhost:3000/api/test-connection
```

### Dashboard Data
```bash
curl http://localhost:3000/api/dashboard/real
```

## Troubleshooting

### "Customer not found"
The script will show you the first 5 customers in the database. Run this SQL in Supabase to check:

```sql
SELECT email, name FROM customers LIMIT 10;
```

### "Missing environment variables"
Check your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### "Connection failed"
- Check Supabase project is active
- Verify credentials are correct
- Check internet connection

## What Gets Tested

| Test | What It Checks |
|------|----------------|
| Environment | `.env.local` variables loaded |
| Connection | Can reach Supabase database |
| Customer | teamhack2025@gmail.com exists |
| Devices | Solar panels, batteries, etc. |
| Energy | Production/consumption readings |
| Financial | Monthly billing data |

## Next Steps

Once all tests pass:
1. ✅ Your API is working
2. ✅ Data is connected
3. ✅ Dashboard will show real data
4. ✅ Ready for production!

🎉 Happy testing!
