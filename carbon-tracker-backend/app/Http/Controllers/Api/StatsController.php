<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function averages()
    {
        $path = storage_path('app/primary_data_CO2.csv');

        if (!file_exists($path)) {
            return response()->json(['error' => 'Reference data not found'], 404);
        }

        $rows = array_map('str_getcsv', file($path));
        $header = array_map('trim', array_shift($rows));
        $data = array_map(fn($row) => array_combine($header, $row), $rows);

        $avg = fn($col) => count($data) > 0
            ? array_sum(array_column($data, $col)) / count($data)
            : 0;

        return response()->json([
            'avg_energy_kwh' => round($avg('Energy_Usage_kWh'), 3),
            'avg_transport_km' => round($avg('Transportation_Distance_km'), 3),
            'avg_plastic_kg' => round($avg('Plastic_Usage_kg'), 3),
        ]);
    }

    public function breakdown(Request $request)
    {
        $activities = $request->user()->activities;

        return response()->json([
            'electricity_co2' => round($activities->where('type', 'electricity')->sum('carbon_emitted'), 3),
            'transport_co2' => round($activities->where('type', 'transport')->sum('carbon_emitted'), 3),
            'plastic_co2' => round($activities->where('type', 'plastic')->sum('carbon_emitted'), 3),
        ]);
    }
}