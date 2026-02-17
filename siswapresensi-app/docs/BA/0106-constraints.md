# Constraints - SiswaPresensi

## Budget

**Total Budget:** Tidak ditentukan (proyek internal/opensource)

**Allocation:**
- **Development:** Tidak ada batasan spesifik
- **Infrastructure:** Menggunakan hosting yang tersedia
- **Third-party Services:** Menggunakan layanan gratis atau freemium (Firebase, Google Maps)

**Catatan:** Proyek ini bersifat open-source, sehingga budget bukan faktor pembatas utama.

---

## Timeline

**Start Date:** Q1 2026 (Januari 2026)
**End Date:** Q2 2026 (Juni 2026)

**Milestones:**
- **Februari 2026:** Selesaikan Business Analysis dan Project Planning
- **Maret 2026:** Selesaikan MVP (Priority 1 features)
- **April 2026:** Selesaikan Priority 2 features
- **Mei 2026:** Testing dan Bug Fixing
- **Juni 2026:** Deployment dan Launch

---

## Team

**Size:** 3-5 orang (Small Team)

**Roles:**
- **1 Business Analyst:** Analisis kebutuhan bisnis dan dokumentasi
- **1-2 Developers:** Backend (Laravel) dan Frontend (React/Inertia.js)
- **1 QA Engineer:** Testing dan quality assurance
- **1 Project Manager:** Manajemen proyek dan koordinasi (opsional)

---

## Technical

**Tech Stack (Fixed):**
- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 19 (TypeScript) dengan Inertia.js v2
- **Database:** PostgreSQL 14+
- **Styling:** Tailwind CSS 4.0
- **State Management:** Inertia.js shared data + React hooks

**Security Requirements:**
- **Authentication:** Laravel Fortify (session-based + 2FA)
- **Authorization:** Role-based access control (RBAC)
- **Data Encryption:** SSL/TLS untuk data in transit
- **Input Validation:** Server-side (Form Requests) dan client-side (TypeScript)

---

## Legal & Compliance

**Privacy & Data Protection:**
- **GDPR Compliance:** Jika target user di Eropa, sistem harus mematuhi GDPR
- **Data Retention:** Data presensi harus disimpan minimal 1 tahun untuk audit

**Accessibility:**
- **WCAG 2.1 AA:** Sistem harus mematuhi standar aksesibilitas WCAG 2.1 Level AA

---

## Operational

**Business Hours:**
- **Support Hours:** 09:00 - 17:00 WIB (Senin - Jumat)

**Maintenance Windows:**
- **Scheduled Maintenance:** Mingguan (Minggu dini hari)

**Backup & Recovery:**
- **Database Backup:** Harian dengan retention 30 hari
