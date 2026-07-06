<?php

namespace App\Services;

class CarbonCalculator
{
    // ── Constants copied exactly from the original Streamlit app ──
    const PLASTIC_KG_PER_ITEM = 0.141;
    const MOTORCYCLE_PETROL_CO2 = 0.11367; // kg CO2 per km
    const EDC_RATE = 610.0;                // Riel per kWh
    const GRID_EMISSION_FACTOR = 0.18708;  // kg CO2 per kWh
    const PLASTIC_LIFECYCLE_CO2 = 6.0;     // kg CO2 per kg of plastic
    const BASELINE_CO2_PER_DAY = 0.50;     // kg CO2, zero-input baseline

    protected array $transportFactors = [
        'Walking' => ['None' => 0.0],
        'Bicycle' => ['None' => 0.0],
        'Motorcycle/Scooter' => [
            'Petrol (Gasoline)' => self::MOTORCYCLE_PETROL_CO2,
            'Electric' => 0.020,
        ],
        'Tuk Tuk, Grab, PassApp' => [
            'Petrol (Gasoline)' => self::MOTORCYCLE_PETROL_CO2,
            'Electric' => 0.077,
        ],
        'Car' => [
            'Petrol (Gasoline)' => 0.308,
            'Electric' => 0.077,
            'Hybrid' => 0.176,
        ],
        'Bus' => [
            'Petrol (Gasoline)' => 0.089,
            'Electric' => 0.040,
            'Hybrid' => 0.060,
        ],
    ];

    public function electricityCo2(float $billRiel): array
    {
        $monthlyKwh = $billRiel / self::EDC_RATE;
        $dailyKwh   = $monthlyKwh / 30.0;
        $co2        = $dailyKwh * self::GRID_EMISSION_FACTOR;

        return [
            'monthlyKwh' => $monthlyKwh,
            'dailyKwh' => $dailyKwh,
            'co2' => $co2,
        ];
    }

    public function transportCo2(string $mode, string $fuel, float $distanceKm): array
    {
        $factor = $this->transportFactors[$mode][$fuel] ?? self::MOTORCYCLE_PETROL_CO2;

        return [
            'factor' => $factor,
            'co2' => $distanceKm * $factor,
        ];
    }

    public function plasticCo2(int $items): array
    {
        $mass = $items * self::PLASTIC_KG_PER_ITEM;

        return [
            'mass' => $mass,
            'co2' => $mass * self::PLASTIC_LIFECYCLE_CO2,
        ];
    }

    public function isAllZero(float $billRiel, float $distanceKm, int $plasticItems): bool
    {
        return $billRiel == 0 && $distanceKm == 0 && $plasticItems == 0;
    }
}