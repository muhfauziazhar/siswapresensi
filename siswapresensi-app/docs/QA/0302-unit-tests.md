# Unit Testing - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Unit Testing SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi unit testing untuk SiswaPresensi, mencakup unit testing untuk backend (Laravel) dan frontend (React).

---

## 2. Backend Unit Tests (Laravel/PHPUnit)

### 2.1 Model Tests

#### User Model Test

```php
<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\OrangTua;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_role_attribute()
    {
        $user = User::factory()->create(['role' => 'guru']);
        $this->assertEquals('guru', $user->role);
    }

    public function test_user_can_be_siswa()
    {
        $siswa = Siswa::factory()->create();
        $this->assertInstanceOf(Siswa::class, $user->userable);
    }

    public function test_user_can_be_guru()
    {
        $guru = Guru::factory()->create();
        $this->assertInstanceOf(Guru::class, $guru->user->userable);
    }

    public function test_user_can_be_orang_tua()
    {
        $orangTua = OrangTua::factory()->create();
        $this->assertInstanceOf(OrangTua::class, $orangTua->user->userable);
    }

    public function test_user_password_is_hashed()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123')
        ]);

        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(password_verify('password123', $user->password));
    }

    public function test_user_scope_for_role()
    {
        User::factory()->create(['role' => 'admin']);
        User::factory()->create(['role' => 'guru']);
        User::factory()->create(['role' => 'siswa']);
        User::factory()->create(['role' => 'orang_tua']);

        $adminUsers = User::role('admin')->get();
        $guruUsers = User::role('guru')->get();
        $siswaUsers = User::role('siswa')->get();
        $orangTuaUsers = User::role('orang_tua')->get();

        $this->assertCount(1, $adminUsers);
        $this->assertCount(1, $guruUsers);
        $this->assertCount(1, $siswaUsers);
        $this->assertCount(1, $orangTuaUsers);
    }

    public function test_user_polymorphic_relationship()
    {
        $guru = Guru::factory()->create();
        $siswa = Siswa::factory()->create();
        $orangTua = OrangTua::factory()->create();

        $guru->user()->associate($guru);
        $siswa->user()->associate($siswa);
        $orangTua->user()->associate($orangTua);

        $this->assertInstanceOf(Guru::class, $guru->userable);
        $this->assertInstanceOf(Siswa::class, $siswa->userable);
        $this->assertInstanceOf(OrangTua::class, $orangTua->userable);
    }
}
```

#### Siswa Model Test

```php
<?php

namespace Tests\Unit\Models;

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Presensi;
use App\Models\Izin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiswaTest extends TestCase
{
    use RefreshDatabase;

    public function test_siswa_belongs_to_kelas()
    {
        $kelas = Kelas::factory()->create();
        $siswa = Siswa::factory()->create(['kelas_id' => $kelas->id]);

        $this->assertEquals($kelas->id, $siswa->kelas_id);
        $this->assertTrue($kelas->siswa->contains($siswa));
    }

    public function test_siswa_has_many_presensi()
    {
        $siswa = Siswa::factory()->create();
        Presensi::factory()->count(3)->create(['siswa_id' => $siswa->id]);

        $this->assertCount(3, $siswa->presensi);
    }

    public function test_siswa_belongs_to_orang_tua()
    {
        $siswa = Siswa::factory()->create();
        $orangTua = OrangTua::factory()->create();

        $siswa->orang_tua()->associate($orangTua);

        $this->assertEquals($orangTua->id, $siswa->orang_tua->id);
        $this->assertTrue($orangTua->siswa->contains($siswa));
    }

    public function test_siswa_has_full_name()
    {
        $siswa = Siswa::factory()->create([
            'nama_depan' => 'Ahmad',
            'nama_belakang' => 'Rizky'
        ]);

        $this->assertEquals('Ahmad Rizky', $siswa->nama_lengkap);
    }

    public function test_siswa_has_nis()
    {
        $siswa = Siswa::factory()->create(['nis' => '12345']);

        $this->assertEquals('12345', $siswa->nis);
    }

    public function test_siswa_has_status_aktif()
    {
        $siswa = Siswa::factory()->create(['status' => 'aktif']);
        $this->assertEquals('aktif', $siswa->status);
    }

    public function test_siswa_scope_aktif()
    {
        Siswa::factory()->create(['status' => 'aktif']);
        Siswa::factory()->create(['status' => 'non-aktif']);
        Siswa::factory()->create(['status' => 'aktif']);

        $aktifSiswa = Siswa::aktif()->get();
        $nonAktifSiswa = Siswa::nonAktif()->get();

        $this->assertCount(1, $aktifSiswa);
        $this->assertCount(1, $nonAktifSiswa);
    }
}
```

#### Presensi Model Test

