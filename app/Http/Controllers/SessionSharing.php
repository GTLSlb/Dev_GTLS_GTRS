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
// use Tymon\JWTAuth\Contracts\JWTSubject;
// use Tymon\JWTAuth\Facades\JWTAuth;
// use Tymon\JWTAuth\Exceptions\TokenExpiredException;
// use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class SessionSharing extends Controller
{



    private function is_jwt_valid($jwt_token) {
        $secretKey = $_ENV['JWT_SECRET'] ?? '2zX!8fD@qY6k#eT^mP9w$Jr1&uV5g*Bf3';
        $allowed_algs = ['HS256'];
        $currentTime = time();

        if (empty($jwt_token)) {
            \Log::error("JWT Token is empty");
            return false;
        }

        // Check if token has 3 segments
        $segments = explode('.', $jwt_token);
        if (count($segments) !== 3) {
            \Log::error("Invalid JWT Token format. Expected 3 segments, got " . count($segments));
            return false;
        }

        if($jwt_token == null || $jwt_token == undefined) return false;

        try {
        // This single call performs three checks:
        // 1. Decodes the token.
        // 2. Verifies the signature using the secret key.
        // 3. Verifies the expiration (exp), not before (nbf), and issued at (iat) claims.

        $decoded = JWT::decode(
            $jwt_token,
            new Key($secretKey, $allowed_algs[0]) // Pass the key and the algorithm
        );

        // If decoding succeeds without exceptions, the token is valid.
        return true;

    } catch (ExpiredException $e) {
        \Log::error("JWT Expired: " . $e->getMessage());
        return false;
    } catch (SignatureInvalidException $e) {
        \Log::error("JWT Signature Invalid: " . $e->getMessage());
        return false;
    } catch (Exception $e) {
        \Log::error("JWT Decode Error: " . $e->getMessage());
        return false;
    }
    }

    public function validateAccessToken($accessToken, $userId, $gtam_api_url)
    {
        $root = $_ENV['GTAM_API_URL'] ?? config('app.gtam_api_url') ?? $gtam_api_url ?? '';
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

    private function is_session_valid($token, $userId, $jwt_token, $gtam_api_url) {
        try {
            // Query the database to check if the session is valid
            $tableName = $_ENV['DB_TABLE'] ?? "custom_sessions";

            $results = DB::table('custom_sessions')
                ->where('payload', $token)
                ->where('user_id', $userId)
                ->limit(1)
                ->get();

            \Log::info("MySQL table: " . $tableName);
            \Log::info("MySQL result: " . $results->count() . " rows found for user_id: " . $userId);
            \Log::info("\n");
            \Log::info("Access Token result: " . $this->validateAccessToken($token, $userId, $gtam_api_url));
            \Log::info("JWT Token result: " . $this->is_jwt_valid($jwt_token));
            \Log::info("\n");
            $isValid = $this->validateAccessToken($token, $userId, $gtam_api_url) && $this->is_jwt_valid($jwt_token);

            return $isValid;
        } catch (Exception $e) {
            return false;
        }
    }

    public function exchangeToken(Request $request) {
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
}
