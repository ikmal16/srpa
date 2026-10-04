<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;

class ReportController extends Controller
{
    public function index()
    {
        $byCountry = Student::query()
            ->selectRaw(
                'country_name, country_code, flag_url, COUNT(*) as total'
            )
            ->groupBy('country_name', 'country_code', 'flag_url')
            ->orderByDesc('total')
            ->get()
            ->withoutAppends();

        $byRegion = Student::query()
            ->selectRaw('region, COUNT(*) as total')
            ->groupBy('region')
            ->orderByDesc('total')
            ->get()
            ->withoutAppends();
        
        $passportStats = [
            'expiring_soon' => Student::query()
                ->whereDate('passport_expiry', '>', now())
                ->whereDate('passport_expiry', '<=', now()->addDays(30))
                ->count(),

            'expired' => Student::query()
                ->whereDate('passport_expiry', '<', now())
                ->count(),
                ];

        return response()->json([
            'by_country' => $byCountry,
            'by_region' => $byRegion,
            'passport_stats' => $passportStats,
        ]);
    }
}