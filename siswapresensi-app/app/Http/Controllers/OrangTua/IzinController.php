<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrangTua\StoreIzinRequest;
use App\Models\Izin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IzinController extends Controller
{
    /**
     * Show izin requests for orang_tua's children.
     */
    public function index(Request $request): Response
    {
        $orangTua = auth()->user()->orangTua;
        $anakIds = $orangTua->anak()->pluck('id');

        $izin = Izin::query()
            ->whereIn('siswa_id', $anakIds)
            ->with(['siswa', 'jadwal.mapel'])
            ->latest()
            ->paginate(15);

        return Inertia::render('orang-tua/izin/index', [
            'izin' => $izin,
        ]);
    }

    /**
     * Show form to create a new izin request.
     */
    public function create(): Response
    {
        $orangTua = auth()->user()->orangTua;

        $anak = $orangTua->anak()
            ->aktif()
            ->with(['kelas.jadwal' => function ($query) {
                $query->aktif()->with(['mapel', 'guru']);
            }])
            ->get();

        return Inertia::render('orang-tua/izin/create', [
            'anak' => $anak,
        ]);
    }

    /**
     * Store a newly created izin request.
     */
    public function store(StoreIzinRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $orangTua = auth()->user()->orangTua;

        // Validate that siswa belongs to this orang_tua
        $anakIds = $orangTua->anak()->pluck('id');

        if (! $anakIds->contains($validated['siswa_id'])) {
            return back()->with('error', 'Siswa yang dipilih bukan anak Anda.');
        }

        $buktiPath = null;

        if ($request->hasFile('bukti')) {
            $buktiPath = $request->file('bukti')->store('bukti-izin', 'public');
        }

        Izin::create([
            'siswa_id' => $validated['siswa_id'],
            'jadwal_id' => $validated['jadwal_id'],
            'jenis' => $validated['jenis'],
            'alasan' => $validated['alasan'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'bukti_path' => $buktiPath,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Izin berhasil diajukan.');
    }
}
