<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Services\CarbonCalculator;
use App\Services\BadgeChecker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->activities()->latest()->get();
    }

    public function store(Request $request, CarbonCalculator $calc)
    {
        $data = $request->validate([
            'type' => 'required|in:electricity,transport,plastic',
            'electricity_bill_riel' => 'nullable|numeric',
            'transport_mode' => 'nullable|string',
            'transport_fuel' => 'nullable|string',
            'transport_distance_km' => 'nullable|numeric',
            'plastic_items' => 'nullable|integer',
            'activity_date' => 'required|date',
        ]);

        $co2 = match ($data['type']) {
            'electricity' => $calc->electricityCo2($data['electricity_bill_riel'] ?? 0)['co2'],
            'transport'   => $calc->transportCo2(
                                $data['transport_mode'] ?? 'Walking',
                                $data['transport_fuel'] ?? 'None',
                                $data['transport_distance_km'] ?? 0
                              )['co2'],
            'plastic'     => $calc->plasticCo2($data['plastic_items'] ?? 0)['co2'],
        };

        $data['carbon_emitted'] = $co2;

        $activity = $request->user()->activities()->create($data);

        // Award eco points: fewer emissions = more points, floor at 0
        $pointsEarned = max(0, (int) round(50 - ($co2 * 5)));
        $request->user()->increment('eco_score', $pointsEarned);

        // Check for any new badges earned
        $newBadges = app(BadgeChecker::class)->checkAndAward($request->user());

        return response()->json([
            'activity' => $activity,
            'points_earned' => $pointsEarned,
            'new_badges' => $newBadges,
        ], 201);
    }

    public function destroy(Request $request, Activity $activity)
    {
        abort_if($activity->user_id !== $request->user()->id, 403, 'Not your activity.');

        $activity->delete();

        return response()->json(['message' => 'Activity deleted']);
    }

    public function predictToday(Request $request, CarbonCalculator $calc)
    {
        $today = $request->user()->activities()->whereDate('activity_date', now())->get();

        // Convert today's electricity bills back into daily kWh using the calculator
        $dailyKwh = $today->where('type', 'electricity')->sum(function ($a) use ($calc) {
            return $calc->electricityCo2($a->electricity_bill_riel)['dailyKwh'];
        });

        $distanceKm = $today->where('type', 'transport')->sum('transport_distance_km');

        $plasticKg = $today->where('type', 'plastic')->sum(function ($a) {
            return $a->plastic_items * CarbonCalculator::PLASTIC_KG_PER_ITEM;
        });

        // If there's genuinely no activity today, skip calling the ML service
        if ($dailyKwh == 0 && $distanceKm == 0 && $plasticKg == 0) {
            return response()->json([
                'prediction' => CarbonCalculator::BASELINE_CO2_PER_DAY,
                'source' => 'baseline',
            ]);
        }

        try {
            $response = Http::timeout(5)->post('https://carbon-tracker-ml-service-production.up.railway.app/predict', [
                'energy_usage_kwh_day' => $dailyKwh,
                'transportation_distance_km' => $distanceKm,
                'plastic_usage_kg' => $plasticKg,
            ]);

            $result = $response->json();

            if (!$result || $result['prediction'] === null) {
                // ML service reachable but failed internally — use direct sum fallback
                $result = [
                    'prediction' => round($today->sum('carbon_emitted'), 4),
                    'source' => 'fallback',
                ];
            }
        } catch (\Exception $e) {
            // ML service unreachable entirely — same fallback
            $result = [
                'prediction' => round($today->sum('carbon_emitted'), 4),
                'source' => 'fallback',
            ];
        }

        return response()->json($result);
    }

    public function destroyAll(Request $request)
    {
        $count = $request->user()->activities()->count();
        $request->user()->activities()->delete();

        return response()->json(['message' => "Deleted {$count} activities."]);
    }
}