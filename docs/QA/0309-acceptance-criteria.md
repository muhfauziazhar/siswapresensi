# Acceptance Criteria - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Acceptance Criteria SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan acceptance criteria untuk semua fitur SiswaPresensi, yang akan digunakan untuk verifikasi sebelum release.

---

## 2. Format Acceptance Criteria

### 2.1 User Story Format

```
Sebagai [role],
Saya ingin [feature],
Agar [benefit].
```

### 2.2 Acceptance Criteria Format

```
GIVEN [context]
WHEN [action]
THEN [outcome]
```

---

## 3. Authentication & Authorization

### 3.1 User Login

**User Story:**
```
Sebagai pengguna (Guru, Siswa, Orang Tua, Super Admin),
Saya ingin login ke sistem,
Agar saya dapat mengakses fitur sesuai role saya.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-001 | Pengguna berada di halaman login | Pengguna memasukkan email dan password yang valid | Pengguna berhasil login dan diarahkan ke dashboard sesuai role | P0 |
| AC-002 | Pengguna berada di halaman login | Pengguna memasukkan email yang tidak terdaftar | Menampilkan pesan error "Email tidak terdaftar" | P1 |
| AC-003 | Pengguna berada di halaman login | Pengguna memasukkan password yang salah | Menampilkan pesan error "Password salah" | P1 |
| AC-004 | Pengguna berada di halaman login | Pengguna memasukkan email dan password kosong | Menampilkan pesan error "Email dan password wajib diisi" | P2 |
| AC-005 | Pengguna berada di halaman login | Pengguna memasukkan email dengan format yang salah | Menampilkan pesan error "Format email tidak valid" | P2 |
| AC-006 | Pengguna sudah login | Pengguna mengklik tombol logout | Pengguna berhasil logout dan diarahkan ke halaman login | P1 |

**Definition of Done:**
- [ ] Login endpoint berfungsi dengan benar
- [ ] Password di-hash dengan bcrypt
- [ ] Token JWT dibuat dan valid
- [ ] Session timeout dikonfigurasi (2 jam)
- [ ] Rate limiting untuk login (5 percobaan per 15 menit)
- [ ] Unit tests untuk login
- [ ] Integration tests untuk login
- [ ] E2E tests untuk login flow

---

### 3.2 Role-Based Access Control

**User Story:**
```
Sebagai Super Admin,
Saya ingin mengakses semua fitur admin,
Agar saya dapat mengelola sistem secara penuh.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-007 | Super Admin login | Super Admin mengakses halaman admin dashboard | Super Admin dapat melihat dan mengakses semua fitur admin | P0 |
| AC-008 | Guru login | Guru mencoba mengakses halaman admin dashboard | Guru ditolak dan mendapatkan pesan "Akses ditolak" | P0 |
| AC-009 | Siswa login | Siswa mencoba mengakses halaman admin dashboard | Siswa ditolak dan mendapatkan pesan "Akses ditolak" | P0 |
| AC-010 | Orang Tua login | Orang Tua mencoba mengakses halaman admin dashboard | Orang Tua ditolak dan mendapatkan pesan "Akses ditolak" | P0 |

**Definition of Done:**
- [ ] Role-based middleware berfungsi
- [ ] Authorization checks di semua endpoint
- [ ] Error handling untuk unauthorized access
- [ ] Unit tests untuk authorization
- [ ] Integration tests untuk authorization
- [ ] E2E tests untuk authorization

---

## 4. Siswa Presensi

### 4.1 QR Code Generation

