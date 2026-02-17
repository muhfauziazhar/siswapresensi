<?php

use App\Models\Kelas;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
});

it('can list kelas', function () {
    Kelas::factory()->count(3)->create();
    $this->actingAs($this->admin)->get('/admin/kelas')->assertStatus(200);
});

it('can create kelas', function () {
    $this->actingAs($this->admin)->post('/admin/kelas', [
        'nama' => 'XII IPA 1',
        'tingkat' => '12',
        'status' => 'aktif',
    ])->assertRedirect('/admin/kelas');

    $this->assertDatabaseHas('kelas', ['nama' => 'XII IPA 1']);
});

it('can update kelas', function () {
    $kelas = Kelas::factory()->create();
    $this->actingAs($this->admin)->put("/admin/kelas/{$kelas->id}", [
        'nama' => 'XII IPA 2',
        'tingkat' => '12',
        'status' => 'aktif',
    ])->assertRedirect('/admin/kelas');

    $this->assertDatabaseHas('kelas', ['id' => $kelas->id, 'nama' => 'XII IPA 2']);
});

it('can delete kelas', function () {
    $kelas = Kelas::factory()->create();
    $this->actingAs($this->admin)->delete("/admin/kelas/{$kelas->id}")->assertRedirect('/admin/kelas');
    $this->assertDatabaseMissing('kelas', ['id' => $kelas->id]);
});

it('validates required fields when creating kelas', function () {
    $this->actingAs($this->admin)->post('/admin/kelas', [])->assertSessionHasErrors(['nama', 'tingkat', 'status']);
});
