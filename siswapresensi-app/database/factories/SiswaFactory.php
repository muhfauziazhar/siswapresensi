<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Siswa>
 */
class SiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'siswa']),
            'nis' => fake()->unique()->numerify('########'),
            'nama_depan' => fake()->firstName(),
            'nama_belakang' => fake()->lastName(),
            'kelas_id' => Kelas::factory(),
            'orang_tua_id' => null,
            'status' => 'aktif',
        ];
    }

    public function withOrangTua(?OrangTua $orangTua = null): static
    {
        return $this->state(fn (array $attributes) => [
            'orang_tua_id' => $orangTua?->id ?? OrangTua::factory(),
        ]);
    }

    public function nonAktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'non_aktif',
        ]);
    }
}
