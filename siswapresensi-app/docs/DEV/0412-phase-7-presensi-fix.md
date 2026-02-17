# Phase 7 Completion Notes — Presensi Bug Fix

> **Completed:** 2026-02-17
> **Status:** ✅ Presensi Validation Fixed for Empty Array
> **Previous Phase:** Phase 6 — Remove QR Features

---

## Issue

**Problem:**
When "Hadir Semua" is intended (no students selected as absent), the `Simpan Presensi` button appeared to do nothing.

**Root Cause:**
The backend validation in `ReverseMarkingRequest` used `['required', 'array']` for the `absensi` field. In Laravel, `required` fails if the array is empty (`[]`). Since "Hadir Semua" is represented by an empty `absensi` list (no exceptions to the "All Present" rule), the validation was failing silently (redirecting back with errors that weren't displayed).

## Fix

**File:** `app/Http/Requests/Guru/ReverseMarkingRequest.php`
- Changed validation rule for `absensi` from `required` to `present`.
- `present` ensures the field exists in the request (it sends `[]`) but allows it to be empty.

---

## Verification
- Login as **Guru**.
- Go to **Presensi**.
- Select a schedule.
- Ensure **Reverse Marking** mode is active.
- **Do not check any students** (Hadir Semua).
- Click **Simpan Presensi**.
- Should now succeed and show "Presensi berhasil disimpan" notification.
