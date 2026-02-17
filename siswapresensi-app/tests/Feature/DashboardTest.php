<?php

use App\Models\User;

it('requires authentication to view dashboard', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

it('admin can view admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)->get('/dashboard')->assertStatus(200);
});

it('guru can view guru dashboard', function () {
    $guruUser = User::factory()->create(['role' => 'guru']);
    \App\Models\Guru::factory()->create(['user_id' => $guruUser->id]);
    $this->actingAs($guruUser)->get('/dashboard')->assertStatus(200);
});

it('siswa can view siswa dashboard', function () {
    $siswaUser = User::factory()->create(['role' => 'siswa']);
    \App\Models\Siswa::factory()->create(['user_id' => $siswaUser->id]);
    $this->actingAs($siswaUser)->get('/dashboard')->assertStatus(200);
});

it('orang_tua can view orang_tua dashboard', function () {
    $orangTuaUser = User::factory()->create(['role' => 'orang_tua']);
    \App\Models\OrangTua::factory()->create(['user_id' => $orangTuaUser->id]);
    $this->actingAs($orangTuaUser)->get('/dashboard')->assertStatus(200);
});
