# Dependencies - SiswaPresensi

## External APIs

### Firebase: Web Push Notifications

**Purpose:** Send real-time notifications to parents and students

**Version:** Latest stable version

**Integration Plan:**
- Use Firebase Cloud Messaging (FCM) for web push
- Implement notification types: attendance, approval, reminders
- Queue notifications for reliability
- Use sandbox mode for development
- Switch to production environment before launch

**Criticality:** Required for notifications (Priority 2)

**Alternatives:** OneSignal, Pusher

**Documentation:** https://firebase.google.com/docs/cloud-messaging

---

### Google Maps API: Geofencing

**Purpose:** Validate student location within school radius (prevent cheating)

**Version:** Latest stable version

**Integration Plan:**
- Use Google Maps Geocoding API for location validation
- Calculate distance between student and school
- Validate QR code only within configured radius
- Use API key for development and production
- Monitor API usage and costs

**Criticality:** Optional for geofencing (Priority 2)

**Alternatives:** OpenStreetMap, Mapbox

**Documentation:** https://developers.google.com/maps

---

## Third-Party Services

### Hosting: DigitalOcean VPS

**Purpose:** Host application (Laravel + React)

**Version:** Latest stable Ubuntu LTS

**Integration Plan:**
- Deploy Laravel application on VPS
- Use Nginx as web server
- Use PHP-FPM for PHP processing
- Use MySQL or PostgreSQL for database
- Setup SSL certificate with Let's Encrypt
- Configure firewall and security

**Criticality:** Required for deployment

**Alternatives:** AWS, Google Cloud, Shared hosting

**Documentation:** https://www.digitalocean.com/docs/

---

### Monitoring: Sentry

**Purpose:** Error tracking and performance monitoring

**Version:** Latest stable version

**Integration Plan:**
- Integrate Sentry SDK for Laravel
- Integrate error tracking for React
- Configure error alerts
- Monitor performance metrics
- Track user sessions for debugging

**Criticality:** Required for production

**Alternatives:** New Relic, Datadog

**Documentation:** https://docs.sentry.io/

---

### Uptime Monitoring: UptimeRobot

**Purpose:** Monitor application uptime and availability

**Version:** Free tier

**Integration Plan:**
- Monitor main application URL
- Monitor API endpoints
- Configure alerts for downtime
- Monitor response times

**Criticality:** Required for production

**Alternatives:** Pingdom, StatusCake

**Documentation:** https://uptimerobot.com/

---

## Internal Dependencies

### Team Dependencies

#### Business Analyst (BA)
- **Required by:** Project Manager (PM)
- **What we need:** Complete BA documentation (requirements, personas, journeys, features, business rules, constraints, success metrics)
- **Timeline:** Jan 2026
- **Status:** Complete ✅

#### Project Manager (PM)
- **Required by:** Backend Developer, Frontend Developer, QA Engineer
- **What we need:** Complete PM documentation (roadmap, phases, resources, risks, dependencies, quality standards, communication)
- **Timeline:** Feb 2026
- **Status:** In Progress

#### Backend Developer
- **Required by:** Frontend Developer, QA Engineer
- **What we need:** Functional API endpoints, database schema, authentication system, business logic
- **Timeline:** Feb-Jun 2026
- **Status:** Pending

#### Frontend Developer
- **Required by:** QA Engineer
- **What we need:** Functional UI components, user interface, responsive design
- **Timeline:** Feb-Jun 2026
- **Status:** Pending

#### QA Engineer
- **Required by:** Project Manager, Stakeholders
- **What we need:** Test results, bug reports, acceptance criteria verification
- **Timeline:** May-Jun 2026
- **Status:** Pending

---

### Technical Dependencies

#### Laravel Framework
- **Required by:** Backend Developer
- **What we need:** Laravel 10/11 installed and configured
- **Timeline:** Feb 2026
- **Status:** Pending

#### Inertia.js
- **Required by:** Frontend Developer
- **What we need:** Inertia.js adapter for Laravel and React
- **Timeline:** Feb 2026
- **Status:** Pending

#### React
- **Required by:** Frontend Developer
- **What we need:** React installed and configured
- **Timeline:** Feb 2026
- **Status:** Pending

#### Tailwind CSS
- **Required by:** Frontend Developer
- **What we need:** Tailwind CSS installed and configured
- **Timeline:** Feb 2026
- **Status:** Pending

#### Database (MySQL/PostgreSQL)
- **Required by:** Backend Developer
- **What we need:** Database server installed and configured
- **Timeline:** Feb 2026
- **Status:** Pending

---

### Feature Dependencies

#### Authentication System
- **Required by:** All admin features, User management
- **Dependencies:** Laravel Fortify
- **Timeline:** Feb 2026
- **Status:** Pending

