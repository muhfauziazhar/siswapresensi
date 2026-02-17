<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kelas>
 */
class KelasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => 'XI IPA '.fake()->unique()->numberBetween(1, 20),
            'tingkat' => '11',
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
