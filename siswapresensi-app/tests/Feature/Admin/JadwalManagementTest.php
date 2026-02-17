<?php

use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
});

it('can list jadwal', function () {
    Jadwal::factory()->count(3)->create();
    $this->actingAs($this->admin)->get('/admin/jadwal')->assertStatus(200);
});

it('can create jadwal', function () {
    $kelas = Kelas::factory()->create();
    $mapel = Mapel::factory()->create();
    $guru = Guru::factory()->create();

    $this->actingAs($this->admin)->post('/admin/jadwal', [
        'kelas_id' => $kelas->id,
        'mapel_id' => $mapel->id,
        'guru_id' => $guru->id,
        'hari' => 'senin',
        'waktu_mulai' => '08:00',
        'waktu_selesai' => '09:00',
        'status' => 'aktif',
    ])->assertRedirect('/admin/jadwal');

    $this->assertDatabaseHas('jadwal', ['kelas_id' => $kelas->id, 'mapel_id' => $mapel->id]);
});

it('detects schedule conflict', function () {
    $kelas = Kelas::factory()->create();
    $mapel1 = Mapel::factory()->create();
    $mapel2 = Mapel::factory()->create();
    $guru = Guru::factory()->create();

    Jadwal::factory()->create([
        'kelas_id' => $kelas->id,
        'mapel_id' => $mapel1->id,
        'guru_id' => $guru->id,
        'hari' => 'senin',
        'waktu_mulai' => '08:00',
        'waktu_selesai' => '09:00',
        'status' => 'aktif',
    ]);

    // Try to create overlapping schedule
    $this->actingAs($this->admin)->post('/admin/jadwal', [
        'kelas_id' => $kelas->id,
        'mapel_id' => $mapel2->id,
        'guru_id' => $guru->id,
        'hari' => 'senin',
        'waktu_mulai' => '08:30',
        'waktu_selesai' => '09:30',
        'status' => 'aktif',
    ])->assertSessionHasErrors();
});
