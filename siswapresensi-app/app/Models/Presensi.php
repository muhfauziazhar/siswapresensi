<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presensi extends Model
{
    use HasFactory;

    protected $table = 'presensi';

    protected $fillable = [
        'siswa_id',
        'jadwal_id',
        'status',
        'tanggal',
        'qr_type',
        'marked_by',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function markedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    // Scopes
    public function scopeHariIni($query)
    {
        return $query->where('tanggal', now()->toDateString());
    }

    public function scopeViaQrGeneral($query)
    {
        return $query->where('qr_type', 'general');
    }

    public function scopeViaQrJadwal($query)
    {
        return $query->where('qr_type', 'jadwal');
    }
}
