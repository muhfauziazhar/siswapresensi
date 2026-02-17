# Phase 1 Completion Notes — SiswaPresensi

> **Completed:** 2026-02-17
> **Status:** ✅ All migrations running, database seeded, models ready
> **Next Phase:** Phase 2 — Authentication UI & Dashboard

---

## What Was Done

### 1. Environment Configuration

**File:** `.env`

- `DB_CONNECTION=pgsql` — Neon PostgreSQL (cloud)
- `APP_NAME=SiswaPresensi`, `APP_LOCALE=id`
- Session driver: `database` (120 min lifetime)

**Connection string format:**
```
postgresql://neondb_owner:npg_oRy70hlYVIjD@ep-dry-bonus-a1mhyb05-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

---

### 2. Database Schema (11 migrations)

```
database/migrations/
├── 0001_01_01_000000_create_users_table.php      # users + sessions + password_reset_tokens
├── 0001_01_01_000001_create_cache_table.php       # Laravel cache (default)
├── 0001_01_01_000002_create_jobs_table.php        # Laravel queue (default)
├── 2026_02_16_230637_create_guru_table.php        # → FK: users
├── 2026_02_16_230637_create_kelas_table.php       # standalone
├── 2026_02_16_230637_create_mapel_table.php       # standalone
├── 2026_02_16_230637_create_orang_tua_table.php   # → FK: users
├── 2026_02_16_230637_create_siswa_table.php       # → FK: users, kelas, orang_tua | has qr_code_token
├── 2026_02_16_230640_create_jadwal_table.php      # → FK: kelas, mapel, guru
├── 2026_02_16_230644_create_izin_table.php        # → FK: siswa, jadwal, users
└── 2026_02_16_230644_create_presensi_table.php    # → FK: siswa, jadwal, users | has qr_type
```

#### Critical Design Decisions

1. **Indonesian singular table names** (not English plural): `siswa`, `guru`, `jadwal`, `kelas`, `mapel`, `orang_tua`, `presensi`, `izin`
   - All foreign key constraints MUST use explicit `->constrained('table_name')` — Laravel's auto-pluralization breaks Indonesian names
   
2. **No polymorphic relationships**: Simple FK (`user_id`) on profile tables pointing to `users`

3. **Dual QR code system**:
   - `siswa.qr_code_token` — UUID, auto-generated on create, permanent general QR
   - `presensi.qr_type` — `'jadwal'` or `'general'`, tracks which QR method was used

4. **Users table** includes `role` column (`admin`, `guru`, `siswa`, `orang_tua`) and Fortify 2FA columns (`two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`)

---

### 3. Eloquent Models (9 models)

```
app/Models/
├── User.php       # Authenticatable + TwoFactorAuthenticatable
│                  # Relationships: siswa(), guru(), orangTua(), profile()
│                  # Helpers: isAdmin(), isGuru(), isSiswa(), isOrangTua()
│                  # Scope: role($role)
│
├── Siswa.php      # table='siswa', auto-generates qr_code_token on boot
│                  # Accessor: nama_lengkap
│                  # Relationships: user, kelas, orangTua, presensi, izin
│
├── Guru.php       # table='guru' → user, jadwal
├── OrangTua.php   # table='orang_tua' → user, anak (siswa)
├── Kelas.php      # table='kelas' → siswa, jadwal | scope: aktif()
├── Mapel.php      # table='mapel' → jadwal | scope: aktif()
├── Jadwal.php     # table='jadwal' → kelas, mapel, guru, presensi, izin
│                  # Scopes: aktif(), hariIni()
│
├── Presensi.php   # table='presensi' → siswa, jadwal, markedByUser
│                  # Scopes: hariIni(), viaQrGeneral(), viaQrJadwal()
│
└── Izin.php       # table='izin' → siswa, jadwal, reviewedByUser
                   # Scopes: pending(), approved(), rejected()
```

> **IMPORTANT:** All models use explicit `$table` property because table names are Indonesian singular (not Laravel's default plural convention).

---

### 4. Seeded Test Data

| Entity | Count | Details |
|--------|-------|---------|
| Admin | 1 | `admin@siswapresensi.test` |
| Guru | 2 | Budi Santoso (NIP: 1234567890), Siti Nurhaliza |
| Orang Tua | 2 | Siti Aminah, Budi Hartono |
| Siswa | 4 | Ahmad Rizky, Dewi Sartika (XI IPA 1), Budi Jr, Rina Wati (XI IPA 2) |
| Kelas | 2 | XI IPA 1, XI IPA 2 |
| Mapel | 3 | Matematika (MAT), Fisika (FIS), Bahasa Indonesia (BIN) |
| Jadwal | 6 | Distributed across kelas × mapel × guru |
| Presensi | 2 | 1 via jadwal QR, 1 via general QR |
| Izin | 1 | Pending sakit request |

**All passwords:** `password`

---

### 5. Gotchas & Lessons Learned

1. **Migration ordering matters** — Files with same timestamp run alphabetically. `izin` runs before `jadwal` (i < j), causing FK failures. Solution: give `jadwal` an earlier timestamp.

2. **`->constrained()` without args** auto-pluralizes table name — Always pass explicit table name for Indonesian tables: `->constrained('siswa')`, NOT `->constrained()`.

3. **Duplicate migration files** — The original Fortify 2FA migration (`add_two_factor_columns_to_users_table`) was removed because those columns are now in the main users migration.

---

## What's NOT Done Yet

### Phase 2 — Authentication UI & Dashboard (Next)
Per PM roadmap (`docs/PM/0201-roadmap.md`):
- [ ] Authentication pages (login, register, forgot password)
- [ ] 2FA setup UI
- [ ] Role-based dashboard layouts
- [ ] Basic UI component library
- [ ] Fortify configuration (features, CreateNewUser action)

### Phase 3 — MVP Features
- [ ] Manajemen Sekolah (CRUD: Kelas, Mapel, Jadwal)
- [ ] QR Code Generation (per-jadwal + general)
- [ ] QR Code Scanning + Presensi
- [ ] Reverse Marking
- [ ] Request Izin/Sakit + Approval
- [ ] Dashboard per role
- [ ] Laporan Presensi

---

## Reference Docs

| Doc | Path | Purpose |
|-----|------|---------|
| Roadmap | `docs/PM/0201-roadmap.md` | Timeline & milestones |
| Data Model | `docs/DEV/0404-data-model.md` | Full schema + ERD + model specs |
| Architecture | `docs/DEV/0402-architecture.md` | Tech stack & service layer |
| Business Rules | `docs/BA/0105-business-rules.md` | QR code rules, presensi logic |
| User Journey | `docs/BA/0103-user-journey.md` | User flows (incl. Journey 3A fallback QR) |
| Agent Rules | `.agent/rules/` | Coding standards, testing strategy, security |

---

## Quick Start for Next Agent

```bash
cd siswapresensi-app

# Verify everything works
php artisan migrate:fresh --seed
php artisan tinker
>>> User::count()           # → 9
>>> Siswa::first()->qr_code_token  # → UUID string
>>> Presensi::first()->qr_type     # → 'jadwal'

# Start dev server
composer run dev
```
