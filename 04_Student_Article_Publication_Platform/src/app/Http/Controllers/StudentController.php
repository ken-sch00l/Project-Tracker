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
        $articles = Article::whereHas('status', function ($q) {
            $q->where('name', 'published');
        })
        ->with(['writer','category','status'])
        ->latest()
        ->get();

        return Inertia::render('Student/Dashboard', [
            'articles' => $articles
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
            ->back()
            ->with('success', 'Comment posted successfully.');
    }
}