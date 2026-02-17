# Business Rules - SiswaPresensi

## Rule Rule 1: Manajemen User & Role

**Description:** Sistem memiliki 4 roles: Super Admin, Guru, Siswa, Orang Tua.

**Logic:**
- Setiap user memiliki role tunggal.
- Super Admin memiliki akses penuh ke seluruh sistem.
- Guru hanya dapat mengakses fitur terkait presensi dan jadwal mereka.
- Siswa hanya dapat mengakses fitur terkait presensi mereka sendiri.
- Orang Tua hanya dapat mengakses fitur terkait anak-anak mereka.

**Example:**
- Admin membuat user "Budi Santoso" dengan role "Guru".
- Budi login dan hanya melihat jadwal dan presensi kelas mereka.
- Budi tidak dapat mengakses manajemen users.

**Exception:** Tidak ada. Role bersifat tunggal dan eksklusif.

---

## Rule 2: Manajemen Kelas & Mapel

**Description:** Kelas dan mapel harus dikelola dengan status aktif/nonaktif.

**Logic:**
- Kelas nonaktif tidak dapat digunakan untuk jadwal baru.
- Mapel nonaktif tidak dapat digunakan untuk jadwal baru.
- Satu kelas dapat memiliki banyak mapel.
- Satu mapel dapat digunakan di banyak kelas.

**Example:**
- Admin membuat kelas "XI IPA 1" dengan status aktif.
- Admin membuat mapel "Matematika" dengan status aktif.
- Admin membuat jadwal "Matematika XI IPA 1" dengan kelas dan mapel aktif.
- Admin menonaktifkan kelas "XI IPA 1".
- Hasil: Jadwal "Matematika XI IPA 1" tidak dapat digunakan.

**Exception:** Tidak ada. Kelas/mapel nonaktif tidak dapat digunakan untuk jadwal baru.

---

## Rule 3: Manajemen Jadwal

**Description:** Jadwal pelajaran harus memiliki konflik detection.

**Logic:**
- Satu guru tidak dapat mengajar di 2 kelas pada waktu yang sama.
- Satu kelas tidak dapat memiliki 2 mapel pada waktu yang sama.
- Jadwal bentrok harus dicegah sebelum disimpan.

**Example:**
- Admin mencoba membuat jadwal:
  - Guru: Budi Santoso
  - Kelas: XI IPA 1
  - Waktu: Senin 08:00 - 09:30
- Admin mencoba membuat jadwal lain:
  - Guru: Budi Santoso
  - Kelas: XI IPA 2
  - Waktu: Senin 08:30 - 10:00
- Hasil: Error, jadwal bentrok (guru sama pada waktu yang tumpang tindih).

**Exception:** Tidak ada. Konflik jadwal tidak diperbolehkan.

---

## Rule 4: QR Code Generation (Per-Jadwal)

**Description:** Siswa dapat generate QR code unik untuk jadwal tertentu.

**Logic:**
- QR code berisi: siswa_id, jadwal_id, timestamp, expiry_time.
- QR code berlaku untuk 2 jam setelah generate.
- QR code hanya valid untuk jadwal yang dipilih.
- QR code di-encode dengan base64.

**Example:**
- Siswa Ahmad Rizky generate QR code untuk jadwal "Matematika XI IPA 1" jam 08:00.
- QR code berisi: {siswa_id: 1, jadwal_id: 1, timestamp: 2026-02-16T08:00:00Z, expiry: 2026-02-16T10:00:00Z}.
- QR code valid sampai jam 10:00.
- Siswa mencoba scan QR code jam 10:30.
- Hasil: QR code expired, tidak valid.

**Exception:** QR code expired tidak valid. QR code untuk jadwal berbeda tidak valid.

---

## Rule 4A: QR Code Umum (General / Fallback)

**Description:** Setiap siswa memiliki QR Code Umum di profil yang berfungsi sebagai fallback.

**Logic:**
- QR Code Umum berisi: `qr_code_token` (UUID permanen) dari tabel siswa.
- QR Code Umum **tidak expire** — selalu aktif selama siswa berstatus aktif.
- QR Code Umum **tidak terikat jadwal tertentu** — guru yang menentukan jadwal saat scan.
- Saat guru scan QR Code Umum, sistem mencari jadwal aktif guru pada waktu tersebut.
- Jika guru memiliki jadwal aktif, presensi otomatis ter-record dengan `qr_type: 'general'`.
- Jika guru tidak memiliki jadwal aktif, sistem menolak scan.

