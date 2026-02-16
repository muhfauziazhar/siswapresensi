# User Journey - SiswaPresensi

## Journey 1: Guru Input Presensi (Scan QR Code)

### Step 1: Login ke Sistem
**User Action:** Guru membuka website SiswaPresensi dan login dengan email/password.

**System Response:** Sistem melakukan validasi kredensial dan mengarahkan guru ke dashboard.

**Touch Points:** Halaman login

**Pain Points:**
- Kredensial salah
- Sistem tidak merespons

---

### Step 2: Buka Jadwal Hari Ini
**User Action:** Guru membuka halaman jadwal hari ini.

**System Response:** Sistem menampilkan daftar jadwal hari ini dengan mapel, kelas, dan waktu.

**Touch Points:** Dashboard → Jadwal

**Pain Points:**
- Tidak ada jadwal hari ini
- Jadwal bentrok (conflict)

---

### Step 3: Pilih Kelas untuk Presensi
**User Action:** Guru memilih kelas (misal: "Matematika XI IPA 1").

**System Response:** Sistem menampilkan halaman presensi dengan daftar siswa dan opsi input presensi.

**Touch Points:** Halaman presensi

**Pain Points:**
- Daftar siswa tidak muncul
- Kelas tidak memiliki jadwal hari ini

---

### Step 4: Pilih Opsi Scan QR Code
**User Action:** Guru memilih opsi "Scan QR Code".

**System Response:** Sistem membuka kamera dan menampilkan viewfinder untuk scan QR code.

**Touch Points:** Halaman scan QR

**Pain Points:**
- Kamera tidak dapat diakses
- QR code tidak dapat dipindai

---

### Step 5: Scan QR Code Siswa
**User Action:** Siswa menunjukkan QR code, guru memindai QR code.

**System Response:** Sistem memvalidasi QR code dan menampilkan informasi siswa (nama, NIS, kelas).

**Touch Points:** Kamera smartphone

**Pain Points:**
- QR code tidak valid
- QR code kadaluarsa
- QR code diluar radius sekge (jika geofencing aktif)

---

### Step 6: Konfirmasi Presensi
**User Action:** Sistem otomatis menandai siswa sebagai "Hadir" dan menampilkan konfirmasi.

**System Response:** Presensi tersimpan ke database dan notifikasi dikirim ke orang tua.

**Touch Points:** Halaman presensi

**Pain Points:**
- Presensi gagal disimpan
- Notifikasi tidak terkirim

---

## Journey 2: Guru Input Presensi (Reverse Marking)

### Step 1: Login ke Sistem
**User Action:** Guru membuka website dan login.

**System Response:** Sistem mengarahkan guru ke dashboard.

**Touch Points:** Halaman login

---

### Step 2: Buka Jadwal Hari Ini
**User Action:** Guru membuka halaman jadwal hari ini.

**System Response:** Sistem menampilkan daftar jadwal hari ini.

**Touch Points:** Dashboard → Jadwal

---

### Step 3: Pilih Kelas untuk Presensi
**User Action:** Guru memilih kelas (misal: "Matematika XI IPA 1").

**System Response:** Sistem menampilkan halaman presensi.

**Touch Points:** Halaman presensi

---

### Step 4: Pilih Opsi Reverse Marking
**User Action:** Guru memilih opsi "Reverse Marking" (mark yang TIDAK hadir).

**System Response:** Sistem menampilkan daftar semua siswa dengan checkbox untuk mark tidak hadir.

**Touch Points:** Halaman reverse marking

**Pain Points:**
- Daftar siswa tidak muncul
- Daftar siswa tidak lengkap

---

### Step 5: Check Siswa yang Tidak Hadir
**User Action:** Guru menandai siswa yang tidak hadir (Sakit/Izin/Alpha).

**System Response:** Sistem menampilkan opsi untuk memilih tipe ketidakhadiran.

**Touch Points:** Halaman reverse marking

**Pain Points:**
- Tidak jelas tipe ketidakhadiran
- Sulit memilih banyak siswa sekaligus

---

### Step 6: Simpan Presensi
**User Action:** Guru klik tombol "Simpan".

**System Response:** Presensi tersimpan ke database. Siswa yang tidak dicek otomatis ter-mark sebagai "Hadir".

**Touch Points:** Halaman presensi

**Pain Points:**
- Presensi gagal disimpan
- Siswa yang hadir tidak ter-mark benar

---

## Journey 3: Siswa Generate QR Code

### Step 1: Login ke Sistem
**User Action:** Siswa membuka website dan login dengan NIS/password.

**System Response:** Sistem mengarahkan siswa ke dashboard.

**Touch Points:** Halaman login

---

### Step 2: Lihat Jadwal Hari Ini
**User Action:** Siswa membuka halaman jadwal hari ini.

**System Response:** Sistem menampilkan daftar jadwal hari ini.

**Touch Points:** Dashboard → Jadwal

---

### Step 3: Pilih Kelas untuk Presensi
**User Action:** Siswa memilih kelas (misal: "Matematika XI IPA 1").

**System Response:** Sistem menampilkan halaman presensi.

