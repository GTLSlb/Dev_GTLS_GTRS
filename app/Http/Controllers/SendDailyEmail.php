<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactUsFormMail;
use Illuminate\Support\Facades\Mail;

class SendDailyEmail extends Controller
{
    public function SendEmail(Request $request)
    {
        $dataArray = $request->all();
    dd($dataArray);
        // redirect the user with a success message
        return response()->json(['message' => 'Data received successfully']);
    }
}
