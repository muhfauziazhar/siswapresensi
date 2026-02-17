<?php

namespace App\Http\Requests\OrangTua;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreIzinRequest extends FormRequest
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
            'jenis' => ['required', 'in:izin,sakit'],
            'alasan' => ['required', 'string', 'max:500'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'bukti' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
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
            'jenis.required' => 'Jenis izin wajib dipilih.',
            'jenis.in' => 'Jenis izin harus izin atau sakit.',
            'alasan.required' => 'Alasan wajib diisi.',
            'alasan.string' => 'Alasan harus berupa teks.',
            'alasan.max' => 'Alasan maksimal 500 karakter.',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
            'tanggal_mulai.date' => 'Format tanggal mulai tidak valid.',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi.',
            'tanggal_selesai.date' => 'Format tanggal selesai tidak valid.',
            'tanggal_selesai.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'bukti.file' => 'Bukti harus berupa file.',
            'bukti.mimes' => 'Bukti harus berformat JPG, JPEG, PNG, atau PDF.',
            'bukti.max' => 'Ukuran bukti maksimal 2MB.',
        ];
    }
}