**Touch Points:** Halaman presensi

---

### Step 4: Generate QR Code
**User Action:** Siswa klik tombol "Generate QR Code".

**System Response:** Sistem generate QR code unik dengan timestamp dan expiry time.

**Touch Points:** Halaman presensi

**Pain Points:**
- QR code tidak dapat digenerate
- Generate QR code lambat

---

### Step 5: Tampilkan QR Code
**User Action:** QR code tampil di browser.

**System Response:** Siswa dapat screenshot atau show langsung ke guru.

**Touch Points:** Halaman QR code

**Pain Points:**
- QR code tidak jelas
- QR code kecil/sulit discan

---

### Step 6: Guru Scan QR Code
**User Action:** Guru memindai QR code siswa.

**System Response:** Siswa ter-mark sebagai "Hadir" dan notifikasi dikirim ke orang tua.

**Touch Points:** Kamera guru

---

## Journey 4: Orang Tua Request Izin/Sakit

### Step 1: Login ke Sistem
**User Action:** Orang tua membuka website dan login.

**System Response:** Sistem mengarahkan orang tua ke dashboard.

**Touch Points:** Halaman login

---

### Step 2: Pilih Anak
**User Action:** Orang tua memilih anak (misal: "Ahmad Rizky").

**System Response:** Sistem menampilkan dashboard anak (jadwal, status hari ini).

**Touch Points:** Dashboard anak

---

### Step 3: Buka Form Request Izin/Sakit
**User Action:** Orang tua klik tombol "Request Izin/Sakit".

**System Response:** Sistem menampilkan form request.

**Touch Points:** Form request

---

### Step 4: Isi Form Request
**User Action:** Orang tua mengisi form:
- Pilih tipe: Sakit/Izin
- Pilih tanggal: 20 Feb 2026
- Isi alasan: "Demam tinggi"
- Upload bukti: Surat dokter (opsional)

**System Response:** Sistem melakukan validasi form.

**Touch Points:** Form request

**Pain Points:**
- Form tidak valid
- Upload bukti gagal

---

### Step 5: Submit Request
**User Action:** Orang tua klik tombol "Kirim Request".

**System Response:** Request tersimpan dengan status "Pending". Notifikasi dikirim ke guru.

**Touch Points:** Form request

**Pain Points:**
- Request gagal disimpan
- Notifikasi tidak terkirim

---

### Step 6: Guru Review Request
**User Action:** Guru menerima notifikasi dan membuka halaman approval.

**System Response:** Sistem menampilkan request dengan detail.

**Touch Points:** Halaman approval

---

### Step 7: Guru Approve Request
**User Action:** Guru klik tombol "Setujui".

**System Response:** Request status berubah menjadi "Approved". Presensi otomatis ter-mark sebagai "Sakit". Notifikasi dikirim ke orang tua.

**Touch Points:** Halaman approval

---

### Step 8: Orang Tua Terima Notifikasi
**User Action:** Orang tua menerima notifikasi "Request Approved".

**System Response:** Orang tua dapat melihat status approved di dashboard.

**Touch Points:** Dashboard anak

---

## Journey 5: Super Admin Manage Users

### Step 1: Login ke Sistem
**User Action:** Admin membuka website dan login.

**System Response:** Sistem mengarahkan admin ke dashboard.

**Touch Points:** Halaman login

---

### Step 2: Buka Manajemen Users
**User Action:** Admin membuka halaman manajemen users.

**System Response:** Sistem menampilkan daftar semua users (guru, siswa, orang tua).

**Touch Points:** Dashboard → Users

---

### Step 3: Tambah User Baru
**User Action:** Admin klik tombol "Tambah User".

**System Response:** Sistem menampilkan form tambah user.

**Touch Points:** Form tambah user

---

### Step 4: Isi Form User
**User Action:** Admin mengisi form:
- Nama: "Guru Baru"
- Email: "gurubaru@example.com"
- Password: "password123"
- Role: "Guru"

**System Response:** Sistem melakukan validasi form.

**Touch Points:** Form tambah user

---

### Step 5: Simpan User
**User Action:** Admin klik tombol "Simpan".

**System Response:** User tersimpan ke database.

**Touch Points:** Form tambah user

---

### Step 6: User Muncul di Daftar
**User Action:** Admin kembali ke halaman manajemen users.

**System Response:** User baru muncul di daftar.

**Touch Points:** Halaman users

---

## Ringkasan Journey

| Journey | Jumlah Step | User Utama | Touch Point Utama |
|---------|-------------|------------|-------------------|
| Guru Input Presensi (Scan QR) | 6 | Guru | Website, Kamera |
| Guru Input Presensi (Reverse Marking) | 6 | Guru | Website |
| Siswa Generate QR Code | 6 | Siswa | Website, Browser |
| Orang Tua Request Izin/Sakit | 8 | Orang Tua | Website, Email |
| Super Admin Manage Users | 6 | Admin | Website |

---

## Dokumentasi Terkait
- [Overview](./0101-overview.md)
- [User Personas](./0102-user-personas.md)
- [Features](./0104-features.md)
