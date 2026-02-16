# Security Testing - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Security Testing SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi security testing untuk SiswaPresensi, mencakup vulnerability scanning, penetration testing, dan security best practices.

---

## 2. Security Threats & Vulnerabilities

### 2.1 OWASP Top 10

| Threat | Risk Level | Mitigation |
|--------|------------|------------|
| SQL Injection | Critical | Use ORM, parameterized queries |
| XSS (Cross-Site Scripting) | High | Escape output, CSP headers |
| CSRF (Cross-Site Request Forgery) | High | CSRF tokens, SameSite cookies |
| Authentication Bypass | Critical | Strong password policies, MFA |
| Authorization Bypass | Critical | Role-based access control |
| Sensitive Data Exposure | High | Encryption at rest and in transit |
| XML External Entity (XXE) | Medium | Disable XML entity processing |
| Broken Access Control | High | Proper authorization checks |
| Security Misconfiguration | Medium | Secure defaults, regular audits |
| Server-Side Request Forgery (SSRF) | Medium | Validate and sanitize URLs |

---

## 3. Security Test Scenarios

### 3.1 Authentication Security Tests

```php
<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_is_hashed()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(password_verify('password123', $user->password));
    }

    public function test_login_rate_limiting()
    {
        // Attempt multiple failed logins
        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/auth/login', [
                'email' => 'invalid@example.com',
                'password' => 'wrongpassword'
            ]);
        }

        // Verify rate limit exceeded
        $response = $this->postJson('/api/auth/login', [
            'email' => 'invalid@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(429);
    }

    public function test_token_expiration()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token', ['*'], now()->addMinutes(5))->plainTextToken;

        // Wait for token to expire
        $this->travelTo(now()->addMinutes(6));

        $response = $this->withToken($token)
                         ->getJson('/api/siswa');

        $response->assertStatus(401);
    }

    public function test_session_timeout()
    {
        $user = User::factory()->create();

        $this->actingAs($user);
        
        // Wait for session timeout
        $this->travelTo(now()->addHours(3));

        $response = $this->getJson('/api/siswa');

        $response->assertStatus(401);
    }

    public function test_csrf_protection()
    {
        $response = $this->post('/api/auth/logout');

        // Verify CSRF token is required
        $response->assertStatus(419);
    }
}
```

### 3.2 Authorization Security Tests

```php
<?php

namespace Tests\Feature\Security;

use App\Models\User;
use App\Models\Siswa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_siswa_cannot_access_admin_endpoints()
    {
        $siswaUser = User::factory()->create(['role' => 'siswa']);

        $response = $this->actingAs($siswaUser)
                         ->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_guru_cannot_access_orang_tua_endpoints()
    {
        $guruUser = User::factory()->create(['role' => 'guru']);

        $response = $this->actingAs($guruUser)
                         ->getJson('/api/orang-tua/izin');

        $response->assertressStatus(403);
    }

    public function test_orang_tua_cannot_access_other_children_data()
    {
        $orangTuaUser = User::factory()->create(['role' => 'orang_tua']);
        $otherSiswa = Siswa::factory()->create();

        $response = $this->actingAs($orangTuaUser)
                         ->getJson("/api/siswa/{$otherSiswa->id}");

        $response->assertStatus(403);
    }

    public function test_idor_prevention()
    {
        $siswaUser = User::factory()->create(['role' => 'siswa']);
        $otherSiswa = Siswa::factory()->create();

        // Try to access other student's data
        $response = $this->actingAs($siswaUser)
                         ->getJson("/api/presensi/siswa/{$otherSiswa->id}");

        $response->assertStatus(403);
    }
}
```

### 3.3 Input Validation Tests

```php
<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InputValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_sql_injection_prevention()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($adminUser)
                         ->getJson('/api/siswa?search=\'; DROP TABLE users; --');

        $response->assertStatus(200);
        
        // Verify users table still exists
        $this->assertDatabaseHas('users', ['id' => $adminUser->id]);
    }

    public function test_xss_prevention()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);

        $xssPayload = '<script>alert("XSS")</script>';

        $response = $this->actingAs($adminUser)
                         ->postJson('/api/siswa', [
                             'nama_depan' => $xssPayload,
                             'nama_belakang' => 'Test',
                             'nis' => '12345'
                         ]);

        $response->assertStatus(201);

        // Verify XSS payload is escaped
        $this->assertDatabaseHas('siswa', [
            'nama_depan' => $xssPayload
        ]);

        $getResponse = $this->actingAs($adminUser)
                              ->getJson('/api/siswa');

        $getResponse->assertStatus(200);
        $this->assertStringNotContainsString('<script>', $getResponse->json());
    }

    public function test_command_injection_prevention()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);

        $commandPayload = 'test; rm -rf /';

        $response = $this->actingAs($adminUser)
                         ->postJson('/api/siswa', [
                             'nama_depan' => $commandPayload,
                             'nama_belakang' => 'Test',
                             'nis' => '12345'
                         ]);

        $response->assertStatus(201);

        // Verify command was not executed
        $this->fileExists('/root'); // Root directory should still exist
    }

    public function test_path_traversal_prevention()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);

        $pathTraversalPayload = '../../../etc/passwd';

        $response = $this->actingAs($adminUser)
                         ->getJson("/api/files?path={$pathTraversalPayload}");

        $response->assertStatus(400);
    }
}
```

### 3.4 API Security Tests

