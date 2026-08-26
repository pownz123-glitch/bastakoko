<?php

use App\Models\Student;

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
