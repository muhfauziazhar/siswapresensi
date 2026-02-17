<?php

namespace Database\Factories;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Mapel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jadwal>
 */
class JadwalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $waktuMulai = fake()->randomElement(['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00']);
        $waktuSelesai = date('H:i', strtotime($waktuMulai) + 2700);

        return [
            'kelas_id' => Kelas::factory(),
            'mapel_id' => Mapel::factory(),
            'guru_id' => Guru::factory(),
            'hari' => fake()->randomElement(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']),
            'waktu_mulai' => $waktuMulai,
            'waktu_selesai' => $waktuSelesai,
            'status' => 'aktif',
        ];
    }

    public function nonAktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'non_aktif',
        ]);
    }
}
