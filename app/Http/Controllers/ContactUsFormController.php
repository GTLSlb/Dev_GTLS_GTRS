<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactUsFormMail;
use Illuminate\Support\Facades\Mail;

class ContactUsFormController extends Controller
{
    public function submitContactUSForm(Request $request)
    {
        
        // validate the form data
        $this->validate($request, [
            'name' => 'required',
            'company' => 'required',
            'email' => 'required|email',
            'message' => 'required',
            'phone' => 'required',
        ]);
    
        // store the uploaded PDF file, if any
        // if ($request->hasFile('attachment')) {
        //     $pdf = $request->file('attachment');
        //     $pdfName = time() . '_' . $pdf->getClientOriginalName();
        //     $pdf->move(public_path('pdf'), $pdfName);
        // } else {
        //     $pdfName = null;
        // }
    
        // prepare the email data
        $data = [
            'name' => $request->input('name'),
            'company' => $request->input('company'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'message' => $request->input('message'),
            // 'pdf' => $pdfName,
        ];
    
        // send the email
        Mail::to('customerservice@gtls.com.au')->send(new ContactUsFormMail($data));
    
        // redirect the user with a success message
        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
}
