<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Spatie role middleware alias
Route::aliasMiddleware('role', \Spatie\Permission\Middleware\RoleMiddleware::class);

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ✅ Unified Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Action Routes (Role Protected)
|--------------------------------------------------------------------------
*/

// Writer Actions
Route::middleware(['auth','role:writer'])->prefix('writer')->name('writer.')->group(function () {
    Route::post('/articles', [\App\Http\Controllers\WriterController::class, 'store'])->name('articles.store');
    Route::post('/articles/{article}/submit', [\App\Http\Controllers\WriterController::class, 'submit'])->name('articles.submit');
    Route::post('/articles/{article}/revise', [\App\Http\Controllers\WriterController::class, 'revise'])->name('articles.revise');
});

// Editor Actions
Route::middleware(['auth','role:editor'])->prefix('editor')->name('editor.')->group(function () {
    Route::get('/articles/{article}/review', [\App\Http\Controllers\EditorController::class, 'review'])->name('articles.review');
    Route::post('/articles/{article}/revision', [\App\Http\Controllers\EditorController::class, 'requestRevision'])->name('articles.requestRevision');
    Route::post('/articles/{article}/publish', [\App\Http\Controllers\EditorController::class, 'publish'])->name('articles.publish');
});

// Student Actions
Route::middleware(['auth','role:student'])->prefix('student')->name('student.')->group(function () {
    Route::post('/articles/{article}/comment', [\App\Http\Controllers\StudentController::class, 'comment'])->name('articles.comment');
});

require __DIR__.'/auth.php';
require __DIR__.'/sample.php';