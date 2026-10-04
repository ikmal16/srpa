<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class StudentDistributionReportExport implements Export, WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'By Country' => new CountryReportExport(),
            'By Region' => new RegionReportExport(),
        ];
    }
}