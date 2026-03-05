<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Revision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EditorController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Editor Dashboard
    |--------------------------------------------------------------------------
    */

    public function dashboard()
    {

        $pending = Article::whereHas('status', function ($q) {
            $q->where('name', 'submitted');
        })
        ->with(['writer','category','status'])
        ->latest()
        ->get();

        $needsRevision = Article::whereHas('status', function ($q) {
            $q->where('name', 'needs_revision');
        })
        ->with(['writer','category','status'])
        ->latest()
        ->get();


        /*
        |------------------------------------------------------------------
        | Statistics
        |------------------------------------------------------------------
        */

        $stats = [

            'pending_reviews' => Article::whereHas('status', function ($q) {
                $q->where('name','submitted');
            })->count(),

            'needs_revision' => Article::whereHas('status', function ($q) {
                $q->where('name','needs_revision');
            })->count(),

            'published_articles' => Article::whereHas('status', function ($q) {
                $q->where('name','published');
            })->count(),

            'articles_reviewed' => Article::where('editor_id', Auth::id())->count(),

        ];


        return Inertia::render('Editor/Dashboard', [
            'pending' => $pending,
            'needsRevision' => $needsRevision,
            'stats' => $stats
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Review Page
    |--------------------------------------------------------------------------
    */

    public function review(Article $article)
    {
        return Inertia::render('Editor/Review', [
            'article' => $article->load(['writer','category','status','revisions'])
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Request Revision
    |--------------------------------------------------------------------------
    */

    public function requestRevision(Request $request, Article $article)
    {
        $data = $request->validate([
            'comments' => 'required|string'
        ]);

        $revision = Revision::create([
            'article_id' => $article->id,
            'editor_id' => Auth::id(),
            'comments' => $data['comments']
        ]);

        $status = ArticleStatus::firstOrCreate(
            ['name' => 'needs_revision'],
            ['label' => 'Needs Revision']
        );

        $article->update([
            'status_id' => $status->id
        ]);

        if ($article->writer) {
            $article->writer->notify(
                new \App\Notifications\RevisionRequestedNotification($revision)
            );
        }

        return redirect()
            ->route('editor.dashboard')
            ->with('success', 'Revision requested.');
    }


    /*
    |--------------------------------------------------------------------------
    | Publish Article
    |--------------------------------------------------------------------------
    */

    public function publish(Article $article)
    {
        $published = ArticleStatus::firstOrCreate(
            ['name' => 'published'],
            ['label' => 'Published']
        );

        $article->update([
            'status_id' => $published->id,
            'editor_id' => Auth::id()
        ]);

        if ($article->writer) {
            $article->writer->notify(
                new \App\Notifications\ArticlePublishedNotification($article)
            );
        }

        return redirect()
            ->route('editor.dashboard')
            ->with('success', 'Article published.');
    }
}