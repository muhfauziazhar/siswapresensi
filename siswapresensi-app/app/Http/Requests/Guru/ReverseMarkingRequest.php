<?php

namespace App\Http\Requests\Guru;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReverseMarkingRequest extends FormRequest
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
            'jadwal_id' => ['required', 'exists:jadwal,id'],
            'tanggal' => ['required', 'date'],
            'absensi' => ['required', 'array'],
            'absensi.*.siswa_id' => ['required', 'exists:siswa,id'],
            'absensi.*.status' => ['required', 'in:izin,sakit,alpha'],
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
            'jadwal_id.required' => 'Jadwal wajib dipilih.',
            'jadwal_id.exists' => 'Jadwal yang dipilih tidak valid.',
            'tanggal.required' => 'Tanggal wajib diisi.',
            'tanggal.date' => 'Format tanggal tidak valid.',
            'absensi.required' => 'Data absensi wajib diisi.',
            'absensi.array' => 'Data absensi harus berupa array.',
            'absensi.*.siswa_id.required' => 'Siswa wajib dipilih.',
            'absensi.*.siswa_id.exists' => 'Siswa yang dipilih tidak valid.',
            'absensi.*.status.required' => 'Status absensi wajib dipilih.',
            'absensi.*.status.in' => 'Status absensi harus izin, sakit, atau alpha.',
        ];
    }
}
