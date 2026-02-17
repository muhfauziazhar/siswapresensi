# Features - SiswaPresensi

## Priority 1: Must Have (MVP)

### [ ] 1. User Authentication & Authorization
**Description:** Sistem menyediakan fitur login untuk 4 roles: Super Admin, Guru, Siswa, Orang Tua.

**Value:** Memastikan keamanan sistem dan membatasi akses hanya ke user yang berwenang.

**User Story:** Sebagai [Role], saya ingin login ke sistem dengan email/password agar saya dapat mengakses dashboard sesuai role saya.

**Dependencies:** Tidak ada

---

### [ ] 2. Manajemen Sekolah (Kelas & Mapel)
**Description:** Admin dapat mengelola data kelas dan mapel (tambah, edit, nonaktifkan).

**Value:** Memungkinkan pengelolaan struktur akademik sekolah.

**User Story:** Sebagai Admin, saya ingin menambah, mengedit, dan menonaktifkan kelas dan mapel agar saya dapat mengelola struktur akademik.

**Dependencies:** User Authentication

---

### [ ] 3. Manajemen Jadwal
**Description:** Admin/Guru dapat mengatur jadwal pelajaran (tambah, edit, nonaktifkan dengan hari, jam, mapel, kelas, guru).

**Value:** Memungkinkan pengaturan jadwal pelajaran yang terstruktur.

**User Story:** Sebagai Admin, saya ingin menambah dan mengatur jadwal pelajaran agar saya dapat mengelola jadwal sekolah.

**Dependencies:** Manajemen Sekolah

---

### [ ] 4. Manajemen Siswa
**Description:** Admin dapat mengelola data siswa (tambah, edit, nonaktifkan, import dari Excel).

**Value:** Memungkinkan pengelolaan data siswa.

**User Story:** Sebagai Admin, saya ingin menambah, mengedit, dan menonaktifkan siswa agar saya dapat mengelola data siswa.

**Dependencies:** Manajemen Sekolah

---

### [ ] 5. Manajemen Guru
**Description:** Admin dapat mengelola data guru (tambah, edit, nonaktifkan).

**Value:** Memungkinkan pengelolaan data guru.

**User Story:** Sebagai Admin, saya ingin menambah, mengedit, dan menonaktifkan guru agar saya dapat mengelola data guru.

**Dependencies:** User Authentication

---

### [ ] 6. Manajemen Orang Tua
**Description:** Admin dapat mengelola data orang tua (tambah, edit, nonaktifkan, hubungkan ke siswa).

**Value:** Memungkinkan pengelolaan data orang tua dan hubungan ke siswa.

**User Story:** Sebagai Admin, saya ingin menambah, mengedit, dan menonaktifkan orang tua agar saya dapat mengelola data orang tua.

**Dependencies:** Manajemen Siswa

---

### [ ] 7. QR Code Generation
**Description:** Siswa dapat generate QR code unik untuk presensi di jadwal tertentu.

**Value:** Memungkinkan siswa generate QR code untuk presensi.

**User Story:** Sebagai Siswa, saya ingin generate QR code untuk jadwal hari ini agar saya dapat menunjukkannya ke guru.

**Dependencies:** Manajemen Jadwal, Manajemen Siswa

---

### [ ] 8. QR Code Validation (Scan)
**Description:** Guru dapat memindai QR code siswa dan sistem memvalidasi QR code tersebut.

**Value:** Memungkinkan guru memvalidasi presensi siswa dengan cepat dan akurat.

**User Story:** Sebagai Guru, saya ingin memindai QR code siswa agar saya dapat memvalidasi presensi dengan cepat.

**Dependencies:** QR Code Generation

---

### [ ] 9. Reverse Marking
**Description:** Guru dapat memilih opsi "Reverse Marking" untuk hanya menandai siswa yang TIDAK hadir (Sakit/Izin/Alpha).

**Value:** Memungkinkan guru input presensi lebih efisien (hanya mark yang tidak hadir).

**User Story:** Sebagai Guru, saya ingin hanya menandai siswa yang tidak hadir agar saya dapat menghemat waktu.

**Dependencies:** Manajemen Jadwal, Manajemen Siswa

---

### [ ] 10. Request Izin/Sakit (Orang Tua)
**Description:** Orang tua dapat mengajukan izin/sakit untuk anak dengan form (tanggal, alasan, upload bukti).

**Value:** Memungkinkan orang tua request izin/sakit secara online.

**User Story:** Sebagai Orang Tua, saya ingin mengajukan izin/sakit untuk anak agar saya tidak perlu WA guru.

**Dependencies:** Manajemen Siswa, Manajemen Orang Tua

---

### [ ] 11. Approval Workflow (Guru)
**Description:** Guru dapat approve/reject request izin/sakit dari orang tua.

**Value:** Memungkinkan guru review dan approve/reject request izin/sakit.

**User Story:** Sebagai Guru, saya ingin approve/reject request izin/sakit agar saya dapat mengelola presensi.

**Dependencies:** Request Izin/Sakit

---

### [ ] 12. Auto-Marking Presensi
**Description:** Sistem otomatis menandai presensi siswa yang approved izin/sakit (tidak perlu mark manual).

