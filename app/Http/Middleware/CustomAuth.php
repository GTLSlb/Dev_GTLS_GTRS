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

    public function validateAccessToken($accessToken, $userId){
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

        $hasSession = $request->hasSession();
        if ($hasSession) {

            $path = $request->path();
            $request->headers->set('X-CSRF-TOKEN', csrf_token());

            $accessToken = $_COOKIE['access_token'] ?? false;
            $userId = $request->session()->get('user') ?? false;

            // check if user's token is valid & is on login route
            if(($path == 'loginComp' || $path == 'login' || $path == 'loginapi') && $userId && $accessToken){
                $isValid = $this->validateAccessToken($accessToken, $userId['UserId']);
                if(!$isValid){
                    //redirect to login
                    return redirect()->route('login');
                }else{
                    //stay inside the system
                    return redirect($_ENV['REDIRECT_ROUTE']);
                }
            }
            else{
                if ($path == 'loginComp' || $path == 'login' || $path == 'failed-login' || $path == 'loginapi' || $path == 'forgot-password' || $path == 'auth/azure' || $path == 'auth/azure/callback' || $path == 'microsoftToken' || $path == 'logoutWithoutRequest' || $path == 'gtrs/logoutWithoutReq'|| $path == 'logoutWithoutReq') {
                    return $next($request);
                }
                if ($path !== 'login' && $path != 'failed-login' && $path !== 'loginapi' && $path !== 'forgot-password' && !$request->session()->has('user')) {
                    return redirect()->route('login');
                }
            }
        } else {
            $path = $request->path();
            if ($path == 'loginComp' || $path == 'login' || $path == 'loginapi' || $path == 'forgot-password' || $path == '/auth/azure' || $path == 'auth/azure/callback' || $path == 'microsoftToken' || $path == 'logoutWithoutRequest'|| $path == 'gtrs/logoutWithoutReq' || $path == 'logoutWithoutReq') {
                return $next($request);
            }
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
