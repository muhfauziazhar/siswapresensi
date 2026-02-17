# Coding Standards - SiswaPresensi

> Standar ini berlaku untuk semua kode di project `siswapresensi-app`.
> Backend: Laravel 12 + PHP 8.2+ | Frontend: React 19 + TypeScript 5.7+

---

## PHP Standards

### PSR-12 Compliance (via Laravel Pint)

- Class names: `PascalCase`
- Method names: `camelCase`
- Constants: `UPPER_CASE`
- Variables: `camelCase`
- File names: `PascalCase`

**Linting command:**
```bash
# Format semua file PHP
composer lint          # pint --parallel

# Check tanpa modify
composer test:lint     # pint --parallel --test
```

### Laravel Best Practices

#### Controllers (Inertia Pattern)

- Gunakan `Inertia::render()` untuk mengembalikan pages, **bukan** `response()->json()`
- Gunakan form requests untuk validasi
- Gunakan authorization middleware
- Keep controllers thin (business logic di services)

```php
<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Http\Requests\PresensiRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PresensiController extends Controller
{
    public function index(PresensiRequest $request): Response
    {
        $presensi = Presensi::with(['siswa', 'jadwal'])
            ->where('jadwal_id', $request->jadwal_id)
            ->paginate(20);

        return Inertia::render('presensi/guru-presensi', [
            'presensi' => $presensi,
        ]);
    }

    public function store(PresensiRequest $request): RedirectResponse
    {
        Presensi::create($request->validated());

        return redirect()->route('presensi.index')
            ->with('success', 'Presensi berhasil dicatat.');
    }
}
```

#### Models

