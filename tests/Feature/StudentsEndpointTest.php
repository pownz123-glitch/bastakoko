<?php

use App\Models\Student;
use App\Models\User;

test('students endpoint returns raw student records', function () {
    $student = Student::factory()->create([
        'first_name' => 'Test',
        'last_name' => 'Student',
    ]);

    $this->getJson('/students')
        ->assertOk()
        ->assertJsonPath('0.id', $student->id)
        ->assertJsonPath('0.first_name', 'Test')
        ->assertJsonPath('0.last_name', 'Student');
});

test('an authenticated user can update a student', function () {
    $student = Student::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/students/{$student->id}", [
            'first_name' => 'Updated',
            'last_name' => $student->last_name,
            'email' => $student->email,
            'program' => $student->program,
            'gender' => $student->gender,
            'birthday' => $student->birthday,
            'address' => 'Updated address',
            'number' => $student->number,
            'yr_level' => (string) $student->yr_level,
        ])
        ->assertOk()
        ->assertJsonPath('first_name', 'Updated')
        ->assertJsonPath('address', 'Updated address');

    expect($student->fresh()->first_name)->toBe('Updated');
    expect($student->fresh()->address)->toBe('Updated address');
});
