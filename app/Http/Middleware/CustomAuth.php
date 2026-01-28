<?php

namespace App\Http\Middleware;

use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Session\Session;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\DB;

// Custom Controllers
use App\Http\Controllers\SessionSharing;
use App\Http\Controllers\Auth\JsonWebTokenController;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\ExpiredException;

class CustomAuth extends Middleware
{
    /**
     * Attempt to authenticate a user using the given credentials.
     *
     * @param  array  $credentials
     * @return bool
     */

    //  protected $guard;

    public function __construct()
    {
        //$this->guard = $guard;
    }

    public function handle($request, $next, ...$guards){
        $path = $request->path();
        $trimmedPath = trim($path, '/');
\Log::info("Path: " . $path);
        $jwt_token = $request->cookie('jwt_token') ?? "";
        $auth_routes = ['loginComp', 'login', 'loginapi', 'forgot-password', 'auth/azure', 'auth/azure/callback', 'microsoftToken', 'logoutWithoutRequest', 'exchange-token'];
\Log::info("JWT TOKEN: " . $jwt_token);
        // 1. LOGIC: Determine Auth Status ( JWT first, then Session )
        $is_valid_JWT = ($jwt_token == "" || $jwt_token == 'undefined' || $jwt_token == 'null' || $jwt_token == null)
        ? false
        : JsonWebTokenController::is_jwt_valid($jwt_token);
\Log::info("IS VALID JWT TOKEN: " . $jwt_token);
        $payload = [
            'token' => null,
            'user' => null,
            'userId' => null,
        ];
        // 1.a. Populate payload
        if($is_valid_JWT) {
            // If JWT is valid, decode it and save to payload
            $decoded_data = JsonWebTokenController::decode_jwt_valid($jwt_token);
            \Log::info("DECODED JWT TOKEN: " . JsonWebTokenController::is_jwt_valid($jwt_token));
            $payload['user'] = $decoded_data->user;
            $payload['token'] = $decoded_data->Token;
            $payload['userId'] = $decoded_data->userId;
        }else{
            // If JWT is not valid, check Session
            $session_user = $request->hasSession() ? $request->session()->get('user') : null;
            $session_token = $request->hasSession() ? $request->session()->get('token') : null;

            $userDecoded = is_string($session_user) ? json_decode($session_user, true) : (array)$session_user;
            $session_userId = data_get($userDecoded, 'UserId') ?? data_get($userDecoded, '0.UserId');

            // Save to payload
            if($session_user && $session_token){
                $payload['user'] = $session_user;
                $payload['token'] = $session_token;
                $payload['userId'] = $session_userId;

                // Save a new JWT token
                $new_jwt = JsonWebTokenController::encode_jwt([
                    'user' => $session_user,
                    'Token' => $session_token,
                    'userId' => $session_userId
                ]);
                \Log::info("NEW JWT TOKEN: " . $new_jwt);
                \Cookie::queue('jwt_token', $new_jwt, 60 * 24 * 30);
            }
        }

        // 1.b. Validate Authentication
        $is_authenticated = true;
        $is_authenticated = $payload['userId'] != null && $payload['token'] != null ? SessionSharing::validate_access_token($payload['token'], $payload['userId']) : false;
        $is_accessing_auth_route = in_array($trimmedPath, $auth_routes);

        // 2. LOGIC: If Authenticated and trying to access Auth pages -> Redirect to Main Page
        if ($is_authenticated && $is_accessing_auth_route && $trimmedPath  != 'gtrs/main') {
            return redirect(config('app.redirect_route') ?? '/gtrs/main');
        }

        // 3. LOGIC: If NOT Authenticated and trying to access Protected pages -> Redirect to Login
        if (!$is_authenticated && !$is_accessing_auth_route && $trimmedPath  != 'login') {
            return redirect('/login');
        }

        // Set CSRF token for web sessions if needed
        if ($request->hasSession()) {
            $request->headers->set('X-CSRF-TOKEN', csrf_token());
        }

        return $next($request);
    }

    protected function verifyCsrfToken($token)
    {
        // Implementation using Laravel's built-in CSRF token verification:
        return hash_equals($token, csrf_token());
    }
}
?>
