<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Notifications\ArticleSubmittedNotification;

class WriterController extends Controller
{

    public function dashboard()
    {
        $writerId = Auth::id();

        $articles = Article::with(['status','category'])
            ->where('writer_id', $writerId)
            ->latest()
            ->get();

        $stats = [

            'total_articles' => Article::where('writer_id', $writerId)->count(),

            'drafts' => Article::where('writer_id', $writerId)
                ->whereHas('status', fn($q) => $q->where('name','draft'))
                ->count(),

            'submitted' => Article::where('writer_id', $writerId)
                ->whereHas('status', fn($q) => $q->where('name','submitted'))
                ->count(),

            'published' => Article::where('writer_id', $writerId)
                ->whereHas('status', fn($q) => $q->where('name','published'))
                ->count(),
        ];

        $popularArticles = Article::where('writer_id', $writerId)
            ->withCount('comments')
            ->orderByDesc('comments_count')
            ->limit(5)
            ->get();

        $month = DB::getDriverName() === 'sqlite'
            ? "strftime('%m', created_at)"
            : 'MONTH(created_at)';

        $activity = Article::where('writer_id', $writerId)
            ->selectRaw("{$month} as month, COUNT(*) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {

                $months = [
                    1 => 'Jan', 2 => 'Feb', 3 => 'Mar',
                    4 => 'Apr', 5 => 'May', 6 => 'Jun',
                    7 => 'Jul', 8 => 'Aug', 9 => 'Sep',
                    10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
                ];

                return [
                    'month' => $months[$item->month],
                    'total' => $item->total
                ];
            });

        return Inertia::render('Writer/Dashboard', [
            'articles' => $articles,
            'stats' => $stats,
            'popularArticles' => $popularArticles,
            'activity' => $activity
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Writer/CreateArticle', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Article::class);

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

        $article = Article::create($data);

        return redirect()->route('writer.dashboard');
    }

    public function submit(Article $article)
    {
        $this->authorize('submit', $article);

        $submitted = ArticleStatus::where('name','submitted')->first();

        if ($submitted) {
            $article->update([
                'status_id' => $submitted->id
            ]);
        }

        // notify editors
        $editors = User::role('editor')->get();

        foreach ($editors as $editor) {
            $editor->notify(new ArticleSubmittedNotification($article));
        }

        return redirect()->route('writer.dashboard');
    }

    public function revise(Request $request, Article $article)
    {
        $this->authorize('revise', $article);

        $data = $request->validate([
            'content' => 'required|string'
        ]);

        $article->update([
            'content' => $data['content']
        ]);

        return redirect()->route('writer.dashboard');
    }

    public function analytics()
    {
        $writerId = Auth::id();

        // Get all published articles with engagement metrics
        $publishedArticles = Article::where('writer_id', $writerId)
            ->whereHas('status', fn($q) => $q->where('name', 'published'))
            ->with(['category'])
            ->withCount('comments')
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'views' => $article->views_count,
                    'comments' => $article->comments_count,
                    'engagement' => ($article->views_count + $article->comments_count),
                    'created_at' => $article->created_at->format('M d, Y'),
                ];
            })
            ->sortByDesc('engagement')
            ->values();

        // Overall stats
        $stats = [
            'total_views' => Article::where('writer_id', $writerId)->sum('views_count'),
            'total_comments' => Article::where('writer_id', $writerId)->withCount('comments')->get()->sum('comments_count'),
            'total_articles' => Article::where('writer_id', $writerId)->whereHas('status', fn($q) => $q->where('name', 'published'))->count(),
        ];

        return Inertia::render('Writer/Analytics', [
            'publishedArticles' => $publishedArticles,
            'stats' => $stats
        ]);
    }
}
