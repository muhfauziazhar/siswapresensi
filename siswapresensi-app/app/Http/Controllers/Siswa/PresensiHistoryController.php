<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresensiHistoryController extends Controller
{
    /**
     * Show presensi history for the authenticated siswa.
     */
    public function index(Request $request): Response
    {
        $siswa = auth()->user()->siswa;

        $query = Presensi::query()
            ->where('siswa_id', $siswa->id)
            ->with(['jadwal.mapel', 'jadwal.kelas']);

        if ($request->filled('tanggal_mulai')) {
            $query->where('tanggal', '>=', $request->input('tanggal_mulai'));
        }

        if ($request->filled('tanggal_selesai')) {
            $query->where('tanggal', '<=', $request->input('tanggal_selesai'));
        }

        $presensi = $query->latest('tanggal')->paginate(20)->withQueryString();

        $statsQuery = Presensi::query()->where('siswa_id', $siswa->id);

        if ($request->filled('tanggal_mulai')) {
            $statsQuery->where('tanggal', '>=', $request->input('tanggal_mulai'));
        }

        if ($request->filled('tanggal_selesai')) {
            $statsQuery->where('tanggal', '<=', $request->input('tanggal_selesai'));
        }

        $stats = [
            'hadir' => (clone $statsQuery)->where('status', 'hadir')->count(),
            'izin' => (clone $statsQuery)->where('status', 'izin')->count(),
            'sakit' => (clone $statsQuery)->where('status', 'sakit')->count(),
            'alpha' => (clone $statsQuery)->where('status', 'alpha')->count(),
        ];

        return Inertia::render('siswa/presensi-history', [
            'presensi' => $presensi,
            'stats' => $stats,
            'filters' => [
                'tanggal_mulai' => $request->input('tanggal_mulai'),
                'tanggal_selesai' => $request->input('tanggal_selesai'),
            ],
        ]);
    }
}
