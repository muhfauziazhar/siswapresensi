<?php

namespace Database\Factories;

use App\Models\Jadwal;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Presensi>
 */
class PresensiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'siswa_id' => Siswa::factory(),
            'jadwal_id' => Jadwal::factory(),
            'status' => 'hadir',
            'tanggal' => now()->toDateString(),
            'qr_type' => 'jadwal',
            'marked_by' => null,
            'marked_at' => now(),
        ];
    }

    public function alpha(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'alpha',
        ]);
    }

    public function izin(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'izin',
        ]);
    }

    public function sakit(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sakit',
        ]);
    }

    public function viaGeneralQr(): static
    {
        return $this->state(fn (array $attributes) => [
            'qr_type' => 'general',
        ]);
    }
}
