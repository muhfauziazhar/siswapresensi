# Success Metrics - SiswaPresensi

## Business Metrics

### Metric 1: Tingkat Kehadiran (Attendance Rate)
- **Definition:** Persentase siswa yang hadir per kelas.
- **Formula:** (Total Siswa Hadir / Total Siswa) × 100%
- **Target:** > 90% kehadiran per kelas.
- **Frequency:** Harian (real-time dashboard)
- **Owner:** Guru, Admin
- **Data Source:** Database presensi

**Contoh:**
- Total siswa: 30
- Siswa hadir: 27
- Tingkat kehadiran: 90%

---

### Metric 2: Waktu Penghematan (Time Saved)
- **Definition:** Waktu yang dihemat guru dibandingkan presensi manual.
- **Formula:** (Waktu Manual - Waktu Digital) per kelas
- **Target:** Save 10-15 menit per kelas = 1-1.5 jam/hari per guru.
- **Frequency:** Mingguan
- **Owner:** Admin
- **Data Source:** Analytics (tracking time input presensi)

**Contoh:**
- Waktu manual: 15 menit
- Waktu digital: 3 menit
- Waktu penghematan: 12 menit per kelas

---

### Metric 3: Adopsi Orang Tua (Parent Adoption)
- **Definition:** Persentase orang tua yang aktif menggunakan parent portal.
- **Formula:** (Orang Tua Aktif / Total Orang Tua) × 100%
- **Target:** 70% orang tua aktif.
- **Frequency:** Bulanan
- **Owner:** Admin
- **Data Source:** Database users

**Contoh:**
- Total orang tua: 100
- Orang tua aktif: 70
- Adopsi orang tua: 70%

---

### Metric 4: Request Approval Rate
- **Definition:** Persentase request izin/sakit yang disetujui.
- **Formula:** (Request Approved / Total Request) × 100%
- **Target:** < 80% request disetujui (realistis).
- **Frequency:** Mingguan
- **Owner:** Guru
- **Data Source:** Database izin requests

**Contoh:**
- Total request: 100
- Request approved: 75
- Request approval rate: 75%

---

### Metric 5: Error Rate Presensi
- **Definition:** Persentase error pada proses presensi.
- **Formula:** (Total Error / Total Presensi) × 100%
- **Target:** < 1% error rate pada presensi.
- **Frequency:** Harian
- **Owner:** QA, Admin
- **Data Data:** Log sistem

**Contoh:**
- Total presensi: 1000
- Total error: 5
- Error rate: 0.5%

---

## User Metrics

### Metric 6: Kepuasan Guru (Teacher Satisfaction)
- **Definition:** Tingkat kepuasan guru berdasarkan survey atau feedback.
- **Formula:** NPS (Net Promoter Score) atau CSAT (Customer Satisfaction Score)
- **Target:** NPS score > 50 (Good) atau CSAT > 4/5.
- **Frequency:** Bulanan, Per Semester
- **Owner:** Admin
- **Data Source:** Survey, Feedback form, Review

**Contoh:**
- Promoters (9-10): 40%
- Passives (7-8): 40%
- Detractors (0-6): 20%
- NPS: 40% - 20% = 20 (Perlu improvement)

---

### Metric 7: Kemudahan Penggunaan (Ease of Use)
- **Definition:** Waktu yang dibutuhkan guru untuk input presensi.
- **Formula:** Rata-rata waktu input presensi per kelas
- **Target:** < 3 menit per kelas (turun dari 10-15 menit).
- **Frequency:** Mingguan
- **Owner:** UX Designer / Developer
- **Data Source:** Analytics (Google Analytics, dll)

**Contoh:**
- Total waktu presensi: 150 menit
- Total kelas: 50
- Rata-rata waktu per kelas: 3 menit

---

### Metric 8: Tingkat Penyelesaian (Completion Rate)
- **Definition:** Persentase guru yang menyelesaikan proses presensi hingga submit.
- **Formula:** (Presensi Selesai / Total Presensi Dimulai) × 100%
- **Target:** > 95% completion rate.
- **Frequency:** Harian, Mingguan
- **Owner:** UX Designer / Developer
- **Data Source:** Analytics (Google Analytics, dll)

**Contoh:**
- Presensi selesai: 95
- Total presensi dimulai: 100
- Tingkat penyelesaian: 95%

---

### Metric 9: Waktu QR Scan
- **Definition:** Rata-rata waktu yang dibutuhkan guru untuk scan QR code.
- **Formula:** Rata-rata waktu scan QR code per siswa
- **Target:** < 5 detik per siswa untuk proses scan.
- **Frequency:** Harian
- **Owner:** Guru
- **Data Source:** Log sistem

**Contoh:**
- Total waktu scan: 250 detik
- Total siswa discan: 50
- Rata-rata waktu per siswa: 5 detik

---

### Metric 10: Retention Rate
- **Definition:** Persentase guru yang terus menggunakan sistem.
- **Formula:** (Guru Repeat / Total Guru Unik) × 100%
- **Target:** 80-90% retention rate.
- **Frequency:** Bulanan, Kuartalan
- **Owner:** Admin
- **Data Source:** Database presensi

