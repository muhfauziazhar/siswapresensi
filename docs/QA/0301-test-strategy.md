# Test Strategy - SiswaPresensi

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi testing untuk SiswaPresensi, mencakup unit testing, integration testing, dan E2E testing.

---

## 2. Pendekatanan Testing

### Unit Testing
- **Scope:** Test fungsi dan komponen secara isolasi
- **Tools:** PHPUnit / Pest (Laravel), Jest / Vitest (React)
- **Coverage Target:** > 80% untuk komponen kritis
- **Frequency:** Setiap commit dan pull request

### Integration Testing
- **Scope:** Test API endpoints dan interaksi database
- **Tools:** PHPUnit / Pest (Laravel)
- **Coverage Target:** > 85% untuk API endpoints
- **Frequency:** Setiap pull request

### E2E Testing
- **Scope:** Test flow lengkap dari perspektif pengguna
- **Tools:** Playwright / Cypress
- **Coverage Target:** Critical user flows
- **Frequency:** Setiap pull request dan nightly

### Performance Testing
- **Scope:** Test sistem di bawah beban
- **Tools:** k6, Artillery
- **Frequency:** Mingguan
- **Target:** < 200ms response time (p95)

### Security Testing
- **Scope:** Identifikasi kerentanan keamanan
- **Tools:** OWASP ZAP, Semgrep, CodeQL
- **Frequency:** Setiap pull request dan nightly

### Accessibility Testing
- **Scope:** Memastikan kepatuhan WCAG 2.1 AA
- **Tools:** axe DevTools, Lighthouse
- **Frequency:** Setiap pull request

---

## 3. Test Pyramid

```
           E2E Tests
          / \
         /   \
        /     \
Integration Tests /   \
      /       \
     /         \
    /           \
Unit Tests
```

---

## 4. Prioritas Testing

### Priority 1: Unit Testing
- Model tests (User, Siswa, Guru, OrangTua, Kelas, Mapel, Jadwal, Presensi, Izin)
- Service tests (QRCodeService, GeofencingService, NotificationService)
- Helper tests (DateHelper, ValidationHelper)
- Component tests (QRCodeDisplay, PresensiForm, Dashboard)
- Hook tests (usePresensi, useAuth)

### Priority 2: Integration Testing
- Authentication API tests
- Presensi API tests
- QR Code API tests
- Izin API tests
- Dashboard API tests
- Database relationship tests

### Priority 3: E2E Testing
- Guru login flow
- Siswa login flow
- Orang Tua login flow
- Guru scan QR code flow
- Guru reverse marking flow
- Orang Tua request izin flow
- Siswa generate QR code flow

### Priority 4: Performance Testing
- QR code generation
- QR code validation
- Presensi creation
- Dashboard load
- Report generation

### Priority 5: Security Testing
- Input validation
- Authentication & authorization
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting

### Priority 6: Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Form accessibility

---

## 5. Test Data Strategy

### Unit Tests
- Gunakan factories untuk test data
- Gunakan RefreshDatabase trait untuk database tests
- Mock external dependencies (API, services)
- Test kedua success dan failure scenarios

### Integration Tests
- Gunakan test database dengan seed data
- Test semua API endpoints
- Test authentication dan authorization
- Test error handling

### E2E Tests
- Gunakan test data yang realistis
- Mock API calls dengan MSW
- Test happy path dan error scenarios
- Gunakan Playwright untuk multi-browser testing

---

## 6. Automated Testing

### CI/CD Pipeline

**On Setiap Push:**
- Run linter
- Run type checker
- Run unit tests
- Generate coverage report

**On Setiap Pull Request:**
- Run semua tests (unit, integration, E2E smoke)
- Cek coverage threshold
- Cek quality gates

**Nightly:**
- Run full E2E test suite
- Run performance tests
- Run security scans
- Generate test report

---

## 7. Test Coverage Targets

| Modul | Target | Prioritas |
|--------|--------|----------|
| Models | 90% | High |
| Services | 90% | High |
| Controllers | 85% | High |
| Middleware | 85% | Medium |
| Helpers | 90% | High |
| Components | 80% | Medium |
| Hooks | 85% | Medium |
| Pages | 75% | Low |
| Utils | 90% | High |

---

## 8. Best Practices

### Unit Testing
- Test happy path
- Test edge cases
- Test error conditions
- Gunakan nama test yang deskriptif
- Ikuti pola AAA (Arrange, Act, Assert)
- Jaga tes independen dan terisolasi

### Integration Testing
- Gunakan RefreshDatabase trait
- Gunakan factories untuk test data
- Test semua API endpoints
- Test authentication dan authorization
- Test error handling
- Jaga tes independen

### E2E Testing
- Gunakan React Testing Library
- Test user behavior, bukan implementasi detail
- Mock API calls dengan MSW
- Test aksesibilitas (a11y)
- Jaga tes independen

### Performance Testing
- Definisikan target performance
- Gunakan k6 atau Artillery
- Load test dengan beban realistis
- Monitor resource usage

### Security Testing
- Gunakan OWASP ZAP atau Burp Suite
- Cek kerentanan SQL injection
- Cek kerentanan XSS
- Cek konfigurasi security
- Scan dependencies untuk kerentanan

### Accessibility Testing
- Gunakan axe DevTools atau Lighthouse
- Cek keyboard navigation
- Cek screen reader compatibility
- Cek kontras warna
- Ikuti standar WCAG 2.1 AA

---

## 9. Dokumentasi Terkait
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
- [Accessibility Tests](./0307-accessibility-tests.md)
- [Bug Reporting](./0308-bug-reporting.md)
- [Acceptance Criteria](./0309-acceptance-criteria.md)
- [CI/CD Pipeline](./0310-ci-cd.md)
