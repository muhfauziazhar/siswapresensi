# End-to-End Testing - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | End-to-End Testing SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi end-to-end (E2E) testing untuk SiswaPresensi, menggunakan Playwright untuk menguji user flows dari perspektif pengguna.

---

## 2. Test Scenarios

### 2.1 User Authentication Flow

#### Login Flow

```javascript
// tests/e2e/auth/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'guru@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('[data-testid="user-name"]')).toHaveText('Guru');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toHaveText('Invalid credentials');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'guru@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Logout
    await page.click('[data-testid="logout-button"]');
    
    // Verify redirect to login page
    await expect(page).toHaveURL('/login');
  });
});
```

---

### 2.2 Siswa Presensi Flow

#### QR Code Scanning Flow

```javascript
// tests/e2e/siswa/qr-scan.spec.js
import { test, expect } from '@playwright/test';

test.describe('Siswa QR Code Scanning Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as siswa
    await page.goto('/login');
    await page.fill('input[name="email"]', 'siswa@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should display QR code for today\'s schedule', async ({ page }) => {
    await page.goto('/siswa/qr-code');
    
    // Verify QR code is displayed
    await expect(page.locator('[data-testid="qr-code-image"]')).toBeVisible();
    
    // Verify schedule info
    await expect(page.locator('[data-testid="schedule-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="schedule-info"]')).toContainText('Matematika');
  });

  test('should show QR code expiry time', async ({ page }) => {
    await page.goto('/siswa/qr-code');
    
    // Verify expiry time is displayed
    await expect(page.locator('[data-testid="qr-expiry"]')).toBeVisible();
    await expect(page.locator('[data-testid="qr-expiry"]')).toContainText('Berlaku sampai');
  });

  test('should refresh QR code when requested', async ({ page }) => {
    await page.goto('/siswa/qr-code');
    
    const initialQR = await page.locator('[data-testid="qr-code-image"]').getAttribute('src');
    
    // Click refresh button
    await page.click('[data-testid="refresh-qr-button"]');
    
    // Wait for new QR code
    await page.waitForTimeout(1000);
    
    const refreshedQR = await page.locator('[data-testid="qr-code-image"]').getAttribute('src');
    
    // Verify QR code changed
    expect(initialQR).not.toBe(refreshedQR);
  });
});
```

#### Presensi History Flow

```javascript
// tests/e2e/siswa/presensi-history.spec.js
import { test, expect } from '@playwright/test';

test.describe('Siswa Presensi History Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as siswa
    await page.goto('/login');
    await page.fill('input[name="email"]', 'siswa@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should display presensi history', async ({ page }) => {
    await page.goto('/siswa/presensi');
    
    // Verify history table is displayed
    await expect(page.locator('[data-testid="presensi-table"]')).toBeVisible();
    
    // Verify at least one record
    await expect(page.locator('[data-testid="presensi-row"]')).toHaveCount(5);
  });

  test('should filter presensi by date range', async ({ page }) => {
    await page.goto('/siswa/presensi');
    
    // Set date range
    await page.fill('input[name="start_date"]', '2024-02-01');
    await page.fill('input[name="end_date"]', '2024-02-15');
    await page.click('button[type="submit"]');
    
    // Verify filtered results
    await expect(page.locator('[data-testid="presensi-row"]')).toHaveCount(10);
  });

  test('should show presensi statistics', async ({ page }) => {
    await page.goto('/siswa/presensi');
    
    // Verify statistics cards
    await expect(page.locator('[data-testid="stat-hadir"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-tidak-hadir"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-izin"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-sakit"]')).toBeVisible();
  });
});
```

---

### 2.3 Guru Reverse Marking Flow

```javascript
// tests/e2e/guru/reverse-marking.spec.js
import { test, expect } from '@playwright/test';

test.describe('Guru Reverse Marking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as guru
    await page.goto('/login');
    await page.fill('input[name="email"]', 'guru@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should display class list', async ({ page }) => {
    await page.goto('/guru/kelas');
    
    // Verify class list is displayed
    await expect(page.locator('[data-testid="kelas-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="kelas-item"]')).toHaveCount(5);
  });

  test('should display student list for selected class', async ({ page }) => {
    await page.goto('/guru/kelas');
    
    // Click on first class
    await page.click('[data-testid="kelas-item"]:first-child');
    
    // Verify student list is displayed
    await expect(page.locator('[data-testid="siswa-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="siswa-item"]')).toHaveCount(20);
  });

  test('should mark reverse presensi for student', async ({ page }) => {
    await page.goto('/guru/reverse-marking');
    
    // Select class
    await page.selectOption('[name="kelas_id"]', '1');
    
    // Wait for student list to load
    await page.waitForSelector('[data-testid="siswa-item"]');
    
    // Select first student
    await page.click('[data-testid="siswa-item"]:first-child [data-testid="select-siswa"]');
    
    // Select status
    await page.selectOption('[name="status"]', 'tidak_hadir');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toHaveText('Presensi berhasil ditandai');
  });

  test('should bulk mark reverse presensi for multiple students', async ({ page }) => {
    await page.goto('/guru/reverse-marking');
    
    // Select class
    await page.selectOption('[name="kelas_id"]', '1');
    
    // Wait for student list to load
    await page.waitForSelector('[data-testid="siswa-item"]');
    
    // Select multiple students
    await page.click('[data-testid="siswa-item"]:nth-child(1) [data-testid="select-siswa"]');
    await page.click('[data-testid="siswa-item"]:nth-child(2) [data-testid="select-siswa"]');
    await page.click('[data-testid="siswa-item"]:nth-child(3) [data-testid="select-siswa"]');
    
    // Select status
    await page.selectOption('[name="status"]', 'sakit');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toHaveText('3 presensi berhasil ditandai');
  });
});
```

