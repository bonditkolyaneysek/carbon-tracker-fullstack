<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $topUsers = User::select('id', 'name', 'eco_score')
            ->orderByDesc('eco_score')
            ->take(20)
            ->get();

        // Also return the logged-in user's own rank, even if outside top 20
        $currentUserRank = User::where('eco_score', '>', $request->user()->eco_score)->count() + 1;

        return response()->json([
            'leaderboard' => $topUsers,
            'your_rank' => $currentUserRank,
            'your_score' => $request->user()->eco_score,
        ]);
    }
}