# Tech Stack - SiswaPresensi

> **Sumber kebenaran (source of truth)** untuk semua teknologi dan dependensi yang digunakan.
> Versi yang tercantum di sini sesuai dengan `composer.json` dan `package.json` pada project `siswapresensi-app`.

---

## Backend

### Framework
- **Laravel:** 12 (latest)
- **PHP:** 8.2+

### Database
- **Primary:** PostgreSQL 14+
- **ORM:** Eloquent ORM (Laravel built-in)

### Authentication & Authorization
- **Package:** Laravel Fortify
- **Type:** Session-based authentication (web guard)
- **Features:**
  - User registration
  - Password reset
  - Email verification
  - Two-Factor Authentication (2FA) dengan TOTP
  - Rate limiting (5 percobaan per IP)
- **Catatan:** Fortify menangani backend logic; frontend (React + Inertia) menyediakan UI sendiri

### Routing
- **Package:** Laravel Wayfinder (`laravel/wayfinder ^0.1.9`)
- **Purpose:** Type-safe route generation untuk React frontend

### QR Code Generation
- **Package:** `simplesoftwareio/simple-qrcode` (akan ditambahkan)
- **Purpose:** Generate QR codes untuk presensi siswa

### Notifications
- **Service:** Firebase Cloud Messaging (FCM) (akan ditambahkan)
- **Type:** Web Push notifications
- **Purpose:** Real-time notifications ke orang tua dan siswa

---

## Frontend

### Framework & Language
- **React:** 19
- **TypeScript:** 5.7+ (mandatory, semua file `.tsx`)
- **Inertia.js:** 2.x (`@inertiajs/react ^2.3.7`)
- **Purpose:** SPA experience dengan server-side routing (no API layer needed untuk UI)

### Build Tool
- **Vite:** 7 (`laravel-vite-plugin ^2.0`)
- **React Plugin:** `@vitejs/plugin-react ^5.0` + React Compiler (`babel-plugin-react-compiler`)
- **Wayfinder Plugin:** `@laravel/vite-plugin-wayfinder ^0.1.3`
- **SSR:** Didukung via `resources/js/ssr.tsx`

### Styling
- **Framework:** Tailwind CSS 4.0 (`@tailwindcss/vite ^4.1`)
- **Animation:** `tw-animate-css ^1.4`
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)

