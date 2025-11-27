# Requirements Document - P2P Energy Trading & Local Energy Communities

## Introduction

This document specifies the requirements for implementing Peer-to-Peer (P2P) Energy Trading and Local Energy Community features in the customer energy portal. The system enables customers to share, trade, and monitor energy within their local community while maintaining privacy and compliance with EU Energy Communities framework.

## Glossary

- **System**: The customer energy portal application
- **User**: A registered customer of the energy provider
- **Prosumer**: A user who both produces and consumes energy
- **Consumer**: A user who only consumes energy
- **Community**: A Local Energy Community as defined by EU regulations
- **P2P Trade**: A peer-to-peer energy transaction between community members
- **Trading Rule**: An automated condition for buying or selling energy
- **Community Price**: The current market price for energy within the community
- **Anonymized ID**: A privacy-preserving identifier (e.g., "House A17", "Prosumer #23")
- **Self-Sufficiency Ratio**: Percentage of community consumption covered by local production
- **Trading Offer**: A buy or sell proposal in the community marketplace
- **Grid Tariff**: The standard retail electricity price
- **Feed-in Tariff**: The standard price paid for exporting to the grid

## Requirements

### Requirement 1

**User Story:** As a user, I want to view my local energy community dashboard, so that I can understand the community's energy production, consumption, and trading activity.

#### Acceptance Criteria

1. WHEN a user accesses the community dashboard THEN the System SHALL display total community production in kWh for selectable periods (today, week, month)
2. WHEN a user accesses the community dashboard THEN the System SHALL display total community consumption in kWh for the selected period
3. WHEN a user accesses the community dashboard THEN the System SHALL display the share of self-consumption versus traded energy
4. WHEN a user accesses the community dashboard THEN the System SHALL display the number of active members in the community
5. WHEN a user accesses the community dashboard THEN the System SHALL display total P2P energy traded in kWh
6. WHEN a user accesses the community dashboard THEN the System SHALL display total community savings versus standard grid-only supply
7. WHEN a user accesses the community dashboard THEN the System SHALL display CO₂ emissions avoided through local energy sharing
8. WHEN a user accesses the community dashboard THEN the System SHALL display a visual chart comparing community production versus consumption
9. WHEN a user accesses the community dashboard THEN the System SHALL display a visual chart comparing P2P traded energy versus grid-imported energy
10. WHEN a user accesses the community dashboard THEN the System SHALL display a time-series chart showing daily, weekly, or monthly evolution of P2P trading

### Requirement 2

**User Story:** As a user, I want to view anonymized community members, so that I can see who participates while respecting their privacy.

#### Acceptance Criteria

1. WHEN the System displays community members THEN the System SHALL show participants using anonymized identifiers
2. WHEN the System displays community members THEN the System SHALL NOT reveal exact addresses of participants
3. WHEN the System displays community members THEN the System SHALL display at most approximate locality information (district or postcode zone)
4. WHEN the System displays community members THEN the System SHALL indicate whether each member is a prosumer or consumer
5. WHEN the System displays a community map THEN the System SHALL show approximate locations without precise coordinates

### Requirement 3

**User Story:** As a user, I want to view the P2P trading marketplace, so that I can see available energy offers and make informed trading decisions.

#### Acceptance Criteria

1. WHEN a user accesses the P2P marketplace THEN the System SHALL display the current real-time local market price in €/kWh
2. WHEN a user accesses the P2P marketplace THEN the System SHALL display all active community buy offers
3. WHEN displaying buy offers THEN the System SHALL show volume requested in kWh, price willing to pay in €/kWh, and time window
4. WHEN a user accesses the P2P marketplace THEN the System SHALL display all active community sell offers
5. WHEN displaying sell offers THEN the System SHALL show available surplus in kWh, minimum price in €/kWh, and time window
6. WHEN a user views the marketplace THEN the System SHALL provide filter options for time window (now, today, week)
7. WHEN a user views the marketplace THEN the System SHALL provide filter options for price range
8. WHEN a user views the marketplace THEN the System SHALL provide filter options for energy type (green energy, local neighborhood)
9. WHEN displaying trading offers THEN the System SHALL show the anonymized ID of the offering party

### Requirement 4

