<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJadwalRequest;
use App\Http\Requests\Admin\UpdateJadwalRequest;
use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/jadwal/index', [
            'jadwal' => Jadwal::query()->with(['kelas', 'mapel', 'guru'])->latest()->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/jadwal/create', [
            'kelasList' => Kelas::query()->aktif()->get(),
            'mapelList' => Mapel::query()->aktif()->get(),
            'guruList' => Guru::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJadwalRequest $request): RedirectResponse
    {
        if ($this->hasScheduleConflict($request)) {
            return back()->withErrors(['conflict' => 'Jadwal bertabrakan dengan jadwal lain yang sudah ada.'])->withInput();
        }

        Jadwal::create($request->validated());

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Jadwal $jadwal): Response
    {
        return Inertia::render('admin/jadwal/edit', [
            'jadwal' => $jadwal,
            'kelasList' => Kelas::query()->aktif()->get(),
            'mapelList' => Mapel::query()->aktif()->get(),
            'guruList' => Guru::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJadwalRequest $request, Jadwal $jadwal): RedirectResponse
    {
        if ($this->hasScheduleConflict($request, $jadwal)) {
            return back()->withErrors(['conflict' => 'Jadwal bertabrakan dengan jadwal lain yang sudah ada.'])->withInput();
        }

        $jadwal->update($request->validated());

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jadwal $jadwal): RedirectResponse
    {
        $jadwal->delete();

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil dihapus.');
    }

    /**
     * Check if the schedule conflicts with existing schedules.
     */
    private function hasScheduleConflict(StoreJadwalRequest|UpdateJadwalRequest $request, ?Jadwal $jadwal = null): bool
    {
        return Jadwal::query()
            ->where('hari', $request->hari)
            ->where('status', 'aktif')
            ->where(function ($q) use ($request) {
                $q->where('guru_id', $request->guru_id)
                    ->orWhere('kelas_id', $request->kelas_id);
            })
            ->where(function ($q) use ($request) {
                $q->where('waktu_mulai', '<', $request->waktu_selesai)
                    ->where('waktu_selesai', '>', $request->waktu_mulai);
            })
            ->when($jadwal, fn ($q) => $q->where('id', '!=', $jadwal->id))
            ->exists();
    }
}
