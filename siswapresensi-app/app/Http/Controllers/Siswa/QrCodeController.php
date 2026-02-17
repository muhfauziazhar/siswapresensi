<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QrCodeController extends Controller
{
    /**
     * Show siswa's QR codes page.
     */
    public function index(Request $request): Response
    {
        $siswa = auth()->user()->siswa;

        $jadwalHariIni = Jadwal::query()
            ->where('kelas_id', $siswa->kelas_id)
            ->aktif()
            ->hariIni()
            ->with(['mapel', 'guru'])
            ->orderBy('waktu_mulai')
            ->get();

        return Inertia::render('siswa/qr-code', [
            'jadwalHariIni' => $jadwalHariIni,
            'siswa' => $siswa,
            'generalQrToken' => $siswa->qr_code_token,
        ]);
    }

    /**
     * Generate per-jadwal QR code.
     */
    public function generate(Request $request): RedirectResponse
    {
        $request->validate([
            'jadwal_id' => ['required', 'exists:jadwal,id'],
        ]);

        $siswa = auth()->user()->siswa;

        $qrData = base64_encode(json_encode([
            'siswa_id' => $siswa->id,
            'jadwal_id' => $request->input('jadwal_id'),
            'timestamp' => now()->toIso8601String(),
            'expires_at' => now()->addHours(2)->toIso8601String(),
        ]));

        return back()->with('qr_data', $qrData);
    }
}