**User Story:** As a user, I want to create automated trading rules, so that I can participate in P2P trading without manual intervention.

#### Acceptance Criteria

1. WHEN a user creates a buy rule THEN the System SHALL allow specification of maximum energy per day or week in kWh
2. WHEN a user creates a buy rule THEN the System SHALL allow specification of maximum price in €/kWh
3. WHEN a user creates a buy rule THEN the System SHALL allow specification of preferred time windows
4. WHEN a user creates a sell rule THEN the System SHALL allow specification of minimum battery state of charge before selling
5. WHEN a user creates a sell rule THEN the System SHALL allow specification of minimum price in €/kWh
6. WHEN a user creates a sell rule THEN the System SHALL allow specification of time constraints
7. WHEN a user creates a trading rule THEN the System SHALL provide simulated outcomes based on historical data
8. WHEN a user views their trading rules THEN the System SHALL display which rules are currently active
9. WHEN a user views their trading rules THEN the System SHALL display which rules have been matched
10. WHEN a user modifies a trading rule THEN the System SHALL allow enabling or disabling the rule with a simple toggle

### Requirement 5

**User Story:** As a user, I want to view real-time pricing signals, so that I can make optimal trading decisions.

#### Acceptance Criteria

1. WHEN a user accesses pricing information THEN the System SHALL display the current P2P community price
2. WHEN a user accesses pricing information THEN the System SHALL display the standard retail tariff for comparison
3. WHEN a user accesses pricing information THEN the System SHALL display the feed-in tariff for comparison
4. WHEN a user accesses pricing information THEN the System SHALL display any applicable dynamic grid tariff
5. WHEN the System detects favorable trading conditions THEN the System SHALL display a "Good time to sell now" indicator
6. WHEN the System detects favorable buying conditions THEN the System SHALL display a "Good time to buy now" indicator
7. WHEN community price exceeds grid price THEN the System SHALL display a warning indicator
8. WHEN a user accesses pricing information THEN the System SHALL display short-term price forecasts
9. WHEN a user accesses pricing information THEN the System SHALL display expected high or low price periods

### Requirement 6

**User Story:** As a user, I want to view my personal P2P trading history, so that I can track my participation and savings.

#### Acceptance Criteria

1. WHEN a user accesses their trading history THEN the System SHALL display a list of all completed trades
2. WHEN displaying a trade THEN the System SHALL show time and date, role (buyer or seller), quantity in kWh, executed price in €/kWh, and anonymized counterparty
3. WHEN a user views trading history THEN the System SHALL provide aggregation by selectable periods
4. WHEN displaying aggregated data THEN the System SHALL show total energy bought from community in kWh
5. WHEN displaying aggregated data THEN the System SHALL show total energy sold to community in kWh
6. WHEN displaying aggregated data THEN the System SHALL show effective average price paid versus normal tariff
7. WHEN displaying aggregated data THEN the System SHALL show effective average price received versus feed-in tariff
8. WHEN displaying savings THEN the System SHALL calculate and display amount saved by buying from community versus standard tariff
9. WHEN displaying earnings THEN the System SHALL calculate and display additional amount earned by selling to community versus feed-in tariff
10. WHEN a user views trading history THEN the System SHALL display a graph of monthly net P2P trading balance in kWh and €
11. WHEN a user views trading history THEN the System SHALL display a graph comparing executed prices versus standard tariff over time

### Requirement 7

**User Story:** As a user, I want to view community-level statistics, so that I can understand the collective impact and participation.

#### Acceptance Criteria

1. WHEN a user accesses community insights THEN the System SHALL display the percentage of energy covered by local P2P trading versus total consumption
2. WHEN a user accesses community insights THEN the System SHALL display the community self-sufficiency ratio
3. WHEN a user accesses community insights THEN the System SHALL display CO₂ savings for the community as a whole
4. WHEN a user accesses community insights THEN the System SHALL display the participation rate (percentage of members who traded in the last period)
5. WHEN a user accesses community insights THEN the System SHALL display anonymized leaderboards for top energy sharers
6. WHEN a user accesses community insights THEN the System SHALL display anonymized leaderboards for top green consumers
7. WHEN displaying leaderboards THEN the System SHALL NOT reveal personal identification information

