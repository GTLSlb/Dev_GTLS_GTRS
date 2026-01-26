<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\ExpiredException;

use Exception;

class SessionSharing extends Controller
{
    public static function validate_access_token($accessToken, $userId)
    {
        $root = $_ENV['GTAM_API_URL'] ?? config('app.gtam_api_url') ?? '';
        $url = $root . 'Validate/Session';

        \Log::info("Validating Access Token via GTAM API: " . $url);
        \Log::info("UserId: " . $userId);
        \Log::info("AccessToken: " . $accessToken);
        $headers = [
            'UserId' => $userId,
            'Token' => $accessToken,
        ];
        $response = Http::withHeaders($headers)->get($url);
        \Log::info("response: " . $response->status());
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

    public static function is_session_valid($token, $userId, $jwt_token, $gtam_api_url) {
        try {
            // Query the database to check if the session is valid
            $tableName = $_ENV['DB_TABLE'] ?? "custom_sessions";

            $results = DB::table('custom_sessions')
                ->where('payload', $token)
                ->where('user_id', $userId)
                ->limit(1)
                ->get();

            $isValid = $this->validate_access_token($token, $userId, $gtam_api_url) && $this->is_jwt_valid($jwt_token);

            return $isValid;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function exchangeToken(Request $request) {
    $user = $request->input('user');
    $token = $request->input('token');
    $gtls_session = $request->input('gtls_session');
    $jwt_token = $request->input('jwt_token');
    $gtam_api_url= $_ENV['GTAM_API_URL'] ??  $request->input('gtam_url') ?? config('app.gtam_api_url') ?? '';

    \Log::info("Exchange Token method: ");
    \Log::info("GTRR URL: " . $gtam_api_url);
    \Log::info("gtls_session: " . $gtls_session);
    \Log::info("token: " . $token);
    \Log::info("jwt_token: " . $jwt_token);

    //if user is a string decode it
    $user = gettype($user) == "string" ? json_decode($user, true) : $user;

    if(!$user || !$token || !$jwt_token){
        return response()->json(['message' => 'Unauthorized', 'data' => ['user' => $user, 'token' => $token, 'jwt_token' => $jwt_token, 'gtls_session' => $gtls_session]], 401);
    }

    $isValidSession = $this->is_session_valid($token, $user['UserId'], $jwt_token, $gtam_api_url);

    if(!$isValidSession){
        \Log::info("Not Valid session: ");
        return response()->json(['message' => 'Invalid session', 'results' => $isValidSession ,'data' => ['user' => $user, 'token' => $token, 'jwt_token' => $jwt_token, 'gtls_session' => $gtls_session]], 401);
    }

    if($jwt_token && !$gtls_session){
        // Create a new GTLS session
        \Log::info("Session not created, starting session...");
        $request->session()->regenerate();

        // Store a key piece of validation data to make the session useful
        $request->session()->put('token', $token);
        $request->session()->put('user', is_array($user) ? json_encode($user) : $user);
        $request->session()->put('user_id', $user['UserId']);
        $request->session()->put('newRoute', '/loginapi');

        $sessionId = $request->session()->getId();
        \Log::info("SessionId: " . $sessionId);
        $lastActivity = time();
        DB::table('custom_sessions')->insert([
            'id' => $sessionId,
            'user_id' => $user['UserId'],
            'payload' => $token,
            'user' => json_encode($user),
            'last_activity' => $lastActivity,
            'created_at' => NOW(),
            'updated_at' => NOW(),
        ]);
        return response()->json(['message' => 'Success, create gtls session', 'data' => ['user' => $user, 'token' => $token, 'jwt_token' => $jwt_token, 'gtls_session' => $sessionId]], 200);
    } else {
        return response()->json(['message' => 'Session already exists or invalid request', 'data' => ['user' => $user, 'token' => $token, 'jwt_token' => $jwt_token, 'gtls_session' => $gtls_session]], 400);
    }
}

    public static function handleSessionSharing(Request $request)
    {
        $user = $request->input('user');
        $token = $request->input('token');
        $jwt_token = $request->input('jwt_token');
        $sessionId = $request->session()->getId();

        // Implement session validation logic
        $url = config('app.gtrr_api_url') . 'exchange-token';
        try {
            $body = [
                'user' => $user,
                'gtls_session' => $sessionId,
                'token' => $token,
                'jwt_token' => null
            ];
            $response = Http::post($url, $body);
            $jwt_token = null;
            if ($response->successful()) {
                $data = $response->json();
                $jwt_token = $data['jwt_token'] ?? null;
            }
        } catch (Exception $e) {
            \Log::error("Error validating session from Node: " . $e->getMessage());
            return null;
        }

        return $jwt_token;
    }

}
