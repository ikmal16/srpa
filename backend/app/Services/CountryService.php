<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class CountryService
{
    public function findByCode(string $countryCode): array
    {
        $response = Http::withToken(config('services.rest_countries.api_key'))
            ->get(
                'https://api.restcountries.com/countries/v5/codes.alpha_2/'
                . strtoupper($countryCode),
                [
                    'response_fields' => 'names.common,names.official,codes.alpha_2,region,flag.url_png',
                ]
            );

        if ($response->failed()) {
            throw ValidationException::withMessages([
                'country_code' => ['The selected country code is invalid.'],
            ]);
        }

        $countries = $response->json('data.objects', []);

        if (empty($countries)) {
            throw ValidationException::withMessages([
                'country_code' => ['The selected country code is invalid.'],
            ]);
        }

        $country = $countries[0];

        return [
            'country_code' => $country['codes']['alpha_2'],
            'country_name' => $country['names']['common'],
            'official_country_name' => $country['names']['official'],
            'region' => $country['region'],
            'flag_url' => $country['flag']['url_png'] ?? null,
        ];
    }
}