<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WriterController extends Controller
{
    /*
    |----------------------------------------------------------------------
    | Writer Dashboard
    |----------------------------------------------------------------------
    */

    public function dashboard()
    {
        $articles = Article::with(['status','category'])
            ->where('writer_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Writer/Dashboard', [
            'articles' => $articles
        ]);
    }

    /*
    |----------------------------------------------------------------------
    | Create Article Page
    |----------------------------------------------------------------------
    */

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Writer/CreateArticle', [
            'categories' => $categories
        ]);
    }

    /*
    |----------------------------------------------------------------------
    | Save Draft / Submit
    |----------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $data['writer_id'] = Auth::id();

        $draftStatus = ArticleStatus::firstOrCreate(
            ['name' => 'draft'],
            ['label' => 'Draft']
        );

        $submittedStatus = ArticleStatus::firstOrCreate(
            ['name' => 'submitted'],
            ['label' => 'Submitted']
        );

        $data['status_id'] = $request->boolean('submit')
            ? $submittedStatus->id
            : $draftStatus->id;

        Article::create($data);

        return redirect()->route('writer.dashboard');
    }

    /*
    |----------------------------------------------------------------------
    | Submit Draft
    |----------------------------------------------------------------------
    */

    public function submit(Article $article)
    {
        $submitted = ArticleStatus::where('name', 'submitted')->first();

        if ($submitted) {
            $article->update([
                'status_id' => $submitted->id
            ]);
        }

        return redirect()->route('writer.dashboard');
    }

    /*
    |----------------------------------------------------------------------
    | Revise Article
    |----------------------------------------------------------------------
    */

    public function revise(Request $request, Article $article)
    {
        $data = $request->validate([
            'content' => 'required|string'
        ]);

        $article->update([
            'content' => $data['content']
        ]);

        return redirect()->route('writer.dashboard');
    }
}