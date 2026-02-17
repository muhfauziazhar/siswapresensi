# Phase 2 & 3 Completion Notes — SiswaPresensi

> **Completed:** 2026-02-17
> **Status:** ✅ All controllers, routes, pages, tests passing (72 tests, 196 assertions)
> **Build:** ✅ `npm run build` succeeds (2781 modules)
> **Next Phase:** Phase 4 — Enhancement (Real-time, Geofencing, Import/Export, Mobile Responsive)

---

## Phase 2 — Foundation Layer

### 1. Role Middleware

**File:** `app/Http/Middleware/RoleMiddleware.php`

- Accepts variadic roles: `role:admin`, `role:admin,guru`
- Checks `$request->user()->role` against allowed roles
- Returns 403 if unauthorized

**Registration:** `bootstrap/app.php`
```php
$middleware->alias(['role' => RoleMiddleware::class]);
```

---

### 2. TypeScript Domain Types

**File:** `resources/js/types/models.ts`

All domain types defined:
- `Kelas`, `Mapel`, `Guru`, `Siswa`, `OrangTua`
- `Jadwal`, `Presensi`, `Izin`
- Status enums: `PresensiStatus`, `IzinJenis`, `IzinStatus`
- Utility types: `PaginatedData<T>`, `DashboardStats`

**File:** `resources/js/types/auth.ts`
- Added `UserRole = 'admin' | 'guru' | 'siswa' | 'orang_tua'`
- Added `role: UserRole` to `User` interface

---

### 3. Model Factories (8 files)

```
database/factories/
├── GuruFactory.php
├── KelasFactory.php
├── MapelFactory.php
├── OrangTuaFactory.php
├── SiswaFactory.php
├── JadwalFactory.php
├── PresensiFactory.php
└── IzinFactory.php
```

Each factory includes:
- Proper relations (auto-creates parent User when needed)
- State methods: `->nonAktif()`, `->sakit()`, `->approved()`, `->rejected()`, etc.
- `UserFactory` updated with `'role' => 'admin'` default

---

### 4. Role-Based Navigation

**File:** `resources/js/components/app-sidebar.tsx`

- `getNavItems(role)` function returns role-specific sidebar items
- Admin: Dashboard, Kelas, Mapel, Guru, Siswa, Orang Tua, Jadwal
- Guru: Dashboard, Presensi, Scan QR, Izin Siswa
- Siswa: Dashboard, QR Code, Riwayat Presensi
- Orang Tua: Dashboard, Presensi Anak, Izin

---

### 5. Shared Components

```
resources/js/components/
├── flash-messages.tsx    # Auto-dismissing success/error alerts
├── pagination.tsx         # Reusable Inertia pagination
└── stats-card.tsx         # Dashboard stats card with icon
```

**File:** `resources/js/layouts/app-layout.tsx`
- Added `<FlashMessages />` component

**File:** `app/Http/Middleware/HandleInertiaRequests.php`
- Added flash data sharing: `success`, `error`, `qr_data`

---

## Phase 3 — MVP Features

### 6. Controllers (13 files)

```
app/Http/Controllers/
├── DashboardController.php           # Invokable, role-based routing
├── Admin/
│   ├── KelasController.php           # Full CRUD
│   ├── MapelController.php           # Full CRUD
│   ├── GuruController.php            # CRUD + User account creation
│   ├── SiswaController.php           # CRUD + User account creation
│   ├── OrangTuaController.php        # CRUD + User account creation
│   └── JadwalController.php          # CRUD + schedule conflict detection
├── Guru/
│   ├── PresensiController.php        # index, show, scan, storeScan, reverseMarking
│   └── IzinController.php            # index, approve, reject + auto-marking
├── Siswa/
│   ├── QrCodeController.php          # index, generate (base64 JSON, 2h expiry)
│   └── PresensiHistoryController.php # index with date filters & stats
└── OrangTua/
    ├── IzinController.php            # index, create, store (file upload)
    └── PresensiController.php        # index with child filter & stats
```

#### Key Implementation Details

