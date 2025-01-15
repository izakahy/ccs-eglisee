<?php

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); 

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/google/logout', [GoogleAuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function(Request $request) {
        return $request->user();
    });
    Route::apiResource('posts', PostController::class);
});
