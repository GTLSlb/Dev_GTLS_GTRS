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
use App\Http\Controllers\Auth\RegisteredUserController;
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
                        setcookie($name, '', 1, '/', $_ENV['SESSION_DOMAIN'], true);
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
        // Retrieve the 'access_token' cookie if available
        $token = $_COOKIE['access_token'] ?? null;
    
        // Create an instance of the RegisteredUserController and get the current user
        $userController = new RegisteredUserController();
        $user = $userController->getCurrentUserName($request);
        $userMsg = json_decode($user->content(), true);
    
        // If user data indicates 'User not found'
        if (isset($userMsg['message']) && $userMsg['message'] === 'User not found') {
            // Invalidate and flush session data
            $request->session()->invalidate();
            $request->session()->flush();
    
            // Clear cookies to log the user out fully
            $this->clearAllCookies();
    
            // Regenerate the session token for security purposes
            $request->session()->regenerateToken();
    
            // Respond with success (Azure AD logout will be handled on the frontend)
            return response()->json(['status' => 'success', 'message' => 'Logged out locally. Handle Azure AD logout on frontend.']);
        } else {
            // If user is found, proceed with API logout
            $UserId = $user->original['UserId'];
    
            // Set up headers for the API request
            $headers = [
                'UserId' => $UserId,
                'Authorization' => "Bearer " . $token,
            ];
    
            // Send the logout request to the external API
            $url = env('GTAM_API_URL') . "Logout";
            $response = Http::withHeaders($headers)->get($url);
    
            // Check if the logout request was successful
            if ($response->successful()) {
                // Invalidate and flush session data
                $request->session()->forget('user');
                $request->session()->invalidate();
                $request->session()->flush();
    
                // Clear cookies to log the user out fully
                $this->clearAllCookies();
    
                // Regenerate the session token for security purposes
                $request->session()->regenerateToken();
    
                // Respond with success (Azure AD logout will be handled on the frontend)
                return response()->json(['status' => 'success', 'message' => 'Logged out locally. Handle Azure AD logout on frontend.']);
            } else {
                // Handle failure in the external API call
                return redirect()->back()->withErrors(['error' => 'Logout failed. Please try again.']);
            }
        }
    }
    
    /**
     * Helper function to clear all cookies.
     */
    private function clearAllCookies()
    {
        // Set the expiration time for the cookies to a past date (January 1, 1970)
        $expiration = time() - 3600;
    
        // Set domain and flags for cookie clearing
        $domain = $_ENV['SESSION_DOMAIN'] ?? '';
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
    
        // Loop through each cookie and set it to expire
        foreach ($_COOKIE as $name => $value) {
            // Clear the cookie for all paths and domains
            setcookie($name, '', $expiration, '/', $domain, $secure, true); // Secure and HttpOnly flags
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

                $this->clearAllCookies();

                $request->session()->regenerateToken();
                // return redirect('/login');
                return response()->json(['status' => 'success', 'message' => 'Logged out locally. Handle Azure AD logout on frontend.']);

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
                $this->clearAllCookies();

                // Regenerate the session token
                $request->session()->regenerateToken();

                return response()->json(['status' => 'success', 'message' => 'Logged out locally. Handle Azure AD logout on frontend.']);
              
        }
    }

}
?>
