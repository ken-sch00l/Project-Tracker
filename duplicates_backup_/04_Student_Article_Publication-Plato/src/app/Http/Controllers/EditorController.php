<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Revision;
use Illuminate\Http\Request;
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

        return Inertia::render('Editor/Dashboard', compact('pending','published'));
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

        Revision::create([
            'article_id' => $article->id,
            'editor_id' => auth()->id(),
            'comments' => $data['comments'],
        ]);

        $status = ArticleStatus::where('name','needs_revision')->first();
        $article->update(['status_id' => $status->id]);

        return redirect()->back()->with('success','Revision requested');
    }

    public function publish(Article $article)
    {
        $this->authorize('publish', $article);
        $published = ArticleStatus::where('name','published')->first();
        $article->update(['status_id' => $published->id, 'editor_id' => auth()->id()]);

        return redirect()->back()->with('success','Article published');
    }
}
