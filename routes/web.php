<?php

use App\Models\Student;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'auth/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('students', 'students')->name('students.page');
    Route::get('/api/students', function () {
        return response()->json(Student::all());
    })->name('students.index');
    
    Route::post('/api/students', function () {
        $validated = request()->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'program' => 'required|string',
            'gender' => 'required|string',
            'birthday' => 'required|date',
            'address' => 'required|string',
            'number' => 'required|string',
            'yr_level' => 'required|string',
        ]);
        
        $student = Student::create($validated);
        return response()->json($student, 201);
    })->name('students.store');
    
    Route::delete('/api/students/{id}', function (Student $id) {
        $id->delete();
        return response()->json(['message' => 'Student deleted'], 200);
    })->name('students.destroy');
});

require __DIR__.'/settings.php';
