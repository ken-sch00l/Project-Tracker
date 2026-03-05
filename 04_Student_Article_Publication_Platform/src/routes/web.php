<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WriterController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Article;

Route::aliasMiddleware('role', \Spatie\Permission\Middleware\RoleMiddleware::class);

/*
|--------------------------------------------------------------------------
| Public Landing Page
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


/*
|--------------------------------------------------------------------------
| Writer Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:writer'])
    ->prefix('writer')
    ->name('writer.')
    ->group(function () {

        /* Dashboard */
        Route::get('/dashboard', [WriterController::class, 'dashboard'])
            ->name('dashboard');

        /* Create Article Page */
        Route::get('/articles/create', [WriterController::class, 'create'])
            ->name('articles.create');

        /* Store Article */
        Route::post('/articles', [WriterController::class, 'store'])
            ->name('articles.store');

        /* Submit Draft */
        Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])
            ->name('articles.submit');

        /* Revise Article */
        Route::post('/articles/{article}/revise', [WriterController::class, 'revise'])
            ->name('articles.revise');

});


/*
|--------------------------------------------------------------------------
| Editor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:editor'])
    ->prefix('editor')
    ->name('editor.')
    ->group(function () {

        /* Editor Dashboard */
        Route::get('/dashboard', [EditorController::class, 'dashboard'])
            ->name('dashboard');

        /* Review Article */
        Route::get('/articles/{article}/review', function (Article $article) {

            return Inertia::render('Editor/Review', [
                'article' => $article->load([
                    'writer',
                    'category',
                    'status',
                    'revisions'
                ])
            ]);

        })->name('articles.review');

        /* Request Revision */
        Route::post('/articles/{article}/revision', [EditorController::class, 'requestRevision'])
            ->name('articles.requestRevision');

        /* Publish Article */
        Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])
            ->name('articles.publish');

});


/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {

        /* Student Dashboard */
        Route::get('/dashboard', [StudentController::class, 'dashboard'])
            ->name('dashboard');

        /* Comment on Article */
        Route::post('/articles/{article}/comment', [StudentController::class, 'comment'])
            ->name('articles.comment');

});


/*
|--------------------------------------------------------------------------
| Article Pages (Shared)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /* View Article */
    Route::get('/articles/{article}', function (Article $article) {

        return Inertia::render('Article/Show', [
            'article' => $article->load([
                'writer',
                'category',
                'status',
                'comments.student'
            ])
        ]);

    })->name('articles.show');


    /* Edit Article */
    Route::get('/articles/{article}/edit', function (Article $article) {

        return Inertia::render('Article/Edit', [
            'article' => $article->load([
                'writer',
                'category',
                'status'
            ])
        ]);

    })->middleware('role:writer')->name('articles.edit');

});


/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

});


require __DIR__.'/auth.php';