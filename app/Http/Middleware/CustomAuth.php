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

        if ($emailDb == $emailInput) {
            return true; // Validation successful
        }

        return false;
    }

    public function handle($request, Closure $next, ...$guards)
    {
        $hasSession = $request->hasSession();
        if ($hasSession) {
            //$session = $request->session();
            $path = $request->path();

            // Allow access to the login route
            if ($path == 'login' || $path == 'loginapi') {
                return $next($request);
            }
            if ($path !== '/' && $path !== 'login' && $path !== 'loginapi' && !$request->session()->has('user')) {
                return redirect()->route('login');
            }
        } else {
            if ($request->path() == 'login' || $request->path() == 'loginapi') {
                return $next($request);
            }


        }
        return $next($request);
    }
}
?>
