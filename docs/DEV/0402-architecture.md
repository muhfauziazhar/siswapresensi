# System Architecture - SiswaPresensi

## Overview

SiswaPresensi menggunakan arsitektur monolith dengan Laravel 12 sebagai backend dan React 19 + Inertia.js v2 sebagai frontend. Sistem ini didesain untuk skala kecil hingga menengah dengan dukungan SSR dan PWA untuk pengalaman mobile.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / PWA                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React 19 + Inertia.js v2                │  │
│  │  ┌──────────────────────────────────────────┐     │  │
│  │  │    Pages / Components (TypeScript)       │     │  │
│  │  │    Radix UI + Tailwind CSS 4.0           │     │  │
│  │  └──────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Inertia Protocol (XHR + JSON props)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Laravel 12 Backend                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Fortify (Auth)  │  Controllers  │  Middleware    │  │
│  │  ┌──────────────────────────────────────────┐     │  │
│  │  │            Services (Business Logic)     │     │  │
│  │  └──────────────────────────────────────────┘     │  │
│  │  ┌──────────────────────────────────────────┐     │  │
│  │  │         Models (Eloquent ORM)            │     │  │
│  │  └──────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Eloquent ORM
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                    │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### React 19 + Inertia.js v2

**Pattern:** Server-driven SPA — routing dan data loading ditangani oleh Laravel, React hanya me-render UI.

**Benefits:**
- Tidak perlu membuat API layer terpisah untuk frontend
- Server-side rendering (SSR) untuk SEO via `ssr.tsx`
- Props dikirim langsung dari Controller ke React page
- Type-safe route generation via Laravel Wayfinder
- React Compiler untuk optimisasi otomatis

### Pages Structure

```
resources/js/pages/
├── auth/
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── confirm-password.tsx
│   ├── verify-email.tsx
│   └── two-factor-challenge.tsx
├── dashboard.tsx
├── settings/
│   ├── profile.tsx
│   ├── password.tsx
│   ├── appearance.tsx
│   └── two-factor.tsx
├── presensi/
│   ├── guru-presensi.tsx
│   └── siswa-qrcode.tsx
├── manajemen/
│   ├── kelas/
│   ├── mapel/
│   ├── jadwal/
│   ├── siswa/
│   ├── guru/
│   └── orang-tua/
├── laporan/
│   └── presensi-report.tsx
└── welcome.tsx
```

> **Catatan:** Halaman auth sudah tersedia dari Laravel starter kit. Halaman presensi, manajemen, dan laporan akan ditambahkan sesuai sprint planning.

### State Management

**Primary:** Inertia.js shared data — server mengirim props langsung ke page components.

**Local State:** React hooks (`useState`, `useReducer`) untuk UI state.

**Catatan:** Tidak menggunakan external state library. Auth state, flash messages, dan shared data dikelola via Inertia `usePage()` hook.

```tsx
import { usePage } from '@inertiajs/react';

// Access shared data from server
const { auth, flash } = usePage().props;
```

### Components Structure

```
resources/js/components/
├── ui/                          # Radix UI primitives (shadcn/ui pattern)
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── separator.tsx
│   ├── tooltip.tsx
│   └── ...
├── app-header.tsx               # Application header
├── app-sidebar.tsx              # Sidebar navigation
├── app-logo.tsx                 # Logo component
├── breadcrumbs.tsx              # Breadcrumb navigation
├── heading.tsx                  # Page heading
├── input-error.tsx              # Form error display
├── text-link.tsx                # Styled text link
├── nav-main.tsx                 # Main navigation items
├── nav-user.tsx                 # User menu in sidebar
├── nav-footer.tsx               # Footer navigation
├── two-factor-setup-modal.tsx   # 2FA setup UI
├── two-factor-recovery-codes.tsx # 2FA recovery codes
├── delete-user.tsx              # Account deletion
└── user-info.tsx                # User info display
```

### Layouts

```
resources/js/layouts/
├── app-layout.tsx               # Main app layout (sidebar + header)
├── app/sidebar-layout.tsx       # Extended sidebar layout
└── auth-layout.tsx              # Auth pages layout (minimal)
```

---

## Backend Architecture

### Laravel Structure

```
app/
├── Actions/
│   └── Fortify/
│       ├── CreateNewUser.php      # Registration logic
│       └── ResetUserPassword.php  # Password reset logic
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   ├── Guru/
│   │   ├── Siswa/
│   │   └── OrangTua/
│   ├── Middleware/
│   │   └── RoleMiddleware.php
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
├── Concerns/                      # Shared traits
├── Services/
│   ├── QRCodeService.php
│   ├── GeofencingService.php
│   ├── NotificationService.php
│   └── PresensiService.php
└── Providers/
    └── AppServiceProvider.php
```

> **Catatan:** `Actions/Fortify/` berisi customization logic untuk Fortify authentication. Controllers akan menggunakan Inertia responses (`Inertia::render()`) bukan JSON responses.

### Service Layer

**QRCodeService:**
- `generateForJadwal(siswa, jadwal)` — Generate QR per-jadwal (base64, 2 jam expiry)
- `getGeneralQR(siswa)` — Return QR Code Umum dari profil siswa (UUID, no expiry)
- `validate(qrCode)` — Detect tipe QR dan validasi:
  - Per-jadwal: cek expiry, jadwal_id, siswa_id
  - General: lookup `qr_code_token` → resolve jadwal dari guru's active session
