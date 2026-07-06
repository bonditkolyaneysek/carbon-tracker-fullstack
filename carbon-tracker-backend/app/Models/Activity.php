<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'electricity_bill_riel',
        'transport_mode',
        'transport_fuel',
        'transport_distance_km',
        'plastic_items',
        'carbon_emitted',
        'activity_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}