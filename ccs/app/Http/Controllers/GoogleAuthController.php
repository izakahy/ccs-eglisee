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
        $url = Socialite::driver('google')
        ->stateless()
        ->redirect();
        
        return $url;
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')
                    ->stateless()
                    ->user();

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
                    'password' => bcrypt(Str::random(16)), // Random password for the user
                ]
            );

            // Create token
            $token = $user->createToken('google-token')->plainTextToken;

             // Redirect to frontend with token and user data
            $frontendCallbackUrl = config('services.frontend.callback_url') . '?' . http_build_query([
                'token' => $token,
                'user' => json_encode($user->only(['id', 'name', 'email'])),
            ]);

            return redirect($frontendCallbackUrl);
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

    public function logout (Request $request) {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out.'
        ]);
    }

    private function isEmailAllowed($email) {
        $allowedEmail = array_map('trim', explode(',', env('ALLOWED_EMAILS', '')));

        return in_array(strtolower($email), array_map('strtolower', $allowedEmail));
    }
}
