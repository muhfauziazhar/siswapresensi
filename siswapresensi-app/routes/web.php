<?php

use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\MapelController;
use App\Http\Controllers\Admin\OrangTuaController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Guru\IzinController as GuruIzinController;
use App\Http\Controllers\Guru\PresensiController as GuruPresensiController;
use App\Http\Controllers\OrangTua\IzinController as OrangTuaIzinController;
use App\Http\Controllers\OrangTua\PresensiController as OrangTuaPresensiController;
use App\Http\Controllers\Siswa\PresensiHistoryController;
use App\Http\Controllers\Siswa\QrCodeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('kelas', KelasController::class)->parameters(['kelas' => 'kelas']);
    Route::resource('mapel', MapelController::class);
    Route::resource('guru', GuruController::class);
    Route::resource('siswa', SiswaController::class);
    Route::resource('orang-tua', OrangTuaController::class)->parameters(['orang-tua' => 'orangTua']);
    Route::resource('jadwal', JadwalController::class);
});

// Guru routes
Route::middleware(['auth', 'verified', 'role:guru'])->prefix('guru')->name('guru.')->group(function () {
    Route::get('presensi', [GuruPresensiController::class, 'index'])->name('presensi.index');
    Route::get('presensi/scan', [GuruPresensiController::class, 'scan'])->name('presensi.scan');
    Route::post('presensi/scan', [GuruPresensiController::class, 'storeScan'])->name('presensi.store-scan');
    Route::get('presensi/{jadwal}', [GuruPresensiController::class, 'show'])->name('presensi.show');
    Route::post('presensi/reverse-marking', [GuruPresensiController::class, 'reverseMarking'])->name('presensi.reverse-marking');

    Route::get('izin', [GuruIzinController::class, 'index'])->name('izin.index');
    Route::put('izin/{izin}/approve', [GuruIzinController::class, 'approve'])->name('izin.approve');
    Route::put('izin/{izin}/reject', [GuruIzinController::class, 'reject'])->name('izin.reject');
});

// Siswa routes
Route::middleware(['auth', 'verified', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::get('qr-code', [QrCodeController::class, 'index'])->name('qr-code.index');
    Route::post('qr-code/generate', [QrCodeController::class, 'generate'])->name('qr-code.generate');
    Route::get('presensi', [PresensiHistoryController::class, 'index'])->name('presensi.index');
});

// Orang Tua routes
Route::middleware(['auth', 'verified', 'role:orang_tua'])->prefix('orang-tua')->name('orang-tua.')->group(function () {
    Route::get('izin', [OrangTuaIzinController::class, 'index'])->name('izin.index');
    Route::get('izin/create', [OrangTuaIzinController::class, 'create'])->name('izin.create');
    Route::post('izin', [OrangTuaIzinController::class, 'store'])->name('izin.store');
    Route::get('presensi', [OrangTuaPresensiController::class, 'index'])->name('presensi.index');
});

require __DIR__.'/settings.php';
