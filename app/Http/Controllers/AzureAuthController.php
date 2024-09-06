<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Console\View\Components\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Manager\OAuth2\User as SocialiteUser;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AzureAuthController extends Controller
{

    public function handleCallback(Request $request)
    {
        try {
        // Retrieve the user from Azure using Socialite
        $socialiteUser = Socialite::driver('azure')->user();
        $accessToken = $socialiteUser->token;
        $expiresIn = $socialiteUser->expiresIn;

        // find the user in the database through API
        $url = env('GTAM_API_URL') . "validate/MicrosoftToken";
        if (session()->has('user')) {
            return redirect()->route('/main');
        }
        $headers = [
            'Authorization' => $accessToken,
        ];

        // Send the logout request to the external API
        $response = Http::withHeaders($headers)->get($url);

        if ($response->successful()) {
            // $responseBody = $response->body();
            $responseJson = $response->json();
            $jsonString = json_encode($responseJson);
            $request->session()->regenerate();
            $request->session()->put('user', $responseJson);
            $request->session()->put('user_id', $responseJson->UserId);
            $request->session()->put('newRoute', route('azurelogin'));

            $sessionId = $request->session()->getId();
            $payload = $request->session()->get('_token');
            $userSession = $request->session()->get('user');
            $user = $jsonString;
            $lastActivity = time();

            DB::table('custom_sessions')->insert([
                'id' => $sessionId,
                'user_id' => $responseJson->UserId,
                'payload' => $payload,
                'user' => $jsonString,
                'last_activity' => $lastActivity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $request->session()->save();

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $accessToken,
                'expires_in' => $expiresIn,
                'user' => $user,
            ]);
        }

            if (response()->status() == 302) {
                return response()->json([
                    'message' => 'Login error',
                ]);
            }
        } catch (Exception $e) {
            // Handle authentication errors
            //dd($e);
           // return redirect('/login')->with('error', 'Authentication failed, please try again.');
            //    return response()->json([
            //     'message' => 'Authentication error: ' . $e,
            // ], 500);
        }
    }

    public function sendToken(Request $request){
        $accessToken = $request->socialiteUser['accessToken'];
        $expiresIn = $request->socialiteUser['expiresOn'];

        // find the user in the database through API
        $url = env('GTAM_API_URL') . "validate/MicrosoftToken";

        $headers = [
            'Authorization' => $accessToken,
        ];

        // Send the logout request to the external API
        $response = Http::withHeaders($headers)->post($url);

        if ($response->successful()) {
            // $responseBody = $response->body();
            $responseJson = $response->json();

            $jsonString = json_encode($responseJson);

            $request->session()->regenerate();
            $request->session()->put('user', json_encode($responseJson[0]));
            $request->session()->put('user_id', $responseJson[0]['UserId']);
            $request->session()->put('newRoute', route('azure.login'));

            $sessionId = $request->session()->getId();
            $payload = $request->session()->get('_token');
            $userSession = $request->session()->get('user');
            $user = $jsonString;
            $lastActivity = time();

            DB::table('custom_sessions')->insert([
                'id' => $sessionId,
                'user_id' => $responseJson[0]['UserId'],
                'payload' => $payload,
                'user' => $userSession,
                'last_activity' => $lastActivity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $request->session()->save();

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $accessToken,
                'expires_in' => $expiresIn,
                'user' => $user,
            ]);
        }
    }
}

