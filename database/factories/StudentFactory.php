<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

        'first_name' => fake()->name(),
        'last_name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'program' => fake()->randomElement([
            'BSIS',
            'BSCS',
            'BSIT'
        ]),

        'gender' => fake()->randomElement([
            'male',
            'female'
        ]),

        'birthday' => fake()
        ->dataTimeBetwwen('-25 years', '-17 years')
        ->format('Y-m-d'),
      'yr_level'=> fake()->numberBetween(1,4)
        ];
    }
}
