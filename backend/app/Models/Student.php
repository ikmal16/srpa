<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Student extends Model
{
    protected $fillable = [
        'name',
        'matric_no',
        'program',
        'country_code',
        'country_name',
        'official_country_name',
        'region',
        'flag_url',
        'passport_expiry',
    ];

    protected function casts(): array
    {
        return [
            'passport_expiry' => 'date',
        ];
    }

    protected $appends = [
    'passport_status',
    ];

   public function getPassportStatusAttribute(): string
    {
        $expiry = Carbon::parse($this->passport_expiry);

        if ($expiry->isPast()) {
            return 'expired';
        }

        if ($expiry->lessThanOrEqualTo(now()->addDays(30))) {
            return 'expiring_soon';
        }

        return 'valid';
    }
}