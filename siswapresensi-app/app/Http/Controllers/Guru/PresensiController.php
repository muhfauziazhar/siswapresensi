<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guru\ReverseMarkingRequest;
use App\Models\Jadwal;
use App\Models\Presensi;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PresensiController extends Controller
{
    /**
     * Show guru's jadwal for today.
     */
    public function index(Request $request): Response
    {
        $guru = auth()->user()->guru;

        $jadwalHariIni = Jadwal::query()
            ->where('guru_id', $guru->id)
            ->aktif()
            ->hariIni()
            ->with(['kelas', 'mapel'])
            ->orderBy('waktu_mulai')
            ->get();

        return Inertia::render('guru/presensi/index', [
            'jadwalHariIni' => $jadwalHariIni,
        ]);
    }

    /**
     * Show attendance form for a specific jadwal.
     */
    public function show(Jadwal $jadwal): Response
    {
        $jadwal->load(['kelas', 'mapel', 'guru']);

        $siswaList = Siswa::query()
            ->where('kelas_id', $jadwal->kelas_id)
            ->aktif()
            ->with(['presensi' => function ($query) use ($jadwal) {
                $query->where('jadwal_id', $jadwal->id)
                    ->where('tanggal', now()->toDateString());
            }])
            ->orderBy('nama_depan')
            ->get();

        $presensiRecords = Presensi::query()
            ->where('jadwal_id', $jadwal->id)
            ->where('tanggal', now()->toDateString())
            ->with('siswa')
            ->get();

        return Inertia::render('guru/presensi/show', [
            'jadwal' => $jadwal,
            'siswaList' => $siswaList,
            'presensiRecords' => $presensiRecords,
        ]);
    }

    /**
     * Show QR scanner page.
     */
    public function scan(): Response
    {
        return Inertia::render('guru/presensi/scan');
    }

    /**
     * Process QR code scan.
     */
    public function storeScan(Request $request): RedirectResponse
    {
        $request->validate([
            'qr_data' => ['required', 'string'],
        ]);

        $qrData = $request->input('qr_data');

        // Try to decode as base64 JSON (per-jadwal QR)
        $decoded = json_decode(base64_decode($qrData), true);

        if ($decoded && isset($decoded['siswa_id'], $decoded['jadwal_id'], $decoded['expires_at'])) {
            // Per-jadwal QR
            if (now()->isAfter($decoded['expires_at'])) {
                return back()->with('error', 'QR code sudah expired.');
            }

            $siswa = Siswa::findOrFail($decoded['siswa_id']);
            $jadwal = Jadwal::findOrFail($decoded['jadwal_id']);
            $qrType = 'jadwal';
        } else {
            // General QR (UUID token)
            $siswa = Siswa::where('qr_code_token', $qrData)->firstOrFail();
            $guru = auth()->user()->guru;

            $jadwal = Jadwal::where('guru_id', $guru->id)
                ->aktif()
                ->hariIni()
                ->where('kelas_id', $siswa->kelas_id)
                ->first();

            if (! $jadwal) {
                return back()->with('error', 'Tidak ada jadwal aktif untuk siswa ini.');
            }

            $qrType = 'general';
        }

        // Check existing
        $existing = Presensi::where('siswa_id', $siswa->id)
            ->where('jadwal_id', $jadwal->id)
            ->where('tanggal', now()->toDateString())
            ->first();

        if ($existing) {
            return back()->with('error', 'Siswa sudah presensi hari ini.');
        }

        Presensi::create([
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'status' => 'hadir',
            'tanggal' => now()->toDateString(),
            'qr_type' => $qrType,
            'marked_by' => auth()->id(),
        ]);

        return back()->with('success', 'Presensi berhasil dicatat.');
    }

    /**
     * Process reverse marking.
     */
    public function reverseMarking(ReverseMarkingRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $jadwal = Jadwal::findOrFail($validated['jadwal_id']);

        DB::transaction(function () use ($jadwal, $validated) {
            $siswaIds = Siswa::where('kelas_id', $jadwal->kelas_id)
                ->aktif()
                ->pluck('id');

            // Mark all as 'hadir' first
            foreach ($siswaIds as $siswaId) {
                Presensi::updateOrCreate(
                    [
                        'siswa_id' => $siswaId,
                        'jadwal_id' => $jadwal->id,
                        'tanggal' => $validated['tanggal'],
                    ],
                    [
                        'status' => 'hadir',
                        'marked_by' => auth()->id(),
                    ]
                );
            }

            // Update the ones in absensi array with their specified status
            foreach ($validated['absensi'] as $absen) {
                Presensi::where('siswa_id', $absen['siswa_id'])
                    ->where('jadwal_id', $jadwal->id)
                    ->whereDate('tanggal', $validated['tanggal'])
                    ->update([
                        'status' => $absen['status'],
                        'marked_by' => auth()->id(),
                    ]);
            }
        });

        return back()->with('success', 'Presensi berhasil disimpan.');
    }
}