**Kapan Digunakan:**
- QR code per-jadwal gagal di-generate (error jaringan, dll.)
- QR code per-jadwal sudah expired
- Siswa tidak sempat generate QR per-jadwal
- Proses presensi perlu dipercepat

**Example:**
- Siswa Ahmad Rizky membuka profil dan menunjukkan QR Code Umum.
- Guru Budi Santoso scan QR Code Umum jam 08:15.
- Guru saat ini memiliki jadwal aktif: "Matematika XI IPA 1" (08:00-09:30).
- Sistem mencocokkan: Ahmad Rizky adalah anggota kelas XI IPA 1 ✅.
- Presensi ter-record sebagai "Hadir" (qr_type: general).

**Exception:**
- Guru tidak memiliki jadwal aktif → scan ditolak.
- Siswa bukan anggota kelas pada jadwal aktif guru → scan ditolak.
- Siswa berstatus non-aktif → QR Code Umum tidak valid.

**Perbandingan:**

| Aspek | QR Per-Jadwal | QR Umum (Fallback) |
|-------|---------------|--------------------|
| Isi | siswa_id + jadwal_id + timestamp | qr_code_token (UUID) |
| Expiry | 2 jam | Tidak expire |
| Terikat jadwal | Ya (spesifik) | Tidak (guru menentukan) |
| Kapan digunakan | Normal / default | Fallback |
| Tracking di presensi | qr_type: 'jadwal' | qr_type: 'general' |

---

## Rule 5: QR Code Validation

**Description:** Guru dapat memvalidasi QR code siswa.

**Logic:**
- QR code harus valid (tidak expired, jadwal benar).
- QR code hanya valid dalam radius sekolah (jika geofencing aktif).
- QR code hanya dapat divalidasi sekali per jadwal.
- Setelah validasi, presensi otomatis ter-mark sebagai "Hadir".

**Example:**
- Siswa generate QR code untuk jadwal jam 08:00.
- Guru scan QR code jam 08:30.
- Hasil: QR code valid, siswa ter-mark sebagai "Hadir".
- Guru scan QR code yang sama jam 09:00.
- Hasil: Error, QR code sudah divalidasi.

**Exception:** QR code expired, QR code sudah divalidasi, QR code diluar radius (jika geofencing aktif).

---

## Rule 6: Reverse Marking

**Description:** Guru dapat memilih opsi "Reverse Marking" untuk hanya menandai siswa yang TIDAK hadir.

**Logic:**
- Semua siswa otomatis ter-mark sebagai "Hadir" secara default.
- Guru hanya perlu menandai siswa yang tidak hadir (Sakit/Izin/Alpha).
- Siswa yang tidak dicek tetap ter-mark sebagai "Hadir".

**Example:**
- Kelas XI IPA 1 memiliki 30 siswa.
- Guru memilih "Reverse Marking".
- Guru menandai 2. siswa sebagai "Sakit" dan 1 siswa sebagai "Izin".
- Hasil: 27 siswa ter-mark sebagai "Hadir", 2 siswa "Sakit", 1 siswa "Izin".

**Exception:** Tidak ada. Reverse marking adalah fitur untuk efisiensi.

---

## Rule 7: Request Izin/Sakit

**Description:** Orang tua dapat mengajukan izin/sakit untuk anak.

**Logic:**
- Request izin/sakit memiliki status: Pending, Approved, Rejected.
- Request harus memiliki: siswa_id, tanggal_mulai, tanggal_selesai, jenis (Sakit/Izin), alasan.
- Bukti (surat dokter/foto) opsional tapi disarankan untuk "Sakit".
- Request otomatis dikirim ke guru yang mengajar pada tanggal tersebut.

**Example:**
- Orang tua Siti Aminah request izin untuk Ahmad Rizky:
  - Tanggal: 20 Feb 2026
  - Jenis: Sakit
  - Alasan: "Demam tinggi"
  - Bukti: Surat dokter
- Status: Pending
- Guru Budi Santoso menerima notifikasi request.

**Exception:** Orang tua tidak dapat request izin untuk anak yang bukan milik mereka.

---

## Rule 8: Approval Workflow

**Description:** Guru dapat approve/reject request izin/sakit.

**Logic:**
- Guru hanya dapat approve/reject request untuk kelas mereka.
- Request Approved otomatis ter-mark di presensi sebagai "Sakit" atau "Izin".
- Request Rejected tidak mengubah presensi.
- Orang tua menerima notifikasi Approved/Rejected.

