<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function deleteFiles(Request $request)
    {
        $filesToDelete = $request->input('fileNames'); // Array of file names to delete

        foreach ($filesToDelete as $fileName) {
            // Assuming the files are stored in the "public" disk
            Storage::disk('public')->delete('POs/' . $fileName);
        }

        return response()->json(['message' => 'Files deleted successfully']);
    }
}