- `resolveJadwalFromGuru(guru)` — Cari jadwal aktif guru berdasarkan hari + waktu saat ini

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
- Handle auto-marking from approved izin requests

### Inertia Controller Pattern

Dengan Inertia.js, controllers **tidak** mengembalikan JSON response, melainkan me-render React page:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresensiController extends Controller
{
    public function index(Request $request): Response
    {
        $presensi = Presensi::with(['siswa', 'jadwal'])
            ->where('jadwal_id', $request->jadwal_id)
            ->paginate(20);

        return Inertia::render('presensi/guru-presensi', [
            'presensi' => $presensi,
        ]);
    }
}
```

---

## Database Architecture

### Database Engine
- **PostgreSQL 14+** — chosen untuk production
- **SQLite in-memory** — digunakan untuk testing (`phpunit.xml`)

### Tables

1. **users** - User accounts dengan polymorphic relationships
2. **siswa** - Student data
3. **guru** - Teacher data
4. **orang_tua** - Parent data
5. **kelas** - Class data
6. **mapel** - Subject data
7. **jadwal** - Schedule data
8. **presensi** - Attendance records
9. **izin** - Permission requests
10. **sessions** - Session storage (Fortify session driver)

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

## Authentication Architecture

### Laravel Fortify (Session-Based)

Fortify menyediakan backend authentication logic tanpa UI. Frontend (React) menyediakan halaman sendiri.

**Routes (web routes, bukan /api/):**
- `POST /login` — User login (session)
- `POST /logout` — User logout
- `POST /register` — User registration
- `POST /forgot-password` — Request password reset
- `POST /reset-password` — Reset password
- `POST /email/verification-notification` — Resend verification email
- `POST /two-factor-challenge` — 2FA verification

**Features (config/fortify.php):**
- Registration
- Password Reset
- Email Verification
- Two-Factor Authentication (TOTP, confirm + confirmPassword)

**Guard:** `web` (session-based, bukan token/JWT)

### Authorization (RBAC)

**Roles:**
- `admin` - Full access
- `guru` - Access to presensi, jadwal, approval
- `siswa` - Access to own presensi, QR code
- `orang_tua` - Access to children's data, izin requests

**Middleware:**
- Laravel built-in `auth` middleware
- Custom `RoleMiddleware` — checks user role

---

## API Architecture

### Inertia Routes (Primary)

Sebagian besar interaksi menggunakan Inertia.js (server-rendered pages). Tidak memerlukan API endpoint terpisah untuk CRUD UI.

**Presensi:**
- `GET /presensi` — Halaman presensi (Inertia page)
- `POST /presensi` — Create presensi record
- `PUT /presensi/{id}` — Update presensi
- `DELETE /presensi/{id}` — Delete presensi

**QR Code:**
- `POST /qr/generate` — Generate QR code
- `POST /qr/validate` — Validate QR code

**Izin:**
- `GET /izin` — Halaman izin requests
- `POST /izin` — Create izin request
- `PUT /izin/{id}/approve` — Approve request
- `PUT /izin/{id}/reject` — Reject request

**Dashboard:**
- `GET /dashboard` — Dashboard page (Inertia)

### API Routes (Optional, untuk mobile/external)

Jika diperlukan akses dari mobile app, API routes dapat ditambahkan di `routes/api.php` dengan Sanctum token authentication.

---

## Security Architecture

### Authentication & Authorization

**Authentication:** Laravel Fortify (Session-based + 2FA)

**Session Configuration:**
- Driver: `database`
- Lifetime: 120 menit (2 jam)
- Encrypt: `false` (can be enabled)
- Bcrypt rounds: 12

**Data Protection:**

**In Transit:** TLS/SSL (HTTPS required)

**At Rest:** Database encryption for sensitive fields (passwords, 2FA recovery codes)

**Input Validation:** Server-side (Form Requests) + client-side (TypeScript types)

---

## Performance Architecture

### Caching

**Cache Store:** Database (default, configurable to Redis)

**Strategies:**
- Cache frequently accessed data (kelas, mapel, jadwal)
- Cache QR codes temporarily
- Cache dashboard statistics
- Session caching via database

### Database Optimization

**Indexing:** Proper indexes on frequently queried columns (foreign keys, dates)

**Query Optimization:**
- Use Eloquent relationships efficiently
- Avoid N+1 queries with eager loading
- Use pagination for large datasets

### Frontend Optimization

- React Compiler for automatic memoization
- Vite code splitting
- SSR for initial page load
- Tailwind CSS purging (built-in v4)

---

## Deployment Architecture

### Environments

1. **Local** — Development (`composer run dev`)
2. **Staging** — Testing
3. **Production** — Live

### CI/CD Pipeline

**GitHub Actions (`.github/workflows/tests.yml`):**
- Automated testing on push to `develop`, `main`
- Automated testing on pull request
- Matrix testing: PHP 8.4, 8.5
- Steps: checkout → setup PHP → setup Node → install deps → build → Pest tests

---

## Monitoring Architecture

### Error Tracking

**Sentry** — Error tracking dan performance monitoring

### Application Monitoring

**Laravel Telescope** — Debugging dan monitoring (development)

### Uptime Monitoring

**UptimeRobot** — Monitor application uptime

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Coding Standards](./0405-coding-standards.md)
