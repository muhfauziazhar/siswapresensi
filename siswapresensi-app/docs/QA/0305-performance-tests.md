# Performance Testing - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Performance Testing SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi performance testing untuk SiswaPresensi, mencakup load testing, stress testing, dan performance monitoring.

---

## 2. Performance Targets

### 2.1 Response Time Targets

| Endpoint | Target (p50) | Target (p95) | Target (p99) |
|----------|--------------|--------------|--------------|
| Login | < 200ms | < 500ms | < 1000ms |
| Get Siswa List | < 100ms | < 300ms | < 500ms |
| Get Presensi History | < 150ms | < 400ms | < 700ms |
| Scan QR Code | < 200ms | < 500ms | < 1000ms |
| Mark Reverse Presensi | < 200ms | < 500ms | < 1000ms |
| Create Izin | < 300ms | < 700ms | < 1500ms |
| Get Dashboard | < 300ms | < 700ms | < 1500ms |
| Generate Report | < 2000ms | < 5000ms | < 10000ms |

### 2.2 Throughput Targets

| Scenario | Target |
|----------|--------|
| Normal Load | > 100 req/sec |
| Peak Load | > 500 req/sec |
| QR Code Scanning | > 200 req/sec |

### 2.3 Resource Usage Targets

| Metric | Target |
|--------|--------|
| CPU Usage | < 70% |
| Memory Usage | < 80% |
| Database Connections | < 80% of pool |
| Disk I/O | < 80% |

---

## 3. Load Testing Scenarios

### 3.1 Normal Load Scenario

```javascript
// tests/performance/normal-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.01'],           // Error rate must be less than 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
  // Login
  let loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'guru@siswapresensi.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => JSON.parse(r.body).token !== undefined,
  }) || errorRate.add(1);

  let token = JSON.parse(loginRes.body).token;

  // Get siswa list
  let siswaRes = http.get(`${BASE_URL}/api/siswa`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(siswaRes, {
    'siswa list status is 200': (r) => r.status === 200,
    'siswa list has data': (r) => JSON.parse(r.body).data.length > 0,
  }) || errorRate.add(1);

  // Get presensi history
  let presensiRes = http.get(`${BASE_URL}/api/presensi`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(presensiRes, {
    'presensi status is 200': (r) => r.status === 200,
    'presensi has data': (r) => JSON.parse(r.body).data.length > 0,
  }) || errorRate.add(1);

  sleep(1);
}
```

### 3.2 Peak Load Scenario

```javascript
// tests/performance/peak-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<700'], // 95% of requests must complete below 700ms
    errors: ['rate<0.05'],            // Error rate must be less than 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000'';

export default function () {
  // Simulate QR code scanning
  let scanRes = http.post(`${BASE_URL}/api/presensi/scan`, JSON.stringify({
    qr_code: 'base64_encoded_qr_data',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(scanRes, {
    'scan status is 201': (r) => r.status === 201,
    'scan has message': (r) => JSON.parse(r.body).message !== undefined,
  }) || errorRate.add(1);

  sleep(Math.random() * 3);
}
```

### 3.3 Stress Test Scenario

```javascript
// tests/performance/stress-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp up to 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '2m', target: 400 },   // Ramp up to 400 users
    { duration: '2m', target: 600 },   // Ramp up to 600 users
    { duration: '2m', target: 800 },   // Ramp up to 800 users
    { duration: '2m', target: 1000 },  // Ramp up to 1000 users
    { duration: '5m', target: 1000 },  // Stay at 1000 users
    { duration: '2m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% of requests must complete below 1500ms
    errors: ['rate<0.1'],             // Error rate must be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
  // Simulate mixed workload
  let scenario = Math.random();

  if (scenario < 0.3) {
    // Login
    http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: 'guru@siswapresensi.com',
      password: 'password123',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (scenario < 0.6) {
    // Get siswa list
    http.get(`${BASE_URL}/api/siswa`);
  } else if (scenario < 0.8) {
    // Scan QR code
    http.post(`${BASE_URL}/api/presensi/scan`, JSON.stringify({
      qr_code: 'base64_encoded_qr_data',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    // Get dashboard
    http.get(`${BASE_URL}/api/dashboard`);
  }

  sleep(Math.random() * 2);
}
```

---

## 4. Running Performance Tests

### 4.1 Using k6

```bash
# Run normal load test
k6 run tests/performance/normal-load.js

# Run with custom base URL
BASE_URL=https://staging.siswapresensi.com k6 run tests/performance/normal-load.js

# Run peak load test
k6 run tests/performance/peak-load.js

# Run stress test
k6 run tests/performance/stress-test.js

# Run with output to file
k6 run out.json tests/performance/normal-load.js

# Run with HTML report
k6 run --out json=results.json tests/performance/normal-load.js
k6-reporter results.json
```

### 4.2 Using Artillery

```yaml
# tests/performance/qr-scan-config.yml
config:
  target: "http://localhost:8000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  processor: "./qr-scan-processor.js"

scenarios:
  - name: "QR Code Scanning"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "siswa@siswapresensi.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "token"
      - post:
          url: "/api/presensi/scan"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            qr_code: "base64_encoded_qr_data"
```

