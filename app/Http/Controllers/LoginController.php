<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Middleware\ApiAuth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Customer;
use App\Models\Driver;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use App\Http\Middleware\CustomAuth;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Dotenv\Dotenv;
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

        $url = $_ENV['GTAM_API_URL'];

        // Get an array of all the cookies
        $cookies = $_COOKIE;

        // Loop through each cookie and set it to expire
        foreach ($cookies as $name => $value) {
            setcookie($name, '', 1, '/', $_ENV['SESSION_DOMAIN'], true);
        }
        $response = Http::withHeaders($headers)->get("$url" . "Login");
        if ($response->successful()) {
            $responseData = $response->json();
            if (!empty($responseData)) {
                $authProvider = new CustomAuth();

                $credentials = [
                    'EmailInput' => $request->input('Email'),
                    'EmailDb' => $responseData[0]['Email'],
                    'PasswordDb' => $responseData[0]['UserId'],
                    'PasswordInput' => $request->input('Password'),
                ];

                $authenticatedUser = $authProvider->attempt($credentials, true);

                if ($authenticatedUser) {
                    // Redirect to the intended page with the obtained user
                    $user = null;
                    $TokenHeaders = [
                        'UserId'=> $responseData[0]['UserId'],
                        'OwnerId'=> $responseData[0]['OwnerId'],
                        // 'AppId'=> $appID,
                        'Content-Type'=> "application/x-www-form-urlencoded",
                    ];
                    $TokenBody = [
                        'grant_type' => "password",
                    ];

                    $tokenURL = $_ENV['GTAM_API_URL'];
                    $tokenRes = Http::withHeaders($TokenHeaders)
                    ->asForm()
                    ->post("$tokenURL" . "Token", $TokenBody);

                    if($responseData[0]['TypeId'] == 1) // the user is a customer
                    {
                        $user = new Customer($responseData[0]);
                    }else if($responseData[0]['TypeId'] == 2) // the user is an employee
                    {
                        $user = new Employee($responseData[0]);
                    }
                    else{ // the user is a driver
                        $user = new Driver($responseData[0]);
                    }
                    if ($tokenRes->successful()) {

                        $token = $tokenRes->json();
                        $cookieName = 'access_token';
                        $cookieValue = $token['access_token'];
                        $expiry = 60 * 60 * 24 * 2; //48h

                        setcookie('previous_page', $_ENV['APP_URL'] . "/main", time() + $expiry, '/', $_ENV['SESSION_DOMAIN'], true);

                        $cookieName = 'access_token';
                        $cookieValue = $token['access_token'];

                        setcookie($cookieName, $cookieValue, time() + $expiry, '/', $_ENV['SESSION_DOMAIN'], true);
                        setcookie('refresh_token', $token['refresh_token'], time() + $expiry, '/', $_ENV['SESSION_DOMAIN'], true);

                        $userId = $user['UserId'];
                        $request->session()->regenerate();
                        $request->session()->put('user', $user);
                        $request->session()->put('user_id', $userId);
                        $request->session()->put('newRoute', route('loginapi'));

                        $sessionId = $request->session()->getId();
                        $payload = $request->session()->get('_token');
                        $userSession = $request->session()->get('user');
                        $user = json_encode($userSession->getAttributes());

                        $lastActivity = time();
                        DB::table('custom_sessions')->insert([
                            'id' => $sessionId,
                            'user_id' => $userId,
                            'payload' => $payload,
                            'user' => $user,
                            'last_activity' => $lastActivity,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $request->session()->save();
                        if ($request->session()->get('newRoute') && $request->session()->get('user')) {
                            return response()->json([
                                'status' => 200,
                                'message' => 'Logged in successfully',
                                'access_token' => $cookieValue,
                                'expires_in' => $expiry,
                            ]);
                        }
                        }else{
                            $errorMessage = 'Something went wrong, try again later';
                            $statusCode = 500;
                            return response(['error' => $response, 'Message' => $errorMessage], $statusCode);
                        }


                } else {
                    $errorMessage = 'Invalid Credentials';
                    $statusCode = 500;
                    return response(['error' => $response, 'Message' => $errorMessage], $statusCode);
                }
            }
        } else {
            $errorMessage = 'Invalid Credentials';
            $statusCode = 500;
            return response(['error' => $response, 'Message' => $errorMessage], $statusCode);
        }
    }


    public function logout(Request $request)
    {
        // Retrieve the 'access_token' cookie
        $token = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : null;

        // Create an instance of the RegisteredUserController and get the current user
        $userController = new RegisteredUserController();
        $user = $userController->getCurrentUserName($request);
        $userMsg = json_decode($user->content(), true);

        if(gettype($userMsg) != "array" && gettype($userMsg) != "object" && gettype($userMsg) == "string") {
        if ($userMsg['message'] == 'User not found') {

                $request->session()->invalidate();
                $request->session()->flush();
                // Set the expiration time for the cookies to 1/1/1970
                $expiration = 1;
                $cookies = $_COOKIE;

                // Loop through each cookie and set it to expire
                foreach ($cookies as $name => $value) {
                    setcookie($name, '', $expiration, '/', $_ENV['SESSION_DOMAIN'], true);
                }
                $request->session()->regenerateToken();
                // return redirect('/login');
        }} else {
            // Extract the UserId from the response
            $UserId = $user->original['UserId'];

            // Set up headers for the logout request
            $headers = [
                'UserId' => $UserId,
                'Authorization' => "Bearer " . "$token",
            ];

            // Define the URL for the logout request
            $url = env('GTAM_API_URL') . "Logout";

            // Send the logout request to the external API
            $response = Http::withHeaders($headers)->get($url);

            // Check if the logout request was successful
            if ($response->successful()) {
                // Invalidate and flush the session
                $request->session()->forget('user');
                $request->session()->invalidate();
                $request->session()->flush();
                // Set the expiration time for the cookies to 1/1/1970
                $expiration = 1;

                // Get an array of all the cookies
                $cookies = $_COOKIE;

                // Loop through each cookie and set it to expire
                foreach ($cookies as $name => $value) {
                    setcookie($name, '', $expiration, '/', $_ENV['SESSION_DOMAIN'], true);
                }

                // Regenerate the session token
                $request->session()->regenerateToken();
            } else {
                // Handle the case where the logout request fails
                return redirect()->back()->withErrors(['error' => 'Logout failed. Please try again.']);
            }
        }
    }

    public function logoutWithoutRequest(Request $request)
    {
        // Retrieve the 'access_token' cookie
        $token = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : null;

        // Create an instance of the RegisteredUserController and get the current user
        $userController = new RegisteredUserController();
        $user = $userController->getCurrentUserName($request);
        $userMsg = json_decode($user->content(), true);

        //check if user is not found
        if(gettype($userMsg) != "array" && gettype($userMsg) != "object" && gettype($userMsg) == "string") {
        if ($userMsg['message'] == 'User not found') {

                $request->session()->invalidate();
                $request->session()->flush();
                // Set the expiration time for the cookies to 1/1/1970
                $expiration = 1;
                $cookies = $_COOKIE;

                // Loop through each cookie and set it to expire
                foreach ($cookies as $name => $value) {
                    setcookie($name, '', $expiration, '/', $_ENV['SESSION_DOMAIN'], true);
                }
                $request->session()->regenerateToken();
                // return redirect('/login');
        }} else {
                // Invalidate and flush the session
                $request->session()->forget('user');
                $request->session()->invalidate();
                $request->session()->flush();
                // Set the expiration time for the cookies to 1/1/1970
                $expiration = 1;

                // Get an array of all the cookies
                $cookies = $_COOKIE;

                // Loop through each cookie and set it to expire
                foreach ($cookies as $name => $value) {
                    setcookie($name, '', $expiration, '/', $_ENV['SESSION_DOMAIN'], true);
                }

                // Regenerate the session token
                $request->session()->regenerateToken();
        }
    }

    public function azureLogout()
    {
        // Microsoft Azure AD Logout URL
        $azureLogoutUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/logout';

        // The URL to redirect back to after logout (your application's home or login page)
        $postLogoutRedirectUri = urlencode(route('home')); // Replace 'home' with your route name

        // Redirect to Microsoft Azure logout endpoint with post-logout redirect URL
        return redirect()->away($azureLogoutUrl . '?post_logout_redirect_uri=' . $postLogoutRedirectUri);
        // return redirect('/login');
    }
}
?>
