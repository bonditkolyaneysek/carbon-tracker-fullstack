<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['electricity', 'transport', 'plastic']);

            // electricity
            $table->float('electricity_bill_riel')->nullable();

            // transport
            $table->string('transport_mode')->nullable();
            $table->string('transport_fuel')->nullable();
            $table->float('transport_distance_km')->nullable();

            // plastic
            $table->integer('plastic_items')->nullable();

            // computed by CarbonCalculator
            $table->float('carbon_emitted')->default(0);

            $table->date('activity_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('activities');
    }
};