### UI Components
- **System:** shadcn/ui pattern (Radix UI primitives + Tailwind styling)
- **Primitives (Radix UI):**
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-collapsible`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-label`
  - `@radix-ui/react-navigation-menu`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-toggle` / `toggle-group`
  - `@radix-ui/react-tooltip`
- **Headless UI:** `@headlessui/react ^2.2` (additional headless components)
- **Icons:** `lucide-react ^0.475`
- **OTP Input:** `input-otp ^1.4` (untuk 2FA)

### State Management
- **Primary:** Inertia.js shared data (server-driven props)
- **Local:** React hooks (`useState`, `useReducer`)
- **Catatan:** Tidak menggunakan external state library (Zustand, Redux, dll.)

### QR Code Scanning
- **Package:** `react-qr-reader` atau browser native (akan ditambahkan)
- **Purpose:** Scan QR codes pada device guru

---

## Development Tools

### Backend
- **Package Manager:** Composer
- **Testing:** Pest v4 (`pestphp/pest ^4.3`, `pestphp/pest-plugin-laravel ^4.0`)
- **Linting:** Laravel Pint (`laravel/pint ^1.24`) — PSR-12 + Laravel preset
- **Debugging:** Laravel Pail (`laravel/pail ^1.2`) — real-time log viewer
- **Local Dev:** Laravel Sail (`laravel/sail ^1.41`) — Docker environment
- **AI Tooling:** Laravel Boost (`laravel/boost ^2.0`)
- **REPL:** Laravel Tinker (`laravel/tinker ^2.10`)
- **Mocking:** Mockery (`mockery/mockery ^1.6`)
- **Error Handler:** Collision (`nunomaduro/collision ^8.6`)

### Frontend
- **Package Manager:** npm
- **Linting:** ESLint 9 (flat config) + plugins:
  - `eslint-plugin-react` — React rules
  - `eslint-plugin-react-hooks` — Hooks rules
  - `eslint-plugin-import` — Import ordering
  - `typescript-eslint` — TypeScript rules
  - `eslint-config-prettier` — Disable conflicting rules
- **Formatting:** Prettier 3.4+ dengan `prettier-plugin-tailwindcss`
- **Type Checking:** TypeScript (`tsc --noEmit`)

### IDE
- **Primary:** VS Code
- **Config:** `.vscode/` settings included, EditorConfig (`.editorconfig`)

---

## DevOps & Infrastructure

### Version Control
- **Git:** Git
- **Hosting:** GitHub
- **CI/CD:** GitHub Actions (`.github/workflows/tests.yml`)

### Hosting
- **Development:** Local (`composer run dev` — menjalankan server, queue, logs, vite secara concurrent)
- **Staging:** DigitalOcean VPS atau Laravel Forge
- **Production:** DigitalOcean VPS atau Laravel Forge

### Web Server
- **Nginx:** Reverse proxy
- **PHP-FPM:** PHP processing

### SSL/TLS
- **Provider:** Let's Encrypt
- **Purpose:** HTTPS required untuk production

---

## Monitoring & Logging

### Error Tracking
- **Service:** Sentry
- **Purpose:** Error tracking dan performance monitoring

### Application Monitoring
- **Service:** Laravel Telescope (development)
- **Purpose:** Debugging dan monitoring Laravel requests, queries, jobs

### Uptime Monitoring
- **Service:** UptimeRobot
- **Purpose:** Monitor application uptime dan availability

---

## Testing Tools

### Backend Testing
- **Unit & Feature Testing:** Pest v4
- **Database Testing:** SQLite in-memory (`:memory:`) via `phpunit.xml`
- **API Testing:** Postman / Insomnia

### Frontend Testing
- **Linting:** ESLint + Prettier (build-time quality)
- **Type Checking:** TypeScript (`npm run types`)
- **E2E Testing:** Playwright (akan ditambahkan)
- **Performance Testing:** k6 / Artillery

### Security Testing
- **Tools:** OWASP ZAP, Semgrep, CodeQL

### Accessibility Testing
- **Tools:** axe DevTools, Lighthouse, WAVE

---

## Third-Party Services

### Firebase
- **Purpose:** Web Push notifications (akan ditambahkan)
- **Services:** Cloud Messaging (FCM)

### Google Maps API
- **Purpose:** Geofencing (optional)
- **Services:** Geocoding API

---

## Browser Support

### Desktop Browsers
- **Chrome:** Latest stable
- **Firefox:** Latest stable
- **Safari:** Latest stable
- **Edge:** Latest stable

### Mobile Browsers
- **iOS Safari:** iOS 14+
- **Chrome Mobile:** Latest stable
- **Samsung Internet:** Latest stable

---

## Summary

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Backend Framework | Laravel | 12 | Application framework |
| PHP | PHP | 8.2+ | Backend language |
| Database | PostgreSQL | 14+ | Data storage |
| Authentication | Laravel Fortify | ^1.30 | Session-based auth + 2FA |
| Frontend Framework | React | 19 | UI framework |
| Language | TypeScript | 5.7+ | Type-safe frontend |
| SPA Bridge | Inertia.js | 2.x | Server-driven SPA |
| Styling | Tailwind CSS | 4.0 | CSS framework |
| UI Components | Radix UI / shadcn | Latest | Accessible primitives |
| Build Tool | Vite | 7 | Frontend bundler |
| Testing | Pest | 4.x | Backend testing |
| Linting (PHP) | Laravel Pint | ^1.24 | Code formatting |
| Linting (JS) | ESLint + Prettier | 9 / 3.4 | Frontend quality |
| CI/CD | GitHub Actions | — | Automation |
| Hosting | DigitalOcean VPS | — | Production hosting |
| Error Tracking | Sentry | — | Error monitoring |
| Notifications | Firebase | — | Web Push (planned) |

---

## Dokumentasi Terkait
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Coding Standards](./0405-coding-standards.md)
- [Git Workflow](./0406-git-workflow.md)
- [Deployment](./0407-deployment.md)
