<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    public function comment(User $user, Article $article)
    {
        return $user->hasRole('student') && $article->isPublished();
    }

    public function moderate(User $user, Comment $comment)
    {
        return $user->hasRole('editor');
    }
}
