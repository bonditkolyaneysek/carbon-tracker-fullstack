<?php

namespace App\Services;

class RecommendationEngine
{
    public function getRecommendations(float $electricityCo2, float $transportCo2, float $plasticCo2): array
    {
        $total = $electricityCo2 + $transportCo2 + $plasticCo2;

        if ($total == 0) {
            return [
                "Outstanding! You had a truly low-impact day with no recorded electricity, transport, or plastic use.",
            ];
        }

        $contributions = [
            'Electricity' => $electricityCo2,
            'Transportation' => $transportCo2,
            'Plastic' => $plasticCo2,
        ];

        $largest = array_search(max($contributions), $contributions);

        return match ($largest) {
            'Electricity' => [
                "Set your air-conditioner to 25°C or use inverter mode.",
                "Unplug chargers and devices when not in use.",
                "Switch high-use lighting to LED.",
            ],
            'Transportation' => [
                "Combine errands or carpool with colleagues.",
                "Walk or cycle for short distances.",
                "Choose electric vehicle options on ride-hailing apps.",
            ],
            'Plastic' => [
                "Carry a reusable canvas tote for shopping.",
                "Use a reusable stainless-steel water bottle.",
                "Decline plastic cutlery and straws at takeout meals.",
            ],
        };
    }

    public function getFootprintLevel(float $totalCo2): string
    {
        if ($totalCo2 < 3.0) return 'Low Footprint';
        if ($totalCo2 < 12.0) return 'Moderate Footprint';
        return 'High Footprint';
    }
}