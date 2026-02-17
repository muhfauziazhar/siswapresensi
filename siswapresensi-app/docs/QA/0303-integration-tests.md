# Integration Testing - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Integration Testing SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi integration testing untuk SiswaPresensi, mencakup testing integrasi antar komponen dan API endpoints.

---

## 2. API Integration Tests

### 2.1 Authentication API Tests

```php
<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthAPITest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'guru@example.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'guru@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'token',
                     'user' => [
                         'id',
                         'email',
                         'role',
                         'name'
                     ]
                 ]);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'invalid@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials'
                 ]);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)
                         ->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Successfully logged out'
                 ]);
    }

    public function test_protected_route_requires_authentication()
    {
        $response = $this->getJson('/api/siswa');

        $response->assertStatus(401);
    }
}
```

### 2.2 Siswa API Tests

```php
<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiswaAPITest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->adminUser = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_get_all_siswa()
    {
        Siswa::factory()->count(5)->create();

        $response = $this->actingAs($this->adminUser)
                         ->getJson('/api/siswa');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    public function test_admin_can_create_siswa()
    {
        $kelas = Kelas::factory()->create();

        $response = $this->actingAs($this->adminUser)
                         ->postJson('/api/siswa', [
                             'nama_depan' => 'Ahmad',
                             'nama_belakang' => 'Rizky',
                             'nis' => '12345',
                             'kelas_id' => $kelas->id,
                             'status' => 'aktif'
                         ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Siswa created successfully'
                 ]);

        $this->assertDatabaseHasari('siswa', [
            'nama_depan' => 'Ahmad',
            'nama_belakang' => 'Rizky',
            'nis' => '12345'
        ]);
    }

    public function test_admin_can_update_siswa()
    {
        $siswa = Siswa::factory()->create();

        $response = $this->actingAs($this->adminUser)
                         ->putJson("/api/siswa/{$siswa->id}", [
                             'nama_depan' => 'Ahmad Updated',
                             'nama_belakang' => 'Rizky',
                             'nis' => '12345'
                         ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Siswa updated successfully'
                 ]);

        $this->assertDatabaseHas('siswa', [
            'id' => $siswa->id,
            'nama_depan' => 'Ahmad Updated'
        ]);
    }

    public function test_admin_can_delete_siswa()
    {
        $siswa = Siswa::factory()->create();

        $response = $this->actingAs($this->adminUser)
                         ->deleteJson("/api/siswa/{$siswa->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Siswa deleted successfully'
                 ]);

        $this->assertDatabaseMissing('siswa', [
            'id' => $siswa->id
        ]);
    }

    public function test_non_admin_cannot_access_siswa_api()
    {
        $guruUser = User::factory()->create(['role' => 'guru']);

        $response = $this->actingAs($guruUser)
                         ->getJson('/api/siswa');

        $response->assertStatus(403);
    }
}
```

### 2.3 Presensi API Tests

```php
<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Jadwal;
use App\Models\Presensi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PresensiAPITest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->adminUser = User::factory()->create(['role' => 'admin']);
    }

    public function test_siswa_can_mark_presensi_with_qr()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $qrData = base64_encode(json_encode([
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'timestamp' => now()->timestamp,
            'expiry' => now()->addHours(2)->timestamp
        ]));

        $response = $this->actingAs($siswa->user)
                         ->postJson('/api/presensi/scan', [
                             'qr_code' => $qrData
                         ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Presensi marked successfully'
                 ]);

        $this->assertDatabaseHas('presensi', [
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'status' => 'hadir'
        ]);
    }

    public function test_guru_can_mark_reverse_presensi()
    {
        $guru = User::factory()->create(['role' => 'guru']);
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $response = $this->actingAs($guru)
                         ->postJson('/api/presensi/reverse', [
                             'siswa_id' => $siswa->id,
                             'jadwal_id' => $jadwal->id,
                             'status' => 'tidak_hadir'
                         ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Reverse presensi marked successfully'
                 ]);

        $this->assertDatabaseHas('presensi', [
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'status' => 'tidak_hadir'
        ]);
    }

    public function test_admin_can_get_presensi_report()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();
        Presensi::factory()->count(5)->create([
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id
        ]);

        $response = $this->actingAs($this->adminUser)
                         ->getJson('/api/presensi/report', [
                             'siswa_id' => $siswa->id,
                             'start_date' => now()->subDays(7)->toDateString(),
                             'end_date' => now()->toDateString()
                         ]);

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    public function test_expired_qr_code_rejected()
    {
        $siswa = Siswa::factory()->create();
        $jadwal = Jadwal::factory()->create();

        $expiredQrData = base64_encode(json_encode([
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'timestamp' => now()->subMinutes(10)->timestamp,
            'expiry' => now()->subMinutes(10)->timestamp
        ]));

        $response = $this->actingAs($siswa->user)
                         ->postJson('/api/presensi/scan', [
                             'qr_code' => $expiredQrData
                         ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'QR code has expired'
                 ]);
    }
}
```

