# Energy Customer Portal - Product Specification

Complete product specification, data model, API design, and UI documentation for a full-featured Customer Portal serving energy consumers, prosumers, and hybrid users.

## 📚 Documentation Structure

This repository contains comprehensive documentation for designing and implementing a Customer Portal for an energy company startup:

### 1. [PRODUCT_SPECIFICATION.md](./PRODUCT_SPECIFICATION.md)
**Main product specification document covering:**
- User types and roles (Customer, Prosumer, Business, Admin)
- Complete sitemap and navigation structure
- Module overviews (12 main sections)
- User journeys and workflows
- Design principles and KPIs
- Future enhancements roadmap

### 2. [DATA_MODEL.md](./DATA_MODEL.md)
**Complete data model specification including:**
- Entity relationship diagrams
- TypeScript interfaces for all entities
- Core entities: User, Account, Site, Meter, Contract, Invoice, etc.
- Production entities: SolarSystem, Inverter, Battery, EVCharger
- Support entities: Ticket, Notification, AlertPreference
- Database indexes and relationships

### 3. [API_DESIGN.md](./API_DESIGN.md)
**RESTful API and GraphQL schema design:**
- Complete REST API endpoints (50+ endpoints)
- Authentication and authorization
- Consumption, production, and net balance APIs
- Billing and payment endpoints
- Device and asset management
- Forecast and insights APIs
- Admin endpoints
- GraphQL schema (alternative approach)
- Error handling and rate limiting

### 4. [UI_COMPONENTS.md](./UI_COMPONENTS.md)
**Detailed UI component library and page descriptions:**
- Core UI components (Layout, Data Display, Forms, Status)
- Chart components (Line, Bar, Donut, Gauge, Heatmap)
- Form components (DateRangePicker, Select, Input, Button)
- Complete page layouts for all 12 modules
- Responsive behavior (Mobile, Tablet, Desktop)
- Accessibility features

### 5. [WIREFRAMES.md](./WIREFRAMES.md)
**Visual wireframes and layout descriptions:**
- Design system (colors, typography, spacing)
- Layout grids for desktop and mobile
- Detailed wireframes for key pages
- Component wireframes
- Mobile adaptations
- Interaction patterns
- Animation guidelines

## 🎯 Key Features

### For Consumers
- Real-time and historical consumption analytics
- Cost tracking and billing management
- Contract and tariff management
- Usage comparisons and benchmarking
- Goal setting and tracking

### For Prosumers
- Production monitoring (solar, wind, battery)
- Self-consumption and export tracking
- Feed-in revenue management
- Net balance visualization
- Device status monitoring

### For Businesses
- Multi-site management
- Business-specific analytics
- Tax reporting data
- Team access capabilities

### For Admins
- Customer management
- Contract and tariff administration
- Manual meter reading adjustments
- Ticket management
- System monitoring

## 🏗️ Technical Stack (Recommended)

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts or Chart.js
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table
- **Date Handling:** date-fns
- **State Management:** Zustand or React Context

## 📋 Implementation Checklist

### Phase 1: Foundation
- [ ] Project setup (Next.js, TypeScript, Tailwind)
- [ ] Authentication system (JWT)
- [ ] Layout components (AppShell, Sidebar, Header)
- [ ] Core UI components (Button, Input, Card, etc.)
- [ ] Routing structure

### Phase 2: Core Features
- [ ] Dashboard page
- [ ] Consumption module
- [ ] Production module
- [ ] Net balance view
- [ ] Basic charts integration

### Phase 3: Billing & Contracts
- [ ] Billing page and invoice detail
- [ ] Payment methods management
- [ ] Contracts and tariffs
- [ ] Tariff comparison tool

### Phase 4: Devices & Assets
- [ ] Device listing and detail pages
- [ ] Meter management
- [ ] Solar system monitoring
- [ ] Battery and EV charger views

### Phase 5: Advanced Features
- [ ] Forecast and insights
- [ ] Notifications system
- [ ] Support ticketing
- [ ] Settings and profile management

### Phase 6: Admin Console
- [ ] Admin dashboard
- [ ] Customer management
- [ ] Ticket management
- [ ] System monitoring

## 🔐 Security Considerations

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens for state-changing operations
- Rate limiting on API endpoints
- Secure password storage (bcrypt)
- Two-factor authentication (2FA) support

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Color contrast requirements
- Focus indicators
- Skip links

## 📱 Responsive Design

- **Mobile:** < 640px (single column, drawer navigation)
- **Tablet:** 640px - 1024px (2 columns, adapted navigation)
- **Desktop:** > 1024px (full layout, sidebar navigation)
- **Large Desktop:** > 1440px (optimized spacing)

## 🚀 Getting Started

1. Review the [PRODUCT_SPECIFICATION.md](./PRODUCT_SPECIFICATION.md) for overall understanding
2. Study the [DATA_MODEL.md](./DATA_MODEL.md) for database schema
3. Review [API_DESIGN.md](./API_DESIGN.md) for backend integration
4. Use [UI_COMPONENTS.md](./UI_COMPONENTS.md) for component implementation
5. Reference [WIREFRAMES.md](./WIREFRAMES.md) for visual design guidance

## 📝 Notes

- All monetary values should support multiple currencies (EUR, USD, etc.)
- Date/time handling should respect user timezone settings
- Charts should be interactive and exportable
- Data exports should support CSV and PDF formats
- Real-time updates via WebSocket (optional, Phase 2+)

## 🤝 Contributing

This is a specification document. When implementing:
1. Follow the data models and API contracts defined here
2. Maintain consistency with the UI component library
3. Ensure responsive design across all breakpoints
4. Test accessibility features thoroughly
5. Document any deviations from the specification

## 📄 License

This specification is provided for implementation purposes.

---

**Last Updated:** January 2025  
**Version:** 1.0.0