**Contoh:**
- Guru repeat: 80
- Total guru unik: 100
- Retention rate: 80%

---

## Technical Metrics

### Metric 11: Waktu Muat Halaman (Page Load Time)
- **Definition:** Rata-rata waktu yang dibutuhkan untuk memuat halaman.
- **Formula:** Rata-rata waktu load halaman dari semua halaman
- **Target:** < 2 detik untuk halaman utama, < 1.5 detik untuk halaman lainnya.
- **Frequency:** Real-time (monitoring)
- **Owner:** Developer / DevOps
- **Data Source:** APM (Application Performance Monitoring)

**Contoh:**
- Homepage: 1.5 detik
- Halaman presensi: 1.2 detik
- Halaman dashboard: 1.8 detik
- Rata-rata: 1.5 detik

---

### Metric 12: Uptime (Availability)
- **Definition:** Persentase waktu sistem tersedia dan dapat diakses.
- **Formula:** (Total Uptime / Total Time) × 100%
- **Target:** > 99% availability (downtime < 7.2 jam per bulan).
- **Frequency:** Real-time (monitoring)
- **Owner:** Developer / DevOps
- **Data Source:** Uptime monitoring (UptimeRobot, Pingdom, dll)

**Contoh:**
- Total uptime: 712 jam
- Total time: 720 jam (1 bulan)
- Uptime: 98.9%

---

### Metric 13: Tingkat Error (Error Rate)
- **Definition:** Persentase request yang mengalami error.
- **Formula:** (Total Error / Total Request) × 100%
- **Target:** < 0.1% error rate pada transasi.
- **Frequency:** Real-time (monitoring)
- **Owner:** Developer / QA
- **Data Source:** Log sistem, APM

**Contoh:**
- Total error: 5
- Total request: 10.000
- Error rate: 0.05%

---

### Metric 14: API Response Time
- **Definition:** Rata-rata waktu yang dibutuhkan API untuk merespons request.
- **Formula:** Rata-rata waktu response API
- **Target:** < 200ms untuk API calls kritis, < 500ms untuk API calls lainnya.
- **Frequency:** Real-time (monitoring)
- **Owner:** Developer / DevOps
- **Data Source:** APM, Log sistem

**Contoh:**
- API login: 100ms
- API QR generate: 150ms
- API QR validate: 80ms
- Rata-rata: 110ms

---

### Metric 15: Database Query Performance
- **Definition:** Rata-rata waktu yang dibutuhkan untuk mengeksekusi query database.
- **Formula:** Rata-rata waktu eksekusi query database
- **Target:** < 100ms untuk query kritis, < 300ms untuk query lainnya.
- **Frequency:** Mingguan
- **Owner:** Developer / DBA
- **Data Source:** Database monitoring, Slow query log

**Contoh:**
- Query get presensi: 50ms
- Query create presensi: 80ms
- Query get jadwal: 30ms
- Rata-rata: 53.33ms

---

## Ringkasan Success Metrics

| Kategori | Metric | Target | Frequency | Owner |
|----------|--------|--------|-----------|-------|
| Business | Tingkat Kehadiran | > 90% | Harian | Guru, Admin |
| Business | Waktu Penghematan | 10-15 menit/kelas | Mingguan | Admin |
| Business | Adopsi Orang Tua | 70% | Bulanan | Admin |
| Business | Request Approval Rate | < 80% | Mingguan | Guru |
| Business | Error Rate Presensi | < 1% | Harian | QA, Admin |
| User | Kepuasan Guru | NPS > 50 | Bulanan | Admin |
| User | Kemudahan Penggunaan | < 3 menit/kelas | Mingguan | UX Designer |
| User | Tingkat Penyelesaian | > 95% | Harian | UX Designer |
| User | Waktu QR Scan | < 5 detik/siswa | Harian | Guru |
| User | Retention Rate | 80-90% | Bulanan | Admin |
| Technical | Waktu Muat Halaman | < 2 detik | Real-time | Developer |
| Technical | Uptime | > 99% | Real-time | Developer |
| Technical | Tingkat Error | < 0.1% | Real-time | Developer |
| Technical | API Response Time | < 200ms | Real-time | Developer |
| Technical | Database Query Performance | < 100ms | Mingguan | Developer |

---

## Tools untuk Monitoring

### Business & User Metrics
- **Google Analytics:** Untuk tracking user behavior dan conversion
- **Custom Dashboard:** Untuk tracking business metrics

### Technical Metrics
- **Sentry:** Untuk error tracking dan monitoring
- **Laravel Telescope:** Untuk debugging dan monitoring Laravel
- **MySQL Slow Query Log:** Untuk monitoring query performance

---

## Dokumentasi Terkait
- [Overview](./0101-overview.md)
- [Business Rules](./0105-business-rules.md)
- [Constraints](./0106-constraints.md)
