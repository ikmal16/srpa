<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],

            'matric_no' => [
                'required',
                'string',
                'max:30',
                'unique:students,matric_no',
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