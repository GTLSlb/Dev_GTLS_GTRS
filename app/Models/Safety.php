<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Safety extends Model
{
    use HasApiTokens;
    protected $casts = [
        'date' => 'date',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    protected static function boot()
    {
        parent::boot();
        
        static::saving(function ($model) {
            if ($model->user_id) {
                $user = User::findOrFail($model->user_id);
                $model->debtor_id = $user->user_id;
            }
        });
    }
    use HasFactory;
}