---

### 2.4 Orang Tua Izin Flow

```javascript
// tests/e2e/orang-tua/izin.spec.js
import { test, expect } from '@playwright/test';

test.describe('Orang Tua Izin Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as orang tua
    await page.goto('/login');
    await page.fill('input[name="email"]', 'orangtua@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should display children list', async ({ page }) => {
    await page.goto('/orang-tua/anak');
    
    // Verify children list is displayed
    await expect(page.locator('[data-testid="anak-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="anak-item"]')).toHaveCount(2);
  });

  test('should create izin request', async ({ page }) => {
    await page.goto('/orang-tua/izin/create');
    
    // Select child
    await page.selectOption('[name="siswa_id"]', '1');
    
    // Select izin type
    await page.selectOption('[name="jenis"]', 'sakit');
    
    // Set date range
    await page.fill('input[name="tanggal_mulai"]', '2024-02-20');
    await page.fill('input[name="tanggal_selesai"]', '2024-02-22');
    
    // Fill reason
    await page.fill('textarea[name="alasan"]', 'Anak demam tinggi');
    
    // Upload proof (mock)
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/medical-certificate.jpg');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toHaveText('Izin berhasil diajukan');
  });

  test('should display izin history', async ({ page }) => {
    await page.goto('/orang-tua/izin');
    
    // Verify izin list is displayed
    await expect(page.locator('[data-testid="izin-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="izin-item"]')).toHaveCount(5);
  });

  test('should display izin status', async ({ page }) => {
    await page.goto('/orang-tua/izin');
    
    // Verify status badges
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Disetujui')).toBeVisible();
    await expect(page.locator('text=Ditolak')).toBeVisible();
  });
});
```

---

### 2.5 Admin Dashboard Flow

```javascript
// tests/e2e/admin/dashboard.spec.js
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should display dashboard statistics', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Verify statistics cards
    await expect(page.locator('[data-testid="stat-total-siswa"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-total-guru"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-total-kelas"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-total-presensi"]')).toBeVisible();
  });

  test('should display recent presensi activity', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Verify recent activity list
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
    await expect(page.locator('[data-testid="activity-item"]')).toHaveCount(10);
  });

  test('should generate presensi report', async ({ page }) => {
    await page.goto('/admin/laporan');
    
    // Set report parameters
    await page.selectOption('[name="kelas_id"]', '1');
    await page.fill('input[name="start_date"]', '2024-02-01');
    await page.fill('input[name="end_date"]', '2024-02-15');
    
    // Click generate
    await page.click('button[type="submit"]');
    
    // Verify report is displayed
    await expect(page.locator('[data-testid="report-table"]')).toBeVisible();
  });

  test('should export report to PDF', async ({ page }) => {
    await page.goto('/admin/laporan');
    
    // Set report parameters
    await page.selectOption('[name="kelas_id"]', '1');
    await page.fill('input[name="start_date"]', '2024-02-01');
    await page.fill('input[name="end_date"]', '2024-02-15');
    
    // Click export PDF
    await page.click('[data-testid="export-pdf-button"]');
    
    // Verify download started
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('laporan-presensi.pdf');
  });
});
```

---

## 3. Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/e2e/auth/login.spec.js

# Run specific test
npm run test:e2e -- --grep "should login successfully"

# Run in headed mode (show browser)
npm run test:e2e -- --headed

# Run in debug mode
npm run test:e2e -- --debug

# Run with specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Run with video recording
npm run test:e2e -- --video=on

# Run with trace
npm run test:e2e -- --trace=on
```

---

## 4. Test Configuration

### Playwright Config

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

---

## 5. Test Data Setup

### Test Database

```bash
# Setup test database
php artisan migrate:fresh --seed
php artisan db:seed --class=TestDataSeeder
```

### Mock API Responses

```javascript
// tests/e2e/mocks/api-handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/siswa', () => {
    return HttpResponse.json({
      data: [
        { id: 1, nama: 'Ahmad Rizky', nis: '12345' },
        { id: 2, nama: 'Budi Santoso', nis: '12346' },
      ]
    });
  }),
  
  http.post('/api/presensi/scan', () => {
    return HttpResponse.json({
      message: 'Presensi marked successfully',
      data: { status: 'hadir' }
    });
  }),
];
```

---

## 6. Test Coverage Targets

| Scenario | Target | Current |
|----------|--------|----------|
| Authentication | 100% | - |
| Siswa Presensi | 100% | - |
| Guru Reverse Marking | 100% | - |
| Orang Tua Izin | 100% | - |
| Admin Dashboard | 100% | - |

---

## 7. Best Practices

- Use page object model for reusable page interactions
- Use data-testid selectors for stability
- Test real user flows, not implementation details
- Include accessibility testing
- Test on multiple browsers and devices
- Use meaningful test names
- Keep tests independent and isolated
- Use proper waits and assertions

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](a./0303-integration-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
