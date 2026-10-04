<?php

namespace App\Exports;

use App\Models\Student;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RegionReportExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Student::query()
            ->selectRaw('region, COUNT(*) as total')
            ->groupBy('region')
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'region' => $item->region,
                    'students' => $item->total,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Region',
            'Number of Students',
        ];
    }
}