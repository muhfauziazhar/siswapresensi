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