**DashboardController** — Invokable `__invoke()` with `match($user->role)`:
- Admin: counts of all entities
- Guru: today's jadwal, pending izin count
- Siswa: monthly presensi stats, QR info
- OrangTua: children stats, pending izin count

**Admin Guru/Siswa/OrangTua Controllers** — `DB::transaction()` for user+profile creation:
- Creates User with role, then creates profile with `user_id`
- Delete cascades: deletes both profile and user

**JadwalController** — `hasScheduleConflict()`:
- Checks overlapping time slots for same kelas+hari
- Excludes current record on update

**Guru PresensiController** — Dual QR support:
- Per-jadwal QR: base64 decode → JSON with siswa_id, jadwal_id, timestamp, expires_at
- General QR: UUID token lookup in siswa table
- Reverse marking: marks all as 'hadir', then updates absensi entries

**Guru IzinController** — Auto-marking on approval:
- When izin approved, creates presensi records for date range with matching status (sakit/izin)

---

### 7. Form Requests (15 files)

```
app/Http/Requests/
├── Admin/
│   ├── StoreKelasRequest.php
│   ├── UpdateKelasRequest.php
│   ├── StoreMapelRequest.php
│   ├── UpdateMapelRequest.php
│   ├── StoreGuruRequest.php
│   ├── UpdateGuruRequest.php
│   ├── StoreSiswaRequest.php
│   ├── UpdateSiswaRequest.php
│   ├── StoreOrangTuaRequest.php
│   ├── UpdateOrangTuaRequest.php
│   ├── StoreJadwalRequest.php
│   └── UpdateJadwalRequest.php
├── Guru/
│   ├── StoreScanRequest.php
│   └── ReverseMarkingRequest.php
└── OrangTua/
    └── StoreIzinRequest.php
```

- Array-based validation rules
- Indonesian error messages
- Update requests use `Rule::unique()->ignore()` for edit scenarios
- StoreJadwalRequest validates time format and `after` constraint

---

### 8. Routes

**File:** `routes/web.php`

```php
// Dashboard (all authenticated roles)
Route::get('/dashboard', DashboardController::class)->name('dashboard');

// Admin routes (role:admin middleware)
Route::prefix('admin')->middleware('role:admin')->group(function () {
    Route::resource('kelas', KelasController::class)->parameters(['kelas' => 'kelas']);
    Route::resource('mapel', MapelController::class);
    Route::resource('guru', GuruController::class);
    Route::resource('siswa', SiswaController::class);
    Route::resource('orang-tua', OrangTuaController::class)->parameters(['orang-tua' => 'orangTua']);
    Route::resource('jadwal', JadwalController::class);
});

// Guru routes (role:guru middleware)
Route::prefix('guru')->middleware('role:guru')->group(function () {
    Route::get('presensi', ...)->name('guru.presensi.index');
    Route::get('presensi/{jadwal}', ...)->name('guru.presensi.show');
    Route::get('presensi/scan/{jadwal}', ...)->name('guru.presensi.scan');
    Route::post('presensi/scan', ...)->name('guru.presensi.store-scan');
    Route::post('presensi/reverse-marking', ...)->name('guru.presensi.reverse-marking');
    Route::get('izin', ...)->name('guru.izin.index');
    Route::put('izin/{izin}/approve', ...)->name('guru.izin.approve');
    Route::put('izin/{izin}/reject', ...)->name('guru.izin.reject');
});

// Siswa routes (role:siswa middleware)
// OrangTua routes (role:orang_tua middleware)
```

#### Route Naming Conventions
- `->parameters(['kelas' => 'kelas'])` — Fixes Laravel auto-pluralization of Indonesian nouns
- `->parameters(['orang-tua' => 'orangTua'])` — Maps hyphenated URL to camelCase parameter

---

### 9. Frontend Pages (27 files)

