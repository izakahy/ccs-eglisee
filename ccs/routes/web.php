<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;


Route::get('/', function () {
    return view('welcome');
});

// Route::get('auth/google/redirect', function (Request $request) {
//     return Socialite::driver('google')->redirect();
// });
// Route::get('auth/google/callback', function (Request $request) {
//     $googleUser = Socialite::driver("google")->user();
    
//     $user = User::updateOrCreate(
//         ['google_id' => $googleUser->id],
//         [
//             'name' => $googleUser->name,
//             'email' => $googleUser->email,
//             'password' => Str::password(12)
//         ]
//     );

//     Auth::login($user);

//     return redirect(config("app.frontend_url") . "/dashbord");
// });
