<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WriterController extends Controller
{
    public function dashboard()
    {
        $articles = Article::where('writer_id', auth()->id())->with('status', 'category')->get();
        $categories = \App\Models\Category::orderBy('name')->get();
        return Inertia::render('Writer/Dashboard', compact('articles', 'categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $data['writer_id'] = Auth::id();

        // determine status: draft by default, but if request asks to submit, mark submitted
        $draftStatus = ArticleStatus::firstOrCreate(['name' => 'draft'], ['label' => 'Draft']);
        $submittedStatus = ArticleStatus::firstOrCreate(['name' => 'submitted'], ['label' => 'Submitted']);

        if ($request->boolean('submit')) {
            $data['status_id'] = $submittedStatus->id;
        } else {
            $data['status_id'] = $draftStatus->id;
        }

        $article = Article::create($data);

        // notify editors only when article is submitted
        if ($data['status_id'] === $submittedStatus->id) {
            $editors = \App\Models\User::role('editor')->get();
            foreach ($editors as $editor) {
                $editor->notify(new \App\Notifications\ArticleSubmittedNotification($article));
            }
            return redirect()->route('writer.dashboard')->with('success', 'Article submitted');
        }

        return redirect()->route('writer.dashboard')->with('success', 'Draft created');
    }

    public function submit(Article $article)
    {
        $this->authorize('submit', $article);
        $submitted = ArticleStatus::where('name','submitted')->first();
        $article->update(['status_id' => $submitted->id]);
        // notify editors maybe

        return redirect()->back()->with('success', 'Article submitted');
    }

    public function revise(Request $request, Article $article)
    {
        $this->authorize('requestRevision', $article);
        $data = $request->validate(['content' => 'required']);
        $article->update($data);
        // status back to draft?
        return redirect()->route('writer.dashboard')->with('success','Article revised');
    }
}
