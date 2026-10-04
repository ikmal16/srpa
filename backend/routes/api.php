<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ReportController;
use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\Api\CountryController;
use App\Exports\StudentDistributionReportExport;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('reports/export', function () {
    return Excel::download(
        new StudentDistributionReportExport,
        'student_distribution_report.xlsx'
    );
    })->middleware('role:pegawai,pensyarah');

    Route::get('countries', [CountryController::class, 'index'])
    ->middleware('role:pegawai,pensyarah');
    
    Route::get('students/export', function () {
    return Excel::download(
        new StudentsExport,
        'students.xlsx'
    );
    })->middleware('role:pegawai,pensyarah');

    Route::get('students/export/csv', function () {
        return Excel::download(
            new StudentsExport,
            'students.csv',
            \Maatwebsite\Excel\Excel::CSV
        );
    })->middleware('role:pegawai,pensyarah');

    Route::get('reports', [ReportController::class, 'index'])
    ->middleware('role:pegawai,pensyarah');

    // Pegawai + Pensyarah: view and search
    Route::get('students', [StudentController::class, 'index'])
        ->middleware('role:pegawai,pensyarah');

    Route::post('students/import', [StudentController::class, 'import'])
        ->middleware('role:pegawai');

    Route::get('students/{student}', [StudentController::class, 'show'])
        ->middleware('role:pegawai,pensyarah');

    // Pegawai only: create, update, delete
    Route::post('students', [StudentController::class, 'store'])
        ->middleware('role:pegawai');

    Route::put('students/{student}', [StudentController::class, 'update'])
        ->middleware('role:pegawai');

    Route::patch('students/{student}', [StudentController::class, 'update'])
        ->middleware('role:pegawai');

    Route::delete('students/{student}', [StudentController::class, 'destroy'])
        ->middleware('role:pegawai');
});