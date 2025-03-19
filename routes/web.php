<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SupportFormController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SendDailyEmail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use App\Http\Controllers\ImageController;
use gtls\loginstory\LoginClass;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return Inertia::render('Layout');
})->middleware(['custom.auth'])->name('Main');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('forgot.password');

Route::post('/loginComp', [ LoginClass::class, 'login'])->name('loginComp');

Route::get('/auth/azure/callback', [LoginClass::class, 'handleCallback'])->name('azure.callback');

Route::post('/microsoftToken', [LoginClass::class, 'sendToken'])->name('azure.token');

Route::post('/composerLogout', [ LoginClass::class, 'logout'])->middleware(['custom.auth'])->name('composerLogout');

Route::post('/logoutWithoutReq', [ LoginClass::class, 'logoutWithoutRequest'])->middleware(['custom.auth'])->name('composerLogoutWithoutReq');

Route::get('/gtrs/dashboard', function () {
    return Inertia::render('Layout');
})->middleware(['custom.auth'])->name('layout');

Route::redirect('/', '/gtrs/main');

Route::get('/gtrs/main', function () {
    return Inertia::render('Layout');
})->middleware(['custom.auth'])->name('landing.page');


Route::get('/gtam', function () {
    return Inertia::render('GTAM');
})->middleware(['custom.auth'])->name('gtam');

Route::post('/support', [SupportFormController::class, 'submitSupportForm'])->name('support.submit');

Route::post('/sendemail', [SendDailyEmail::class, 'SendEmail']);

// Route::post('/saveImg', [NewUserController::class, 'storePic']);

Route::post('/upload', function (Request $request) {
    if($request->hasFile('file')){
        $file = $request->file('file');
    $fileName = $file->getClientOriginalName();
    $destinationPath = public_path('userImgs');
    if (file_exists($destinationPath . '/' . $fileName)) {
        return response()->json(['message' => 'File already exists']);
    } else {
        $file->move($destinationPath, $fileName);
        return response()->json(['message' => 'File uploaded successfully', 'filename' => $fileName]);
    }
    }
});

Route::get('/downloadGTLS-docx', function () {
    $pathToFile = public_path('docs/Gold-Tiger-Capability-Statement-2020-12-24.pdf');
    $headers = array(
        'Content-Type: application/docx',
    );
    return response()->download($pathToFile, 'Gold-Tiger-Capability-Statement-2020-12-24.pdf', $headers);
});

Route::get('/checkAuth', [AuthenticatedSessionController::class, 'checkAuth']);

Route::middleware('custom.auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/users', [RegisteredUserController::class, 'getCurrentUserName'])->name('/gtms');
    Route::get('/childrens/{id}', [RegisteredUserController::class, 'getChildrens']);
    Route::get('/childrenlist/{id}', [RegisteredUserController::class, 'getChildrensList']);
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/user/{id}', [RegisteredUserController::class, 'getUserName']);
    Route::get('/safety/{user_id}', [RegisteredUserController::class, 'getSafetyData']);
    Route::get('/findUserById/{user_id}', [RegisteredUserController::class, 'searchUserByName']);
    Route::get('/getUsersWhoCanApprove', [RegisteredUserController::class, 'getUsersWhoCanApprove']);
    Route::delete('/delete-file', [RegisteredUserController::class, 'deleteFile']);
    Route::post('/auth/azure', function () {
        return Socialite::driver('azure')->redirect();
    })->name('azure.login');
    Route::get('/{path?}', function (Request $request) {
        return Inertia::render('Layout');
    })->where('path', '.*');
});

Route::post('/getAppLogo', [ImageController::class, 'showAppLogo'])->name('logo.show');

Route::get('/session-data', function () {
    return response()->json(['userr' => session('userr')]);
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage', [
        // Add any data you want to pass to the React component
    ]);
});


require __DIR__ . '/auth.php';
