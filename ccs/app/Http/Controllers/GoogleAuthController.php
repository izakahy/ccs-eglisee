<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class GoogleAuthController extends Controller
{
    public function redirect() {
        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $email = $googleUser->getEmail();

            if (!$this->isEmailAllowed($email)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Access denied. Your email domain is not authorized.',
                ], 403);
            }

            // Check if user exists or create new
            $user = User::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(Str::random(16)),
                ]
            );

            // Create token
            $token = $user->createToken('google-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
                'message' => "Successfully logged in with Google!"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to login with Google',
                'error' => $e->getMessage(),
                'details' => config('app.debug') ? [
                    'code' => $request->get('code'),
                    'state' => $request->get('state'),
                    'error' => $request->get('error')
                ] : null
            ], 500);
        }
    }

    private function isEmailAllowed($email) {
        $allowedEmail = array_map('trim', explode(',', env('ALLOWED_EMAILS', '')));

        return in_array(strtolower($email), array_map('strtolower', $allowedEmail));
    }
}
