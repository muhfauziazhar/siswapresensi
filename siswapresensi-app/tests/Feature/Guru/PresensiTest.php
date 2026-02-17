<?php

use App\Models\Guru;
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
        'hari' => strtolower(now()->englishDayOfWeek),
        'waktu_mulai' => '07:00',
        'waktu_selesai' => '08:00',
    ]);
});

it('can view presensi index', function () {
    $this->actingAs($this->guruUser)->get('/guru/presensi')->assertStatus(200);
});

it('can view presensi show for a jadwal', function () {
    $this->actingAs($this->guruUser)->get("/guru/presensi/{$this->jadwal->id}")->assertStatus(200);
});

it('can do reverse marking', function () {
    $siswa1 = Siswa::factory()->create(['kelas_id' => $this->kelas->id]);
    $siswa2 = Siswa::factory()->create(['kelas_id' => $this->kelas->id]);

    $response = $this->actingAs($this->guruUser)->post('/guru/presensi/reverse-marking', [
        'jadwal_id' => $this->jadwal->id,
        'tanggal' => now()->toDateString(),
        'absensi' => [
            ['siswa_id' => $siswa1->id, 'status' => 'alpha'],
        ],
    ]);
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('presensi', [
        'siswa_id' => $siswa1->id,
        'jadwal_id' => $this->jadwal->id,
        'status' => 'alpha',
    ]);

    $this->assertDatabaseHas('presensi', [
        'siswa_id' => $siswa2->id,
        'jadwal_id' => $this->jadwal->id,
        'status' => 'hadir',
    ]);
});
