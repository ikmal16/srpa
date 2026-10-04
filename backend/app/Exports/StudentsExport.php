<?php

namespace App\Exports;

use App\Models\Student;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentsExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Student::query()
            ->orderBy('id')
            ->get([
                'name',
                'matric_no',
                'program',
                'country_code',
                'country_name',
                'official_country_name',
                'region',
                'passport_expiry',
            ]);
    }

    public function headings(): array
    {
        return [
            'Name',
            'Matric No',
            'Program',
            'Country Code',
            'Country',
            'Official Country Name',
            'Region',
            'Passport Expiry',
        ];
    }
}