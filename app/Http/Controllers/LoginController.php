<?php

namespace App\Http\Controllers;

use App\Http\Middleware\ApiAuth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use App\Http\Middleware\CustomAuth;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;

class LoginController extends Controller
{
    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        $email = $request->input('Email');
        $password = $request->input('Password');

        $headers = [
            'Email' => $email,
            'Password' => $password,
        ];

        $url = 'https://gtlslebs06-vm.gtls.com.au:5432/api/Login';
        $response = Http::withHeaders($headers)->get($url);
        if ($response->successful()) {
            $responseData = $response->json();
            if (!empty($responseData)) {
                $user = new User($responseData[0]);
                $authProvider = new CustomAuth(Auth::guard()->getProvider(), $request->session());
                $credentials = [
                    'EmailInput' => $request->input('Email'),
                    'EmailDb' => $responseData[0]['Username'],
                    'PasswordDb' => $responseData[0]['UserId'],
                    'PasswordInput' => $request->input('Password'),
                ];
                $authenticatedUser = $authProvider->attempt($credentials, true);
                if ($authenticatedUser) {
                    // Redirect to the intended page with the obtained user 
                    $request->session()->regenerate();
                    $request->session()->put('user', $user);
                    $request->session()->put('newRoute', route('loginapi'));
                    $request->session()->put('isLoggingOut', false);

                    if ($request->session()->get('newRoute') && $request->session()->get('user')) {
                        return response($request, 200);
                    }

                } else {
                    $errorMessage = 'An error occurred.';
                    $statusCode = 500;
                    return response(['not auth' => $response], $statusCode);
                }
            }
        } else {
            // Create a static error response
            $errorMessage = 'An error occurred.';
            $statusCode = 500;
            return response(['error' => $response], $statusCode);
        }
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->flush();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
?>
