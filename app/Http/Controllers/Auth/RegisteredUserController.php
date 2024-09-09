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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

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
    public function getCurrentUserName(Request $request)
    {

        if ($request->session()->get('user')!=null) {

            //$user = $request->session()->get('user');
            //dd($request->session()->getId());
            $sessionId = $request->session()->getId();

            // Query the database to get the user based on the session ID
            $user = DB::table('custom_sessions')
                ->where('id', $sessionId)
                ->value('user');

            // Assuming the 'user' column contains JSON-encoded user data
            $user = json_decode($user);
            if($user->TypeId == 1) // the user is a customer
            {
                $UserId = $user->UserId;
                $TypeId = $user->TypeId;
                $TypeName =$user->TypeName;
                $OwnerId = $user->OwnerId;
                // $GroupId = $user->GroupId;
                $GroupName = $user->GroupName;
                $Username = $user->Username;
                $Email = $user->Email;
                $CustomerName = $user->CustomerName;
                $user = array (
                    'UserId' => $UserId,
                    'TypeId' => $TypeId,
                    'TypeName' => $TypeName,
                    'OwnerId' => $OwnerId,
                    // 'GroupId' => $GroupId,
                    'GroupName' => $GroupName,
                    'Username' => $Username,
                    'Email' => $Email,
                    'CustomerName' => $CustomerName,
                );
            }else if($user->TypeId == 2) // the user is an employee
            {
                $UserId = $user->UserId;
                $UniqueId = $user->UniqueId;
                $TypeId = $user->TypeId;
                $TypeName =$user->TypeName;
                $OwnerId = $user->OwnerId;
                // $GroupId = $user->GroupId;
                $Username = $user->Username;
                $FirstName = $user->FirstName;
                $LastName = $user->LastName;
                $Email = $user->Email;
                $PhoneNo = $user->PhoneNo;
                $Dob = $user->Dob;
                $Address = $user->Address;
                $Picture = $user->Picture;
                $NationalityId = $user->NationalityId;
                $NationalityName = $user->NationalityName;
                $BranchId = $user->BranchId;
                $RoleId = $user->RoleId;
                $RoleName = $user->RoleName;
                $ReportToId = $user->ReportToId;
                $ReportToName = $user->ReportToName;
                $HiringDate = $user->HiringDate;
                $StateId = $user->StateId;
                $StateName = $user->StateName;
               // $Applications = $user->Applications;
                $user = array (
                    'UserId' => $UserId,
                    'UniqueId' => $UniqueId,
                    'TypeId' => $TypeId,
                    'TypeName' => $TypeName,
                    'OwnerId' => $OwnerId,
                    // 'GroupId' => $GroupId,
                    'Username' => $Username,
                    'FirstName' => $FirstName,
                    'LastName' => $LastName,
                    'Email' => $Email,
                    'PhoneNo' => $PhoneNo,
                    'Dob' => $Dob,
                    'Address' => $Address,
                    'Picture' => $Picture,
                    'NationalityId' => $NationalityId,
                    'NationalityName' => $NationalityName,
                    'BranchId' => $BranchId,
                    'RoleId' => $RoleId,
                    'RoleName' => $RoleName,
                    'ReportToId' => $ReportToId,
                    'ReportToName' => $ReportToName,
                    'HiringDate' => $HiringDate,
                    'StateId' => $StateId,
                    'StateName' => $StateName,
                );
            }
            else{ // the user is a driver
                $UserId = $user->UserId;
                $TypeId = $user->TypeId;
                $TypeName =$user->TypeName;
                $Username = $user->Username;
                $Email = $user->Email;
                $truckNbr = $user->truckNbr;
                $location = $user->location;
                $driverNbr = $user->driverNbr;
                $phoneNbr = $user->phoneNbr;
                $user = array (
                    'UserId' => $UserId,
                    'TypeId' => $TypeId,
                    'TypeName' => $TypeName,
                    'truckNbr' => $truckNbr,
                    'location' => $location,
                    'driverNbr' => $driverNbr,
                    'Username' => $Username,
                    'Email' => $Email,
                    'phoneNbr' => $phoneNbr,
                );
            }




            return response()->json($user);
        } else {
            return response();
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