#### Manajemen Sekolah (Kelas, Mapel, Jadwal)
- **Required by:** Manajemen Siswa, Manajemen Guru, Presensi System
- **Dependencies:** Authentication System
- **Timeline:** Mar 2026
- **Status:** Pending

#### Manajemen Siswa
- **Required by:** Presensi System, Parent Portal
- **Dependencies:** Manajemen Sekolah
- **Timeline:** Mar 2026
- **Status:** Pending

#### Manajemen Guru
- **Required by:** Presensi System, Approval Workflow
- **Dependencies:** Manajemen Sekolah
- **Timeline:** Mar 2026
- **Status:** Pending

#### Manajemen Orang Tua
- **Required by:** Parent Portal
- **Dependencies:** Manajemen Siswa
- **Timeline:** Mar 2026
- **Status:** Pending

#### QR Code System
- **Required by:** Presensi System (Scan & Generate)
- **Dependencies:** Manajemen Siswa, Manajemen Jadwal
- **Timeline:** Mar 2026
- **Status:** Pending

#### Presensi System
- **Required by:** Laporan Transaksi
- **Dependencies:** QR Code System, Manajemen Jadwai, Manajemen Siswa
- **Timeline:** Mar 2026
- **Status:** Pending

#### Request Izin/Sakit
- **Required by:** Approval Workflow
- **Dependencies:** Manajemen Siswa, Manajemen Orang Tua
- **Timeline:** Apr 2026
- **Status:** Pending

#### Approval Workflow
- **Required by:** Auto-Marking Presensi
- **Dependencies:** Request Izin/Sakit, Manajemen Guru
- **Timeline:** Apr 2026
- **Status:** Pending

#### Auto-Marking Presensi
- **Required by:** Tidak ada
- **Dependencies:** Approval Workflow
- **Timeline:** Apr 2026
- **Status:** Pending

#### Laporan Transaksi
- **Required by:** Tidak ada
- **Dependencies:** Presensi System
- **Timeline:** Mar 2026
- **Status:** Pending

---

## Dependency Graph

```
BA Documentation (Complete)
    ↓
PM Documentation (In Progress)
    ↓
Foundation Setup
    ├── Laravel Framework
    ├── Inertia.js
    ├── React
    ├── Tailwind CSS
    ├── Database (MySQL/PostgreSQL)
    └── Authentication System
        ↓
Manajemen Sekolah (Kelas, Mapel, Jadwal)
    ↓
├── Manajemen Siswa
│   ↓
│   ├── QR Code System
│   │   ↓
│   │   └── Presensi System
│   │       ↓
│   │       └── Laporan Transaksi
│   │
│   └── Manajemen Orang Tua
│       ↓
│       └── Request Izin/Sakit
│           ↓
│           └── Approval Workflow
│               ↓
│               └── Auto-Marking Presensi
│
└── Manajemen Guru
    ↓
    └── Approval Workflow
```

---

## Dependency Risks

### High-Risk Dependencies

1. **Firebase (Notifications)** - Integration issues or API changes
   - **Risk:** Integration issues or API changes
   - **Mitigation:** Start integration early, use sandbox, have fallback

2. **Google Maps (Geofencing)** - API quota or changes
   - **Risk:** API quota or changes
   - **Mitigation:** Monitor usage, have alternative (OpenStreetMap)

3. **Authentication System** - Security vulnerabilities
   - **Risk:** Security vulnerabilities
   - **Mitigation:** Use Laravel Fortify, follow security best practices

### Medium-Risk Dependencies

1. **Database Design** - Poor schema design leading to performance issues
   - **Risk:** Poor schema design leading to performance issues
   - **Mitigation:** Design thoroughly, test with realistic data, optimize queries

2. **Feature Dependencies** - Delays in one feature blocking dependent features
   - **Risk:** Delays in one feature blocking dependent features
   - **Mitigation:** Prioritize critical path, have contingency plan

### Low-Risk Dependencies

1. **UI Framework (React, Tailwind)** - Learning curve or compatibility issues
   - **Risk:** Learning curve or compatibility issues
   - **Mitigation:** Use stable versions, follow documentation

---

## Dependency Management Plan

### Weekly Dependency Review
- Check status of all dependencies
- Identify blocked dependencies
- Update timeline if needed
- Communicate delays to stakeholders

### Dependency Tracking
- Use project management tool (Jira, Linear) to track dependencies
- Link related tasks and features
- Set due dates for critical dependencies

### Dependency Resolution
- Prioritize critical path dependencies
- Allocate resources to unblock dependencies
- Escalate blocking issues to project manager

---

## Dokumentasi Terkait
- [Project Roadmap](./0201-roadmap.md)
- [Phases & Milestones](./0202-phases.md)
- [Resource Allocation](./0203-resources.md)
- [Risk Assessment](./0204-risks.md)
- [Quality Standards](./0206-quality-standards.md)
- [Communication Plan](./0207-communication.md)
