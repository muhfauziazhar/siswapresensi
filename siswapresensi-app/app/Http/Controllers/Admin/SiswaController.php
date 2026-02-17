<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSiswaRequest;
use App\Http\Requests\Admin\UpdateSiswaRequest;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $query = Siswa::query()->with(['kelas', 'orangTua'])->latest();

        if (request('search')) {
            $query->where(function ($q) {
                $q->where('nama_depan', 'like', '%' . request('search') . '%')
                  ->orWhere('nama_belakang', 'like', '%' . request('search') . '%')
                  ->orWhere('nis', 'like', '%' . request('search') . '%');
            });
        }

        if (request('kelas_id') && request('kelas_id') !== 'all') {
            $query->where('kelas_id', request('kelas_id'));
        }

        return Inertia::render('admin/siswa/index', [
            'siswa' => $query->paginate(15)->withQueryString(),
            'kelasList' => Kelas::query()->aktif()->orderBy('nama')->get(),
            'filters' => request()->only(['search', 'kelas_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/siswa/create', [
            'kelasList' => Kelas::query()->aktif()->get(),
            'orangTuaList' => OrangTua::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSiswaRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->nama_depan.' '.$request->nama_belakang,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'siswa',
            ]);

            Siswa::create([
                'user_id' => $user->id,
                'nis' => $request->nis,
                'nama_depan' => $request->nama_depan,
                'nama_belakang' => $request->nama_belakang,
                'kelas_id' => $request->kelas_id,
                'orang_tua_id' => $request->orang_tua_id,
            ]);
        });

        return redirect()->route('admin.siswa.index')->with('success', 'Siswa berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa): Response
    {
        return Inertia::render('admin/siswa/edit', [
            'siswa' => $siswa->load(['kelas', 'orangTua', 'user']),
            'kelasList' => Kelas::query()->aktif()->get(),
            'orangTuaList' => OrangTua::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSiswaRequest $request, Siswa $siswa): RedirectResponse
    {
        DB::transaction(function () use ($request, $siswa) {
            $siswa->update([
                'nis' => $request->nis,
                'nama_depan' => $request->nama_depan,
                'nama_belakang' => $request->nama_belakang,
                'kelas_id' => $request->kelas_id,
                'orang_tua_id' => $request->orang_tua_id,
            ]);

            $userData = [
                'name' => $request->nama_depan.' '.$request->nama_belakang,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            $siswa->user->update($userData);
        });

        return redirect()->route('admin.siswa.index')->with('success', 'Siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa): RedirectResponse
    {
        DB::transaction(function () use ($siswa) {
            $siswa->delete();
            $siswa->user->delete();
        });

        return redirect()->route('admin.siswa.index')->with('success', 'Siswa berhasil dihapus.');
    }
}
