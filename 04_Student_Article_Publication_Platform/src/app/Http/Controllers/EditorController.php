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
    public function dashboard()
    {
        $pending = Article::whereHas('status', function ($q) {
            $q->where('name', 'submitted');
        })->with('writer', 'category')->get();

        $published = Article::whereHas('status', function ($q) {
            $q->where('name', 'published');
        })->get();

        $categories = \App\Models\Category::orderBy('name')->get();
        return Inertia::render('Editor/Dashboard', compact('pending','published','categories'));
    }

    public function review(Article $article)
    {
        $this->authorize('view', $article);
        return Inertia::render('Editor/Review', compact('article'));
    }

    public function requestRevision(Request $request, Article $article)
    {
        $this->authorize('requestRevision', $article);
        $data = $request->validate(['comments' => 'required|string']);

        $revision = Revision::create([
            'article_id' => $article->id,
            'editor_id' => Auth::id(),
            'comments' => $data['comments'],
        ]);

        $status = ArticleStatus::firstOrCreate(['name' => 'needs_revision'], ['label' => 'Needs Revision']);
        $article->update(['status_id' => $status->id]);

        // notify writer
        $article->writer->notify(new \App\Notifications\RevisionRequestedNotification($revision));

        return redirect()->back()->with('success','Revision requested');
    }

    public function publish(Article $article)
    {
        $this->authorize('publish', $article);
        $published = ArticleStatus::firstOrCreate(['name' => 'published'], ['label' => 'Published']);
        $article->update(['status_id' => $published->id, 'editor_id' => Auth::id()]);

        // notify writer
        $article->writer->notify(new \App\Notifications\ArticlePublishedNotification($article));

        return redirect()->back()->with('success','Article published');
    }
}