**User Story:**
```
Sebagai Siswa,
Saya ingin melihat QR code untuk presensi hari ini,
Agar saya dapat discan oleh guru.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-011 | Siswa login | Siswa mengakses halaman QR code | QR code ditampilkan dengan jadwal hari ini | P0 |
| AC-012 | Siswa login | Siswa mengakses halaman QR code di hari libur | Menampilkan pesan "Tidak ada jadwal hari ini" | P1 |
| AC-013 | Siswa login | Siswa mengklik tombol refresh QR code | QR code baru digenerate dengan timestamp baru | P1 |
| AC-014 | Siswa login | QR code sudah berumur lebih dari 2 jam | QR code otomatis di-refresh | P1 |
| AC-015 | Siswa login | Siswa melihat QR code | QR code berisi data: siswa_id, jadwal_id, timestamp, expiry | P0 |

**Definition of Done:**
- [ ] QR code generation service berfungsi
- [ ] QR code berisi data yang benar
- [ ] QR code expiry mechanism berfungsi
- [ ] QR code refresh mechanism berfungsi
- [ ] Unit tests untuk QR code generation
- [ ] Integration tests untuk QR code generation
- [ ] E2E tests untuk QR code display

---

### 4.2 QR Code Scanning

**User Story:**
```
Sebagai Guru,
Saya ingin scan QR code siswa,
Agar presensi siswa tercatat otomatis.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-016 | Guru login | Guru scan QR code yang valid | Presensi siswa tercatat dengan status "hadir" | P0 |
| AC-017 | Guru login | Guru scan QR code yang sudah expired | Menampilkan pesan error "QR code sudah expired" | P1 |
| AC-018 | Guru login | Guru scan QR code yang tidak valid | Menampilkan pesan error "QR code tidak valid" | P1 |
| AC-019 | Guru login | Guru scan QR code siswa yang sudah presensi hari ini | Menampilkan pesan "Siswa sudah presensi hari ini" | P1 |
| AC-020 | Guru login | Guru scan QR code di luar jadwal | Menampilkan pesan error "Di luar jadwal presensi" | P1 |

**Definition of Done:**
- [ ] QR code validation service berfungsi
- [ ] Presensi otomatis tercatat
- [ ] Duplicate presensi prevention berfungsi
- [ ] Time-based validation berfungsi
- [ ] Unit tests untuk QR code scanning
- [ ] Integration tests untuk QR code scanning
- [ ] E2E tests untuk QR code scanning flow

---

### 4.3 Presensi History

**User Story:**
```
Sebagai Siswa,
Saya ingin melihat riwayat presensi saya,
Agar saya dapat memantau kehadiran saya.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-021 | Siswa login | Siswa mengakses halaman riwayat presensi | Riwayat presensi ditampilkan dalam tabel | P0 |
| AC-022 | Siswa login | Siswa filter riwayat berdasarkan tanggal | Riwayat yang sesuai filter ditampilkan | P1 |
| AC-023 | Siswa login | Siswa melihat riwayat presensi | Setiap record menampilkan: tanggal, mata pelajaran, status, jam | P0 |
| AC-024 | Siswa login | Siswa melihat riwayat presensi | Statistik kehadiran ditampilkan (hadir, tidak hadir, izin, sakit) | P1 |
| AC-025 | Siswa login | Siswa mengakses halaman riwayat presensi | Pagination tersedia jika data > 20 records | P2 |

**Definition of Done:**
- [ ] Presensi history endpoint berfungsi
- [ ] Filter berdasarkan tanggal berfungsi
- [ ] Pagination berfungsi
- [ ] Statistik kehadiran dihitung dengan benar
- [ ] Unit tests untuk presensi history
- [ ] Integration tests untuk presensi history
- [ ] E2E tests untuk presensi history display

---

## 5. Guru Reverse Marking

### 5.1 Reverse Marking

**User Story:**
```
Sebagai Guru,
Saya ingin menandai presensi siswa yang tidak hadir,
Agar presensi siswa tercatat dengan benar.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-026 | Guru login | Guru memilih kelas | Daftar siswa di kelas tersebut ditampilkan | P0 |
| AC-027 | Guru login | Guru memilih siswa dan status "tidak hadir" | Presensi siswa tercatat dengan status "tidak hadir" | P0 |
| AC-028 | Guru login | Guru memilih siswa dan status "izin" | Presensi siswa tercatat dengan status "izin" | P1 |
| AC-029 | Guru login | Guru memilih siswa dan status "sakit" | Presensi siswa tercatat dengan status "sakit" | P1 |
| AC-030 | Guru login | Guru memilih multiple siswa | Presensi semua siswa tercatat dengan status yang sama | P1 |
| AC-031 | Guru login | Guru mencoba menandai siswa yang sudah presensi | Menampilkan pesan "Siswa sudah presensi hari ini" | P1 |

