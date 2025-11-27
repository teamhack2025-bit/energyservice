# Requirements Document

## Introduction

This document outlines the requirements for migrating the Energy Customer Portal from mock data to a production-ready Supabase database with 1000 synthetic customer records. The system currently uses client-side mock data generators across multiple dashboard pages (main dashboard, energy home, community, and energy sharing). This migration will replace all mock data with real database queries, enabling multi-tenant support and realistic data persistence.

## Glossary

- **Energy Portal**: The web application providing energy monitoring and management features
- **Supabase**: PostgreSQL database platform with real-time capabilities and REST API
- **Customer**: An individual household or business using the energy monitoring system
- **Device**: Physical energy equipment (solar panels, batteries, heat pumps, EV chargers, etc.)
- **Energy Reading**: Time-series data point capturing production, consumption, and grid interaction
- **Financial Data**: Monthly billing information including costs, revenue, and taxes
- **Mock Data**: Synthetic data generated client-side for demonstration purposes
- **Multi-tenant**: System architecture supporting multiple independent customers
- **Energy Flow**: Real-time snapshot of energy production, consumption, and distribution
- **Community**: Group of customers participating in peer-to-peer energy trading
- **Energy Sharing Group**: Cooperative arrangement where members share locally produced energy

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want to set up a Supabase database with comprehensive schema, so that the application can store and retrieve real customer energy data.

#### Acceptance Criteria

1. WHEN the database schema is created THEN the system SHALL include tables for customers, devices, energy_readings, financial_data, community_members, energy_sharing_groups, and sharing_transactions
2. WHEN tables are created THEN the system SHALL define appropriate indexes on customer_id, timestamp, and frequently queried fields for optimal performance
3. WHEN tables are created THEN the system SHALL enable Row Level Security (RLS) policies for multi-tenant data isolation
4. WHEN foreign key relationships are defined THEN the system SHALL enforce referential integrity with CASCADE delete operations
5. WHEN enum types are needed THEN the system SHALL define device_type, device_status, transaction_status, and member_role enums

### Requirement 2

**User Story:** As a system administrator, I want to generate 1000 realistic Luxembourg customer records with complete energy data, so that the application can demonstrate production-ready functionality.

#### Acceptance Criteria

1. WHEN generating customer data THEN the system SHALL create 1000 unique customers with realistic Luxembourg names, addresses, postcodes, and cities
2. WHEN generating device data THEN the system SHALL assign 3-8 devices per customer with realistic distributions (80% solar panels, 30% batteries, 40% heat pumps, 25% EV chargers, 10% wind turbines)
3. WHEN generating energy readings THEN the system SHALL create hourly readings for the last 30 days with realistic production patterns based on time of day, season, and weather
4. WHEN calculating consumption THEN the system SHALL model realistic usage patterns with morning peaks (6-9 AM), evening peaks (5-10 PM), and nighttime reduction
5. WHEN generating financial data THEN the system SHALL calculate monthly bills using Luxembourg energy prices (€0.28/kWh import, €0.08/kWh export, 17% VAT)
6. WHEN generating community data THEN the system SHALL create 5-10 community groups with 20-50 members each and realistic trading activity
7. WHEN generating energy sharing data THEN the system SHALL create 3-5 sharing groups with 5-15 members each and realistic energy distribution patterns

### Requirement 3

**User Story:** As a developer, I want TypeScript types generated from the Supabase schema, so that I have type-safe database queries throughout the application.

#### Acceptance Criteria

1. WHEN the schema is defined THEN the system SHALL generate TypeScript interfaces matching all database tables
2. WHEN types are generated THEN the system SHALL include Row, Insert, and Update types for each table
3. WHEN types are used THEN the system SHALL provide compile-time type checking for all database operations
4. WHEN enum types exist THEN the system SHALL generate corresponding TypeScript union types

### Requirement 4

**User Story:** As a developer, I want a centralized Supabase client configuration, so that all API routes and components can access the database consistently.

#### Acceptance Criteria

1. WHEN the Supabase client is initialized THEN the system SHALL use environment variables for URL and API keys
2. WHEN the client is created THEN the system SHALL include TypeScript generic types for the database schema
3. WHEN authentication is needed THEN the system SHALL provide helper functions to get the current customer ID
4. WHEN the client is imported THEN the system SHALL be available as a singleton instance across the application

### Requirement 5

**User Story:** As a developer, I want API routes that fetch real data from Supabase, so that the dashboard displays actual customer information instead of mock data.

#### Acceptance Criteria

1. WHEN the dashboard API is called THEN the system SHALL return customer info, devices, today's stats, monthly financial data, last 30 days trends, and last 7 days consumption/production
2. WHEN the energy home API is called THEN the system SHALL return real-time energy flow data including solar production, battery status, consumption by zone, and grid interaction
3. WHEN the community API is called THEN the system SHALL return community overview, member list, trading statistics, and recent transactions
4. WHEN the energy sharing API is called THEN the system SHALL return group overview, member contributions, pricing rules, and energy distribution
5. WHEN any API encounters an error THEN the system SHALL return appropriate HTTP status codes and error messages
6. WHEN APIs are called THEN the system SHALL filter data by the authenticated customer ID for multi-tenant isolation

