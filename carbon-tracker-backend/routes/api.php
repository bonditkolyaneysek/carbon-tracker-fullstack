<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::delete('/activities/all', [ActivityController::class, 'destroyAll']);
    Route::apiResource('activities', ActivityController::class)->only(['index', 'store', 'destroy']);

    Route::get('/recommendations', [RecommendationController::class, 'index']);
    Route::get('/predict-today', [ActivityController::class, 'predictToday']);
    Route::get('/leaderboard', [LeaderboardController::class, 'index']);
    Route::get('/badges', function (Request $request) {
        return $request->user()->badges;
    });
    Route::get('/stats/averages', [StatsController::class, 'averages']);
    Route::get('/stats/breakdown', [StatsController::class, 'breakdown']);
    Route::post('/chatbot', [ChatbotController::class, 'chat']);
});