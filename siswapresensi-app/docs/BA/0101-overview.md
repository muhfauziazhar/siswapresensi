# Ringkasan Proyek - SiswaPresensi

## Pernyataan Masalah

Sistem presensi manual di sekolah Indonesia saat ini menghadapi beberapa tantangan utama:

1. **Waktu Terbuang Sia-Sia** - Guru menghabiskan 10-15 menit per kelas untuk memanggil nama siswa satu per satu saat presensi. Kalau 6 kelas/hari = 1-1.5 jam HABIS untuk presensi doang.

2. **Proses Manual Rentan Error** - Presensi manual menggunakan kertas mudah salah catat, duplikasi, atau terlewat.

3. **Tidak Ada Real-Time Tracking** - Orang tua tidak tahu apakah anaknya hadir di sekolah atau tidak. Notifikasi hanya setelah rapor keluar (bulanan).

4. **Request Izin/Sakit Rumit** - Orang tua harus menghubungi sekolah secara manual (telepon/WA) untuk request izin/sakit. Prosesnya tidak terdokumentasi dengan baik.

5. **Analitik Tidak Ada** - Sekolah tidak punya data real-time tentang tingkat kehadiran, pola ketidakhadiran, atau performa guru dalam input presensi.

6. **Validasi Sulit** - Tidak ada sistem untuk memvalidasi keaslian presensi (siswa bisa minta teman scan QR-nya).

## Visi Solusi

SiswaPresensi adalah sistem presensi berbasis web yang menyediakan:

1. **QR Code Presensi** - Siswa generate QR code di browser, guru scan untuk mark presensi. Cepat dan akurat.

2. **Reverse Marking** - Guru hanya perlu mark siswa yang TIDAK hadir (Sakit/Izin/Alpha). Lebih efisien daripada mark satu-satu.

3. **Parent Portal** - Orang tua bisa request izin/sakit untuk anak secara online, upload bukti (surat dokter), dan monitor kehadiran real-time.

4. **Approval Workflow** - Guru approve/reject request izin/sakit dari orang tua. Approved request otomatis ter-mark di presensi.

5. **Auto-Marking** - Siswa yang approved izin/sakit otomatis ter-mark di presensi, tidak perlu mark manual lagi.

6. **Dashboard Per Role** - Dashboard terpisah untuk Admin, Guru, Siswa, dan Orang Tua dengan fitur yang relevan.

7. **Real-Time Notifications** - Notifikasi otomatis ke orang tua saat anak hadir/tidak hadir, dan ke siswa saat request disetujui/ditolak.

8. **Geofencing (Optional)** - QR code hanya valid dalam radius sekolah (mencegah cheating).

9. **Laporan & Analitik** - Laporan presensi harian/mingguan/bulanan, statistik kehadiran, dan analitik pola.

10. **Web-Based (No Mobile App)** - Semua berjalan di browser dengan PWA capabilities. Installable ke phone seperti native app.

## Target Pengguna

### 1. Super Admin
- **Deskripsi:** Pengelola sistem dengan akses penuh untuk konfigurasi dan manajemen.
- **Kebutuhan:** Manage sekolah, users, settings, monitoring, laporan.

### 2. Guru
- **Deskripsi:** Pengajar yang mengajar di kelas dan perlu input presensi siswa.
- **Kebutuhan:** Lihat jadwal, input presensi (scan QR/reverse marking), approve requests, lihat laporan.

### 3. Siswa
- **Deskripsi:** Siswa yang perlu generate QR code untuk presensi.
- **Kebutuhan:** Generate QR code, lihat jadwal, lihat riwayat presensi, request izin/sakit.

### 4. Orang Tua
- **Deskripsi:** Orang tua siswa yang ingin monitor kehadiran anak.
- **Kebutuhan:** Request izin/sakit, monitor kehadiran real-time, lihat riwayat, terima notifikasi.

## Metrik Keberhasilan

### Metrik Bisnis
- **Tingkat Kehadiriran:** Target > 90% kehadiran per kelas.
- **Waktu Penghematan:** Save 10-15 menit per kelas = 1-1.5 jam/hari per guru.
- **Adopsi Orang Tua:** 70% orang tua aktif menggunakan parent portal.
- **Request Approval Rate:** < 80% request izin/sakit disetujui (realistis).
- **Error Rate Presensi:** < 1% error rate pada presensi.

### Metrik Pengguna
- **Kepuasan Guru:** Target NPS score > 50 untuk guru.
- **Kemudahan Penggunaan:** Waktu input presensi < 3 menit per kelas (turun dari 10-15 menit).
- **Tingkat Penyelesaian:** < 5% dropout saat proses presensi.
- **Waktu QR Scan:** < 5 detik per siswa untuk proses scan.

### Metrik Teknis
- **Waktu Muat Halaman:** < 2 detik untuk halaman utama.
- **Waktu Generate QR:** < 1 detik untuk generate QR code.
- **Waktu Validate QR:** < 500ms untuk validasi QR code.
- **Uptime:** > 99% availability.
- **API Response Time:** < 200ms untuk API calls kritis.

---

## Dokumentasi Terkait
- [User Personas](./0102-user-personas.md)
- [User Journey](./0103-user-journey.md)
- [Features](./0104-features.md)
- [Business Rules](./0105-business-rules.md)
- [Constraints](./0106-constraints.md)
- [Success Metrics](./0107-success-metrics.md)
