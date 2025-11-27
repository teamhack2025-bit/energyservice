# Enhanced Weather Features

## Overview
The application now uses WeatherAPI.com to provide comprehensive weather data including alerts, air quality, and detailed forecasts.

## Features Implemented

### 1. **Weather Alerts** 🚨
- Real-time government weather alerts (USA, UK, Europe, and worldwide)
- Alert severity levels: Extreme, Severe, Moderate, Minor
- Displays:
  - Alert headline and event type
  - Affected areas
  - Effective and expiration times
  - Safety instructions
- Visual indicators on dashboard with alert count badge

### 2. **Air Quality Monitoring** 🌫️
- Real-time air quality index (AQI)
- Pollutant measurements:
  - PM2.5 and PM10 (particulate matter)
  - O₃ (Ozone)
  - NO₂ (Nitrogen dioxide)
  - SO₂ (Sulphur dioxide)
  - CO (Carbon monoxide)
- US EPA and UK DEFRA index standards
- Color-coded quality levels:
  - Good (Green)
  - Moderate (Yellow)
  - Unhealthy for Sensitive Groups (Orange)
  - Unhealthy (Red)
  - Very Unhealthy (Purple)
  - Hazardous (Dark Red)
- Health recommendations for sensitive groups

### 3. **5-Day Detailed Forecast** 📅
- Daily weather predictions
- Max/min temperatures
- Weather conditions with icons
- Hourly data including:
  - Humidity levels
  - Wind speed and direction
  - UV index
  - Rain/snow probability
  - Sunrise and sunset times

### 4. **Enhanced Dashboard Widget** 🎯
- Compact weather display on dashboard
- Alert badge with count (animated pulse effect)
- Air quality indicator (clickable to full weather page)
- Current conditions with:
  - Temperature and feels-like
  - Weather icon and description
  - Humidity, wind, visibility
  - Sunrise/sunset times
  - 3-day forecast preview
  - Moon phase information

### 5. **Dedicated Weather Page** 🌤️
- Full weather dashboard at `/weather`
- Large current weather display
- Comprehensive air quality widget
- Detailed 5-day forecast cards
- Auto-refresh every 10 minutes
- Manual refresh button
- Location information

## Configuration

### Environment Variables
Add to your `.env.local`:

```bash
# WeatherAPI.com Configuration
WEATHERAPI_KEY=your_api_key_here
NEXT_PUBLIC_DEFAULT_LOCATION=Berlin
```

### Get Your API Key
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your free API key from the dashboard
3. Free tier includes:
   - Real-time weather
   - 3-day forecast
   - Weather alerts
   - Air quality data
   - Astronomy data

## API Features Used

### Current Weather
- Temperature (°C/°F)
- Feels like temperature
- Humidity
- Pressure
- Visibility
- UV index
- Wind speed, direction, and gusts
- Weather conditions
- Sunrise/sunset times
- Moon phase and illumination

### Forecast API
- Up to 14 days forecast (5 days implemented)
- Hourly intervals
- Weather alerts
- Air quality data
- Astronomy data (sunrise, sunset, moon phase)

### Data Refresh
- Dashboard widget: Every 10 minutes
- Weather page: Every 10 minutes + manual refresh
- Cached API responses: 10 minutes

## User Benefits

### Energy Management
- Plan energy usage based on weather forecasts
- Optimize solar panel efficiency with UV and cloud data
- Adjust heating/cooling based on temperature predictions

### Safety & Health
- Receive severe weather alerts
- Monitor air quality for outdoor activities
- Plan based on UV index for solar panel maintenance

### Smart Planning
- Schedule outdoor maintenance during optimal weather
- Anticipate energy demand changes
- Prepare for weather-related energy fluctuations

## Navigation
- Dashboard: Compact weather widget with alerts
- Sidebar: New "Weather" menu item
- Click alert badge or air quality indicator to view full details

## Technical Details

### Components
- `WeatherWidgetCompact.tsx` - Dashboard widget with alerts
- `WeatherAlerts.tsx` - Alert display component
- `AirQualityWidget.tsx` - Air quality monitoring
- `WeatherForecastDetailed.tsx` - 5-day forecast cards
- `app/weather/page.tsx` - Full weather dashboard

### API Route
- `/api/weather` - Fetches data from WeatherAPI.com
- Supports query parameter `?q=location`
- Returns formatted weather data with alerts and air quality

### Image Configuration
Next.js configured to load weather icons from:
- `cdn.weatherapi.com`

## Future Enhancements (Available with API)
- Pollen data (Pro+ plan)
- Marine weather and tide data
- Historical weather data
- 15-minute interval data (Enterprise)
- Solar irradiance data (Enterprise)
- Evapotranspiration data (Business+)
- Weather maps overlay
- Multi-location support
- Custom alert notifications
- Weather-based energy recommendations

## Mock Data
If API key is not configured, the system displays mock weather data with a warning banner.