### Requirement 6

**User Story:** As a developer, I want service layer classes that encapsulate database queries, so that business logic is separated from API routes and can be reused.

#### Acceptance Criteria

1. WHEN service methods are called THEN the system SHALL execute optimized Supabase queries with appropriate filters and joins
2. WHEN aggregating data THEN the system SHALL perform calculations efficiently using database queries rather than client-side processing
3. WHEN time-series data is requested THEN the system SHALL group readings by hour or day as appropriate
4. WHEN service methods encounter errors THEN the system SHALL throw descriptive exceptions that can be handled by API routes

### Requirement 7

**User Story:** As a user, I want the main dashboard to display my real energy data, so that I can monitor my actual production, consumption, and costs.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL fetch and display today's net balance, monthly cost, monthly revenue, and efficiency percentage from the database
2. WHEN the dashboard displays charts THEN the system SHALL show last 30 days import/export trends and last 7 days consumption/production from real data
3. WHEN the dashboard shows energy balance THEN the system SHALL calculate produced, consumed, and net values from actual readings
4. WHEN the dashboard updates THEN the system SHALL replace all mock data generators with API calls to Supabase

### Requirement 8

**User Story:** As a user, I want the energy home page to display my real-time smart home data, so that I can monitor and control my devices accurately.

#### Acceptance Criteria

1. WHEN the energy home page loads THEN the system SHALL fetch current energy flow including solar production, battery state, consumption by zone, and grid interaction
2. WHEN the timeline graph displays THEN the system SHALL show 24-hour historical data from actual readings
3. WHEN financial summary displays THEN the system SHALL calculate costs and savings from real transaction data
4. WHEN device details are shown THEN the system SHALL retrieve actual device specifications and status from the database

### Requirement 9

**User Story:** As a user, I want the community page to display real peer-to-peer trading data, so that I can participate in the energy marketplace with actual members.

#### Acceptance Criteria

1. WHEN the community page loads THEN the system SHALL display actual community members with their real production and consumption data
2. WHEN trading offers are shown THEN the system SHALL retrieve active buy and sell offers from the database
3. WHEN transaction history displays THEN the system SHALL show completed trades with actual timestamps and amounts
4. WHEN community statistics are calculated THEN the system SHALL aggregate real data from all community members

### Requirement 10

**User Story:** As a user, I want the energy sharing page to display my group's real data, so that I can see actual energy distribution and member contributions.

#### Acceptance Criteria

1. WHEN the energy sharing page loads THEN the system SHALL display the user's sharing group with actual member data
2. WHEN energy flow visualization displays THEN the system SHALL show real-time distribution based on actual production and consumption
3. WHEN member contributions are shown THEN the system SHALL calculate actual energy shared and received from database records
4. WHEN pricing controls are displayed THEN the system SHALL retrieve actual group pricing rules from the database

### Requirement 11

**User Story:** As a developer, I want a data generation script that can be run independently, so that I can populate the database with test data for development and demonstration.

#### Acceptance Criteria

1. WHEN the generation script runs THEN the system SHALL create all 1000 customers with complete data in under 5 minutes
2. WHEN inserting data THEN the system SHALL use batch operations (100-1000 records per batch) for optimal performance
3. WHEN the script encounters errors THEN the system SHALL log detailed error messages and continue processing remaining batches
4. WHEN the script completes THEN the system SHALL output summary statistics showing record counts for each table
5. WHEN the script is run multiple times THEN the system SHALL handle duplicate key conflicts gracefully

### Requirement 12

**User Story:** As a developer, I want comprehensive environment variable configuration, so that the application can connect to different Supabase instances for development, staging, and production.

#### Acceptance Criteria

1. WHEN environment variables are set THEN the system SHALL require NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for client-side access
2. WHEN the data generation script runs THEN the system SHALL require SUPABASE_SERVICE_ROLE_KEY for admin operations
3. WHEN environment variables are missing THEN the system SHALL provide clear error messages indicating which variables are required
4. WHEN the application starts THEN the system SHALL validate that all required environment variables are present

### Requirement 13

**User Story:** As a developer, I want migration documentation that guides the setup process, so that other developers can replicate the database configuration.

#### Acceptance Criteria

1. WHEN the documentation is read THEN the system SHALL provide step-by-step instructions for creating a Supabase project
2. WHEN the documentation describes schema setup THEN the system SHALL include the complete SQL schema with explanations
3. WHEN the documentation covers data generation THEN the system SHALL explain how to run the script and verify results
4. WHEN the documentation addresses troubleshooting THEN the system SHALL include common issues and their solutions
5. WHEN the documentation describes API integration THEN the system SHALL explain how each page connects to the new endpoints
