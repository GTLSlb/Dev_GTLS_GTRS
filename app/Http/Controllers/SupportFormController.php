<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\SupportFormMail;
use Illuminate\Support\Facades\Mail;

class SupportFormController extends Controller
{
    public function submitSupportForm(Request $request)
    {
        // validate the form data
       $this->validate($request, [
        'subject' => 'required',
        'name' => 'required',
        'email' => 'required|email',
        'message' => 'required',
        // 'attachment' => 'sometimes|nullable|mimes:pdf,png,jpeg,jpg|max:2048',
    ]);

    // Store the uploaded file, if any
    if ($request->hasFile('attachment')) {
        $file = $request->file('attachment');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $fileName);
    } else {
        $fileName = null;
    }

    // Prepare the email data
    $data = [
        'subject' => $request->input('subject'),
        'name' => $request->input('name'),
        'email' => $request->input('email'),
        'message' => $request->input('message'),
        'attachment' => $fileName,
    ];
    
        // send the email
        Mail::to('ITSupport@gtls.com.au')->send(new SupportFormMail($data));
    
        // redirect the user with a success message
        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
}
