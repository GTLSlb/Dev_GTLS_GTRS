<?php

namespace App\Providers;

use App\Auth\CustomGuard;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\Http;

class CustomAuthServiceProvider extends ServiceProvider
{
    public function retrieveById($identifier)
    {
        return new GenericUser([
            'id' => $identifier,
            'email' => $identifier,
        ]);
    }

    public function retrieveByToken($identifier, $token)
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
    }

    public function retrieveByCredentials(array $credentials)
    {
        if (! array_key_exists('email', $credentials)) {
            return null;
        }

        // GenericUser is a class from Laravel Auth System
        return new GenericUser([
            'id' => $credentials['email'],
            'email' => $credentials['email'],
        ]);
    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        $email = $credentials['Email'];
        $password = $credentials['Password'];
   
        // Perform the validation logic here
        // Compare the provided credentials with the user's credentials
       
        if ($user['email'] == $email) {
            // && $user['pass'] === $password
            return true; // Validation successful
        }
   
        return false; // Validation failed
    }
}
