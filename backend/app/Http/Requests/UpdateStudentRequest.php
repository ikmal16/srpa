<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    $student = $this->route('student');

    return [
        'name' => ['required', 'string', 'max:150'],

        'matric_no' => [
            'required',
            'string',
            'max:30',
            Rule::unique('students', 'matric_no')->ignore($student->id),
        ],

        'program' => ['required', 'string', 'max:150'],

        'country_code' => [
            'required',
            'string',
            'max:10',
        ],

        'passport_expiry' => [
            'required',
            'date',
        ],
    ];
}
}