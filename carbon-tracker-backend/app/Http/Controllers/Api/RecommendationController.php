<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationEngine;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index(Request $request, RecommendationEngine $engine)
    {
        $activities = $request->user()->activities;

        $electricityCo2 = $activities->where('type', 'electricity')->sum('carbon_emitted');
        $transportCo2   = $activities->where('type', 'transport')->sum('carbon_emitted');
        $plasticCo2     = $activities->where('type', 'plastic')->sum('carbon_emitted');

        $tips = $engine->getRecommendations($electricityCo2, $transportCo2, $plasticCo2);
        $level = $engine->getFootprintLevel($electricityCo2 + $transportCo2 + $plasticCo2);

        return response()->json([
            'electricity_co2' => round($electricityCo2, 3),
            'transport_co2' => round($transportCo2, 3),
            'plastic_co2' => round($plasticCo2, 3),
            'total_co2' => round($electricityCo2 + $transportCo2 + $plasticCo2, 3),
            'footprint_level' => $level,
            'recommendations' => $tips,
        ]);
    }
}