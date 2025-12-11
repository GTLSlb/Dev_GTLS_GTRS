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

    protected function validateAccessToken($accessToken, $userId)
    {
        \Log::info("Validating Access Token via GTAM API: " . config('app.gtam_api_url'));
        \Log::info("UserId: " . $userId);
        \Log::info("AccessToken: " . $accessToken);
        $url = $_ENV['GTAM_API_URL'] ?? config('app.gtam_api_url') ?? $gtam_api_url ?? '';
        $headers = [
            'UserId' => $userId,
            'Token' => $accessToken,
        ];
        $response = Http::withHeaders($headers)->get($url . 'Validate/Session');
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

    protected function is_performing_test(){
        $is_testing = false;
        if(isset($_COOKIE['gtls_test'])){
            $val = $_COOKIE['gtls_test'];
            $is_testing = empty($val) ? false : ($val === null || $val === "true" ? true : false);
        }

        return $is_testing;
    }

    public function handle($request, $next, ...$guards)
    {
        $auth_routes = ['loginComp', 'login', 'loginapi', 'forgot-password', 'auth/azure', 'auth/azure/callback', 'microsoftToken', 'logoutWithoutRequest', 'exchange-token'];
        $hasSession = $request->hasSession();
        $path = $request->path();
        $performing_test = $this->is_performing_test();

        // Check if we are performing a test
        if($performing_test){
            // Simulate a session for testing
            $request->headers->set('X-CSRF-TOKEN', csrf_token());
            return $next($request);
        }

        if ($request->hasSession()) {
            $request->headers->set('X-CSRF-TOKEN', csrf_token());

            // Attempt to retrieve authentication credentials from the session
            $accessToken = $request->session()->get('token') ?? false;
            $userId = $request->session()->get('user') ?? false;

            // The 'user' session variable might be stored as a JSON string; decode it if it is.
            $userId = gettype($userId) == "string" ? json_decode($userId, true) : $userId;

            /**
             * CASE 1: Authenticated User attempting to access Auth Routes (Login, Forgot Password, etc.)
             * If user has a session and valid credentials, check if the token is still active.
             */
            if (in_array($path, $auth_routes) && $userId && $accessToken) {
                if (!$this->validateAccessToken($accessToken, $userId['UserId'])) {
                    return $next($request);
                } else {
                    return redirect(config('app.redirect_route') ?? '/gtam/main');
                }
            }
            /**
             * CASE 2: Unauthenticated User accessing Protected Routes
             * If the route is NOT an auth route AND there is no 'user' in session AND no JWT cookie exists AND not performing a test.
             */
            elseif (!in_array($path, $auth_routes) && !$request->session()->has('user') && !isset($_COOKIE['jwt_token']) && !$performing_test) {
                return redirect()->route('login');
            }
            /**
             * CASE 3: Cookie-based Authentication on Auth Routes
             * If the user is on a login/auth page but already has a valid JWT cookie.
             */
            elseif(in_array($path, $auth_routes) && isset($_COOKIE['jwt_token'])){
                return redirect(config('app.redirect_route') ?? '/gtam/main');
            }
        }
        /**
         * CASE 4: No Active Session
         * If the user is specifically visiting an Auth Route and has no JWT cookie.
         */
        elseif (in_array($request->path(), $auth_routes) && !isset($_COOKIE['jwt_token'])) {
            return $next($request);
        }

        // --- Default: Pass the request on ---
        // If none of the above conditions resulted in a redirect or early exit,
        // allow the request to proceed to the next middleware or controller.
        return $next($request);
    }

    protected function verifyCsrfToken($token)
    {
        // Implementation using Laravel's built-in CSRF token verification:
        return hash_equals($token, csrf_token());
    }
}