```php
<?php

namespace Tests\Unit\Models;

use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\Jadwal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PresensiTest extends TestCase
{
    use RefreshDatabase;

    public function test_presensi_belongs_to_siswa()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $presensi = Presensi::factory()->create([
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id
        ]);

        $this->assertEquals($jadwal->id, $presensi->jadwal_id);
        $this->assertTrue($jadwal->presensi->contains($presensi));
    }

    public function test_presensi_belongs_to_jadwal()
    {
        $jadwal = Jadwal::factory()->create();
        $presensi = Presensi::factory()->count(3)->create([
            'jadwal_id' => $jadwal->id
        ]);

        $this->assertCount(3, $jadwal->presensi);
    }

    public function test_presensi_belongs_to_jadwal()
    {
        $jadwal = Jadwal::factory()->create();
        $presensi = Presensi::factory()->create([
            'jadwal_id' => $jadwal->id,
            'status' => 'hadir',
            'tanggal' => now()->toDateString()
        ]);

        $this->assertEquals($jadwal->id, $presensi->jadwal_id);
        $this->assertEquals('hadir', $presensi->status);
    }

    public function test_presensi_has_timestamps()
    {
        $presensi = Presensi::factory()->create([
            'tanggal' => now()->toDateString()
        ]);

        $this->assertNotNull($presensi->created_at);
        $this->assertNotNull($presensi->updated_at);
    }

    public function test_presensi_scope_hadir_ini()
    {
        $presensi = Presensi::factory()->create([
            'tanggal' => now()->toDateString()
        ]);

        $hariIniPresensi = Presensi::hariIni()->get();
        $this->assertCount(1, $hariIniPresensi);
    }
}
```

---

## 3. Service Tests

#### QR Code Service Test

```php
<?php

namespace Tests\Unit\Services;

use App\Services\QRCodeService;
use App\Models\Siswa;
use App\Models\Jadwal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QRCodeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $qrService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->qrService = app(QRCodeService::class);
    }

    public function test_generate_qr_code_for_siswa()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $qrCode = $this->qrService->generate($siswa, $jadwal);

        $this->assertIsString($qrCode);
        $this->assertNotEmpty($qrCode);
    }

    public function test_qr_code_contains_siswa_id()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $qrCode = $this->qrService->generate($siswa, $jadwal);
        $decoded = json_decode(base64_decode($qrCode), true);

        $this->assertEquals($siswa->id, $decoded['siswa_id']);
        $this->assertEquals($jadwal->id, $decoded['jadwal_id']);
    }

    public function test_qr_code_has_timestamp()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $qrCode = $this->qrService->generate($siswa, $jadwal);
        $decoded = json_decode(base64_decode($qrCode), true);

        $this->assertArrayHasKey('timestamp', $decoded);
        $this->assertGreaterThan($decoded['timestamp'], time());
    }

    public function test_validate_qr_code()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        // Generate QR code with valid timestamp
        $validData = [
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'timestamp' => now()->timestamp,
            'expiry' => now()->addHours(2)->timestamp
        ];
        $validQR = base64_encode(json_encode($validData));

        // Test valid QR code
        $this->assertTrue($this->qrService->validate($validQR));

        // Test expired QR code
        $expiredData = [
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'timestamp' => now()->subMinutes(10)->timestamp,
            'expiry' => now()->subMinutes(10)->timestamp
        ];
        $expiredQR = base64_encode(json_encode($expiredData));

        $this->assertFalse($this->qrService->validate($expiredQR));
    }
}
```

---

## 4. Helper Tests

#### Date Helper Test

```php
<?php

namespace Tests\Unit\Helpers;

use Tests\TestCase;

class DateHelperTest extends TestCase
{
    public function test_format_indonesian_date()
    {
        $date = '2024-02-16';
        $formatted = formatIndonesianDate($date);

        $this->assertEquals('16 Februari 2024', $formatted);
    }

    public function test_get_current_semester()
    {
        $semester = getCurrentSemester();

        $this->assertContains($semester, ['Ganjil', 'Genap']);
        $this->assertContains($semester, ['Genap']);
    }

    public function test_is_school_day()
    {
        $this->assertTrue(isSchoolDay(now()));
        $this->assertFalse(isSchoolDay(now()->addDayWeekend()));

        // Saturday
        $this->assertFalse(isSchoolDay(now()->modify('day', '+1 day')));
        // Sunday
        $this->assertFalse(isSchoolDay(now()->modify('day', '+6 days')));
    }

    public function test_calculate_time_diff()
    {
        $start = new Date('2024-02-16T08:00:00Z');
        $end = new Date('2024-02-16T10:00:00Z');

        $diff = calculateTimeDiff($start, $end);

        $this->assertEquals(2 * 60 * 60 * 1000, $diff);
    }
}
```

---

## 5. Running Unit Tests

### Backend Tests

```bash
# Run all unit tests
php artisan test --testsuite=Unit

# Run specific test file
php artisan test tests/Unit/Models/UserTest.php

# Run specific test method
php artisan test --filter test_user_has_role_attribute

# Run with coverage
php artisan test --coverage

# Run in parallel
php artisan test --parallel

# Run specific test
php artisan test --filter test_generate_qr_code

# Run with coverage
php artisan test --coverage
```

### Frontend Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test UserTest.test.jsx

# Run specific test
npm test --testNamePattern="renders QR code image"

# Run in watch mode
npm test --watch

# Run with coverage
npm test --coverage
```

---

## 6. Test Coverage Targets

| Module | Target | Current |
|--------|--------|----------|
| Models | 90% | Functions > 90% | - |
| Services | 90% | Functions > 90% | - |
| Controllers | 85% | - |
| Middleware | 85% | - |
| Helpers | 90% | Functions > 90% | - |

---

## 7. Best Practices

### Backend

- Use factories for test data
- Use RefreshDatabase trait for database tests
- Mock external dependencies (API, services)
- Test both success and failure scenarios
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Frontend

- Use React Testing Library over enzyme
- Test user behavior, not implementation details
- Mock API calls with MSW
- Test accessibility (a11y)
- Keep tests focused and maintainable

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
- [Accessibility Tests](./0307-accessibility-tests.md)
