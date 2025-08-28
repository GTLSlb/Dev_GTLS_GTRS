<?php

namespace App\Http\Middleware;

use Closure;
use Inertia\Inertia;
use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Session\Session;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Http;

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

    public function attempt(array $credentials = [], $remember = false)
    {
        $emailDb = $credentials['EmailDb'];
        $passwordDb = $credentials['PasswordDb'];
        $emailInput = $credentials['EmailInput'];
        $passwordInput = $credentials['PasswordInput'];
        // Compare the provided credentials with the user's credentials

        if (strtolower($emailDb) == strtolower($emailInput)) {
            return true; // Validation successful
        }

        return false;
    }

    public function validateAccessToken($accessToken, $userId)
    {
        $url = $_ENV['GTAM_API_URL'] . 'Validate/Session';

        $headers = [
            'UserId' => $userId,
            'Token' => $accessToken,
        ];
        $response = Http::withHeaders($headers)->get($url);
        switch ($response->status()) {
            case 200:
                return true;
            case 400:
                // Handle unauthorized access
                return false;
            default:
                // Handle other status codes
                return false;
        }
    }

    public function handle($request, $next, ...$guards)
    {
        $auth_routes = ['loginComp', 'login', 'loginapi', 'forgot-password', 'auth/azure', 'auth/azure/callback', 'microsoftToken', 'logoutWithoutRequest'];
        $hasSession = $request->hasSession();

        $path = $request->path();

        if ($request->hasSession()) {
            $request->headers->set('X-CSRF-TOKEN', csrf_token());

            $accessToken = $request->session()->get('token') ?? false;
            $userId = $request->session()->get('user') ?? false;
            $userId = gettype($userId) == "string" ? json_decode($userId, true) : $userId;

            if (in_array($path, $auth_routes) && $userId && $accessToken) {
                if (!$this->validateAccessToken($accessToken, $userId['UserId'])) {
                    return $next($request);
                } else {
                    return redirect($_ENV['REDIRECT_ROUTE']);
                }
            } elseif (!in_array($path, $auth_routes) && !$request->session()->has('user')) {
                return redirect()->route('login');
            }
        } elseif (in_array($request->path(), $auth_routes)) {
            return $next($request);
        }
        return $next($request);
    }

    protected function verifyCsrfToken($token)
    {
        // Implementation using Laravel's built-in CSRF token verification:
        return hash_equals($token, csrf_token());
    }
}