**Definition of Done:**
- [ ] Reverse marking endpoint berfungsi
- [ ] Bulk reverse marking berfungsi
- [ ] Duplicate presensi prevention berfungsi
- [ ] Status validation berfungsi
- [ ] Unit tests untuk reverse marking
- [ ] Integration tests untuk reverse marking
- [ ] E2E tests untuk reverse marking flow

---

## 6. Orang Tua Izin

### 6.1 Izin Request

**User Story:**
```
Sebagai Orang Tua,
Saya ingin mengajukan izin untuk anak saya,
Agar absensi anak saya tercatat dengan benar.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-032 | Orang Tua login | Orang Tua mengakses halaman ajukan izin | Form izin ditampilkan | P0 |
| AC-033 | Orang Tua login | Orang Tua mengisi form izin dengan lengkap | Izin berhasil diajukan dengan status "pending" | P0 |
| AC-034 | Orang Tua login | Orang Tua mengupload bukti (surat dokter) | Bukti berhasil di-upload dan tersimpan | P1 |
| AC-035 | Orang Tua login | Orang Tua mengisi form izin tanpa alasan | Menampilkan pesan error "Alasan wajib diisi" | P1 |
| AC-036 | Orang Tua login | Orang Tua mengisi tanggal yang tidak valid | Menampilkan pesan error "Tanggal tidak valid" | P1 |
| AC-037 | Orang Tua login | Orang Tua mengajukan izin | Notifikasi dikirim ke guru | P1 |

**Definition of Done:**
- [ ] Izin request endpoint berfungsi
- [ ] File upload berfungsi
- [ ] Form validation berfungsi
- [ ] Notifikasi dikirim ke guru
- [ ] Unit tests untuk izin request
- [ ] Integration tests untuk izin request
- [ ] E2E tests untuk izin request flow

---

### 6.2 Izin Approval

**User Story:**
```
Sebagai Guru,
Saya ingin menyetujui atau menolak izin siswa,
Agar status izin diperbarui.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-038 | Guru login | Guru mengakses halaman da persetujuan izin | Daftar izin pending ditampilkan | P0 |
| AC-039 | Guru login | Guru menyetujui izin | Status izin diperbarui menjadi "disetujui" | P0 |
| AC-040 | Guru login | Guru menolak izin | Status izin diperbarui menjadi "ditolak" | P0 |
| AC-041 | Guru login | Guru menyetujui izin | Notifikasi dikirim ke orang tua | P1 |
| AC-042 | Guru login | Guru menolak izin | Notifikasi dikirim ke orang tua | P1 |
| AC-043 | Guru login | Guru menyetujui izin | Presensi siswa diperbarui sesuai izin | P1 |

**Definition of Done:**
- [ ] Izin approval endpoint berfungsi
- [ ] Status update berfungsi
- [ ] Notifikasi dikirim ke orang tua
- [ ] Presensi update berfungsi
- [ ] Unit tests untuk izin approval
- [ ] Integration tests untuk izin approval
- [ ] E2E tests untuk izin approval flow

---

## 7. Admin Dashboard

### 7.1 Dashboard Statistics

