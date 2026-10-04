<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class CountryController extends Controller
{
    public function index()
    {
        $allCountries = collect();

        $offset = 0;
        $limit = 100;

        do {
            $response = Http::withToken(
                config('services.rest_countries.api_key')
            )->withOptions([
                'force_ip_resolve' => 'v4',
            ])->get(
                'https://api.restcountries.com/countries/v5',
                [
                    'limit' => $limit,
                    'offset' => $offset,
                    'response_fields' => 'names.common,names.official,codes.alpha_2,region,flag.url_png',
                ]
            );

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Unable to fetch countries.',
                ], 502);
            }

            $data = $response->json('data');

            $countries = collect($data['objects'] ?? []);

            $allCountries = $allCountries->merge($countries);

            $more = $data['meta']['more'] ?? false;

            $offset += $limit;

        } while ($more);

        $countries = $allCountries
            ->map(function ($country) {
                return [
                    'country_code' => $country['codes']['alpha_2'],
                    'country_name' => $country['names']['common'],
                    'official_country_name' => $country['names']['official'],
                    'region' => $country['region'],
                    'flag_url' => $country['flag']['url_png'] ?? null,
                ];
            })
            ->sortBy('country_name')
            ->values();

        return response()->json([
            'data' => $countries,
        ]);
    }
}