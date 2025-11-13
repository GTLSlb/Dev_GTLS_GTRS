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
use App\Http\Controllers\SessionSharing;

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

    public function validateAccessToken($accessToken, $userId)
    {
        \Log::info("Validating Access Token via GTAM API: " . config('app.gtam_api_url'));
        \Log::info("UserId: " . $userId);
        \Log::info("AccessToken: " . $accessToken);
        $url = config('app.gtam_api_url') . 'Validate/Session';
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
        $auth_routes = ['loginComp', 'login', 'loginapi', 'forgot-password', 'auth/azure', 'auth/azure/callback', 'microsoftToken', 'logoutWithoutRequest', 'exchange-token'];
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
                    return redirect(config('app.redirect_route') ?? '/gtam/main');
                }
            } elseif (!in_array($path, $auth_routes) && !$request->session()->has('user') && !isset($_COOKIE['jwt_token'])) {
                return redirect()->route('login');
            }elseif(in_array($path, $auth_routes) && isset($_COOKIE['jwt_token'])){
                return redirect(config('app.redirect_route') ?? '/gtam/main');
            }
        } elseif (in_array($request->path(), $auth_routes) && !isset($_COOKIE['jwt_token'])) {
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
