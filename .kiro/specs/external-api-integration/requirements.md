# Requirements Document

## Introduction

This feature integrates an external energy service API (`https://energyserviceapi.vercel.app/api/dashboard/overview/{house_id}`) into the existing dashboard to provide real-time energy data for users. The system will map authenticated users to specific house IDs (H001-H006) and display comprehensive energy metrics, consumption patterns, production data, and net balance information.

## Glossary

- **External API**: The third-party energy service API hosted at `https://energyserviceapi.vercel.app`
- **House ID**: A unique identifier (H001-H006) that represents a specific household in the external API
- **Dashboard Service**: The internal service layer that fetches and transforms data for the dashboard
- **Net Balance**: The difference between energy production and consumption
- **Energy Metrics**: Key performance indicators including net today, cost, revenue, efficiency, production, and consumption

## Requirements

### Requirement 1

**User Story:** As a logged-in user, I want to see my real-time energy data from the external API, so that I can monitor my household's energy performance accurately.

#### Acceptance Criteria

1. WHEN a user views the dashboard THEN the system SHALL fetch data from `https://energyserviceapi.vercel.app/api/dashboard/overview/{house_id}` using the user's assigned house ID
2. WHEN the external API returns data THEN the system SHALL display all metrics including net today, cost this month, revenue this month, efficiency, today production, and today consumption
3. WHEN the external API request fails THEN the system SHALL fall back to mock data and display a warning indicator to the user
4. WHEN the dashboard loads THEN the system SHALL complete the API request within 5 seconds or timeout gracefully
5. WHEN the API response is received THEN the system SHALL validate the response structure before rendering

### Requirement 2

**User Story:** As a system administrator, I want users to be mapped to specific house IDs, so that each user sees their own household's energy data.

#### Acceptance Criteria

1. WHEN a user authenticates THEN the system SHALL assign or retrieve their associated house ID from the range H001 to H006
2. WHEN retrieving user data THEN the system SHALL store the house ID mapping in the user's profile or session
3. WHEN a house ID is not assigned THEN the system SHALL assign the next available house ID from the pool
4. WHEN all house IDs are assigned THEN the system SHALL reuse house IDs in a round-robin fashion

### Requirement 3

**User Story:** As a developer, I want the external API data to be transformed into the dashboard's expected format, so that the UI components render correctly without modification.

#### Acceptance Criteria

1. WHEN the external API returns metrics data THEN the system SHALL map each metric to the dashboard's metric card format with value, unit, change, and change_direction
2. WHEN the external API returns consumption data THEN the system SHALL transform the hourly values array into the format expected by the LineChart component
3. WHEN the external API returns production data THEN the system SHALL transform the hourly values array into the format expected by the LineChart component
4. WHEN the external API returns net balance data THEN the system SHALL transform the 30-day data into the format with timestamp, importKwh, exportKwh, and netKwh fields
5. WHEN the external API returns energy balance data THEN the system SHALL map produced, consumed, and net values to the DonutChart component format

### Requirement 4

**User Story:** As a user, I want to see consumption and production charts for the last 7 days, so that I can understand my recent energy patterns.

#### Acceptance Criteria

1. WHEN the dashboard displays consumption data THEN the system SHALL show hourly consumption values for each of the last 7 days
2. WHEN the dashboard displays production data THEN the system SHALL show hourly production values for each of the last 7 days
3. WHEN rendering daily charts THEN the system SHALL calculate and display the daily average for each day
4. WHEN a day has incomplete data THEN the system SHALL display available data points without interpolation

### Requirement 5

**User Story:** As a user, I want to see my net balance over the last 30 days, so that I can track whether I'm a net producer or consumer of energy.

#### Acceptance Criteria

1. WHEN the dashboard displays net balance THEN the system SHALL show import, export, and net values for each of the last 30 days
2. WHEN rendering the net balance chart THEN the system SHALL use distinct colors for import (red) and export (green) data series
3. WHEN calculating net balance THEN the system SHALL compute net as export minus import for each day
4. WHEN displaying net balance metrics THEN the system SHALL show the most recent day's net value in the metric cards

### Requirement 6

**User Story:** As a user, I want to see quick action buttons that are contextually relevant, so that I can quickly access common tasks.

#### Acceptance Criteria

1. WHEN the external API returns quick actions THEN the system SHALL display each action with its title, description, and icon
2. WHEN a user clicks a quick action THEN the system SHALL navigate to the specified action URL or trigger the appropriate handler
3. WHEN quick actions are not provided by the API THEN the system SHALL display default quick actions for download invoice, change tariff, and report issue

### Requirement 7

**User Story:** As a developer, I want proper error handling and logging, so that I can diagnose issues with the external API integration.

#### Acceptance Criteria

1. WHEN an API request fails THEN the system SHALL log the error with timestamp, house ID, and error details
2. WHEN the API returns invalid data THEN the system SHALL log a validation error and fall back to mock data
3. WHEN network errors occur THEN the system SHALL retry the request up to 2 times with exponential backoff
4. WHEN all retries fail THEN the system SHALL display an error message to the user and use cached or mock data