**Example:**
- Guru Budi Santoso approve request Ahmad Rizky untuk 20 Feb 2026 (Sakit).
- Status request: Approved.
- Presensi Ahmad Rizky untuk 20 Feb 2026 otomatis ter-mark sebagai "Sakit".
- Orang tua Siti Aminah menerima notifikasi "Request Approved".

**Exception:** Guru tidak dapat approve request untuk kelas yang bukan mereka.

---

## Rule 9: Auto-Marking Presensi

**Description:** Sistem otomatis menandai presensi untuk request yang Approved.

**Logic:**
- Saat request Approved, sistem otomatis create/update presensi record.
- Presensi otomatis ter-mark sesuai jenis request (Sakit/Izin).
- Presensi otomatis ter-mark untuk seluruh range tanggal (tanggal_mulai sampai tanggal_selesai).

**Example:**
- Orang tua request izin untuk 20-22 Feb 2026 (3 hari).
- Guru approve request.
- Sistem otomatis create 3 presensi records:
  - 20 Feb 2026: Sakit
  - 21 Feb 2026: Sakit
  - 22 Feb 2026: Sakit

**Exception:** Tidak ada. Auto-marking adalah fitur untuk efisiensi.

---

## Rule 10: Geofencing (Optional)

**Description:** QR code hanya valid dalam radius sekolah.

**Logic:**
- Sekolah memiliki lokasi (latitude, longitude) dan radius (default: 100 meter).
- QR code hanya valid jika siswa berada dalam radius sekolah saat generate.
- Geofencing opsional dan dapat dinonaktifkan.

**Example:**
- Sekolah lokasi: -6.175392, 106.827153 (Monas, Jakarta).
- Radius: 100 meter.
- Siswa generate QR code di rumah (1 km dari sekolah).
- Hasil: Error, siswa diluar radius sekolah.

**Exception:** Geofencing opsional. Jika dinonaktifkan, QR code valid di mana saja.

---

## Rule 11: Presensi Unik per Jadwal

**Description:** Satu siswa hanya memiliki satu presensi per jadwal per tanggal.

**Logic:**
- Siswa tidak dapat memiliki presensi duplikat untuk jadwal dan tanggal yang sama.
- Jika presensi sudah ada, sistem akan update bukan create baru.

**Example:**
- Siswa Ahmad Rizky sudah ter-mark "Hadir" untuk jadwal "Matematika XI IPA 1" tanggal 20 Feb 2026.
- Sistem mencoba create presensi lagi untuk jadwal dan tanggal yang sama.
- Hasil: Update presensi yang sudah ada, bukan create baru.

**Exception:** Tidak ada. Presensi unik per jadwal per tanggal.

---

## Rule 12: Notification Real-Time

**Description:** Sistem mengirim notifikasi real-time ke user yang relevan.

**Logic:**
- Orang tua menerima notifikasi saat anak hadir/tidak hadir.
- Siswa menerima notifikasi saat request izin disetujui/ditolak.
- Guru menerima notifikasi saat ada request izin baru.
- Notifikasi dikirim via Web Push API.

**Example:**
- Siswa Ahmad Rizky ter-mark "Hadir" untuk jadwal jam 08:00.
- Orang tua Siti Aminah menerima notifikasi: "Ahmad Rizky hadir di kelas Matematika jam 08:00".

**Exception:** Jika pengiriman notifikasi gagal, sistem mencatat error tetapi tidak membatalkan presensi.

---

## Ringkasan Business Rules

| Rule | Kategori | Priority |
|------|----------|----------|
| Manajemen User & Role | Manajemen User | High |
| Manajemen Kelas & Mapel | Manajemen Akademik | High |
| Manajemen Jadwal | Manajemen Akademik | High |
| QR Code Generation (Per-Jadwal) | Presensi | High |
| QR Code Umum (Fallback) | Presensi | High |
| QR Code Validation | Presensi | High |
| Reverse Marking | Presensi | High |
| Request Izin/Sakit | Presensi | High |
| Approval Workflow | Presensi | High |
| Auto-Marking Presensi | Presensi | High |
| Geofencing | Presensi | Medium |
| Presensi Unik per Jadwal | Presensi | High |
| Notification Real-Time | Komunikasi | Medium |

---

## Dokumentasi Terkait
- [Overview](./0101-overview.md)
- [Features](./0104-features.md)
- [Constraints](./0106-constraints.md)
