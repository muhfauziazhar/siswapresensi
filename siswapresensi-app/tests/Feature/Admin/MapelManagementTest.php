<?php

use App\Models\Mapel;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
});

it('can list mapel', function () {
    Mapel::factory()->count(3)->create();
    $this->actingAs($this->admin)->get('/admin/mapel')->assertStatus(200);
});

it('can create mapel', function () {
    $this->actingAs($this->admin)->post('/admin/mapel', [
        'nama' => 'Kimia',
        'kode' => 'KIM',
        'status' => 'aktif',
    ])->assertRedirect('/admin/mapel');
    $this->assertDatabaseHas('mapel', ['nama' => 'Kimia', 'kode' => 'KIM']);
});

it('can update mapel', function () {
    $mapel = Mapel::factory()->create();
    $this->actingAs($this->admin)->put("/admin/mapel/{$mapel->id}", [
        'nama' => 'Biologi',
        'kode' => 'BIO',
        'status' => 'aktif',
    ])->assertRedirect('/admin/mapel');
    $this->assertDatabaseHas('mapel', ['id' => $mapel->id, 'nama' => 'Biologi']);
});

it('can delete mapel', function () {
    $mapel = Mapel::factory()->create();
    $this->actingAs($this->admin)->delete("/admin/mapel/{$mapel->id}")->assertRedirect('/admin/mapel');
    $this->assertDatabaseMissing('mapel', ['id' => $mapel->id]);
});
