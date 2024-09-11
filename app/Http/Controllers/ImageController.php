<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ImageController extends Controller
{
    public function showProfileImage(Request $request)
    {
        $filename = $request->input('filename');
        $disk = Storage::disk('s3');
        $path = "userProfiles/{$filename}";

        if (!$disk->exists($path)) {
            abort(404);
        }

        $file = $disk->get($path); // Get the file contents
        $contentType = $disk->mimeType($path); // Get the file MIME type

        return response($file, 200)
            ->header('Content-Type', $contentType)
            ->header('Content-Disposition', 'inline; filename="' . basename($path) . '"');
    }

    public function showAppLogo(Request $request)
    {
        $filename = $request->input('filename');
        $disk = Storage::disk('s3');
        $path = "appLogos/{$filename}";

        if (!$disk->exists($path)) {
            abort(404);
        }

        $file = $disk->get($path); // Get the file contents
        $contentType = $disk->mimeType($path); // Get the file MIME type

        return response($file, 200)
            ->header('Content-Type', $contentType)
            ->header('Content-Disposition', 'inline; filename="' . basename($path) . '"');
    }
}
