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
use Illuminate\Support\Facades\Log;

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

    public function handle($request, $next, ...$guards)
    {
        $hasSession = $request->hasSession();
        if ($hasSession) {
            //$session = $request->session();
            $sessionToken = $request->session()->token();
            $path = $request->path();
            $request->headers->set('X-CSRF-TOKEN', csrf_token());
            // Allow access to the login route
            if ($path == 'login' || $path == 'loginapi' || $path == 'forgot-password' || $path == 'auth/azure' || $path == 'auth/azure/callback' || $path == 'microsoftToken' || $path == 'logoutWithoutRequest') {
                return $next($request);
            }
            if ($path !== 'login' && $path !== 'loginapi' && $path !== 'forgot-password' && !$request->session()->has('user')) {
                return redirect()->route('login');
            }
        } else {
            if ($request->path() == 'login' || $request->path() == 'loginapi' || $request->path() == '/auth/azure' || $request->path() == 'auth/azure/callback' || $request->path() == 'microsoftToken' || $request->path() == 'logoutWithoutRequest') {
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