- Use Eloquent ORM
- Define `$fillable` (never use `$guarded = []`)
- Use typed relationships dan return types
- Use `$casts` untuk type casting
- Use scopes untuk reusable queries

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Presensi extends Model
{
    protected $fillable = [
        'siswa_id',
        'jadwal_id',
        'status',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal(): BelongsTo
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

#### Services

- Keep services stateless
- Use dependency injection
- Return typed values
- Log meaningful events

```php
<?php

namespace App\Services;

use App\Models\Siswa;
use App\Models\Jadwal;
use Illuminate\Support\Facades\Log;

class QRCodeService
{
    public function generate(Siswa $siswa, Jadwal $jadwal): string
    {
        $data = [
            'siswa_id' => $siswa->id,
            'jadwal_id' => $jadwal->id,
            'timestamp' => now()->timestamp,
            'expiry' => now()->addHours(2)->timestamp,
        ];

        $qrCode = base64_encode(json_encode($data));

        Log::info("QR code generated for siswa: {$siswa->nama_lengkap}");

        return $qrCode;
    }

    public function validate(string $qrCode): bool
    {
        $data = json_decode(base64_decode($qrCode), true);

        if (! $data) {
            return false;
        }

        if (! isset($data['expiry']) || $data['expiry'] < now()->timestamp) {
            return false;
        }

        return true;
    }
}
```

#### Fortify Actions

Customization logic untuk authentication ada di `app/Actions/Fortify/`:

```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);
    }
}
```

---

## TypeScript / React Standards

### Language: TypeScript (Mandatory)

Semua file frontend menggunakan TypeScript (`.tsx` / `.ts`). Tidak diperbolehkan menggunakan `.jsx` / `.js` untuk komponen baru.

### Naming Conventions

- Components: `PascalCase` (file: `kebab-case.tsx`)
- Hooks: `use` prefix, `camelCase` (file: `use-presensi.ts`)
- Utilities: `camelCase` (file: `kebab-case.ts`)
- Constants: `UPPER_CASE`
- Types/Interfaces: `PascalCase`

### Type Import Convention

Gunakan separate type imports (enforced by ESLint):

```tsx
// ✅ Correct
import type { User, Presensi } from '@/types';
import { router } from '@inertiajs/react';

// ❌ Wrong — inline type imports
import { type User, router } from '@inertiajs/react';
```

### Component Standards

- Use functional components (no class components)
- Define props dengan TypeScript interface
- Gunakan `cn()` helper untuk conditional class names
- Ikuti shadcn/ui pattern untuk komponen UI

```tsx
import { cn } from '@/lib/utils';

interface QRCodeDisplayProps {
    qrCode: string | null;
    siswa: {
        id: number;
        nama_depan: string;
        nama_belakang: string;
        nis: string;
    };
    className?: string;
}

export function QRCodeDisplay({ qrCode, siswa, className }: QRCodeDisplayProps) {
    if (!qrCode) {
        return <div>Loading...</div>;
    }

    return (
        <div className={cn('space-y-4 rounded-lg border p-6', className)}>
            <img
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code"
                className="mx-auto h-48 w-48"
            />
            <div className="text-center">
                <h3 className="font-semibold">
                    {siswa.nama_depan} {siswa.nama_belakang}
                </h3>
                <p className="text-muted-foreground text-sm">NIS: {siswa.nis}</p>
            </div>
        </div>
    );
}
```

### Hook Standards

- Use `use` prefix
- Return typed values
- Handle loading dan error states

```tsx
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface UsePresensiReturn {
    presensi: Presensi[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function usePresensi(jadwalId: number): UsePresensiReturn {
    const [presensi, setPresensi] = useState<Presensi[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPresensi = () => {
        setLoading(true);
        setError(null);

        router.get(
            `/presensi/jadwal/${jadwalId}`,
            {},
            {
                onSuccess: (page) => {
                    setPresensi(page.props.presensi as Presensi[]);
                },
                onError: () => {
                    setError('Failed to fetch presensi');
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    useEffect(() => {
        fetchPresensi();
    }, [jadwalId]);

    return { presensi, loading, error, refetch: fetchPresensi };
}
```

### Utility Standards

- Keep utility functions pure
- Use TypeScript types
- Export named (no default exports untuk utils)

```tsx
/**
 * Format date to Indonesian format
 */
export function formatIndonesianDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
}
```

---

## File Organization

### Backend Structure

```
app/
├── Actions/
│   └── Fortify/             # Auth customization
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Concerns/                # Shared traits
├── Services/
└── Providers/
```

### Frontend Structure

```
resources/js/
├── pages/                   # Inertia pages (route targets)
│   ├── auth/
│   ├── settings/
│   └── dashboard.tsx
├── components/              # Shared components
│   ├── ui/                  # Radix UI primitives (shadcn/ui)
│   └── ...                  # App-specific components
├── layouts/                 # Page layouts
│   ├── app-layout.tsx
│   └── auth-layout.tsx
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions (cn, etc.)
├── types/                   # TypeScript type definitions
├── actions/                 # Wayfinder generated actions
├── routes/                  # Wayfinder generated routes
├── wayfinder/               # Wayfinder generated types
├── app.tsx                  # App entry point
└── ssr.tsx                  # SSR entry point
```

---

## Linting & Formatting

### Backend (Laravel Pint)

```bash
# Auto-fix semua PHP files
composer lint

# Check only (CI)
composer test:lint
```

Config: `pint.json` — menggunakan Laravel preset.

### Frontend (ESLint + Prettier)

```bash
# Lint + auto-fix
npm run lint

# Format dengan Prettier
npm run format

# Check format (CI)
npm run format:check

# Type check
npm run types
```

**ESLint rules (eslint.config.js):**
- Import ordering (alphabetical, grouped)
- Consistent type imports (`type` keyword)
- React hooks rules
- No unused variables

**Prettier config (`.prettierrc`):**
- Semicolons: yes
- Single quotes: yes
- Print width: 80
- Tab width: 4
- Tailwind class sorting via `prettier-plugin-tailwindcss`

---

## Best Practices

### Backend

- Use PSR-12 (enforced via Pint)
- Keep controllers thin — business logic di services
- Use Eloquent ORM for database operations
- Use form requests for validation
- Use Inertia::render() untuk page responses
- Write Pest tests untuk critical components
- Use type hints dan return types

### Frontend

- Use functional components with hooks
- TypeScript types untuk semua props dan state
- Use `cn()` helper untuk conditional styling
- Follow shadcn/ui pattern untuk UI primitives
- Use Inertia `router` untuk navigation dan form submission
- Prefer named exports over default exports
- Use Wayfinder-generated routes untuk type-safe links

### General

- Follow conventional commit format
- Review code before merging
- Keep documentation up to date
- Don't commit `.env` files atau sensitive data

---

## Documentation Standards

### PHPDoc

```php
<?php

/**
 * Generate QR code for student
 *
 * @param \App\Models\Siswa $siswa Student model
 * @param \App\Models\Jadwal $jadwal Schedule model
 * @return string Base64-encoded QR code
 *
 * @throws \Exception If QR code generation fails
 */
public function generate(Siswa $siswa, Jadwal $jadwal): string;
```

### TSDoc

```tsx
/**
 * Format date to Indonesian format
 *
 * @param date - Date to format
 * @returns Formatted date in Indonesian format
 *
 * @example
 * formatIndonesianDate('2024-02-16') // '16 Februari 2024'
 */
export function formatIndonesianDate(date: Date | string): string;
```

---

## Security Best Practices

### Backend

- Validate all user inputs (Form Requests)
- Use parameterized queries (Eloquent)
- Escape all outputs
- Use CSRF protection (Inertia handles this automatically)
- Use Laravel Fortify for authentication
- Hash passwords with bcrypt (12 rounds)
- Use HTTPS for all communications
- Never trust user input

### Frontend

- TypeScript types untuk type safety
- React's built-in XSS protection (JSX escaping)
- Validate forms on both client dan server
- Use Inertia CSRF token (automatic)
- Implement proper error boundaries
- Use Content Security Policy (CSP) headers

---

## Testing Standards

### Backend (Pest v4)

```php
<?php

use App\Models\User;
use App\Models\Presensi;

it('creates a presensi record', function () {
    $user = User::factory()->create(['role' => 'guru']);

    $response = $this->actingAs($user)
        ->post('/presensi', [
            'siswa_id' => 1,
            'jadwal_id' => 1,
            'status' => 'hadir',
            'tanggal' => now()->toDateString(),
        ]);

    $response->assertRedirect();
    expect(Presensi::count())->toBe(1);
});

it('requires authentication to access presensi', function () {
    $response = $this->get('/presensi');

    $response->assertRedirect('/login');
});
```

**Running tests:**
```bash
# Run semua tests
composer test                    # lint + pest

# Run Pest only
./vendor/bin/pest

# Run specific test file
./vendor/bin/pest tests/Feature/PresensiTest.php

# Run with coverage
./vendor/bin/pest --coverage
```

### Frontend

```bash
# Type checking
npm run types

# Lint check
npm run lint

# Format check
npm run format:check
```

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Git Workflow](./0406-git-workflow.md)
- [Deployment](./0407-deployment.md)
