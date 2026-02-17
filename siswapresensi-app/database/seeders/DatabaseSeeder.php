<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Izin;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\OrangTua;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Sekolah',
            'email' => 'admin@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Guru 1 - Budi Santoso
        $guruUser1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'guru',
        ]);

        $guru1 = Guru::create([
            'user_id' => $guruUser1->id,
            'nip' => '1234567890',
            'nama' => 'Budi Santoso',
        ]);

        // Guru 2 - Siti Nurhaliza
        $guruUser2 = User::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti.guru@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'guru',
        ]);

        $guru2 = Guru::create([
            'user_id' => $guruUser2->id,
            'nip' => '0987654321',
            'nama' => 'Siti Nurhaliza',
        ]);

        // Orang Tua 1
        $orangTuaUser1 = User::create([
            'name' => 'Siti Aminah',
            'email' => 'siti@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'orang_tua',
        ]);

        $orangTua1 = OrangTua::create([
            'user_id' => $orangTuaUser1->id,
            'nama' => 'Siti Aminah',
            'telepon' => '081234567890',
            'alamat' => 'Jl. Merdeka No. 1, Jakarta',
        ]);

        // Orang Tua 2
        $orangTuaUser2 = User::create([
            'name' => 'Budi Hartono',
            'email' => 'budi.orangtua@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'orang_tua',
        ]);

        $orangTua2 = OrangTua::create([
            'user_id' => $orangTuaUser2->id,
            'nama' => 'Budi Hartono',
            'telepon' => '081234567891',
            'alamat' => 'Jl. Sudirman No. 2, Jakarta',
        ]);

        // Kelas
        $kelas1 = Kelas::create([
            'nama' => 'XI IPA 1',
            'tingkat' => 'XI',
        ]);

        $kelas2 = Kelas::create([
            'nama' => 'XI IPA 2',
            'tingkat' => 'XI',
        ]);

        // Mapel
        $mapel1 = Mapel::create([
            'nama' => 'Matematika',
            'kode' => 'MAT',
        ]);

        $mapel2 = Mapel::create([
            'nama' => 'Fisika',
            'kode' => 'FIS',
        ]);

        $mapel3 = Mapel::create([
            'nama' => 'Bahasa Indonesia',
            'kode' => 'BIN',
        ]);

        // Siswa 1 - Ahmad Rizky
        $siswaUser1 = User::create([
            'name' => 'Ahmad Rizky',
            'email' => 'ahmad@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        $siswa1 = Siswa::create([
            'user_id' => $siswaUser1->id,
            'nis' => '2026001',
            'nama_depan' => 'Ahmad',
            'nama_belakang' => 'Rizky',
            'kelas_id' => $kelas1->id,
            'orang_tua_id' => $orangTua1->id,
            // qr_code_token auto-generates via model boot
        ]);

        // Siswa 2 - Dewi Sartika
        $siswaUser2 = User::create([
            'name' => 'Dewi Sartika',
            'email' => 'dewi@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        $siswa2 = Siswa::create([
            'user_id' => $siswaUser2->id,
            'nis' => '2026002',
            'nama_depan' => 'Dewi',
            'nama_belakang' => 'Sartika',
            'kelas_id' => $kelas1->id,
            'orang_tua_id' => $orangTua1->id,
        ]);

        // Siswa 3 - Budi Santoso Jr
        $siswaUser3 = User::create([
            'name' => 'Budi Santoso Jr',
            'email' => 'budi.siswa@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        $siswa3 = Siswa::create([
            'user_id' => $siswaUser3->id,
            'nis' => '2026003',
            'nama_depan' => 'Budi',
            'nama_belakang' => 'Santoso Jr',
            'kelas_id' => $kelas2->id,
            'orang_tua_id' => $orangTua2->id,
        ]);

        // Siswa 4 - Rina Wati
        $siswaUser4 = User::create([
            'name' => 'Rina Wati',
            'email' => 'rina@siswapresensi.test',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        $siswa4 = Siswa::create([
            'user_id' => $siswaUser4->id,
            'nis' => '2026004',
            'nama_depan' => 'Rina',
            'nama_belakang' => 'Wati',
            'kelas_id' => $kelas2->id,
            'orang_tua_id' => $orangTua2->id,
        ]);

        // Jadwal
        // Matematika XI IPA 1 - Senin 08:00-09:30 (Budi Santoso)
        $jadwal1 = Jadwal::create([
            'kelas_id' => $kelas1->id,
            'mapel_id' => $mapel1->id,
            'guru_id' => $guru1->id,
            'hari' => 'senin',
            'waktu_mulai' => '08:00',
            'waktu_selesai' => '09:30',
        ]);

        // Fisika XI IPA 1 - Selasa 10:00-11:30 (Siti Nurhaliza)
        $jadwal2 = Jadwal::create([
            'kelas_id' => $kelas1->id,
            'mapel_id' => $mapel2->id,
            'guru_id' => $guru2->id,
            'hari' => 'selasa',
            'waktu_mulai' => '10:00',
            'waktu_selesai' => '11:30',
        ]);

        // Bahasa Indonesia XI IPA 1 - Rabu 08:00-09:30 (Budi Santoso)
        $jadwal3 = Jadwal::create([
            'kelas_id' => $kelas1->id,
            'mapel_id' => $mapel3->id,
            'guru_id' => $guru1->id,
            'hari' => 'rabu',
            'waktu_mulai' => '08:00',
            'waktu_selesai' => '09:30',
        ]);

        // Matematika XI IPA 2 - Senin 10:00-11:30 (Budi Santoso)
        $jadwal4 = Jadwal::create([
            'kelas_id' => $kelas2->id,
            'mapel_id' => $mapel1->id,
            'guru_id' => $guru1->id,
            'hari' => 'senin',
            'waktu_mulai' => '10:00',
            'waktu_selesai' => '11:30',
        ]);

        // Fisika XI IPA 2 - Selasa 08:00-09:30 (Siti Nurhaliza)
        $jadwal5 = Jadwal::create([
            'kelas_id' => $kelas2->id,
            'mapel_id' => $mapel2->id,
            'guru_id' => $guru2->id,
            'hari' => 'selasa',
            'waktu_mulai' => '08:00',
            'waktu_selesai' => '09:30',
        ]);

        // Bahasa Indonesia XI IPA 2 - Rabu 10:00-11:30 (Siti Nurhaliza)
        $jadwal6 = Jadwal::create([
            'kelas_id' => $kelas2->id,
            'mapel_id' => $mapel3->id,
            'guru_id' => $guru2->id,
            'hari' => 'rabu',
            'waktu_mulai' => '10:00',
            'waktu_selesai' => '11:30',
        ]);

        // Sample Presensi (both via jadwal and general QR)
        Presensi::create([
            'siswa_id' => $siswa1->id,
            'jadwal_id' => $jadwal1->id,
            'status' => 'hadir',
            'tanggal' => now()->format('Y-m-d'),
            'qr_type' => 'jadwal',
            'marked_by' => $guruUser1->id,
        ]);

        Presensi::create([
            'siswa_id' => $siswa2->id,
            'jadwal_id' => $jadwal1->id,
            'status' => 'hadir',
            'tanggal' => now()->format('Y-m-d'),
            'qr_type' => 'general',  // Using general QR fallback
            'marked_by' => $guruUser1->id,
        ]);

        // Sample Izin Request
        Izin::create([
            'siswa_id' => $siswa3->id,
            'jadwal_id' => $jadwal4->id,
            'jenis' => 'sakit',
            'alasan' => 'Demam tinggi',
            'tanggal_mulai' => now()->format('Y-m-d'),
            'tanggal_selesai' => now()->addDay()->format('Y-m-d'),
            'status' => 'pending',
        ]);
    }
}
