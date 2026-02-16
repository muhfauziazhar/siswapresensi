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
            'data' => $presensi,
            'message' => 'Presensi berhasil dibuat'
        ], 201);
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

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function getNamaLengkapAttribute(): string
    {
        return "{$this->siswa->nama_depan} {$this->siswa->nama_belakang}";
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
serensi(data.data);
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
  const d = new Date(date);
  const today = new Date();
  
  return d.toDateString() === today.toDateString();
};
```

---

## File Organization

### Backend Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── PresensiController.php
│   │   └── ...
│   ├── Middleware/
│   │   ├── Authenticate.php
│   │   └── CheckRole.php
│   ├── Requests/
│   │   ├── PresensiRequest.php
│   │   └── ...
│   └── ...
├── Models/
│   ├── User.php
│   ├── Siswa.php
│   └── ...
├── Services/
│   ├── QRCodeService.php
│   ├── NotificationService.php
│   └── ...
└── ...
```

### Frontend Structure

```
resources/js/
├── Pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx
│   │   ├── GuruDashboard.jsx
│   │   ├── SiswaDashboard.jsx
│   │   └── OrangTuaDashboard.jsx
│   ├── Presensi/
│   │   ├── GuruPresensi.jsx
│   │   └── SiswaQRCode.jsx
│   └── ...
├── Components/
│   ├── Common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── Presensi/
│   │   ├── QRCodeDisplay.jsx
│   │   └── PresensiForm.jsx
│   │   └── ...
│   └── ...
├── Hooks/
│   ├── usePresensi.js
│   ├── useAuth.js
│   └── ...
├── Utils/
│   ├── date.js
│   └── validation.js
└── ...
```

---

## Code Review Checklist

### Backend

- [ ] PSR-12 compliance
- [ ] Laravel best practices followed
- [ ] Controllers are thin
- [ ] Business logic in services
- [ ] Models use proper relationships
- [ ] Form requests used for validation
- [ ] Authorization middleware applied
- [ ] Error handling implemented
- [ ] Logging added where appropriate
- [ ] Comments added for complex logic

### Frontend

- [ ] Functional components used
- [ ] Hooks are properly implemented
- [ ] Props interface defined
- [ ] Consistent prop naming
- [ ] Loading and error states handled
- [ ] Accessibility considered (ARIA labels, keyboard navigation)
- [ ] Responsive design implemented
- [ ] Performance optimized (memo, useCallback)
- [ ] Error boundaries implemented
- [ ] Console.log statements removed (except for debugging)

---

## Security Best Practices

### Backend

- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (use Eloquent)
- [ ] XSS prevention (escape output)
- [ ] CSRF protection enabled
- [ ] Password hashing (bcrypt)
- [ ] Token-based authentication (Laravel Sanctum)
- [ ] Rate limiting on sensitive endpoints
- [ ] File upload validation
- [ ] Environment variables for sensitive data

### Frontend

- [ ] Never trust user input
- [ ] Validate all forms
- [ ] Sanitize all outputs
- [ ] Use HTTPS for all API calls
- [ ] Store tokens securely (httpOnly cookies)
- [ ] Implement CSRF tokens
- [ ] Use Content Security Policy (CSP)
- [ ] Validate API responses

---

## Performance Best Practices

### Backend

- [ ] Use database indexes
- [ ] Optimize queries (eager loading, select only needed columns)
- [ ] Use caching (Redis, Laravel cache)
- [ ] Use pagination for large datasets
- [ ] Avoid N+1 queries
- [ ] Use queue for heavy operations

### Frontend

- [ ] Use React.memo for expensive components
- [ ] Use useCallback and useMemo
- [ ] Lazy load components
- [ ] Code splitting
- [ ] Optimize images (compress, lazy load)
- [ ] Debounce user input
- [ ] Virtual scrolling for long lists

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Git Workflow](./0406-git-workflow.md)
- [Deployment](./0407-deployment.md)
