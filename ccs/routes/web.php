<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return view('welcome');
});

Route::get('auth/google/redirect', function (Request $request) {
    return Socialite::driver('google')->redirect();
});
Route::get('auth/google/callback', function (Request $request) {
    dd(Socialite::driver("google")->user());    
});
