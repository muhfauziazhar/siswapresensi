<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Izin;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Presensi;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => $this->adminDashboard(),
            'guru' => $this->guruDashboard($user),
            'siswa' => $this->siswaDashboard($user),
            'orang_tua' => $this->orangTuaDashboard($user),
            default => abort(403),
        };
    }

    private function adminDashboard(): Response
    {
        $stats = [
            'total_siswa' => Siswa::aktif()->count(),
            'total_guru' => Guru::count(),
            'total_kelas' => Kelas::aktif()->count(),
            'hadir_hari_ini' => Presensi::hariIni()->where('status', 'hadir')->count(),
            'izin_hari_ini' => Presensi::hariIni()->where('status', 'izin')->count(),
            'sakit_hari_ini' => Presensi::hariIni()->where('status', 'sakit')->count(),
            'alpha_hari_ini' => Presensi::hariIni()->where('status', 'alpha')->count(),
            'total_jadwal_hari_ini' => Jadwal::aktif()->hariIni()->count(),
        ];

        $recentPresensi = Presensi::with(['siswa', 'jadwal.mapel', 'jadwal.kelas'])
            ->latest('marked_at')
            ->limit(10)
            ->get();

        $pendingIzin = Izin::with(['siswa', 'jadwal.mapel'])
            ->pending()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard/admin', [
            'stats' => $stats,
            'recentPresensi' => $recentPresensi,
            'pendingIzin' => $pendingIzin,
        ]);
    }

    private function guruDashboard($user): Response
    {
        $guru = $user->guru;

        $jadwalHariIni = Jadwal::with(['kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->aktif()
            ->hariIni()
            ->orderBy('waktu_mulai')
            ->get();

        $pendingIzin = Izin::with(['siswa', 'jadwal.mapel'])
            ->whereHas('jadwal', fn ($q) => $q->where('guru_id', $guru->id))
            ->pending()
            ->latest()
            ->limit(10)
            ->get();

        $todayPresensiCount = Presensi::hariIni()
            ->whereHas('jadwal', fn ($q) => $q->where('guru_id', $guru->id))
            ->count();

        return Inertia::render('dashboard/guru', [
            'jadwalHariIni' => $jadwalHariIni,
            'pendingIzin' => $pendingIzin,
            'todayPresensiCount' => $todayPresensiCount,
            'guru' => $guru,
        ]);
    }

    private function siswaDashboard($user): Response
    {
        $siswa = $user->siswa()->with('kelas')->first();

        $jadwalHariIni = Jadwal::with(['mapel', 'guru', 'kelas'])
            ->where('kelas_id', $siswa->kelas_id)
            ->aktif()
            ->hariIni()
            ->orderBy('waktu_mulai')
            ->get();

        $recentPresensi = Presensi::with(['jadwal.mapel'])
            ->where('siswa_id', $siswa->id)
            ->latest('tanggal')
            ->limit(10)
            ->get();

        $stats = [
            'hadir' => Presensi::where('siswa_id', $siswa->id)->where('status', 'hadir')->count(),
            'izin' => Presensi::where('siswa_id', $siswa->id)->where('status', 'izin')->count(),
            'sakit' => Presensi::where('siswa_id', $siswa->id)->where('status', 'sakit')->count(),
            'alpha' => Presensi::where('siswa_id', $siswa->id)->where('status', 'alpha')->count(),
        ];

        return Inertia::render('dashboard/siswa', [
            'siswa' => $siswa,
            'jadwalHariIni' => $jadwalHariIni,
            'recentPresensi' => $recentPresensi,
            'stats' => $stats,
        ]);
    }

    private function orangTuaDashboard($user): Response
    {
        $orangTua = $user->orangTua;

        $anak = Siswa::with(['kelas'])
            ->where('orang_tua_id', $orangTua->id)
            ->aktif()
            ->get();

        $recentPresensi = Presensi::with(['siswa', 'jadwal.mapel'])
            ->whereIn('siswa_id', $anak->pluck('id'))
            ->latest('tanggal')
            ->limit(10)
            ->get();

        $pendingIzin = Izin::with(['siswa', 'jadwal.mapel'])
            ->whereIn('siswa_id', $anak->pluck('id'))
            ->pending()
            ->count();

        return Inertia::render('dashboard/orang-tua', [
            'orangTua' => $orangTua,
            'anak' => $anak,
            'recentPresensi' => $recentPresensi,
            'pendingIzinCount' => $pendingIzin,
        ]);
    }
}
