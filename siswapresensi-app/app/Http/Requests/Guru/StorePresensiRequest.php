<?php

namespace App\Http\Requests\Guru;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePresensiRequest extends FormRequest
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
            'siswa_id' => ['required', 'exists:siswa,id'],
            'jadwal_id' => ['required', 'exists:jadwal,id'],
            'status' => ['required', 'in:hadir,izin,sakit,alpha'],
            'tanggal' => ['required', 'date'],
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
            'siswa_id.required' => 'Siswa wajib dipilih.',
            'siswa_id.exists' => 'Siswa yang dipilih tidak valid.',
            'jadwal_id.required' => 'Jadwal wajib dipilih.',
            'jadwal_id.exists' => 'Jadwal yang dipilih tidak valid.',
            'status.required' => 'Status presensi wajib dipilih.',
            'status.in' => 'Status presensi harus hadir, izin, sakit, atau alpha.',
            'tanggal.required' => 'Tanggal wajib diisi.',
            'tanggal.date' => 'Format tanggal tidak valid.',
        ];
    }
}
