<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Safety;

use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Psy\Readline\Hoa\Console;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\ExpiredException;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
   private function mapUserByTypeId($user){
        $user_type_id = $user->TypeId;
        switch($user_type_id){
            case 1:
                // User is a customer
                return [
                                'UserId' => $user->UserId,
                                'TypeId' => $user->TypeId,
                                'TypeName' => $user->TypeName,
                                'OwnerId' => $user->OwnerId,
                                'PhoneNumber' => $user->PhoneNumber,
                                'CustomerName' => $user->CustomerName,
                                'Picture' => $user->Picture,
                                'Username' => $user->Username,
                                'Email' => $user->Email,
                            ];
            case 2:
                // User is an employee
                return [
                            'UserId' => $user->UserId,
                            'TypeId' => $user->TypeId,
                            'TypeName' => $user->TypeName,
                            'OwnerId' => $user->OwnerId,
                            'Username' => $user->Username,
                            'FirstName' => $user->FirstName,
                            'LastName' => $user->LastName,
                            'Email' => $user->Email,
                            'PhoneNo' => $user->PhoneNo,
                            'Dob' => $user->Dob,
                            'Address' => $user->Address,
                            'Picture' => $user->Picture,
                            'NationalityId' => $user->NationalityId,
                            'NationalityName' => $user->NationalityName,
                            'BranchId' => $user->BranchId,
                            'RoleId' => $user->RoleId,
                            'RoleName' => $user->RoleName,
                            'ReportToId' => $user->ReportToId,
                            'ReportToName' => $user->ReportToName,
                            'HiringDate' => $user->HiringDate,
                            'StateId' => $user->StateId,
                            'StateName' => $user->StateName,
                        ];
            case 3:
                // User is a driver
                return [
                            'UserId' => $user->UserId,
                            'TypeId' => $user->TypeId,
                            'TypeName' => $user->TypeName,
                            'truckNbr' => $user->truckNbr,
                            'location' => $user->location,
                            'driverNbr' => $user->driverNbr,
                            'Username' => $user->Username,
                            'Email' => $user->Email,
                            'phoneNbr' => $user->phoneNbr,
                        ];
            default:
                return null;
        }
    }

    private function validateSessionFromNode($user, $sessionId, $token){
        // Implement session validation logic
        $url = config('app.gtrr_api_url') . 'exchange-token';
        try{
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
            }catch(Exception $e){
                \Log::error("Error validating session from Node: " . $e->getMessage());
                return null;
            }

            return $jwt_token;
    }

    private function decode_jwt_valid($jwt_token) {
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

        if ($jwt_token == null || !isset($jwt_token)) {
            return false;
        }


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
        return $decoded;

    } catch (ExpiredException $e) {
        \Log::error("JWT Expired: " . $e->getMessage());
        return null;
    } catch (SignatureInvalidException $e) {
        \Log::error("JWT Signature Invalid: " . $e->getMessage());
        return null;
    } catch (Exception $e) {
        \Log::error("JWT Decode Error: " . $e->getMessage());
        return null;
    }
    }

        public function getCurrentUserName(Request $request)
    {
        $sessionId = $request->session()->getId();
        $user_from_db = DB::table('custom_sessions')
                ->where('id', $sessionId)
                ->value('user');
        \Log::info("User in controller: " . $user_from_db);
        $user_from_session = $request->session()->get('user');

        $valid_user = $user_from_db != null ? $user_from_db : $user_from_session;

        $decoded_user = null;
        if (is_string($valid_user)) {
            $decoded_user = json_decode($valid_user);
        } elseif ($valid_user === null) {
            if (isset($_COOKIE['jwt_token'])) {
                $decoded_user = $this->decode_jwt_valid($_COOKIE['jwt_token'])->user;
            } else {
                $decoded_user = null;
            }
        } else {
            $decoded_user = null;
        }

        if($decoded_user !== null) {
            $user = $this->mapUserByTypeId($decoded_user);
            $jwt_token = !isset($_COOKIE['jwt_token']) ? $this->validateSessionFromNode($user_from_session, $sessionId, $request->session()->get('token')) : $_COOKIE['jwt_token'];
            $token = !isset($_COOKIE['jwt_token']) ? $request->session()->get('token') : $this->decode_jwt_valid($jwt_token)->Token;

            \Log::info("NEW JWT Token: " . $jwt_token);
            return response()->json([
                'jwt_token' => $jwt_token,
                'token' => $token,
                'user' => $user
            ]);
        }else{
            // User object is null
            return response()->json(['error' => 'Session not found'], 401);
        }
    }

    public function getUserName($id)
    {
        $user = User::find($id);

        if ($user) {
            $FirstName = $user->FirstName;
            $LastName = $user->LastName;
            $UserId = $user->UserId;

            return response()->json([
                'FirstName' => $FirstName,
                'LastName' => $LastName,
                'UserId' => $UserId,
            ]);
        } else {
            return response()->json([
                'error' => 'User not found',
            ]);
        }
    }

    public function getChildrens($id)
    {
        $UserId=$id;
        $user = User::find($UserId);
        //dd($user);
        if ($user) {
            if ($user->parent_id == null) {
                $children = User::where('parent_id', $user->id)->pluck('user_id')->all();
                $formattedChildren = [];
                if ($children) {
                    foreach ($children as $child) {
                        $formattedChildren[] = ['UserId' => (int) $child];
                    };
                    return response()->json([
                        'data' => $formattedChildren,
                    ]);
                } else {
                    return response()->json([
                        'data' =>  ['UserId' => (int) $user->user_id],
                    ]);
                }
            } else {
                return response()->json([
                    'data' =>  ['UserId' => (int) $user->user_id],
                ]);
            }
        } else {
            return response()->json([
                'error' => 'User Not found',
            ]);
        }
    }
    public function getChildrensList($id)
    {
        // Find the user with the given ID
        $user = User::find($id);

        // Check if the user exists
        if ($user) {
            // Check if the user's role ID is 2
            if ($user->role_id == 2) {
                // Check if the user has a parent ID
                if ($user->parent_id != null) {
                    // Return the current user's data as a JSON response

                    return response()->json([
                        'error' => 'This User is a children',
                    ]);
                } else {
                    // Fetch other customers with the same parent ID as the current user
                    $users = User::where('role_id', 2)
                        ->where('parent_id', $user->id)
                        ->get();
                    $data = [];

                    // Format the data of other customers who meet the criteria
                    foreach ($users as $user) {
                        $data[] = [
                            'value' => (int) $user->user_id,
                            'label' => $user->name,
                            'parent_id' => $user->parent_id,
                        ];
                    }

                    // Return the formatted data of other customers as a JSON response
                    return response()->json([
                        'data' => $data
                    ]);
                }
            } else {
                // Fetch other customers with a parent ID or where parent ID is null and not in the list of parent IDs
                $users = User::where('role_id', 2)
                    ->where(function ($query) {
                        $query->whereNotNull('parent_id')
                            ->orWhereNull('parent_id');
                    })
                    ->whereNotIn('id', function ($query) {
                        $query->select('parent_id')
                            ->from('users')
                            ->whereNotNull('parent_id');
                    })
                    ->get();
                $data = [];

                // Format the data of other customers who meet the criteria
                foreach ($users as $user) {
                    $data[] = [
                        'value' => (int) $user->user_id,
                        'label' => $user->name,
                        'parent_id' => $user->parent_id,
                    ];
                }

                // Return the formatted data of other customers as a JSON response
                return response()->json([
                    'data' => $data
                ]);
            }
        } else {
            // If the user is not found, return an error as a JSON response
            return response()->json([
                'error' => 'User Not found',
            ]);
        }
    }
    public function searchUserByName($user_id)
    {
        $user = User::where('user_id', $user_id)->first();
        $test_user = "User";
        if ($user) {
            return response()->json(['user_name' => $user->name], 200);
        } else {
            return response()->json(['user_name' => $test_user], 200);
        }
    }
    public function getUsersWhoCanApprove()
    {
        $roles = [1,6, 9, 10];

        $users = User::whereIn('role_id', $roles)
            ->select('id', 'user_id', 'name')
            ->get();

        return response()->json($users);
    }
    public function getSafetyData($user_ids)
    {
        // Extract the user IDs from the array
        $ids = array_map(function ($user) {
            return $user['UserId'];
        }, $user_ids);

        $safeties = Safety::whereIn('debtor_id', $ids)->get();

        if ($safeties->isNotEmpty()) {
            return response()->json($safeties);
        } else {
            return response()->json([
                'error' => 'Users not found',
            ]);
        }
    }
    public function deleteFile(Request $request)
    {
        $fileNames = $request->input('file_names');

        if (!$fileNames || !is_array($fileNames)) {
            return response()->json(['message' => 'File names array not provided.'], 400);
        }

        $publicPath = public_path();
        $deletedFiles = [];
        $notFoundFiles = [];

        foreach ($fileNames as $fileName) {
            $filePath = $publicPath . '/'. "Invoices" . "/" . $fileName;

            if (File::exists($filePath)) {
                File::delete($filePath);
                $deletedFiles[] = $fileName;
            } else {
                $notFoundFiles[] = $fileName;
            }
        }

        return response()->json([
            'message' => 'Files deleted successfully.',
            'deleted_files' => $deletedFiles,
            'not_found_files' => $notFoundFiles,
        ]);
    }
}
