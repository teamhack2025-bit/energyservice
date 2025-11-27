# Weather Data Integration Setup

The Energy Portal now includes weather data from OpenWeatherMap API to help users understand how weather affects their energy consumption and solar production.

## Features

- **Current Weather**: Temperature, humidity, wind speed, visibility, pressure
- **5-Day Forecast**: Daily weather predictions
- **Sunrise/Sunset Times**: Important for solar production planning
- **Weather Icons**: Visual representation of current conditions

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenWeatherMap API Key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# Optional: Default location (Berlin, Germany)
NEXT_PUBLIC_DEFAULT_LAT=52.52
NEXT_PUBLIC_DEFAULT_LON=13.405
```

Replace `your_api_key_here` with your actual API key.

### 3. Restart Development Server

After adding the API key, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Usage

The weather widget automatically appears on:
- **Dashboard**: Shows current weather and forecast
- **Production Page**: Weather is crucial for understanding solar production

## Mock Data Mode

If no API key is configured, the app will use mock weather data so you can still see the UI and functionality. You'll see a notice indicating mock data is being used.

## API Endpoints

The weather data is fetched via:
- `GET /api/weather` - Current weather and forecast
- Query parameters:
  - `lat` (optional): Latitude
  - `lon` (optional): Longitude

## Free Tier Limits

OpenWeatherMap free tier includes:
- 60 calls/minute
- 1,000,000 calls/month
- Current weather data
- 5-day/3-hour forecast

This is more than sufficient for the portal's needs.

## Customization

You can customize the default location by updating the environment variables:
- `NEXT_PUBLIC_DEFAULT_LAT`: Latitude (e.g., 52.52 for Berlin)
- `NEXT_PUBLIC_DEFAULT_LON`: Longitude (e.g., 13.405 for Berlin)

## Troubleshooting

**Weather widget not showing?**
- Check browser console for errors
- Verify API key is set correctly
- Ensure `.env.local` file exists in root directory
- Restart the development server after adding API key

**Getting errors?**
- Verify your API key is valid
- Check API key hasn't exceeded rate limits
- Ensure location coordinates are valid

