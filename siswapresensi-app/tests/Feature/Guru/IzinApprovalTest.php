<?php

use App\Models\Guru;
use App\Models\Izin;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Siswa;
use App\Models\User;

beforeEach(function () {
    $this->guruUser = User::factory()->create(['role' => 'guru']);
    $this->guru = Guru::factory()->create(['user_id' => $this->guruUser->id]);
    $this->kelas = Kelas::factory()->create();
    $this->mapel = Mapel::factory()->create();
    $this->jadwal = Jadwal::factory()->create([
        'kelas_id' => $this->kelas->id,
        'mapel_id' => $this->mapel->id,
        'guru_id' => $this->guru->id,
    ]);
    $this->siswa = Siswa::factory()->create(['kelas_id' => $this->kelas->id]);
});

it('can view pending izin list', function () {
    Izin::factory()->create([
        'siswa_id' => $this->siswa->id,
        'jadwal_id' => $this->jadwal->id,
    ]);
    $this->actingAs($this->guruUser)->get('/guru/izin')->assertStatus(200);
});

it('can approve izin', function () {
    $izin = Izin::factory()->create([
        'siswa_id' => $this->siswa->id,
        'jadwal_id' => $this->jadwal->id,
        'jenis' => 'sakit',
        'tanggal_mulai' => now()->toDateString(),
        'tanggal_selesai' => now()->toDateString(),
    ]);

    $this->actingAs($this->guruUser)->put("/guru/izin/{$izin->id}/approve")->assertRedirect();

    $this->assertDatabaseHas('izin', [
        'id' => $izin->id,
        'status' => 'approved',
    ]);

    // Check auto-marking
    $this->assertDatabaseHas('presensi', [
        'siswa_id' => $this->siswa->id,
        'jadwal_id' => $this->jadwal->id,
        'status' => 'sakit',
    ]);
});

it('can reject izin', function () {
    $izin = Izin::factory()->create([
        'siswa_id' => $this->siswa->id,
        'jadwal_id' => $this->jadwal->id,
    ]);

    $this->actingAs($this->guruUser)->put("/guru/izin/{$izin->id}/reject", [
        'catatan' => 'Alasan tidak valid',
    ])->assertRedirect();

    $this->assertDatabaseHas('izin', [
        'id' => $izin->id,
        'status' => 'rejected',
        'catatan' => 'Alasan tidak valid',
    ]);
});
