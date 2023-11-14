<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactUsFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->view('emails.contactUs-form')
                    ->with([
                        'name' => $this->data['name'],
                        'company' => $this->data['company'],
                        'email' => $this->data['email'],
                        'phone' => $this->data['phone'],
                        'message' => $this->data['message'],
                    ]);
    }
}