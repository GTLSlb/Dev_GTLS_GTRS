<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FileControllerPO;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::delete('/delete-files',  [FileController::class, 'deleteFiles']);
Route::delete('/delete-files-PO',  [FileController::class, 'deleteFiles']);

Route::post('/upload', function (Request $request) {
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $fileName =time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('Invoices'), $fileName);

        return response()->json(['message' => 'File uploaded successfully','filename' => $fileName]);
    } else {
        return response()->json(['error' => 'No file uploaded'], 400);
    }
});

Route::post('/uploadlogo', function (Request $request) {
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $fileName =time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('AppLogo'), $fileName);

        return response()->json(['message' => 'File uploaded successfully','filename' => $fileName]);
    } else {
        return response()->json(['error' => 'No file uploaded'], 400);
    }
});

Route::post('/uploadPO', function (Request $request) {
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $fileName =time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('POs'), $fileName);

        return response()->json(['message' => 'File uploaded successfully','filename' => $fileName]);
    } else {
        return response()->json(['error' => 'No file uploaded'], 400);
    }
});

// Route::get('/users', [RegisteredUserController::class, 'getCurrentUserName'])->middleware(['auth', 'api']);
// Route::get('/user/{id}', [RegisteredUserController::class, 'getUserName']);
