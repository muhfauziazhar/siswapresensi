<?php

namespace Database\Factories;

use App\Models\Jadwal;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Izin>
 */
class IzinFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tanggalMulai = now()->toDateString();

        return [
            'siswa_id' => Siswa::factory(),
            'jadwal_id' => Jadwal::factory(),
            'jenis' => fake()->randomElement(['izin', 'sakit']),
            'alasan' => fake()->sentence(),
            'tanggal_mulai' => $tanggalMulai,
            'tanggal_selesai' => $tanggalMulai,
            'bukti_path' => null,
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'catatan' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'reviewed_at' => now(),
            'catatan' => fake()->sentence(),
        ]);
    }

    public function sakit(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis' => 'sakit',
        ]);
    }
}
