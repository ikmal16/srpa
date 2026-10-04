<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Services\CountryService;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Imports\StudentsImport;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{

    private CountryService $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }
   public function index()
    {
        $search = request('search');

        return Student::query()
            ->when($search, function ($query) use ($search) {
                $search = trim($search);

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('matric_no', 'like', "%{$search}%")
                        ->orWhere('program', 'like', "%{$search}%")
                        ->orWhere('country_name', 'like', "%{$search}%");

                    if (strcasecmp($search, 'Tamat') === 0) {
                        $q->orWhereDate('passport_expiry', '<', now());
                    }

                    if (strcasecmp($search, 'Akan Tamat') === 0) {
                        $q->orWhere(function ($statusQuery) {
                            $statusQuery
                                ->whereDate('passport_expiry', '>', now())
                                ->whereDate(
                                    'passport_expiry',
                                    '<=',
                                    now()->addDays(30)
                                );
                        });
                    }

                    if (strcasecmp($search, 'Sah') === 0) {
                        $q->orWhereDate(
                            'passport_expiry',
                            '>',
                            now()->addDays(30)
                        );
                    }
                });
            })
            ->orderBy('id', 'desc')
            ->paginate(10);
    }

    public function store(StoreStudentRequest $request)
    {
        $data = $request->validated();

        $country = $this->countryService->findByCode(
            $data['country_code']
        );

        $student = Student::create([
            'name' => $data['name'],
            'matric_no' => $data['matric_no'],
            'program' => $data['program'],

            'country_code' => $country['country_code'],
            'country_name' => $country['country_name'],
            'official_country_name' => $country['official_country_name'],
            'region' => $country['region'],
            'flag_url' => $country['flag_url'],

            'passport_expiry' => $data['passport_expiry'],
        ]);
    
        return response()->json([
            'message' => 'Student created successfully.',
            'data' => $student,
        ], 201);
    }
    public function show(Student $student)
    {
        return response()->json([
            'data' => $student,
        ]);
    }

   public function update(UpdateStudentRequest $request, Student $student)
    {
        $data = $request->validated();

        $country = $this->countryService->findByCode(
            $data['country_code']
        );

        $student->update([
            'name' => $data['name'],
            'matric_no' => $data['matric_no'],
            'program' => $data['program'],

            'country_code' => $country['country_code'],
            'country_name' => $country['country_name'],
            'official_country_name' => $country['official_country_name'],
            'region' => $country['region'],
            'flag_url' => $country['flag_url'],

            'passport_expiry' => $data['passport_expiry'],
        ]);

        return response()->json([
            'message' => 'Student updated successfully.',
            'data' => $student->fresh(),
        ]);
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.',
        ]);
    }

    public function import(Request $request)
{
    $request->validate([
        'file' => [
            'required',
            'file',
            'mimes:xlsx,xls,csv',
            'max:5120',
        ],
    ]);

    Excel::import(
        new StudentsImport($this->countryService),
        $request->file('file')
    );

    return response()->json([
        'message' => 'Students imported successfully.',
    ]);
}
}