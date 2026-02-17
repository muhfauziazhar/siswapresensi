<?php

namespace Tests\Feature\Admin;

use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JadwalFilterTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['role' => 'admin']);
        
        // Create necessary data
        $this->kelas1 = Kelas::factory()->create(['nama' => 'X-A']);
        $this->kelas2 = Kelas::factory()->create(['nama' => 'XI-B']);
        
        $this->guru1 = Guru::factory()->create(['nama' => 'Guru A']);
        $this->guru2 = Guru::factory()->create(['nama' => 'Guru B']);
        
        $this->mapel = Mapel::factory()->create();
    }

    public function test_can_filter_jadwal_by_kelas()
    {
        Jadwal::factory()->create([
            'kelas_id' => $this->kelas1->id,
            'mapel_id' => $this->mapel->id,
            'guru_id' => $this->guru1->id,
            'hari' => 'senin'
        ]);
        
        Jadwal::factory()->create([
            'kelas_id' => $this->kelas2->id,
            'mapel_id' => $this->mapel->id,
            'guru_id' => $this->guru2->id,
            'hari' => 'u'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.jadwal.index', ['kelas_id' => $this->kelas1->id]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('jadwal.data', 1)
                ->where('jadwal.data.0.kelas_id', $this->kelas1->id)
                ->where('filters.kelas_id', (string) $this->kelas1->id)
            );
    }

    public function test_can_filter_jadwal_by_guru()
    {
        Jadwal::factory()->create([
            'kelas_id' => $this->kelas1->id,
            'mapel_id' => $this->mapel->id,
            'guru_id' => $this->guru1->id,
            'hari' => 'senin'
        ]);
        
        Jadwal::factory()->create([
            'kelas_id' => $this->kelas2->id,
            'mapel_id' => $this->mapel->id,
            'guru_id' => $this->guru2->id,
            'hari' => 'selasa'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.jadwal.index', ['guru_id' => $this->guru1->id]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('jadwal.data', 1)
                ->where('jadwal.data.0.guru_id', $this->guru1->id)
            );
    }

    public function test_calendar_view_returns_all_data()
    {
        // Create 20 schedules (more than default pagination 15)
        Jadwal::factory()->count(20)->create([
            'kelas_id' => $this->kelas1->id,
            'mapel_id' => $this->mapel->id,
            'guru_id' => $this->guru1->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.jadwal.index', ['view_mode' => 'calendar']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('jadwal', 20) // Should be array of 20, not paginated object
                ->where('filters.view_mode', 'calendar')
            );
    }
}
