<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Revision;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // create a few articles with relationships
        Article::factory()
            ->count(5)
            ->for(User::whereHas('roles', function ($q) { $q->where('name','writer'); })->first(), 'writer')
            ->for(User::whereHas('roles', function ($q) { $q->where('name','editor'); })->first(), 'editor')
            ->create()
            ->each(function ($article) {
                Revision::factory()->for($article)->create();
                Comment::factory()->for($article)->create();
            });
    }
}
