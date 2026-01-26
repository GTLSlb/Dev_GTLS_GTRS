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

        $jwt_token = $_COOKIE['jwt_token'] ?? "";
        $auth_routes = ['loginComp', 'login', 'loginapi', 'forgot-password', 'auth/azure', 'auth/azure/callback', 'microsoftToken', 'logoutWithoutRequest', 'exchange-token'];

        // 1. LOGIC: Determine Auth Status ( JWT first, then Session )
        $is_valid_JWT = $jwt_token == "" ? false : JsonWebTokenController::is_jwt_valid($jwt_token);

        $payload = [
            'token' => null,
            'user' => null,
            'userId' => null,
        ];
        // 1.a. Populate payload
        if($is_valid_JWT) {
            // If JWT is valid, decode it and save to payload
            $decoded_data = JsonWebTokenController::decode_jwt_valid($jwt_token);
            $payload['user'] = $decoded_data->user;
            $payload['token'] = $decoded_data->Token;
            $payload['userId'] = $decoded_data->userId;
        }else{
            // If JWT is not valid, check Session
            $sessionUser = $request->hasSession() ? $request->session()->get('user') : null;
            $sessionToken = $request->hasSession() ? $request->session()->get('token') : null;
            $sessionUserId = $request->hasSession() ? $request->session()->get('userId') : null;

            // Save to payload
            if($sessionUser && $sessionToken){
                $payload['user'] = $sessionUser;
                $payload['token'] = $sessionToken;
                $payload['userId'] = $sessionUserId;
            }
        }

        // 1.b. Validate Authentication
        $is_authenticated = false;
        $is_authenticated = SessionSharing::validate_access_token($payload['token'], $payload['userId']);

        $is_accessing_auth_route = in_array($trimmedPath, $auth_routes);
        \Log::info("is_authenticated: " . $is_authenticated);
        \Log::info("is_accessing_auth_route: " . $is_accessing_auth_route);
        // 2. LOGIC: If Authenticated and trying to access Auth pages -> Redirect to Main Page
        if ($is_authenticated && $is_accessing_auth_route) {
            return redirect(config('app.redirect_route') ?? '/gtam/main');
        }

        // 3. LOGIC: If NOT Authenticated and trying to access Protected pages -> Redirect to Login
        if (!$is_authenticated && !$is_accessing_auth_route) {
            return redirect()->route('login');
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
