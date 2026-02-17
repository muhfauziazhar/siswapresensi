# Phase 5 Completion Notes — Guru Features Fixes

> **Completed:** 2026-02-17
> **Status:** ✅ Guru Dashboard, Presensi & Izin Page Fixed
> **Previous Phase:** Phase 4 — UI Cleanup

---

## Issues & Fixes

### 1. Guru Dashboard & Presensi Empty (No Schedule Found)
**Problem:**
The system was querying schedules using English day names (e.g., `tuesday`) derived from `now()->englishDayOfWeek`, but the database stores Indonesian day names (`selasa`).

**Fix:**
- Updated `App\Models\Jadwal.php`:
  - `scopeHariIni` now maps English day names to Indonesian (`sunday` -> `minggu`, etc.).
  - This fixes both the Dashboard "Jadwal Hari Ini" section and the main Presensi page.

### 2. Guru Izin Page Bug (Undefined Property)
**Problem:**
The React page `resources/js/pages/guru/izin/index.tsx` expects a prop named `izinList`, but the controller `App\Http\Controllers\Guru\IzinController.php` was passing the data as `izin`. This caused the page to fail rendering or show no data.

**Fix:**
- Updated `App\Http\Controllers\Guru\IzinController.php`:
  - Changed `Inertia::render` payload key from `'izin' => $izin` to `'izinList' => $izin`.

---

## Verification

### Manual Verification Steps
1.  **Login as Guru** (`siti.guru@siswapresensi.test`).
2.  **Dashboard Check:**
    - "Jadwal Hari Ini" should now populate with data (if schedules exist for the current day).
    - "Siswa Hadir Hari Ini" stats should reflect real data.
3.  **Presensi Page Check:**
    - Navigate to `/guru/presensi`.
    - It should display the list of classes for today.
4.  **Izin Page Check:**
    - Navigate to `/guru/izin`.
    - The page should load correctly without errors.
    - If there are pending permission requests, they should appear in the table.
