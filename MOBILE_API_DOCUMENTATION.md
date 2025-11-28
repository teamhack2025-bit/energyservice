# Mobile App API Documentation

Complete API reference for Energy Management Platform backend. All APIs are hosted at `https://energyserviceapi.vercel.app` unless otherwise specified.

**Base URL:** `https://energyserviceapi.vercel.app`

**Authentication:** Currently, APIs use `house_id` parameter to identify the user's house. House IDs are in format `H001`, `H002`, etc. (H001-H006).

---

## Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Devices & Smart Home](#devices--smart-home)
3. [Energy Consumption & History](#energy-consumption--history)
4. [AI Forecast](#ai-forecast)
5. [Sustainability Board](#sustainability-board)
6. [Weather](#weather)

---

## Dashboard Overview

### 1. Get Dashboard Overview

**Endpoint:** `GET /api/dashboard/overview/{house_id}`

**Description:** Returns comprehensive dashboard data including metrics, consumption, production, net balance, and energy balance for a specific house.

**Path Parameters:**
- `house_id` (string, required): House identifier (e.g., "H001")

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/dashboard/overview/H001
```

**Response Structure:**
```json
{
  "house_id": "string",
  "timestamp": "string (ISO 8601)",
  "last_updated": "string (ISO 8601)",
  "metrics": {
    "net_today": {
      "value": "number",
      "unit": "string (e.g., 'kWh')",
      "change": "number (percentage)",
      "change_direction": "string ('up' | 'down' | 'neutral')",
      "label": "string"
    },
    "cost_this_month": {
      "value": "number",
      "unit": "string (e.g., 'EUR')",
      "change": "number (percentage)",
      "change_direction": "string ('up' | 'down' | 'neutral')",
      "label": "string"
    },
    "revenue_this_month": {
      "value": "number",
      "unit": "string (e.g., 'EUR')",
      "change": "number (percentage)",
      "change_direction": "string ('up' | 'down' | 'neutral')",
      "label": "string"
    },
    "efficiency": {
      "value": "number",
      "unit": "string (e.g., '%')",
      "change": "number (percentage)",
      "change_direction": "string ('up' | 'down' | 'neutral')",
      "label": "string"
    },
    "today_production": {
      "value": "number",
      "unit": "string (e.g., 'kWh')",
      "change": "number (percentage)",
      "change_direction": "string ('up' | 'down' | 'neutral')",
      "label": "string"
    },
    "today_consumption": {
      "value": "number",
      "unit": "string (e.g., 'kWh')",
      "change": "number (percentage)",
      "change_direction": "string ('up' | 'down' | 'neutral')",
      "label": "string"
    }
  },
  "consumption": {
    "title": "string",
    "subtitle": "string",
    "dates": "string[] (ISO date strings)",
    "data": [
      {
        "date": "string (ISO date)",
        "values": "number[] (24 hourly values)",
        "average": "number"
      }
    ],
    "unit": "string (e.g., 'kWh')"
  },
  "production": {
    "title": "string",
    "subtitle": "string",
    "dates": "string[] (ISO date strings)",
    "data": [
      {
        "date": "string (ISO date)",
        "values": "number[] (24 hourly values)",
        "average": "number"
      }
    ],
    "unit": "string (e.g., 'kWh')"
  },
  "net_balance": {
    "title": "string",
    "subtitle": "string",
    "dates": "string[] (ISO date strings)",
    "data": [
      {
        "date": "string (ISO date)",
        "import": "number (kWh)",
        "export": "number (kWh)",
        "net": "number (kWh)"
      }
    ],
    "unit": "string (e.g., 'kWh')"
  },
  "energy_balance": {
    "produced": {
      "value": "number",
      "unit": "string",
      "percentage": "number"
    },
    "consumed": {
      "value": "number",
      "unit": "string",
      "percentage": "number"
    },
    "net": {
      "value": "number",
      "unit": "string",
      "percentage": "number"
    }
  },
  "quick_actions": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "icon": "string",
      "action": "string"
    }
  ]
}
```

**Field Descriptions:**
- `house_id`: Unique identifier for the house
- `timestamp`: Current server timestamp
- `last_updated`: Last time data was updated
- `metrics.net_today`: Net energy balance for today (production - consumption)
- `metrics.cost_this_month`: Total energy cost for current month
- `metrics.revenue_this_month`: Revenue from energy export this month
- `metrics.efficiency`: Overall system efficiency percentage
- `metrics.today_production`: Total solar production today
- `metrics.today_consumption`: Total consumption today
- `consumption.data[].values`: Array of 24 hourly consumption values (one per hour)
- `production.data[].values`: Array of 24 hourly production values (one per hour)
- `net_balance.data[].import`: Energy imported from grid
- `net_balance.data[].export`: Energy exported to grid
- `net_balance.data[].net`: Net balance (positive = export, negative = import)
- `energy_balance`: Current energy balance breakdown with percentages

---

### 2. Get Real-time Dashboard Data

**Endpoint:** `GET /api/dashboard/realtime/{house_id}`

**Description:** Returns real-time energy flow data including solar, battery, grid, consumption, EV charging, gas, and heat pump status.

**Path Parameters:**
- `house_id` (string, required): House identifier (e.g., "H001")

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/dashboard/realtime/H001
```

**Response Structure:**
```json
{
  "house_id": "string",
  "house_name": "string",
  "timestamp": "string (ISO 8601)",
  "summary": {
    "consumption_today": "number (kWh)",
    "solar_production_today": "number (kWh)",
    "grid_import_today": "number (kWh)",
    "grid_export_today": "number (kWh)",
    "battery_charge_level": "number (percentage)",
    "net_balance_today": "number (kWh)"
  },
  "energy_flow": {
    "solar": {
      "production": "number (kW)",
      "to_house": "number (kW)",
      "to_grid": "number (kW)",
      "to_battery": "number (kW)",
      "status": "string ('active' | 'idle')"
    },
    "battery": {
      "charge_level": "number (percentage)",
      "charge_rate": "number (kW, positive = charging, negative = discharging)",
      "capacity": "number (kWh)",
      "status": "string ('charging' | 'discharging' | 'idle')"
    },
    "grid": {
      "import": "number (kW)",
      "export": "number (kW)",
      "net": "number (kW, positive = export, negative = import)",
      "status": "string ('importing' | 'exporting' | 'idle')"
    },
    "house": {
      "total_load": "number (kW)"
    },
    "ev_charger": {
      "power": "number (kW)",
      "charge_level": "number (percentage)",
      "status": "string ('charging' | 'idle')"
    },
    "heat_pump": {
      "power": "number (kW)",
      "temperature": "number (°C)",
      "status": "string ('active' | 'idle')"
    }
  },
  "system_status": {
    "solar": "string ('online' | 'offline')",
    "battery": "string ('online' | 'offline')",
    "grid": "string ('connected' | 'disconnected')",
    "ev_charger": "string ('online' | 'offline')",
    "heat_pump": "string ('online' | 'offline')"
  },
  "timeline_24h": [
    {
      "hour": "number (0-23)",
      "solar": "number (kWh)",
      "consumption": "number (kWh)",
      "grid": "number (kWh, positive = export, negative = import)"
    }
  ],
  "live_metrics": [
    {
      "id": "string (e.g., 'consumption', 'ev_charging', 'gas_usage', 'heat_pump')",
      "current_value": "number",
      "unit": "string",
      "status": "string",
      "daily": {
        "usage": "number",
        "cost": "number",
        "unit": "string"
      },
      "details": {
        "living_room": "number (kW)",
        "kitchen": "number (kW)",
        "bedroom": "number (kW)",
        "mode": "string",
        "target": "number",
        "time_to_full": "number (minutes)"
      }
    }
  ]
}
```

**Field Descriptions:**
- `summary`: Daily aggregated values
- `energy_flow`: Current real-time energy flow in kW
- `energy_flow.solar.to_house`: Solar power directly powering house
- `energy_flow.solar.to_grid`: Solar power exported to grid
- `energy_flow.solar.to_battery`: Solar power charging battery
- `energy_flow.battery.charge_rate`: Positive = charging, negative = discharging
- `energy_flow.grid.net`: Positive = exporting, negative = importing
- `system_status`: Overall system component status
- `timeline_24h`: Hourly data for last 24 hours
- `live_metrics`: Real-time device-specific metrics

---

## Devices & Smart Home

### 3. Get Devices List

**Endpoint:** `GET /api/devices`

**Description:** Returns list of all devices/smart home equipment for a specific house.

**Query Parameters:**
- `house_id` (string, required): House identifier (e.g., "H001")

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/devices?house_id=H001
```

**Response Structure:**
```json
{
  "devices": [
    {
      "id": "string",
      "name": "string",
      "type": "string (e.g., 'solar_panel', 'battery', 'ev_charger', 'heat_pump', 'appliance')",
      "location": "string (e.g., 'roof', 'garage', 'kitchen')",
      "status": "string ('online' | 'offline' | 'standby' | 'active')",
      "power": "number (kW or W)",
      "power_unit": "string ('kW' | 'W')",
      "efficiency": "number (percentage, optional)",
      "manufacturer": "string (optional)",
      "model": "string (optional)",
      "installed_date": "string (ISO date, optional)",
      "last_maintenance": "string (ISO date, optional)",
      "warranty_expires": "string (ISO date, optional)",
      "metadata": {
        "capacity": "number (kWh, for batteries)",
        "charge_level": "number (percentage, for batteries/EV)",
        "temperature": "number (°C, for heat pumps)",
        "mode": "string (for smart devices)"
      }
    }
  ],
  "house_id": "string",
  "total_devices": "number",
  "timestamp": "string (ISO 8601)"
}
```

**Field Descriptions:**
- `devices[].id`: Unique device identifier
- `devices[].name`: Human-readable device name
- `devices[].type`: Device category/type
- `devices[].location`: Physical location in house
- `devices[].status`: Current operational status
- `devices[].power`: Current power consumption/production
- `devices[].metadata`: Device-specific additional data (varies by type)

---

## Energy Consumption & History

### 4. Get Predictions (Historical + Forecast)

**Endpoint:** `GET /api/predictions`

**Description:** Returns consolidated energy monitoring data with historical and predicted values for all systems (laundry, kitchen, car, solar, battery, grid, energy sharing).

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/predictions
```

**Response Structure:**
```json
{
  "description": "string",
  "period": {
    "start": "string (ISO 8601)",
    "end": "string (ISO 8601)",
    "hours": "number"
  },
  "sign_convention": {
    "negative": "string (e.g., 'Consumption/Buying')",
    "positive": "string (e.g., 'Production/Selling')"
  },
  "systems": [
    {
      "location": "string (e.g., 'laundry_room', 'kitchen', 'car', 'solar_panels', 'battery', 'grid', 'energy_sharing_community')",
      "unit": "string (e.g., 'kWh')",
      "description": "string"
    }
  ],
  "data": [
    {
      "timestamp": "string (ISO 8601)",
      "laundry_room": "number (kWh, negative = consumption)",
      "kitchen": "number (kWh, negative = consumption)",
      "car": "number (kWh, negative = consumption)",
      "solar_panels": "number (kWh, positive = production)",
      "battery": "number (kWh, positive = charging, negative = discharging)",
      "grid": "number (kWh, negative = import, positive = export)",
      "energy_sharing_community": "number (kWh)",
      "grid_price": "number (EUR/kWh)",
      "community_price": "number (EUR/kWh)"
    }
  ]
}
```

**Field Descriptions:**
- `period`: Time range covered by the data
- `sign_convention`: Explains positive/negative value meanings
- `systems`: List of all monitored systems with descriptions
- `data[]`: Array of hourly data points
- `data[].timestamp`: ISO 8601 timestamp for the data point
- `data[].laundry_room`: Washing machine + dryer consumption
- `data[].kitchen`: Fridge + oven + dishwasher consumption
- `data[].car`: Electric vehicle charging consumption
- `data[].solar_panels`: Solar panel production
- `data[].battery`: Battery charge/discharge (positive = charging)
- `data[].grid`: Grid import/export (negative = import, positive = export)
- `data[].energy_sharing_community`: Community energy sharing
- `data[].grid_price`: Current grid electricity price
- `data[].community_price`: Community energy sharing price

---

## AI Forecast

### 5. Get AI Energy Insights

**Endpoint:** `GET /api/ai/energy-insights/{house_id}`

**Description:** Returns AI-powered energy consumption predictions, recommendations, and insights for optimization.

**Path Parameters:**
- `house_id` (string, required): House identifier (e.g., "H001")

**Query Parameters:**
- `date` (string, optional): Date in format YYYY-MM-DD (defaults to today)

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/ai/energy-insights/H001?date=2025-11-28
```

**Response Structure:**
```json
{
  "house_id": "string",
  "timestamp": "string (ISO 8601)",
  "date": "string (YYYY-MM-DD)",
  "current_hour": "number (0-23)",
  "ai_predictions": {
    "next_hour_prediction": {
      "hour": "number (0-23)",
      "predicted_consumption_kwh": "number",
      "estimated_cost_eur": "number",
      "power_percentage": "number (percentage)",
      "primary_source": "string (e.g., 'solar', 'grid', 'battery')"
    },
    "recommendations": [
      {
        "priority": "string ('high' | 'medium' | 'low')",
        "action": "string (recommended action)",
        "reason": "string (explanation)",
        "potential_savings_eur": "number"
      }
    ],
    "insights": {
      "current_trend": "string (e.g., 'stable', 'increasing', 'decreasing')",
      "peak_hours_today": "number[] (array of hours 0-23)",
      "efficiency_score": "number (0-100)"
    }
  },
  "data_sources": {
    "current_consumption_records": "number",
    "predictions_available": "number"
  }
}
```

**Field Descriptions:**
- `current_hour`: Current hour of the day (0-23)
- `ai_predictions.next_hour_prediction`: Prediction for the next hour
- `ai_predictions.next_hour_prediction.predicted_consumption_kwh`: Expected consumption
- `ai_predictions.next_hour_prediction.estimated_cost_eur`: Estimated cost for next hour
- `ai_predictions.next_hour_prediction.primary_source`: Main energy source expected
- `ai_predictions.recommendations[]`: AI-generated optimization recommendations
- `ai_predictions.recommendations[].priority`: Urgency level
- `ai_predictions.recommendations[].action`: What the user should do
- `ai_predictions.recommendations[].reason`: Why this recommendation
- `ai_predictions.recommendations[].potential_savings_eur`: Potential savings if followed
- `ai_predictions.insights.current_trend`: Overall consumption trend
- `ai_predictions.insights.peak_hours_today`: Hours with highest consumption
- `ai_predictions.insights.efficiency_score`: Overall efficiency rating (0-100)

---

## Sustainability Board

### 6. Get Sustainability Metrics

**Endpoint:** `GET /api/sustainability/metrics`

**Description:** Returns comprehensive sustainability metrics including CO2 avoided, trees saved, water saved, efficiency scores, and more. This endpoint internally calls `/api/devices` and `/api/dashboard/realtime` to calculate metrics.

**Note:** This is a calculated endpoint that aggregates data from devices and dashboard APIs.

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/sustainability/metrics
```

**Response Structure:**
```json
{
  "treesSaved": "number",
  "waterSaved": "number (liters)",
  "co2Avoided": "number (kg)",
  "energySavedVsPeers": "number (percentile 0-100)",
  "renewablePercentage": "number (percentage)",
  "peakLoadReduction": "number (percentage)",
  "deviceEfficiencyScore": "number (0-100)",
  "carbonNeutralityProgress": "number (percentage)",
  "energyHealthIndex": "number (0-100)",
  "annualEnergyReduction": "number (percentage)",
  "costSavings": "number (EUR)",
  "standbyReduction": "number (percentage)",
  "evChargingEfficiency": "number (0-100)",
  "lightingEfficiencyScore": "number (0-100)",
  "hvacEfficiencyIndex": "number (0-100)",
  "applianceHealthRating": "number (0-100)",
  "overallSustainabilityScore": "number (0-100)",
  "consumption": "number (kWh)",
  "production": "number (kWh)",
  "renewableEnergy": "number (kWh)",
  "energySaved": "number (kWh)",
  "baselineConsumption": "number (kWh)",
  "totalDevices": "number",
  "evDevices": "number",
  "lightingDevices": "number",
  "hvacDevices": "number",
  "timestamp": "string (ISO 8601)"
}
```

**Field Descriptions:**
- `treesSaved`: Equivalent trees saved based on CO2 reduction
- `waterSaved`: Water saved (liters) through energy efficiency
- `co2Avoided`: CO2 emissions avoided (kg)
- `energySavedVsPeers`: Percentile ranking vs peers (higher = better)
- `renewablePercentage`: Percentage of energy from renewable sources
- `peakLoadReduction`: Reduction in peak load vs baseline
- `deviceEfficiencyScore`: Overall device efficiency (0-100)
- `carbonNeutralityProgress`: Progress toward carbon neutrality
- `energyHealthIndex`: Overall energy health score
- `annualEnergyReduction`: Estimated annual reduction percentage
- `costSavings`: Estimated cost savings (EUR)
- `standbyReduction`: Reduction in standby power consumption
- `evChargingEfficiency`: EV charging efficiency score
- `lightingEfficiencyScore`: Lighting system efficiency
- `hvacEfficiencyIndex`: HVAC system efficiency
- `applianceHealthRating`: Appliance health rating
- `overallSustainabilityScore`: Composite sustainability score (0-100)

---

### 7. Get Sustainability Devices

**Endpoint:** `GET /api/sustainability/devices`

**Description:** Returns device list specifically formatted for sustainability board. Internally calls `/api/devices`.

**Request Example:**
```http
GET https://energyserviceapi.vercel.app/api/sustainability/devices
```

**Response Structure:**
```json
{
  "houseId": "string",
  "devices": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "location": "string",
      "status": "string",
      "power": "number",
      "power_unit": "string",
      "efficiency": "number (optional)",
      "metadata": {}
    }
  ],
  "timestamp": "string (ISO 8601)"
}
```

---

## Weather

### 8. Get Weather Data

**Endpoint:** `GET /api/weather`

**Description:** Returns current weather conditions and forecast. Uses external WeatherAPI service.

**Query Parameters:**
- `q` (string, optional): Location query (lat,lon format or city name). Defaults to configured default location.

**Request Example:**
```http
GET https://your-domain.com/api/weather?q=49.5022,5.9492
```

**Response Structure:**
```json
{
  "current": {
    "temp": "number (°C)",
    "feels_like": "number (°C)",
    "humidity": "number (percentage)",
    "pressure": "number (mb)",
    "visibility": "number (km)",
    "uv_index": "number",
    "weather": {
      "main": "string (e.g., 'Clouds', 'Clear', 'Rain')",
      "description": "string",
      "icon": "string (URL)"
    },
    "wind": {
      "speed": "number (m/s)",
      "deg": "number (degrees)",
      "dir": "string (e.g., 'SW')",
      "gust": "number (m/s, optional)"
    },
    "air_quality": {
      "co": "number",
      "no2": "number",
      "o3": "number",
      "so2": "number",
      "pm2_5": "number",
      "pm10": "number",
      "us-epa-index": "number (1-6)",
      "gb-defra-index": "number (1-10)"
    },
    "sunrise": "string (HH:MM AM/PM)",
    "sunset": "string (HH:MM AM/PM)",
    "moonrise": "string (HH:MM AM/PM, optional)",
    "moonset": "string (HH:MM AM/PM, optional)",
    "moon_phase": "string (optional)"
  },
  "forecast": [
    {
      "date": "string (ISO date)",
      "temp": "number (°C)",
      "maxtemp": "number (°C)",
      "mintemp": "number (°C)",
      "condition": "string",
      "description": "string",
      "icon": "string (URL)",
      "humidity": "number (percentage)",
      "wind_speed": "number (m/s)",
      "uv": "number",
      "rain_chance": "number (percentage)",
      "snow_chance": "number (percentage)",
      "sunrise": "string",
      "sunset": "string"
    }
  ],
  "alerts": [
    {
      "headline": "string",
      "msgtype": "string",
      "severity": "string",
      "urgency": "string",
      "areas": "string",
      "category": "string",
      "certainty": "string",
      "event": "string",
      "note": "string",
      "effective": "string (ISO 8601)",
      "expires": "string (ISO 8601)",
      "desc": "string",
      "instruction": "string"
    }
  ],
  "location": {
    "name": "string",
    "region": "string",
    "country": "string",
    "lat": "number",
    "lon": "number",
    "tz_id": "string",
    "localtime": "string"
  },
  "mock": "boolean (true if using fallback data)"
}
```

**Field Descriptions:**
- `current`: Current weather conditions
- `forecast`: Array of daily forecasts (typically 5 days)
- `alerts`: Weather alerts/warnings for the area
- `location`: Location information
- `mock`: Indicates if fallback/mock data is being used

**Note:** This endpoint requires WeatherAPI key configuration. Returns mock data if API key is not configured.

---

## Common Patterns

### House ID Determination

The application uses a hash-based algorithm to assign house IDs to users:

```typescript
function getHouseIdForCustomer(customerId: string): string {
  const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const houseNumber = (hash % 6) + 1
  return `H00${houseNumber}`
}
```

This ensures consistent house assignment for the same customer ID. House IDs range from H001 to H006.

### Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "string (error message)",
  "details": "string (optional, additional error details)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (house_id not found)
- `500`: Internal Server Error

### Request Headers

Recommended headers for all requests:
```http
Content-Type: application/json
Accept: application/json
```

### Caching

Most endpoints return cache-control headers. For real-time data, use:
```http
Cache-Control: no-store, no-cache, must-revalidate
```

---

## Mobile App Implementation Notes

### 1. House ID Management
- Store house_id in user profile/session after first API call
- Use consistent house_id across all API calls for same user
- Handle house_id assignment on first login

### 2. Data Refresh Strategy
- **Real-time data** (`/dashboard/realtime`): Refresh every 30-60 seconds
- **Dashboard overview**: Refresh every 5 minutes
- **Predictions**: Refresh every 15 minutes
- **Sustainability metrics**: Refresh every 10 minutes
- **Weather**: Refresh every 30 minutes
- **AI insights**: Refresh every hour

### 3. Error Handling
- Implement retry logic with exponential backoff
- Show user-friendly error messages
- Cache last successful response for offline viewing
- Handle network timeouts gracefully

### 4. Data Transformation
- Convert ISO 8601 timestamps to local timezone
- Format numbers with appropriate decimal places
- Handle null/undefined values gracefully
- Transform arrays for chart libraries

### 5. State Management
- Use Redux/MobX/Context for global state
- Cache API responses locally
- Implement optimistic updates where appropriate
- Sync data when app comes to foreground

---

## Example Mobile App API Client (TypeScript)

```typescript
const API_BASE_URL = 'https://energyserviceapi.vercel.app';

class EnergyAPI {
  private houseId: string | null = null;

  async getHouseId(customerId: string): Promise<string> {
    if (this.houseId) return this.houseId;
    
    // Calculate house ID
    const hash = customerId.split('').reduce((acc, char) => 
      acc + char.charCodeAt(0), 0
    );
    const houseNumber = (hash % 6) + 1;
    this.houseId = `H00${houseNumber}`;
    return this.houseId;
  }

  async getDashboardOverview(houseId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/dashboard/overview/${houseId}`
    );
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return response.json();
  }

  async getRealtimeData(houseId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/dashboard/realtime/${houseId}`
    );
    if (!response.ok) throw new Error('Failed to fetch realtime data');
    return response.json();
  }

  async getDevices(houseId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/devices?house_id=${houseId}`
    );
    if (!response.ok) throw new Error('Failed to fetch devices');
    return response.json();
  }

  async getPredictions() {
    const response = await fetch(`${API_BASE_URL}/api/predictions`);
    if (!response.ok) throw new Error('Failed to fetch predictions');
    return response.json();
  }

  async getAIInsights(houseId: string, date?: string) {
    const dateParam = date ? `?date=${date}` : '';
    const response = await fetch(
      `${API_BASE_URL}/api/ai/energy-insights/${houseId}${dateParam}`
    );
    if (!response.ok) throw new Error('Failed to fetch AI insights');
    return response.json();
  }

  async getSustainabilityMetrics() {
    const response = await fetch(`${API_BASE_URL}/api/sustainability/metrics`);
    if (!response.ok) throw new Error('Failed to fetch sustainability metrics');
    return response.json();
  }
}

export default new EnergyAPI();
```

---

## Summary

This documentation covers all external APIs used by the Energy Management Platform web dashboard. All endpoints are RESTful and return JSON. The mobile app can use these same APIs directly without modification.

**Key Endpoints:**
1. Dashboard Overview: `/api/dashboard/overview/{house_id}`
2. Real-time Data: `/api/dashboard/realtime/{house_id}`
3. Devices: `/api/devices?house_id={house_id}`
4. Predictions: `/api/predictions`
5. AI Insights: `/api/ai/energy-insights/{house_id}?date={date}`
6. Sustainability Metrics: `/api/sustainability/metrics`
7. Weather: `/api/weather?q={location}`

All APIs use `house_id` for identification, which can be calculated from customer ID or stored after first API call.
