# Tech Stack - SiswaPresensi

## Backend

### Framework
- **Laravel:** 10/11 (Latest LTS)
- **PHP:** 8.1+ (Required for Laravel 10/11)

### Database
- **Primary:** MySQL 8.0+ atau PostgreSQL 14+
- **ODM:** Eloquent ORM (Laravel built-in)

### Authentication & Authorization
- **Package:** Laravel Sanctum
- **Type:** Token-based authentication (SPA)
- **Features:** JWT tokens, token refresh, middleware

### API
- **Type:** RESTful API
- **Documentation:** OpenAPI/Swagger
- **Tools:** Postman, Insomnia

### QR Code Generation
- **Package:** `simplesoftwareio/simple-qrcode` (Laravel)
- **Purpose:** Generate QR codes for student attendance

### Notifications
- **Service:** Firebase Cloud Messaging (FCM)
- **Type:** Web Push notifications
- **Purpose:** Real-time notifications to parents and students

---

## Frontend

### Framework
- **React:** 18+ (Latest stable)
- **Inertia.js:** Latest stable
- **Purpose:** SPA without build step

### State Management
- **Primary:** React Context API
- **Alternative:** Zustand (optional, for complex state)

### Styling
- **Framework:** Tailwind CSS 3.x
- **Purpose:** Utility-first CSS framework
- **Components:** Tailwind UI (optional, for pre-built components)

### QR Code Scanning
- **Package:** `react-qr-reader` atau browser native
- **Purpose:** Scan QR codes on teacher device

---

## Development Tools

### Backend
- **IDE:** PHPStorm atau VS Code
- **Package Manager:** Composer
- **Testing:** PHPUnit / Pest
- **Linting:** PHP CS Fixer
- **Type Checking:** PHPStan atau Psalm

### Frontend
- **IDE:** VS Code
- **Package Manager:** npm atau pnpm
- **Testing:** Jest / Vitest
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript (optional, recommended)

---

## DevOps & Infrastructure

### Version Control
- **Git:** Git
- **Hosting:** GitHub
- **CI/CD:** GitHub Actions

### Hosting
- **Development:** Local (Laravel Sail)
- **Staging:** DigitalOcean VPS atau Laravel Forge
- **Production:** DigitalOcean VPS atau Laravel Forge

### Web Server
- **Nginx:** Reverse proxy
- **PHP-FPM:** PHP processing

### SSL/TLS
- **Provider:** Let's Encrypt
- **Purpose:** HTTPS required for production

---

## Monitoring & Logging

### Error Tracking
- **Service:** Sentry
- **Purpose:** Error tracking and performance monitoring

### Application Monitoring
- **Service:** Laravel Telescope
- **Purpose:** Debugging and monitoring Laravel

### Uptime Monitoring
- **Service:** UptimeRobot
- **Purpose:** Monitor application uptime and availability

---

## Testing Tools

### Backend Testing
- **Unit Testing:** PHPUnit / Pest
- **Integration Testing:** PHPUnit / Pest
- **API Testing:** Postman / Insomnia

### Frontend Testing
- **Unit Testing:** Jest / Vitest
- **Component Testing:** React Testing Library
- **E2E Testing:** Playwright / Cypress
- **Performance Testing:** k6 / Artillery

### Security Testing
- **Tools:** OWASP ZAP, Burp Suite, Semgrep, CodeQL

### Accessibility Testing
- **Tools:** axe DevTools, Lighthouse, WAVE

---

## Third-Party Services

### Firebase
- **Purpose:** Web Push notifications
- **Services:** Cloud Messaging (FCM)
- **Documentation:** https://firebase.google.com/docs/cloud-messaging

### Google Maps API
- **Purpose:** Geofencing (optional)
- **Services:** Geocoding API
- **Documentation:** https://developers.google.com/maps

---

## Browser Support

### Desktop Browsers
- **Chrome:** Latest stable
- **Firefox:** Latest stable
- **Safari:** Latest stable
- **Edge:** Latest stable

### Mobile Browsers
- **iOS Safari:** iOS 12+
- **Chrome Mobile:** Latest stable
- **Samsung Internet:** Latest stable

---

## Summary

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Backend Framework | Laravel | 10/11 | Application framework |
| PHP | PHP | 8.1+ | Backend language |
| Database | MySQL/PostgreSQL | 8.0+/14+ | Data storage |
| Authentication | Laravel Sanctum | Latest | Token-based auth |
| Frontend Framework | React | 18+ | UI framework |
| Inertia.js | Inertia.js | Latest | SPA without build |
| Styling | Tailwind CSS | 3.x | CSS framework |
| State Management | React Context | - | State management |
| CI/CD | GitHub Actions | - | Automation |
| Hosting | DigitalOcean VPS | - | Production hosting |
| Error Tracking | Sentry | - | Error monitoring |
| Notifications | Firebase | - | Web Push |

---

## Dokumentasi Terkait
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Coding Standards](./0405-coding-standards.md)
- [Git Workflow](./0406-git-workflow.md)
- [Deployment](./0407-deployment.md)
