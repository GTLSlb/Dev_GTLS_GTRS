<?php

namespace App\Http\Controllers;

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
        $url = $_ENV['GTAM_API_URL']; //LOGIN API
        $expiration = time() - (60 * 60 * 24);
        // Get an array of all the cookies
        $cookies = $_COOKIE;
        // Loop through each cookie and set it to expire
        foreach ($cookies as $name => $value) {
            setcookie($name, '', $expiration);
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
                    ->post("$tokenURL" . "/Token", $TokenBody);
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
                        $expiry = 60 * 60 * 24; // 24 hours
                        $expirationTime = time() + $expiry;
                        
                        // Set cookies for the domain .gtls.store
                        setcookie($cookieName, $cookieValue, $expirationTime, '/', $_ENV['SESSION_DOMAIN'], true, false);
                        setcookie('gtfm_refresh_token', $token['refresh_token'], $expirationTime, '/', $_ENV['SESSION_DOMAIN'], true, false);
                    
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
                            return response($request, 200);
                        }
                    } else {
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
        //  dd($response);
        if ($response->successful()) {
            // Invalidate and flush the session
            $request->session()->invalidate();
            $request->session()->flush();
            // Set the expiration time for the cookies to 24 hours before the current time
            $expiration = time() - (60 * 60 * 24);
            // Get an array of all the cookies
            $cookies = $_COOKIE;
            // Loop through each cookie and set it to expire
            foreach ($cookies as $name => $value) {
                setcookie($name, '', $expiration);
            }
            // Regenerate the session token
            $request->session()->regenerateToken();
            // Redirect to the login page
            return redirect('/login');
        } else {
            // Handle the case where the logout request fails
            // You can log an error or return a specific response
            return redirect()->back()->withErrors(['error' => 'Logout failed. Please try again.']);
        }
    }
}
?>
