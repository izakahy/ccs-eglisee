<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;


Route::get('/', function () {
    return view('welcome');
});


Route::prefix('auth/google')->group(function() {
    Route::get('redirect', [GoogleAuthController::class, 'redirect']);
    Route::get('callback', [GoogleAuthController::class, 'callback']);
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
})->middleware('web');
