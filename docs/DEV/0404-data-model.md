# Data Model - SiswaPresensi

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'guru', 'siswa', 'orang_tua') NOT NULL,
    userable_type VARCHAR(50) NOT NULL,
    userable_id BIGINT UNSIGNED NOT NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_userable (userable_type, userable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Siswa Table

```sql
CREATE TABLE siswa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    nis VARCHAR(20) UNIQUE NOT NULL,
    nama_depan VARCHAR(100) NOT NULL,
    nama_belakang VARCHAR(100) NOT NULL,
    kelas_id BIGINT UNSIGNED NULL,
    orang_tua_id BIGINT UNSIGNED NULL,
    status ENUM('aktif', 'non_aktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL,
    FOREIGN KEY (orang_tua_id) REFERENCES orang_tua(id) ON DELETE SET NULL,
    INDEX idx_nis (nis),
    INDEX idx_status (status),
    INDEX idx_kelas (kelas_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Guru Table

```sql
CREATE TABLE guru (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_nip (nip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Orang Tua Table

```sql
CREATE TABLE orang_tua (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    nama VARCHAR(100) NOT NULL,
    telepon VARCHAR(20),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Kelas Table

```sql
CREATE TABLE kelas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tingkat VARCHAR(50) NOT NULL,
    status ENUM('aktif', 'non_aktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Mapel Table

```sql
CREATE TABLE mapel (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(10) UNIQUE NOT NULL,
    status ENUM('aktif', 'non_aktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Jadwal Table

```sql
CREATE TABLE jadwal (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kelas_id BIGINT UNSIGNED NOT NULL,
    mapel_id BIGINT UNSIGNED NOT NULL,
    guru_id BIGINT UNSIGNED NOT NULL,
    hari ENUM('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu') NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    status ENUM('aktif', 'non_aktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
    FOREIGN KEY (mapel_id) REFERENCES mapel(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE,
    INDEX idx_kelas (kelas_id),
    INDEX idx_guru (guru_id),
    INDEX idx_hari (hari),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Presensi Table

```sql
CREATE TABLE presensi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    jadwal_id BIGINT UNSIGNED NOT NULL,
    status ENUM('hadir', 'izin', 'sakit', 'alpha') NOT NULL,
    tanggal DATE NOT NULL,
    marked_by BIGINT UNSIGNED NOT NULL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    FOREIGN KEY (jadwal_id) REFERENCES jadwal(id) ON DELETE CASCADE,
    INDEX idx_siswa_jadwal_tanggal (siswa_id, jadwal_id, tanggal),
    INDEX idx_status (status),
    INDEX idx_tanggal (tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

### Izin Table

```sql
CREATE TABLE izin (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    jadwal_id BIGINT UNSIGNED NOT NULL,
    jenis ENUM('izin', 'sakit') NOT NULL,
    alasan TEXT NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    bukti_path VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at TIMESTAMP NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    FOREIGN KEY (jadwal_id) REFERENCES jadwal(id) ON DELETE CASCADE,
    INDEX idx_siswa_jadwal (siswa_id, jadwal_id),
    INDEX idx_status (status),
    INDEX idx_tanggal_mulai (tanggal_mulai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;
```

## Relationships

### User Polymorphic

User has polymorphic relationship with:
- Siswa (userable_type = 'siswa', userable_id = siswa.id)
- Guru (userable_type = 'guru', userable_id = guru.id)
- Orang Tua (userable_type = 'orang_tua', userable_id = orang_tua.id)

### Siswa Relationships

Siswa belongs to:
- Kelas (kelas_id)
- Orang Tua (orang_tua_id)

Siswa has many:
- Presensi (siswa_id)
- Izin (siswa_id)

### Guru Relationships

Guru has many:
- Jadwal (guru_id)

### Kelas Relationships

Kelas has many:
- Siswa (kelas_id)
- Jadwal (kelas_id)

### Mapel Relationships

Mapel has many:
- Jadwal (mapel_id)

### Jadwal Relationships

Jadwal belongs to:
- Kelas (kelas_id)
- Mapel (mapel_id)
- Guru (guru_id)

Jadwal has many:
- Presensi (jadwal_id)
- Izin (jadwal_id)

### Presensi Relationships

Presensi belongs to:
- Siswa (a)
- Jadwal (b)

### Izin Relationships

Izin belongs to:
- Siswa (siswa_id)
- Jadwal (jadwal_id)

---

## Laravel Models

### User Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOneOrMany;

class User extends Model
{
    protected $fillable = [
        'email',
        'password',
        'role',
        'userable_type',
        'userable_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Polymorphic relationship
    public function userable()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
```

### Siswa Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    protected $fillable = [
        'user_id',
        'nis',
        'nama_depan',
        'nama_belakang',
        'kelas_id',
        'orang_tua_id',
        'status',
    ];

    // Accessor for full name
    public function getNamaLengkapAttribute()
    {
        return "{$this->nama_depan} {$this->nama_belakang}";
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function orangTua()
    {
        return $this->belongsTo(OrangTua::class);
    }

    public function presensi()
    {
        return $this->hasMany(Presensi::class);
    }

    public function izin()
    {
        return $this->hasMany(Izin::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}
```

### Guru Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guru extends Model
{
    protected $fillable = [
        'user_id',
        'nip',
        'nama',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->whereHas('user', 'status', 'aktif');
    }
}
```

### OrangTua Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrangTua extends Model
{
    protected $fillable = [
        'user_id',
        'nama',
        'telepon',
        'alamat',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function anak()
    {
        return $this->hasMany(Siswa::class);
    }
}
```

### Kelas Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    protected $fillable = [
        'nama',
        'tingkat',
        'status',
    ];

    // Relationships
    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}
```

### Mapel Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mapel extends Model
{
    protected $fillable = [
        'nama',
        'kode',
        'status',
    ];

    // Relationships
    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}
```

### Jadwal Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jadwal extends Model
{
    protected $fillable = [
        'kelas_id',
        'mapel_id',
        'guru_id',
        'hari',
        'waktu_mulai',
        'waktu_selesai',
        'status',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime:H:i',
        'waktu_selesai' => 'datetime:H:i',
    ];

    // Relationships
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function presensi()
    {
        return $this->hasMany(Presensi::class);
    }

    public function izin()
    {
        return $this->hasMany(Izin::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeHariIni($query)
    {
        return $query->where('hari', strtolower(now()->englishDayOfWeek));
    }
}
```

### Presensi Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presensi extends Model
{
    protected $fillable = [
        'siswa_id',
        'jadwal_id',
        'status',
        'tanggal',
        'marked_by',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // Relationships
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class);
    }

    // Scopes
    public function scopeHadirIni($query)
    {
        return $query->where('tanggal', now()->toDateString());
    }
}
```

### Izin Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Izin extends Model
{
    protected $fillable = [
        'siswa_id',
        'jadwal_id',
        'jenis',
        'alasan',
        'tanggal_mulai',
        'tanggal_selesai',
        'bukti_path',
        'status',
        'reviewed_by',
        'catatan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    // Relationships
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
```

---

## Database Migrations

### Create Users Table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['admin', 'guru', 'siswa', 'orang_tua']);
            $table->string('userable_type');
            $table->unsignedBigInteger('userable_id');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
            $table->index('role');
            $table->index(['userable_type', 'userable_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
```

### Create Siswa Table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('nis', 20)->unique();
            $table->string('nama_depan', 100);
            $table->string('nama_belakang', 100);
            $table->unsignedBigInteger('kelas_id')->nullable();
            $table->unsignedBigInteger('orang_tua_id')->nullable();
            $table->enum('status', ['aktif', 'non_aktif'])->default('aktif');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('set null');
            $table->foreign('orang_tua_id')->references('id')->on('orang_tua')->onDelete('set null');
            $table->index('nis');
            $table->index('status');
            $table->index('kelas_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('siswa');
    }
}
```

---

## Data Seeding

### User Factory

```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password123'),
            'role' => $this->faker->randomElement(['admin', 'guru', 'siswa', 'orang_tua']),
            'userable_type' => $this->faker->randomElement(['siswa', 'guru', 'orang_tua']),
            'userable_id' => function (array $attributes) {
                return match($attributes['userable_type']) {
                    'siswa' => \App\Models\Siswa::factory()->create()->id,
                    'guru' => \App\Models\Guru::factory()->create()->id,
                    'orang_tua' => \App\Models\OrangTua::factory()->create()->id,
                };
            },
        ];
    }
}
```

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
