# System Architecture - SiswaPresensi

## Overview

SiswaPresensi menggunakan arsitektur monolith dengan Laravel sebagai backend dan React + Inertia.js sebagai frontend. Sistem ini didesain untuk skala kecil hingga menengah dengan dukungan PWA untuk pengalaman mobile.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / PWA                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              React + Inertia.js           │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │         Pages/Components          │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/JSON
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Laravel Backend                │
│  ┌───────────────────────────────────────────────┐  │
│  │         Controllers                   │  │  │
│  │  ┌──────────────────────────────────┐  │  │  │
│ 1│  │  │   Services                    │  │  │  │
│  │  │  └──────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                      │                             │  │
│  │              ┌─────────────────────────┐  │  │
│  │              │   Models (Eloquent)  │  │  │
│  │              └─────────────────────────┘  │  │
│  │              ┌─────────────────────────┐  │  │
│  │              │   Migrations          │  │  │  │
│  │              └─────────────────────────┘  │  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Eloquent ORM
                         ▼
┌─────────────────────────────────────────────────────────┐
│              MySQL / PostgreSQL Database          │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### React + Inertia.js

**Pattern:** Single Page Application (SPA) without build step

**Benefits:**
- No separate build step for frontend
- Server-side rendering (SSR) for better SEO
- Shared codebase between backend and frontend
- Automatic prop passing via Inertia

### Pages Structure

```
resources/js/Pages/
├── Auth/
│   ├── Login.jsx
│   └── Register.jsx
├── Dashboard/
│   ├── AdminDashboard.jsx
│   ├── GuruDashboard.jsx
│   ├── SiswaDashboard.jsx
│   └── OrangTuaDashboard.jsx
├── Presensi/
│   ├── GuruPresensi.jsx
│   └── SiswaQRCode.jsx
├── Manajemen/
│   ├── Kelas/
│   ├── Mapel/
│   ├── Jadwal/
│   ├── Siswa/
│   ├── Guru/
│   └── OrangTua/
├── Laporan/
│   └── PresensiReport.jsx
└── Layouts/
    ├── AuthLayout.jsx
    ├── AdminLayout.jsx
    └── MainLayout.jsx
```

### State Management

**Primary:** React Context API

**Contexts:**
- `AuthContext` - Authentication state
- `PresensiContext` - Presensi state
- `NotificationContext` - Notification state

### Components Structure

```
resources/js/Components/
├── Common/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   └── Loading.jsx
├── Presensi/
│   ├── QRCodeDisplay.jsx
│   ├── PresensiForm.jsx
│   └── PresensiList.jsx
├── Dashboard/
│   ├── StatCard.jsx
│   └── JadwalList.jsx
└── Layouts/
    ├── Sidebar.jsx
    └── Header.jsx
```

---

## Backend Architecture

### Laravel Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── Admin/
│   │   ├── Guru/
│   │   ├── Siswa/
│   │   └── OrangTua/
│   ├── Middleware/
│   │   ├── Authenticate.php
│   │   ├── RoleMiddleware.php
│   │   └── CheckRole.php
│   └── Requests/
├── Models/
│   ├── User.php
│   ├── Siswa.php
│   ├── Guru.php
│   ├── OrangTua.php
│   ├── Kelas.php
│   ├── Mapel.php
│   ├── Jadwal.php
│   ├── Presensi.php
│   └── Izin.php
├── Services/
│   ├──. QRCodeService.php
│   ├── GeofencingService.php
│   ├── NotificationService.php
│   └──. PresensiService.php
└── Providers/
    └── AppServiceProvider.php
```

### Service Layer

**QRCodeService:**
- Generate QR codes for students
- Validate QR codes
- Handle QR expiry

**GeofencingService:**
- Calculate distance between points
- Check if point is within radius
- Validate student location

**NotificationService:**
- Send notifications via Firebase
- Queue notifications for reliability
- Handle notification failures

**PresensiService:**
- Create presensi records
- Update presensi status
- Handle auto-marking from approved requests

---

## Database Architecture

### Tables

1. **users** - User accounts with polymorphic relationships
2. **siswa** - Student data
3. **guru** - Teacher data
4. **orang_tua** - Parent data
5. **kelas** - Class data
6. **mapel** - Subject data
7. **jadwal** - Schedule data
8. **presensi** - Attendance records
9. **izin** - Permission requests

### Relationships

- User polymorphic to Siswa, Guru, OrangTua
- Siswa belongs to Kelas
- Siswa belongs to OrangTua
- Kelas has many Jadwal
- Jadwal belongs to Mapel
- Jadwal belongs to Guru
- Jadwal has many Presensi
- Presensi belongs to Siswa
- Presensi belongs to Jadwal
- Izin belongs to Siswa
- Izin belongs to Jadwal

---

## API Architecture

### RESTful API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

**Presensi:**
- `POST /api/presensi` - Create presensi
- `GET /api/presensi/{id}` - Get presensi
- `PUT /api/presensi/{id}` - Update presensi
- `DELETE /api/presensi/{id}` - Delete presensi
- `GET /api/presensi/jadwal/{jadwal_id}` - Get presensi by jadwal

**QR Code:**
- `POST /api/qr/generate` - Generate QR code
- `POST /api/qr/validate` - Validate QR code

**Izin:**
- `POST /api/izin` - Create izin request
- `PUT /api/izin/{id}/approve` - Approve request
- `PUT /api/izin/{id}/reject` - Reject request
- `GET /api/izin` - Get user's izin requests

**Dashboard:**
- `GET /api/dashboard/stats` - Get dashboard stats
- `GET /api/dashboard/jadwal-hari-ini` - Get today's schedule

---

## Security Architecture

### Authentication & Authorization

**Authentication:** Laravel Sanctum (Token-based)

**Authorization:** Role-based access control (RBAC)

**Roles:**
- `admin` - Full access
- `guru` - Access to presensi, jadwal, approval
- `siswa` - Access to own presensi, QR code
- `orang_tua` - Access to children's data, izin requests

**Middleware:**
- `Authenticate` - Check if user is authenticated
- `CheckRole` - Check if user has required role

### Data Protection

**In Transit:** TLS/SSL (HTTPS required)

**At Rest:** Database encryption for sensitive fields (passwords)

**Input Validation:** Server-side and client-side validation

---

## Performance Architecture

### Caching

**Laravel Cache:** Redis for session and data caching

**Strategies:**
- Cache frequently accessed data (kelas, mapel, jadwal)
- Cache QR codes temporarily
- Cache dashboard stats

### Database Optimization

**Indexing:** Proper indexes on frequently queried fields

**Query Optimization:**
- Use Eloquent relationships efficiently
- Avoid N+1 queries
- Use eager loading when appropriate

---

## Deployment Architecture

### Environments

1. **Local** - Development
2. **Staging** - Testing
3. **Production** - Live

### CI/CD Pipeline

**GitHub Actions:**
- Automated testing on push
- Automated testing on pull request
- Automated deployment to staging on merge
- Manual deployment to production

---

## Monitoring Architecture

### Error Tracking

**Sentry** - Error tracking and performance monitoring

### Application Monitoring

**Laravel Telescope** - Debugging and monitoring Laravel

### Uptime Monitoring

**UptimeRobot** - Monitor application uptime

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
