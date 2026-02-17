<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateKelasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:50'],
            'tingkat' => ['required', 'string', 'max:10'],
            'status' => ['required', 'in:aktif,non_aktif'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama kelas wajib diisi.',
            'nama.string' => 'Nama kelas harus berupa teks.',
            'nama.max' => 'Nama kelas maksimal 50 karakter.',
            'tingkat.required' => 'Tingkat wajib diisi.',
            'tingkat.string' => 'Tingkat harus berupa teks.',
            'tingkat.max' => 'Tingkat maksimal 10 karakter.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus aktif atau non aktif.',
        ];
    }
}
