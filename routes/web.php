<?php

use Illuminate\Support\Facades\Route;
use app\Http\Controllers\StudentController;
use Inertia\Inertia;

Route::inertia('/', 'auth/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route ::apiResource('students',  StudentController::class);

Route ::middlewer(['auth'])->group(function(){
    Route::get('dashboard', function() {
         return Inertia ::render('dashboard');

    })->name('dashboard');
   
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
