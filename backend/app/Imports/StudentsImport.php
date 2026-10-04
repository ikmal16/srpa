<?php

namespace App\Imports;

use App\Models\Student;
use App\Services\CountryService;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToModel, WithHeadingRow
{
    public function __construct(
        private CountryService $countryService
    ) {
    }

    public function model(array $row): Model|null
    {
        // Skip duplicate matric numbers
        if (Student::where('matric_no', $row['matric_no'])->exists()) {
            return null;
        }

        $country = $this->countryService->findByCode(
            $row['country_code']
        );

        return new Student([
            'name' => $row['name'],
            'matric_no' => $row['matric_no'],
            'program' => $row['program'],
            'country_code' => $country['country_code'],
            'country_name' => $country['country_name'],
            'official_country_name' => $country['official_country_name'],
            'region' => $country['region'],
            'flag_url' => $country['flag_url'],
            'passport_expiry' => $row['passport_expiry'],
        ]);
    }
}