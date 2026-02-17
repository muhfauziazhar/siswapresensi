<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMapelRequest extends FormRequest
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
            'nama' => ['required', 'string', 'max:100'],
            'kode' => ['required', 'string', 'max:10', Rule::unique('mapel', 'kode')->ignore($this->route('mapel'))],
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
            'nama.required' => 'Nama mata pelajaran wajib diisi.',
            'nama.string' => 'Nama mata pelajaran harus berupa teks.',
            'nama.max' => 'Nama mata pelajaran maksimal 100 karakter.',
            'kode.required' => 'Kode mata pelajaran wajib diisi.',
            'kode.string' => 'Kode mata pelajaran harus berupa teks.',
            'kode.max' => 'Kode mata pelajaran maksimal 10 karakter.',
            'kode.unique' => 'Kode mata pelajaran sudah digunakan.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus aktif atau non aktif.',
        ];
    }
}
