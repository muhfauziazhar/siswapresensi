# Coding Standards - SiswaPresensi

## PHP Standards

### PSR-12 Compliance

- Class names: `PascalCase`
- Method names: `camelCase`
- Constants: `UPPER_CASE`
- Variables: `camelCase`
- File names: `PascalCase`

### Laravel Best Practices

#### Controllers

- Use resource controllers for RESTful APIs
- Return JSON responses with consistent structure
- Use form requests for validation
- Use authorization middleware
- Keep controllers thin (business logic in services)

```php
<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Http\Requests\PresensiRequest;
use Illuminate\Http\JsonResponse;

class PresensiController extends Controller
{
    public function index(PresensiRequest $request)
    {
        $presensi = Presensi::with(['siswa', 'jadwal'])
            ->where('jadwal_id', $request->jadwal_id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $presensi
        ]);
    }

    public function store(PresensiRequest $request)
    {
        $presensi = Presensi::create($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => $presensi
        ]);
    }
}
```

#### Models

- Use Eloquent ORM
- Define fillable and guarded properties
- Use relationships and scopes
- Use casts for type casting
- Use accessors and mutators for computed properties

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

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class);
    }

    // Accessor for full name
    public function getNamaLengkapAttribute(): string
    {
        return "{$this->siswa->nama_depan} {$this->siswa->nama_belakang}";
    }

    // Scopes
    public function scopeHadirIni($query)
    {
        return $query->where('tanggal', now()->toDateString());
    }
}
```

#### Services

- Use service classes for business logic
- Keep services stateless
- Use dependency injection
- Return consistent responses

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

        if (!$data) {
            return false;
        }

        if (!isset($data['expiry']) || $data['expiry'] < now()->timestamp) {
            return false;
        }

        return true;
    }
}
```

---

## JavaScript/React Standards

### File Structure

- Use `PascalCase` for components
- Use `camelCase` for utilities
- Use `UPPER_CASE` for constants
- Group related files in folders

### Component Standards

- Use functional components with hooks
- Keep components small and focused
- Use props interface for type safety
- Use consistent prop naming
- Handle loading and error states

```jsx
import React from 'react';

interface QRCodeDisplayProps {
  qrCode: string | null;
  siswa: {
    id: number;
    nama_depan: string;
    nama_belakang: string;
    nis: string;
  };
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, siswa }) => {
  if (!qrCode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="qr-container">
      <img 
        src={`data:image/png;base64,${qrCode}`}
        alt="QR Code"
        className="qr-image"
      />
      <div className="siswa-info">
        <h3>{siswa.nama_depan} {siswa.nama_belakang}</h3>
        <p>NIS: {siswa.nis}</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
```

### Hook Standards

- Use `use` prefix for custom hooks
- Return consistent values from hooks
- Handle loading and error states
- Use proper dependency arrays

```jsx
import { useState, useEffect } from 'react';

function usePresensi(jadwalId: number) {
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPresensi();
  }, [jadwalId]);

  const fetchPresensi = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/presensi/jadwal/${jadwalId}`);
      const data = await response.json();

      if (data.success) {
        setPresensi(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch presensi');
    } finally {
      setLoading(false);
    }
  };

  return { presensi, loading, error, refetch: fetchPresensi };
}

export default usePresensi;
```

### Utility Standards

- Keep utility functions pure
- Use JSDoc for documentation
- Handle edge cases
- Return consistent types

```jsx
/**
 * Format date to Indonesian format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatIndonesianDate = (date: Date | string): string => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return d.toLocaleDateString('id-ID', options);
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const d = new Date(date);
  
  return d.toDateString() === today.toDateString();
};

/**
 * Calculate time difference
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {number} Time difference in milliseconds
 */
export const calculateTimeDiff = (start: Date, end: Date): number => {
  return end.getTime() - start.getTime();
};
```

---

## File Organization

### Backend Structure

```
app/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Services/
└── Providers/
```

### Frontend Structure

```
resources/js/
├── Pages/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Presensi/
│   └── Layouts/
├�── Components/
│   ├── Common/
│   ├── Presensi/
│   └── Dashboard/
├�── Hooks/
├── Utils/
└── Layouts/
```

---

## Best Practices

### Backend

- Use PSR-12 coding standards
- Use Laravel best practices
- Keep controllers thin
- Use service classes for business logic
- Use Eloquent ORM for database operations
- Use middleware for cross-cutting concerns
- Write unit tests for critical components
- Document complex logic with comments
- Use type hints where helpful

### Frontend

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety (optional but recommended)
- Follow React best practices
- Use Tailwind CSS for styling
- Test user behavior, not implementation details
- Mock API calls with MSW
- Test accessibility (a11y)
- Keep tests focused and maintainable

### General

- Write clear, descriptive commit messages
- Follow conventional commit format
- Review code before merging
- Keep documentation up to date
- Refactor when needed
- Don't commit broken code
- Don't commit sensitive data (API keys, passwords)

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

### JSDoc

```jsx
/**
 * Format date to Indonesian format
 *
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date in Indonesian format
 *
 * @example
 * formatIndonesianDate('2024-02-16') // '16 Februari 2024'
 */
export const formatIndonesianDate = (date: Date | string): string;
```

---

## Security Best Practices

### Backend

- Validate all user inputs
- Use parameterized queries (Eloquent)
- Escape all outputs
- Use CSRF protection for forms
- Use Laravel's built-in security features
- Never trust user input
- Use HTTPS for all communications
- Hash passwords with bcrypt
- Use Laravel Sanctum for API authentication

### Frontend

- Never trust user input
- Sanitize all outputs
- Use React's built-in XSS protection
- Validate forms on both client and server
- Store tokens securely (httpOnly cookies)
- Implement proper error boundaries
- Use Content Security Policy (CSP) headers

---

## Performance Best Practices

### Backend

- Use database indexes
- Optimize queries (avoid N+1 problems)
- Use caching (Redis, Laravel cache)
- Use pagination for large datasets
- Queue heavy operations (jobs, notifications)
- Monitor slow queries

### Frontend

- Use React.memo for expensive components
- Use useCallback and useMemo
- Lazy load components
- Optimize images (compress, lazy load)
- Debounce user input
- Code splitting for large bundles

---

## Testing Best Practices

### Backend

- Write unit tests for all critical components
- Use RefreshDatabase trait for database tests
- Mock external dependencies
- Test both success and failure scenarios
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Frontend

- Test user behavior, not implementation details
- Mock API calls with MSW
- Test accessibility (a11y)
- Test loading and error states
- Test keyboard navigation
- Keep tests focused and maintainable

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Git Workflow](./0406-git-workflow.md)
- [Deployment](./0407-deployment.md)