```
resources/js/pages/
├── dashboard/
│   ├── admin.tsx
│   ├── guru.tsx
│   ├── siswa.tsx
│   └── orang-tua.tsx
├── admin/
│   ├── kelas/index.tsx, create.tsx, edit.tsx
│   ├── mapel/index.tsx, create.tsx, edit.tsx
│   ├── guru/index.tsx, create.tsx, edit.tsx
│   ├── siswa/index.tsx, create.tsx, edit.tsx
│   ├── orang-tua/index.tsx, create.tsx, edit.tsx
│   └── jadwal/index.tsx, create.tsx, edit.tsx
├── guru/
│   ├── presensi/index.tsx, show.tsx, scan.tsx
│   └── izin/index.tsx
├── siswa/
│   ├── qr-code.tsx
│   └── presensi-history.tsx
└── orang-tua/
    ├── izin/index.tsx, create.tsx
    └── presensi/index.tsx
```

All pages use:
- TypeScript with proper type annotations
- Inertia `useForm()` for forms
- shadcn/ui components (Button, Input, Select, Table, Card, Badge)
- `AppLayout` layout wrapper
- Lucide React icons
- Pagination component for list pages

---

### 10. Fixes Applied

1. **SQLite Migration Compatibility** — `2026_02_16_230637_create_siswa_table.php`
   - Removed PostgreSQL-specific `->default(DB::raw('gen_random_uuid()'))` 
   - Made `qr_code_token` nullable, generated by Siswa model boot method

2. **UserFactory Default Role** — `database/factories/UserFactory.php`
   - Added `'role' => 'admin'` to default definition (NOT NULL constraint)

3. **Registration Default Role** — `app/Actions/Fortify/CreateNewUser.php`
   - Added `'role' => 'orang_tua'` for public registration flow

4. **Reverse Marking Date Query** — `app/Http/Controllers/Guru/PresensiController.php`
   - Changed `where('tanggal', ...)` to `whereDate('tanggal', ...)` for SQLite compatibility

---

### 11. Test Coverage

```
tests/Feature/
├── Auth/
│   ├── AuthenticationTest.php          # Login/logout
│   ├── PasswordConfirmationTest.php    # Password confirm flow
│   ├── PasswordResetTest.php           # Reset link & reset
│   ├── PasswordUpdateTest.php          # Password update
│   └── RegistrationTest.php            # User registration
├── Admin/
│   ├── KelasManagementTest.php         # CRUD + validation
│   ├── MapelManagementTest.php         # CRUD
│   ├── GuruManagementTest.php          # CRUD + user account
│   ├── SiswaManagementTest.php         # CRUD + user account
│   └── JadwalManagementTest.php        # CRUD + conflict detection
├── Guru/
│   ├── PresensiTest.php                # Index, show, reverse marking
│   └── IzinApprovalTest.php            # View, approve, reject + auto-mark
├── DashboardTest.php                   # Role-based dashboard rendering
├── RoleMiddlewareTest.php              # Access control per role
├── ProfileTest.php                     # Profile update
└── Settings/
    └── ...
```

**Results:** 72 tests, 196 assertions — ALL PASSING ✅

---

## Build Status

```bash
$ npm run build
# ✅ 2781 modules transformed, built in 1m 37s

$ php artisan test --compact
# ✅ 72 passed (196 assertions), 1.82s

$ vendor/bin/pint --dirty --format agent
# ✅ No issues (or auto-fixed)
```

---

## Architecture Summary

```
User Request → Route (web.php) → RoleMiddleware → Controller
    → Form Request validation
    → Eloquent Model operations (with DB::transaction for multi-table)
    → Inertia::render('page', props)
    → React Page Component (TypeScript + shadcn/ui)
    → AppLayout with FlashMessages + role-based Sidebar
```

---

## Known Considerations for Phase 4

1. **QR Code Scanning** — Frontend uses simple text input currently; needs camera integration (e.g., `react-qr-reader`)
2. **File Upload** — Izin bukti upload works via standard form; may need S3/cloud storage for production
3. **Real-time** — No WebSocket/broadcasting yet; polling approach possible via Inertia v2 features
4. **Mobile Responsive** — Pages built with Tailwind responsive classes but not fully optimized for mobile UX
5. **Laporan/Reports** — Not yet implemented; needs export to PDF/Excel
6. **Geofencing** — Not yet implemented; needs browser Geolocation API integration
