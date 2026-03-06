<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Student Dashboard
    |--------------------------------------------------------------------------
    */

    public function dashboard()
    {

        $search = request('search');

        $articles = Article::whereHas('status', function ($q) {
            $q->where('name', 'published');
        })
        ->when($search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%");
        })
        ->with(['writer','category','status'])
        ->latest()
        ->take(9) // LIMIT number of article cards shown
        ->get();


        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $stats = [

            'articles_available' => Article::whereHas('status', function ($q) {
                $q->where('name','published');
            })->count(),

            'comments_posted' => Comment::where('student_id', Auth::id())->count(),

            'total_comments' => Comment::count(),

        ];


        /*
        |--------------------------------------------------------------------------
        | Popular Articles
        |--------------------------------------------------------------------------
        */

        $popularArticles = Article::whereHas('status', function ($q) {
            $q->where('name','published');
        })
        ->with(['writer'])
        ->withCount('comments')
        ->orderByDesc('comments_count')
        ->take(5) // LIMIT trending articles
        ->get();


        return Inertia::render('Student/Dashboard', [
            'articles' => $articles,
            'stats' => $stats,
            'popularArticles' => $popularArticles,
            'search' => $search
        ]);
    }



    /*
    |--------------------------------------------------------------------------
    | Comment on Article
    |--------------------------------------------------------------------------
    */

    public function comment(Request $request, Article $article)
    {

        $data = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = Comment::create([
            'article_id' => $article->id,
            'student_id' => Auth::id(),
            'content' => $data['content']
        ]);

        if ($article->writer) {
            $article->writer->notify(
                new \App\Notifications\CommentPostedNotification($comment)
            );
        }

        return redirect()
            ->route('student.dashboard')
            ->with('success', 'Comment posted successfully.');
    }
}