<?php

use App\Models\Student;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'auth/login')->name('home');

Route::get('/students', function () {
    return response()->json(Student::all());
})->name('students.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