```php
<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class APISecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_requires_authentication()
    {
        $response = $this->getJson('/api/siswa');

        $response->assertStatus(401);
    }

    public function test_api_rate_limiting()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Make 100 requests quickly
        for ($i = 0; $i < 100; $i++) {
            $this->withToken($token)->getJson('/api/siswa');
        }

        // Verify rate limit exceeded
        $response = $this->withToken($token)->getJson('/api/siswa');

        $response->assertStatus(429);
    }

    public function test_cors_headers()
    {
        $response = $this->optionsJson('/api/siswa');

        $response->assertHeader('Access-Control-Allow-Origin', '*');
        $response->assertHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->assertHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function test_https_required()
    {
        $response = $this->getJson('/api/siswa');

        // Verify HTTPS requirement
        $response->assertHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    public function test_content_security_policy()
    {
        $response = $this->get('/');

        // Verify CSP header
        $response->assertHeader('Content-Security-Policy');
    }
}
```

### 3.5 Data Security Tests

```php
<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DataSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_sensitive_data_not_exposed_in_api_responses()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)
                         ->getJson('/api/auth/me');

        $response->assertStatus(200);
        $response->assertJsonMissing(['password']);
        $response->assertJsonMissing(['remember_token']);
    }

    public function test_password_reset_token_is_secure()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => $user->email
        ]);

        $response->assertStatus(200);
        
        // Verify reset token is not exposed in response
        $response->assertJsonMissing(['token']);
    }

    public function test_file_upload_security()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);

        // Test malicious file upload
        $response = $this->actingAs($adminUser)
                         ->postJson('/api/upload', [
                             'file' => 'malicious.php'
                         ]);

        $response->assertStatus(400);
    }

    public function test_file_type_validation()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);

        // Test invalid file type
        $response = $this->actingAs($adminUser)
                         ->postJson('/api/upload', [
                             'file' => 'test.exe'
                         ]);

        $response->assertStatus(400);
    }
}
```

---

## 4. Security Scanning Tools

### 4.1 OWASP ZAP

```bash
# Automated security scan
zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://localhost:8000

# Generate report
zap-cli report -o security-report.html -f html
```

### 4.2 Semgrep

```bash
# Scan for security vulnerabilities
semgrep --config auto --severity ERROR --json --output security-findings.json .

# Scan for SQL injection
semgrep --config=p/security-audit --lang=php app/

# Scan for XSS
semgrep --config=p/xss --lang=php app/
```

### 4.3 Burp Suite

```bash
# Run Burp Suite scanner
burpsuite --headless --project-file=project.burp --scan-config=full-scan
```

### 4.4 Nmap

```bash
# Port scanning
nmap -sV -sC -p 80,443,8000 localhost

# Vulnerability scanning
nmap --script vuln localhost
```

---

## 5. Security Best Practices

### 5.1 Laravel Security Configuration

```php
// config/app.php
return [
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
    'debug' => env('APP_DEBUG', false),
];

// config/session.php
return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => 120, // 2 hours
    'secure' => env('SESSION_SECURE_COOKIE', true),
    'http_only' => true,
    'same_site' => 'lax',
];

// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://siswapresensi.com'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 5.2 Security Middleware

```php
// app/Http/Middleware/SecurityHeaders.php
public function handle($request, Closure $next)
{
    $response = $next($request);

    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    $response->headers->set('Content-Security-Policy', "default-src 'self'");
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->headers->set('Permissions-Policy', 'geolocation=()');

    return $response;
}
```

### 5.3 Input Sanitization

```php
// app/Http/Requests/SiswaRequest.php
public function rules()
{
    return [
        'nama_depan' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
        'nama_belakang' => 'nullable|string|max:255|regex:/^[a-zA-Z\s]+$/',
        'nis' => 'required|string|max:20|unique:siswa,nis',
        'email' => 'nullable|email|max:255',
        'no_hp' => 'nullable|string|max:20|regex:/^[0-9+]+$/',
    ];
}

public function sanitize()
{
    $this->merge([
        'nama_depan' => strip_tags($this->nama_depan),
        'nama_belakang' => strip_tags($this->nama_belakang),
        'nis' => preg_replace('/[^0-9]/', '', $this->nis),
    ]);
}
```

---

## 6. Security Checklist

### Pre-Deployment Security Checklist

- [ ] All dependencies updated to latest versions
- [ ] No hardcoded credentials in code
- [ ] Environment variables properly configured
- [ ] Debug mode disabled in production
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] Output escaping enabled
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] Authentication bypass prevention verified
- [ ] Authorization bypass prevention verified
- [ ] File upload security verified
- [ ] Password hashing verified
- [ ] Session timeout configured
- [ ] Token expiration configured
- [ ] CORS configured
- [ ] Security scan completed
- [ ] Penetration test completed
- [ ] Vulnerabilities remediated

---

## 7. Test Coverage Targets

| Security Area | Target | Current |
|---------------|--------|----------|
| Authentication | 100% | - |
| Authorization | 100% | - |
| Input Validation | 100% | - |
| API Security | 100% | - |
| Data Security | 100% | - |
| OWASP Top 10 | 100% | - |

---

## 8. Best Practices

- Use parameterized queries
- Escape all output
- Validate all input
- Use HTTPS in production
- Implement rate limiting
- Use strong password policies
- Implement MFA for sensitive operations
- Regular security audits
- Keep dependencies updated
- Use security scanning tools
- Monitor for security incidents
- Have incident response plan
- Document security findings
- Remediate vulnerabilities promptly
- Educate team on security best practices

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
