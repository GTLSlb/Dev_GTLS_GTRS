<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    // public function deleteFiles(Request $request)
    // {
    //     $filenames = $request->input('filenames', []);

    //     $deletedFiles = [];

    //     foreach ($filenames as $filename) {
    //         $filePath = public_path("files/Invoices/{$filename}");
    //         if (File::exists($filePath)) {
    //             File::delete($filePath);
    //             $deletedFiles[] = $filename;
    //         }
    //     }

    //     return response()->json(['message' => 'Files deleted successfully']);
    // }
    public function deleteFile($filename)
{
    // Delete a file from the 'public' disk
    Storage::disk('public')->delete($filename);

    return "File $filename has been deleted.";
}
}