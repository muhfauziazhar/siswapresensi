<?php

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
});

it('can list siswa', function () {
    Siswa::factory()->count(3)->create();
    $this->actingAs($this->admin)->get('/admin/siswa')->assertStatus(200);
});

it('can create siswa with user account', function () {
    $kelas = Kelas::factory()->create();
    $this->actingAs($this->admin)->post('/admin/siswa', [
        'nama_depan' => 'Test',
        'nama_belakang' => 'Siswa',
        'nis' => '12345678',
        'kelas_id' => $kelas->id,
        'email' => 'siswa@test.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect('/admin/siswa');

    $this->assertDatabaseHas('siswa', ['nis' => '12345678']);
    $this->assertDatabaseHas('users', ['email' => 'siswa@test.com', 'role' => 'siswa']);
});
