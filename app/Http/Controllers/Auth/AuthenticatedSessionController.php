<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request)
    {

        if ($request->session()->has('user')) {
            $url = $_COOKIE['previous_page'];
            $delimiter = '/';
            $position = 0;
            $occurrence = 3;

            for ($i = 0; $i < $occurrence; $i++) {
                $position = strpos($url, $delimiter, $position + 1);

                if ($position === false) {
                    break;
                }
            }

            if ($position !== false) {
                $textAfterThirdSlash = substr($url, $position + 1);
                $matchedRoute = $textAfterThirdSlash;
            } else {
                $matchedRoute = null;
            }

            if($matchedRoute == null){
                return Inertia::render('Auth/Login');
            }else if($matchedRoute == 'login'){
                return Inertia::render('Auth/Login', [
                    'canResetPassword' => Route::has('password.request'),
                    'status' => session('status'),
                ]);
            }
            else{
                return redirect($matchedRoute);
            }  
        } else {
            // 'user' value exists and is not null, don't do anything
            return Inertia::render('Auth/Login', [
                'canResetPassword' => Route::has('password.request'),
                'status' => session('status'),
            ]);
        }
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        return redirect()->intended(RouteServiceProvider::HOME);
    }


    public function checkAuth()
    {
        if (Auth::check()) {
            // User is not authenticated, return a response indicating that the user needs to log in
            return response()->json([
                'error' => 'User is found',
            ]);
        }else{
            return response()->json([
                'error' => 'User NOT found',
            ]);
        }

        // User is authenticated, return the protected content
        // return inertia('Main');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
