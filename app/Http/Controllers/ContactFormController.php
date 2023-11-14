<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Mail;

class ContactFormController extends Controller
{
    public function submitContactForm(Request $request)
    {
        
        // validate the form data
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email',
            'message' => 'required',
            'phone' => 'required',
            'attachment' => 'nullable|mimes:pdf|max:2048',
        ]);
    
        // store the uploaded PDF file, if any
        if ($request->hasFile('attachment')) {
            $pdf = $request->file('attachment');
            $pdfName = time() . '_' . $pdf->getClientOriginalName();
            $pdf->move(public_path('pdf'), $pdfName);
        } else {
            $pdfName = null;
        }
    
        // prepare the email data
        $data = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'message' => $request->input('message'),
            'pdf' => $pdfName,
        ];
    
        // send the email
        Mail::to('customerservice@gtls.com.au')->send(new ContactFormMail($data));
    
        // redirect the user with a success message
        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
}
