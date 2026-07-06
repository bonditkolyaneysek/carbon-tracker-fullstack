<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\User;

class BadgeChecker
{
    public function checkAndAward(User $user): array
    {
        $newBadges = [];

        // Badge 1: Eco score milestones
        $scoreMilestones = [100 => 'Eco Rookie', 500 => 'Eco Warrior', 1000 => 'Eco Champion'];
        foreach ($scoreMilestones as $threshold => $name) {
            if ($user->eco_score >= $threshold && !$user->badges()->where('badge_name', $name)->exists()) {
                $badge = $user->badges()->create([
                    'badge_name' => $name,
                    'description' => "Reached {$threshold} eco points",
                    'earned_at' => now(),
                ]);
                $newBadges[] = $badge;
            }
        }

        // Badge 2: Logging streak — logged an activity on 3 consecutive distinct days
        $recentDates = $user->activities()
            ->selectRaw('DISTINCT activity_date')
            ->orderByDesc('activity_date')
            ->take(3)
            ->pluck('activity_date');

        if ($recentDates->count() === 3) {
            $sorted = $recentDates->sort()->values();
            $isConsecutive = \Carbon\Carbon::parse($sorted[0])->diffInDays($sorted[1]) == 1
                           && \Carbon\Carbon::parse($sorted[1])->diffInDays($sorted[2]) == 1;

            if ($isConsecutive && !$user->badges()->where('badge_name', '3-Day Streak')->exists()) {
                $badge = $user->badges()->create([
                    'badge_name' => '3-Day Streak',
                    'description' => 'Logged activities 3 days in a row',
                    'earned_at' => now(),
                ]);
                $newBadges[] = $badge;
            }
        }

        return $newBadges;
    }
}