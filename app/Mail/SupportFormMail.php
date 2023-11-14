<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SupportFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        $email = $this->view('emails.support-form')
        ->with([
            'subject' => $this->data['subject'],
            'name' => $this->data['name'],
            'email' => $this->data['email'],
            'message' => $this->data['message'],
        ]);

    // Attach the file if it exists
    if ($this->data['attachment']) {
        $file = public_path('uploads/' . $this->data['attachment']);
        $email->attach($file);
    }

    return $email;
    }
}