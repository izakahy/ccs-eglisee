<?php

use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); 

// Route::get('auth/google/redirect', function (Request $request) {
//     return Socialite::driver('google')->redirect();
// });
// Route::get('auth/google/callback', function (Request $request) {
//     dd($request->all());    
// });

Route::apiResource('posts', PostController::class);