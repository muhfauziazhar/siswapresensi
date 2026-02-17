<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->foreignId('jadwal_id')->constrained('jadwal')->cascadeOnDelete();
            $table->string('status', 10);
            $table->date('tanggal');
            $table->string('qr_type', 10)->default('jadwal'); // 'jadwal' or 'general'
            $table->foreignId('marked_by')->constrained('users');
            $table->timestamp('marked_at')->useCurrent();
            $table->timestamps();

            $table->unique(['siswa_id', 'jadwal_id', 'tanggal']);
            $table->index('status');
            $table->index('tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensi');
    }
};