**Value:** Memungkinkan presensi otomatis untuk siswa yang approved izin/sakit.

**User Story:** Sebagai Guru, saya ingin siswa yang approved izin/sakit otomatis ter-mark agar saya tidak perlu mark manual.

**Dependencies:** Approval Workflow

---

### [ ] 13. Dashboard Per Role
**Description:** Dashboard terpisah untuk setiap role dengan fitur yang relevan.

**Value:** Menyediakan pengalaman yang relevan untuk setiap role.

**User Story:** Sebagai [Role], saya ingin dashboard dengan fitur yang relevan agar saya dapat mengakses fitur yang saya butuh.

**Dependencies:** User Authentication

---

### [ ] 14. Laporan Presensi
**Description:** Guru/Admin dapat melihat laporan presensi harian/mingguan/bulanan.

**Value:** Memungkinkan guru/admin melihat laporan presensi.

**User Story:** Sebagai Guru, saya ingin melihat laporan presensi agar saya dapat memantau kehadiran siswa.

**Dependencies:** Semua fitur presensi

---

## Priority 2: Should Have

### [ ] 15. Real-Time Notifications
**Description:** Sistem mengirim notifikasi real-time ke orang tua saat anak hadir/tidak hadir, dan ke siswa saat request disetujui/ditolak.

**Value:** Memastikan orang tua dan siswa menerima informasi penting secara tepat waktu.

**User Story:** Sebagai Orang Tua, saya ingin menerima notifikasi saat anak hadir/tidak hadir agar saya tahu real-time.

**Dependencies:** Semua fitur presensi

---

### [ ] 16. Gegeofencing (Optional)
**Description:** QR code hanya valid dalam radius sekolah (mencegah cheating).

**Value:** Mencegah siswa scan QR code dari rumah.

**User Story:** Sebagai Guru, saya ingin QR code hanya valid di sekolah agar saya mencegah cheating.

**Dependencies:** QR Code Validation

---

### [ ] 17. Import/Export Data
**Description:** Admin dapat import data siswa/guru dari Excel dan export laporan presensi ke Excel/PDF.

**Value:** Memudahkan manajemen data dan laporan.

**User Story:** Sebagai Admin, saya ingin import data dari Excel dan export laporan ke Excel/PDF agar saya dapat menghemat waktu.

**Dependencies:** Manajemen Siswa, Laporan Presensi

---

### [ ] 18. Mobile-Responsive Design
**Description:** Sistem memiliki desain yang responsif dan dapat diakses dengan baik melalui perangkat mobile.

**Value:** Memungkinkan pengguna mengakses sistem dari smartphone dengan pengalaman yang baik.

**User Story:** Sebagai Siswa, saya ingin mengakses sistem dari smartphone agar saya dapat generate QR code di mana saja.

**Dependencies:** Semua

---

## Priority 3: Nice to Have

### [ ] 19. PWA (Progressive Web App)
**Description:** Sistem dapat di-install ke smartphone seperti native app.

**Value:** Memberikan pengalaman native-like tanpa perlu develop native app.

**User Story:** Sebagai Siswa, saya ingin install sistem ke smartphone agar saya dapat akses cepat.

**Dependencies:** Mobile-Responsive Design

---

### [ ] 20. Analytics & Insights
**Description:** Admin dapat melihat analitik lanjutan (pola kehadiran, performa guru, trend).

**Value:** Memberikan insight yang lebih mendalam untuk pengambilan keputusan.

**User Story:** Sebagai Admin, saya ingin melihat analitik lanjutan agar saya dapat mengambil keputusan bisnis yang lebih baik.

**Dependencies:** Laporan Presensi

---

### [ ] 21. Multi-Language Support
**Description:** Sistem mendukung multiple bahasa (Indonesia, Inggris).

**Value:** Memungkinkan pengguna dari berbagai negara menggunakan sistem dengan nyaman.

**User Story:** Sebagai Siswa, saya ingin menggunakan sistem dalam bahasa Indonesia agar saya dapat menggunakannya dengan nyaman.

**Dependencies:** Semua

---

### [ ] 22. Dark Mode
**Description:** Sistem memiliki opsi dark mode untuk kenyamanan mata.

**Value:** Memberikan opsi tampilan yang nyaman untuk penggunaan di malam hari.

**User Story:** Sebagai Siswa, saya ingin menggunakan dark mode agar mata saya tidak cepat lelah.

**Dependencies:** Semua

---

## Ringkasan Fitur

| Priority | Jumlah Fitur | Fokus Utama |
|----------|--------------|-------------|
| Priority 1 (MVP) | 14 | Core functionality untuk operasional dasar |
| Priority 2 (Should Have) | 4 | Enhancement untuk pengalaman pengguna yang lebih baik |
| Priority 3 (Nice to Have) | 4 | Advanced features untuk ekspansi dan improvement |

---

## Dokumentasi Terkait
- [Overview](./0101-overview.md)
- [User Personas](./0102-user-personas.md)
- [User Journey](./0103-user-journey.md)
- [Business Rules](./0105-business-rules.md)