### Requirement 8

**User Story:** As a user, I want to understand how the energy community works, so that I can make informed decisions about participation.

#### Acceptance Criteria

1. WHEN a user accesses the legal information page THEN the System SHALL explain what an EU Energy Community is
2. WHEN a user accesses the legal information page THEN the System SHALL explain how local trading works on the platform
3. WHEN a user accesses the legal information page THEN the System SHALL explain what data is used and how privacy is protected
4. WHEN a user accesses the legal information page THEN the System SHALL clarify that community participation is voluntary
5. WHEN a user accesses the legal information page THEN the System SHALL clarify that users retain their rights as customers and prosumers
6. WHEN a user accesses the legal information page THEN the System SHALL clarify that P2P trading is mediated by the energy provider according to regulations

### Requirement 9

**User Story:** As a user, I want to see community trading information on my main dashboard, so that I can quickly access relevant information without navigating to a separate section.

#### Acceptance Criteria

1. WHEN a user views the main dashboard THEN the System SHALL display a summary card showing energy bought from community today
2. WHEN a user views the main dashboard THEN the System SHALL display a summary card showing energy sold to community today
3. WHEN a user views the main dashboard THEN the System SHALL display a summary card showing monthly savings from community sharing
4. WHEN a user views the main dashboard THEN the System SHALL provide a shortcut button to access the community trading section
5. WHEN a user views the home energy flow visualization THEN the System SHALL include community import and export as energy sources

### Requirement 10

**User Story:** As a user, I want to join or leave an energy community, so that I can control my participation.

#### Acceptance Criteria

1. WHEN a user is not part of a community THEN the System SHALL display available communities to join
2. WHEN a user selects a community to join THEN the System SHALL require explicit consent
3. WHEN a user joins a community THEN the System SHALL confirm membership and display community dashboard access
4. WHEN a user is part of a community THEN the System SHALL provide an option to leave the community
5. WHEN a user leaves a community THEN the System SHALL cancel all active trading rules
6. WHEN a user leaves a community THEN the System SHALL settle any pending trades

### Requirement 11

**User Story:** As a user, I want to receive notifications about trading activity, so that I stay informed about my participation.

#### Acceptance Criteria

1. WHEN a user's trading rule is matched THEN the System SHALL send a notification
2. WHEN a trade is executed THEN the System SHALL send a notification with trade details
3. WHEN community price reaches a favorable level THEN the System SHALL send a notification if user has enabled price alerts
4. WHEN a user's battery reaches the minimum state of charge for selling THEN the System SHALL send a notification
5. WHEN community has surplus energy available THEN the System SHALL send a notification to potential buyers

### Requirement 12

**User Story:** As a system administrator, I want to ensure data privacy and regulatory compliance, so that the platform meets EU Energy Communities framework requirements.

#### Acceptance Criteria

1. WHEN the System stores user data THEN the System SHALL comply with GDPR requirements
2. WHEN the System displays trading information THEN the System SHALL anonymize all personal identifiers
3. WHEN the System processes trades THEN the System SHALL maintain an audit trail for regulatory compliance
4. WHEN the System calculates prices THEN the System SHALL apply transparent pricing algorithms
5. WHEN the System mediates trades THEN the System SHALL ensure fair access to all community members
6. WHEN the System handles user consent THEN the System SHALL maintain explicit records of community participation agreements

## Data Privacy & Security

- All personal data SHALL be processed in accordance with GDPR
- Trading counterparties SHALL be anonymized in user-facing displays
- Location data SHALL be limited to approximate zones (district/postcode)
- User consent SHALL be explicitly obtained before joining a community
- Audit trails SHALL be maintained for all trades for regulatory compliance

## Performance Requirements

- Community dashboard SHALL load within 2 seconds
- Real-time price updates SHALL occur at least every 30 seconds
- Trading rule matching SHALL execute within 5 seconds of offer creation
- Historical data queries SHALL return results within 3 seconds

## Accessibility Requirements

- All UI components SHALL meet WCAG 2.1 AA standards
- Charts and graphs SHALL include text alternatives
- Color coding SHALL not be the only means of conveying information
- Keyboard navigation SHALL be fully supported
