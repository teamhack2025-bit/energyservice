# Vercel Environment Variables

Add these environment variables to your Vercel project settings:

## Required Variables

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://fzkocsfhlhhlinxqtybf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6a29jc2ZobGhobGlueHF0eWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODI4NDAsImV4cCI6MjA3OTc1ODg0MH0.xMXmjgBX9r0XTBiN33s_VkX_trP-6wgXXuNrV0bWuww
```

### WeatherAPI Configuration
```
WEATHERAPI_KEY=b6568247f8f446b1961140234252711
NEXT_PUBLIC_DEFAULT_LOCATION=49.5022,5.9492
```

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Variable value
   - **Environment**: Select all (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application for changes to take effect

## Important Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser
- `WEATHERAPI_KEY` is server-side only (no NEXT_PUBLIC prefix)
- Update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain after deployment
- All variables should be added to Production, Preview, and Development environments

## After Adding Variables

1. Go to "Deployments" tab
2. Click the three dots menu on the latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" (optional)
5. Click "Redeploy"

Your application will rebuild with the new environment variables.
