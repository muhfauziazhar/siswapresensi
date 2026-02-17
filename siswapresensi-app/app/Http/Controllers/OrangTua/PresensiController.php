<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresensiController extends Controller
{
    /**
     * Show presensi for orang_tua's children.
     */
    public function index(Request $request): Response
    {
        $orangTua = auth()->user()->orangTua;
        $anak = $orangTua->anak()->aktif()->with('kelas')->get();
        $anakIds = $anak->pluck('id');

        $query = Presensi::query()
            ->whereIn('siswa_id', $anakIds)
            ->with(['siswa', 'jadwal.mapel', 'jadwal.kelas']);

        if ($request->filled('siswa_id') && $anakIds->contains($request->input('siswa_id'))) {
            $query->where('siswa_id', $request->input('siswa_id'));
        }

        $presensi = $query->latest('tanggal')->paginate(20)->withQueryString();

        $statsBaseQuery = Presensi::query()->whereIn('siswa_id', $anakIds);

        if ($request->filled('siswa_id') && $anakIds->contains($request->input('siswa_id'))) {
            $statsBaseQuery->where('siswa_id', $request->input('siswa_id'));
        }

        $stats = [
            'hadir' => (clone $statsBaseQuery)->where('status', 'hadir')->count(),
            'izin' => (clone $statsBaseQuery)->where('status', 'izin')->count(),
            'sakit' => (clone $statsBaseQuery)->where('status', 'sakit')->count(),
            'alpha' => (clone $statsBaseQuery)->where('status', 'alpha')->count(),
        ];

        return Inertia::render('orang-tua/presensi/index', [
            'anak' => $anak,
            'presensi' => $presensi,
            'stats' => $stats,
        ]);
    }
}