**User Story:**
```
Sebagai Super Admin,
Saya ingin melihat statistik sistem,
Agar saya dapat memantau performa sistem.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-044 | Super Admin login | Super Admin mengakses dashboard | Statistik total siswa ditampilkan | P0 |
| AC-045 | Super Admin login | Super Admin mengakses dashboard | Statistik total guru ditampilkan | P0 |
| AC-046 | Super Admin login | Super Admin mengakses dashboard | Statistik total kelas ditampilkan | P0 |
| AC-047 | Super Admin login | Super Admin mengakses dashboard | Statistik total presensi hari ini ditampilkan | P0 |
| AC-048 | Super Admin login | Super Admin mengakses dashboard | Grafik presensi mingguan ditampilkan | P1 |

**Definition of Done:**
- [ ] Dashboard statistics endpoint berfungsi
- [ ] Statistik dihitung dengan benar
- [ ] Grafik ditampilkan dengan benar
- [ ] Real-time update berfungsi
- [ ] Unit tests untuk dashboard statistics
- [ ] Integration tests untuk dashboard statistics
- [ ] E2E tests untuk dashboard display

---

### 7.2 Report Generation

**User Story:**
```
Sebagai Super Admin,
Saya ingin generate laporan presensi,
Agar saya dapat melihat rekap kehadiran.
```

**Acceptance Criteria:**

| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
| AC-049 | Super Admin login | Super Admin memilih kelas dan rentang tanggal | Laporan presensi ditampilkan | P0 |
| AC-050 | Super Admin login | Super Admin mengklik tombol export PDF | Laporan berhasil di-download dalam format PDF | P0 |
| AC-051 | Super Admin login | Super Admin mengklik tombol export Excel | Laporan berhasil di-download dalam format Excel | P1 |
| AC-052 | Super Admin login | Super Admin melihat laporan | Laporan berisi: nama siswa, tanggal, status, jam | P0 |
| AC-053 | Super Admin login | Super Admin melihat laporan | Statistik kehadiran ditampilkan | P1 |

**Definition of Done:**
- [ ] Report generation endpoint berfungsi
- [ ] PDF export berfungsi
- [ ] Excel export berfungsi
- [ ] Filter berdasarkan kelas dan tanggal berfungsi
- [ ] Unit tests untuk report generation
- [ ] Integration tests untuk report generation
- [ ] E2E tests untuk report generation flow

---

## 8. Non-Functional Requirements

### 8.1 Performance

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-001 | Login response time | < 500ms (p95) | P0 |
| NFR-002 | QR code generation time | < 200ms (p95) | P0 |
| NFR-003 | QR code scanning time | < 500ms (p95) | P0 |
| NFR-004 | Presensi history load time | < 300ms (p95) | P1 |
| NFR-005 | Report generation time | < 5000ms (p95) | P1 |
| NFR-006 | System uptime | > 99.5% | P0 |
| NFR-007 | Concurrent users | > 100 | P1 |

### 8.2 Security

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-008 | Password hashing | bcrypt | P0 |
| NFR-009 | Token expiration | 2 hours | P0 |
| NFR-010 | Rate limiting | 5 attempts per 15 minutes | P0 |
| NFR-011 | HTTPS | Required in production | P0 |
| NFR-012 | SQL injection prevention | ORM + parameterized queries | P0 |
| NFR-013 | XSS prevention | Output escaping + CSP | P0 |
| NFR-014 | CSRF protection | CSRF tokens | P0 |

### 8.3 Accessibility

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-015 | WCAG compliance | Level AA | P1 |
| NFR-016 | Keyboard navigation | All features accessible | P1 |
| NFR-017 | Screen reader compatibility | NVDA, JAWS | P1 |
| NFR-018 | Color contrast | ≥ 4.5:1 (normal text) | P1 |

### 8.4 Compatibility

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-019 | Browser support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ | P1 |
| NFR-020 | Mobile support | iOS 14+, Android 10+ | P1 |
| NFR-021 | Screen sizes | 320px - 1920px | P1 |

---

## 9. Acceptance Testing Checklist

### 9.1 Pre-Release Checklist

- [ ] All P0 acceptance criteria passed
- [ ] All P1 acceptance criteria passed
- [ ] All critical bugs fixed
- [ ] All high severity bugs fixed
- [ ] Unit tests passed (coverage > 80%)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Performance tests passed
- [ ] Security tests passed
- [ ] Accessibility tests passed
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Deployment to staging successful
- [ ] Stakeholder approval obtained

### 9.2 Release Checklist

- [ ] All acceptance criteria passed
- [ ] All tests passed
- [ ] No critical bugs
- [ ] No high severity bugs
- [ ] Performance targets met
- [ ] Security vulnerabilities remediated
- [ ] Accessibility compliance verified
- [ ] Documentation complete
- [ ] Deployment to production successful
- [ ] Post-deployment testing completed
- [ ] Monitoring configured
- [ ] Rollback plan ready

---

## 10. Test Coverage Targets

| Category | Target | Current |
|----------|--------|----------|
| Functional Requirements | 100% | - |
| Non-Functional Requirements | 100% | - |
| Acceptance Criteria | 100% | - |

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
- [Accessibility Tests](./0307-accessibility-tests.md)
- [Bug Reporting](./0308-bug-reporting.md)
