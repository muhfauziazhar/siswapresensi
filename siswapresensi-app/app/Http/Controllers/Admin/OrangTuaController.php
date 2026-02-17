<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrangTuaRequest;
use App\Http\Requests\Admin\UpdateOrangTuaRequest;
use App\Models\OrangTua;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class OrangTuaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/orang-tua/index', [
            'orangTua' => OrangTua::query()->with('user')->latest()->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/orang-tua/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrangTuaRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'orang_tua',
            ]);

            OrangTua::create([
                'user_id' => $user->id,
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
            ]);
        });

        return redirect()->route('admin.orang-tua.index')->with('success', 'Orang tua berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrangTua $orangTua): Response
    {
        return Inertia::render('admin/orang-tua/edit', [
            'orangTua' => $orangTua->load('user'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrangTuaRequest $request, OrangTua $orangTua): RedirectResponse
    {
        DB::transaction(function () use ($request, $orangTua) {
            $orangTua->update([
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
            ]);

            $userData = [
                'name' => $request->nama,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            $orangTua->user->update($userData);
        });

        return redirect()->route('admin.orang-tua.index')->with('success', 'Orang tua berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrangTua $orangTua): RedirectResponse
    {
        DB::transaction(function () use ($orangTua) {
            $orangTua->delete();
            $orangTua->user->delete();
        });

        return redirect()->route('admin.orang-tua.index')->with('success', 'Orang tua berhasil dihapus.');
    }
}