### 2.4 Izin API Tests

```php
<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Models\Siswa;
use App\Models\OrangTua;
use App\Models\Izin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IzinAPITest extends TestCase
{
    use RefreshDatabase;

    public function test_orang_tua_can_create_izin()
    {
        $siswa = Siswa::factory()->create();
        $orangTua = OrangTua::factory()->create();
        $siswa->orang_tua()->associate($orangTua);

        $response = $this->actingAs($orangTua->user)
                         ->postJson('/api/izin', [
                             'siswa_id' => $siswa->id,
                             'jenis' => 'sakit',
                             'tanggal_mulai' => now()->addDay()->toDateString(),
                             'tanggal_selesai' => now()->addDays(3)->toDateString(),
                             'alasan' => 'Demam tinggi',
                             'bukti' => 'base64_encoded_image'
                         ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Izin created successfully'
                 ]);

        $this->assertDatabaseHas('izin', [
            'siswa_id' => $siswa->id,
            'jenis' => 'sakit',
            'status' => 'pending'
        ]);
    }

    public function test_guru_can_approve_izin()
    {
        $guru = User::factory()->create(['role' => 'guru']);
        $izin = Izin::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($guru)
                         ->postJson("/api/izin/{$izin->id}/approve", [
                             'catatan' => 'Approved'
                         ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Izin approved successfully'
                 ]);

        $this->assertDatabaseHas('izin', [
            'id' => $izin->id,
            'status' => 'disetujui'
        ]);
    }

    public function test_guru_can_reject_izin()
    {
        $guru = User::factory()->create(['role' => 'guru']);
        $izin = Izin::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($guru)
                         ->postJson("/api/izin/{$izin->id}/reject", [
                             'catatan' => 'Tidak valid'
                         ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Izin rejected successfully'
                 ]);

        $this->assertDatabaseHas('izin', [
            'id' => $izin->id,
            'status' => 'ditolak'
        ]);
    }
}
```

---

## 3. Database Integration Tests

### 3.1 Transaction Tests

```php
<?php

namespace Tests\Feature\Database;

use App\Models\Siswa;
use App\Models\Presensi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_presensi_creation_rolls_back_on_error()
    {
        $this->expectException(\Exception::class);

        try {
            DB::transaction(function () {
                $siswa = Siswa::factory()->create();
                Presensi::factory()->create(['siswa_id' => $siswa->id]);
                throw new \Exception('Test error');
            });
        } catch (\Exception $e) {
            // Verify no records were created
            $this->assertDatabaseEmpty('siswa');
            $this->assertDatabaseEmpty('presensi');
            throw $e;
        }
    }

    public function test_multiple_operations_in_single_transaction()
    {
        DB::transaction(function () {
            $siswa = Siswa::factory()->create();
            Presensi::factory()->count(3)->create(['siswa_id' => $siswa->id]);
        });

        $this->assertDatabaseCount('siswa', 1);
        $this->assertDatabaseCount('presensi', 3);
    }
}
```

---

## 4. Running Integration Tests

```bash
# Run all integration tests
php artisan test --testsuite=Feature

# Run specific test file
php artisan test tests/Feature/API/SiswaAPITest.php

# Run specific test method
php artisan test --filter test_admin_can_create_siswa

# Run with coverage
php artisan test --coverage

# Run in parallel
php artisan test --parallel

# Run with verbose output
php artisan test --verbose
```

---

## 5. Test Data Setup

### 5.1 Database Seeders

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Jadwal;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::factory()->create([
            'email' => 'admin@siswapresensi.com',
            'role' => 'admin'
        ]);

        // Create classes
        $kelas = Kelas::factory()->count(5)->create();

        // Create students
        $siswa = Siswa::factory()->count(20)->create([
            'kelas_id' => $kelas->random()->id
        ]);

        // Create teachers
        $guru = Guru::factory()->count(5)->create();

        // Create schedules
        Jadwal::factory()->count(10)->create([
            'guru_id' => $guru->random()->id,
            'kelas_id' => $kelas->random()->id
        ]);
    }
}
```

---

## 6. Test Coverage Targets

| Module | Target | Current |
|--------|--------|----------|
| API Endpoints | 100% | - |
| Database Operations | 90% | - |
| Transactions | 100% | - |
| External Integrations | 80% | - |

---

## 7. Best Practices

- Use RefreshDatabase trait for database tests
- Use factories for test data
- Test both success and failure scenarios
- Test authorization and permissions
- Test validation rules
- Test edge cases
- Use descriptive test names
- Follow AAA pattern

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
