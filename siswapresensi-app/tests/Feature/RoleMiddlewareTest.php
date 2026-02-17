<?php

use App\Models\User;

it('allows admin to access admin routes', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)->get('/admin/kelas')->assertStatus(200);
});

it('denies guru from accessing admin routes', function () {
    $guru = User::factory()->create(['role' => 'guru']);
    $this->actingAs($guru)->get('/admin/kelas')->assertStatus(403);
});

it('denies siswa from accessing admin routes', function () {
    $siswa = User::factory()->create(['role' => 'siswa']);
    $this->actingAs($siswa)->get('/admin/kelas')->assertStatus(403);
});

it('denies orang_tua from accessing admin routes', function () {
    $orangTua = User::factory()->create(['role' => 'orang_tua']);
    $this->actingAs($orangTua)->get('/admin/kelas')->assertStatus(403);
});

it('denies unauthenticated users from accessing protected routes', function () {
    $this->get('/admin/kelas')->assertRedirect('/login');
});
