<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Izin;
use App\Models\Presensi;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IzinController extends Controller
{
    /**
     * Show pending izin requests for guru's jadwal.
     */
    public function index(Request $request): Response
    {
        $guru = auth()->user()->guru;
        $jadwalIds = $guru->jadwal()->pluck('id');

        $izin = Izin::query()
            ->whereIn('jadwal_id', $jadwalIds)
            ->pending()
            ->with(['siswa', 'jadwal.mapel'])
            ->latest()
            ->paginate(15);

        return Inertia::render('guru/izin/index', [
            'izinList' => $izin,
        ]);
    }

    /**
     * Approve an izin request.
     */
    public function approve(Izin $izin): RedirectResponse
    {
        $izin->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
        ]);

        // Auto-mark presensi for the date range
        $start = Carbon::parse($izin->tanggal_mulai);
        $end = Carbon::parse($izin->tanggal_selesai);

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            Presensi::updateOrCreate(
                [
                    'siswa_id' => $izin->siswa_id,
                    'jadwal_id' => $izin->jadwal_id,
                    'tanggal' => $date->toDateString(),
                ],
                [
                    'status' => $izin->jenis,
                    'marked_by' => auth()->id(),
                ]
            );
        }

        return back()->with('success', 'Izin berhasil disetujui.');
    }

    /**
     * Reject an izin request.
     */
    public function reject(Request $request, Izin $izin): RedirectResponse
    {
        $request->validate([
            'catatan' => ['required', 'string', 'max:500'],
        ]);

        $izin->update([
            'status' => 'rejected',
            'catatan' => $request->input('catatan'),
            'reviewed_by' => auth()->id(),
        ]);

        return back()->with('success', 'Izin berhasil ditolak.');
    }
}
