<?php

namespace App\Exports;

use App\Models\Student;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CountryReportExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Student::query()
            ->selectRaw('country_name, COUNT(*) as total')
            ->groupBy('country_name')
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'country' => $item->country_name,
                    'students' => $item->total,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Country',
            'Number of Students',
        ];
    }
}