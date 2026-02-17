<?php

use App\Models\Guru;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
});

it('can list guru', function () {
    Guru::factory()->count(3)->create();
    $this->actingAs($this->admin)->get('/admin/guru')->assertStatus(200);
});

it('can create guru with user account', function () {
    $this->actingAs($this->admin)->post('/admin/guru', [
        'nama' => 'Guru Baru',
        'nip' => '1234567890',
        'email' => 'guru@test.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect('/admin/guru');

    $this->assertDatabaseHas('guru', ['nama' => 'Guru Baru', 'nip' => '1234567890']);
    $this->assertDatabaseHas('users', ['email' => 'guru@test.com', 'role' => 'guru']);
});

it('can delete guru and user', function () {
    $guru = Guru::factory()->create();
    $userId = $guru->user_id;
    $this->actingAs($this->admin)->delete("/admin/guru/{$guru->id}")->assertRedirect('/admin/guru');
    $this->assertDatabaseMissing('guru', ['id' => $guru->id]);
    $this->assertDatabaseMissing('users', ['id' => $userId]);
});