```bash
# Run artillery test
artillery run tests/performance/qr-scan-config.yml

# Run with output file
artillery run tests/performance/qr-scan-config.yml -o results.json

# Run with HTML report
artillery run tests/performance/qr-scan-config.yml --output results.json
artillery report results.json
```

---

## 5. Performance Monitoring

### 5.1 Laravel Telescope

```php
// config/telescope.php
return [
    'enabled' => env('TELESCOPE_ENABLED', true),
    'watchers' => [
        Watchers\RequestWatcher::class => true,
        Watchers\QueryWatcher::class => true,
        Watchers\ModelWatcher::class => true,
        Watchers\JobWatcher::class => true,
        Watchers\LogWatcher::class => true,
        Watchers\GateWatcher::class => true,
    ],
];
```

### 5.2 Database Query Monitoring

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\DB;

public function boot()
{
    if (config('app.debug')) {
        DB::listen(function ($query) {
            if ($query->time > 100) { // Log queries taking more than 100ms
                logger()->channel('slow-queries')->warning('Slow query detected', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time,
                ]);
            }
        });
    }
}
```

### 5.3 Performance Metrics

```javascript
// app/Http/Middleware/PerformanceMiddleware.php
public function handle($request, Closure $next)
{
    $startTime = microtime(true);

    $response = $next($request);

    $duration = (microtime(true) - $startTime) * 1000;

    // Log performance metrics
    logger()->info('Request performance', [
        'url' => $request->fullUrl(),
        'method' => $request->method(),
        'duration' => $duration,
        'status' => $response->status(),
    ]);

    // Add performance header
    $response->headers->set('X-Request-Duration', round($duration, 2));

    return $response;
}
```

---

## 6. Performance Optimization

### 6.1 Database Optimization

```php
// Use eager loading to prevent N+1 queries
$siswa = Siswa::with(['kelas', 'orangTua', 'presensi' => function ($query) {
    $query->where('tanggal', today());
}])->get();

// Use indexes
// migrations/xxxx_add_indexes_to_presensi_table.php
Schema::table('presensi', function (Blueprint $table) {
    $table->index(['siswa_id', 'tanggal']);
    $table->index(['jadwal_id', 'tanggal']);
    $table->index('tanggal');
});

// Use query caching
$presensi = Cache::remember("presensi:{$siswaId}:{$jadwalId}", 3600, function () use ($siswaId, $jadwalId) {
    return Presensi::where('siswa_id', $siswaId)
                   ->where('jadwal_id', $jadwalId)
                   ->first();
});
```

### 6.2 API Optimization

```php
// Use pagination
$siswa = Siswa::paginate(20);

// Use resource limiting
$siswa = Siswa::select(['id', 'nama_depan', 'nama_belakang', 'nis'])->get();

// Use response compression
// config/app.php
'compress_response' => true,

// Use rate limiting
Route::middleware('throttle:60,1')->group->function () {
    Route::get('/api/siswa', [SiswaController::class, 'index']);
});
```

### 6.3 Frontend Optimization

```javascript
// Use code splitting
const PresensiHistory = React.lazy(() => import('./pages/PresensiHistory'));

// Use memoization
const PresensiList = React.memo(({ presensi }) => {
    return presensi.map(p => <PresensiItem key={p.id} data={p} />);
});

// Use debouncing
const debouncedSearch = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    []
);

// Use virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
    height={600}
    itemCount={presensi.length}
    itemSize={50}
    width="100%"
>
    {({ index, style }) => (
        <div style={style}>
            <PresensiItem data={presensi[index]} />
        </div>
    )}
</FixedSizeList>
```

---

## 7. Performance Reports

### 7.1 Weekly Performance Report

```markdown
# Performance Report - Week 7, 2024

## Summary

| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Average Response Time | 245ms | 280ms | -12.5% |
| p95 Response Time | 520ms | 600ms | -13.3% |
| Error Rate | 0.5% | 0.8% | -37.5% |
| Throughput | 150 req/sec | 140 req/sec | +7.1% |

## Top 5 Slowest Endpoints

1. `/api/presensi/report` - 1800ms (p95)
2. `/api/dashboard` - 850ms (p95)
3. `/api/presensi/scan` - 520ms (p95)
4. `/api/siswa` - 320ms (p95)
5. `/api/izin` - 280ms (p95)

## Recommendations

1. Optimize report generation query - add indexes
2. Implement dashboard caching - reduce database queries
3. Optimize QR code validation - use Redis cache
4. Implement API response compression
5. Add CDN for static assets

## Next Steps

1. Implement database query optimization
2. Add Redis caching layer
3. Implement API rate limiting
4. Optimize frontend bundle size
5. Set up performance monitoring alerts
```

---

## 8. Test Coverage Targets

| Scenario | Target | Current |
|----------|--------|----------|
| Normal Load | 100% | - |
| Peak Load | 100% | - |
| Stress Test | 100% | - |
| Performance Monitoring | 100% | - |

---

## 9. Best Practices

- Run performance tests regularly (weekly)
- Monitor production performance continuously
- Set up alerts for performance degradation
- Optimize slow queries before deployment
- Use caching strategically
- Implement pagination for large datasets
- Monitor database connection pool usage
- Profile code regularly
- Document performance bottlenecks
- Track performance improvements over time

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Security Tests](./0306-security-tests.md)
