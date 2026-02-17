<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mapel>
 */
class MapelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->unique()->randomElement([
                'Matematika', 'Fisika', 'Kimia', 'Biologi',
                'Bahasa Indonesia', 'Bahasa Inggris', 'Sejarah',
                'Geografi', 'Ekonomi', 'Sosiologi',
            ]),
            'kode' => fake()->unique()->lexify('???'),
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
