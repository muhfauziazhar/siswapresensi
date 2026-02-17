# Accessibility Testing - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Accessibility Testing SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi accessibility testing untuk SiswaPresensi, memastikan aplikasi dapat diakses oleh semua pengguna, termasuk pengguna dengan disabilitas.

---

## 2. Accessibility Standards

### 2.1 WCAG 2.1 Level AA

SiswaPresensi akan mematuhi standar WCAG 2.1 Level AA untuk memastikan aksesibilitas maksimal.

### 2.2 Key Principles (POUR)

- **P**erceivable - Konten harus dapat dipahami
- **O**perable - Antarmuka harus dapat dioperasikan
- **U**nderstandable - Informasi dan operasi harus dapat dipahami
- **R**obust - Konten harus cukup kuat untuk diinterpretasikan oleh berbagai agen pengguna

---

## 3. Accessibility Test Scenarios

### 3.1 Keyboard Navigation Tests

```javascript
// tests/e2e/accessibility/keyboard-navigation.spec.js
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('should navigate login form with keyboard', async ({ page }) => {
    await page.goto('/login');

    // Focus email input
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="email"]')).toBeFocused();

    // Type email
    await page.keyboard.type('guru@siswapresensi.com');

    // Tab to password input
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="password"]')).toBeFocused();

    // Type password
    await page.keyboard.type('password123');

    // Tab to submit button
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();

    // Submit form
    await page.keyboard.press('Enter');

    // Verify login successful
    await expect(page).toHaveURL('/dashboard');
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/login');

    // Focus email input
    await page.locator('input[name="email"]').focus();

    // Verify focus indicator is visible
    const emailInput = page.locator('input[name="email"]');
    const focusStyle = await email
Input.evaluate(el => {
      return window.getComputedStyle(el).outline;
    });

    expect(focusStyle).not.toBe('none');
  });

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/');

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');

    // Verify skip link is visible when focused
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();

    // Press Enter to skip to main content
    await page.keyboard.press('Enter');

    // Verify focus moved to main content
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('should have logical tab order', async ({ page }) => {
    await page.goto('/login');

    const focusableElements = await page.locator('button, input, a, select, textarea').all();

    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });
});
```

### 3.2 Screen Reader Tests

```javascript
// tests/e2e/accessibility/screen-reader.spec.js
import { test, expect } from '@playwright/test';

test.describe('Screen Reader Compatibility', () => {
  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const image of images) {
      const altText = await image.getAttribute('alt');
      expect(altText).not.toBeNull();
      expect(altText).not.toBe('');
    }
  });

  test('should have labels for form fields', async ({ page }) => {
    await page.goto('/login');

    const inputs = await page.locator('input').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  });

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/login');

    // Fill form and submit
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Verify error message is announced
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/');

    // Verify main landmark
    await expect(page.locator('[role="main"]')).toBeVisible();

    // Verify navigation landmark
    await expect(page.locator('[role="navigation"]')).toBeVisible();

    // Verify header landmark
    await expect(page.locator('[role="banner"]')).toBeVisible();

    // Verify footer landmark
    await expect(page.locator('[role="contentinfo"]')).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;

    for (const heading of headings) {
      const level = parseInt(await heading.evaluate(el => el.tagName.charAt(1)));
      expect(level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = level;
    }
  });
});
```

### 3.3 Color Contrast Tests

```javascript
// tests/e2e/accessibility/color-contrast.spec.js
import { test, expect } from '@playwright/test';

test.describe('Color Contrast', () => {
  test('should have sufficient color contrast for text', async ({ page }) => {
    await page.goto('/');

    const textElements = await page.locator('p, span, div, a, button').all();

    for (const element of textElements) {
      const color = await element.evaluate(el => {
        return window.getComputedStyle(el).color;
      });

      const backgroundColor = await element.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const contrastRatio = calculateContrastRatio(color, backgroundColor);

      // WCAG AA requires 4.5:1 for normal text
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('should have sufficient color contrast for large text', async ({ page }) => {
    await page.goto('/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    for (const heading of headings) {
      const color = await heading.evaluate(el => {
        return window.getComputedStyle(el).color;
      });

      const backgroundColor = await heading.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const contrastRatio = calculateContrastRatio(color, backgroundColor);

      // WCAG AA requires 3:1 for large text
      expect(contrastRatio).toBeGreaterThanOrEqual(3);
    }
  });

  test('should not use color alone to convey information', async ({ page }) => {
    await page.goto('/siswa/presensi');

    // Verify status indicators have text labels
    const statusIndicators = await page.locator('[data-testid="status-indicator"]').all();

    for (const indicator of statusIndicators) {
      const ariaLabel = await indicator.getAttribute('aria-label');
      expect(ariaLabel).not.toBeNull();
    }
  });

  function calculateContrastRatio(foreground, background) {
    // Convert colors to RGB
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    // Calculate relative luminance
    const fgLuminance = calculateLuminance(fg.r, fg.g, fg.b);
    const bgLuminance = calculateLuminance(bg.r, bg.g, bg.b);

    // Calculate contrast ratio
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  function hexToRgb(hex) {
    // Convert hex color to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  function calculateLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
});
```

### 3.4 Form Accessibility Tests

```javascript
// tests/e2e/accessibility/form-accessibility.spec.js
import { test, expect } from '@playwright/test';

test.describe('Form Accessibility', () => {
  test('should have labels for all form fields', async ({ page }) => {
    await page.goto('/login');

    const inputs = await page.locator('input').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  });

  test('should have error messages associated with fields', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Verify error messages are visible
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

    // Verify error messages are associated with fields
    const emailInput = page.locator('input[name="email"]');
    const errorMessage = page.locator('[data-testid="error-message"]');
    const ariaDescribedBy = await emailInput.getAttribute('aria-describedby');

    expect(ariaDescribedBy).toContain(await errorMessage.getAttribute('id'));
  });

  test('should indicate required fields', async ({ page }) => {
    await page.goto('/login');

    const requiredInputs = await page.locator('input[required]').all();

    for (const input of requiredInputs) {
      const ariaRequired = await input.getAttribute('aria-required');
      expect(ariaRequired).toBe('true');
    }
  });

  test('should have form submission status announced', async ({ page }) => {
    await page.goto('/login');

    // Fill form and submit
    await page.fill('input[name="email"]', 'guru@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify success message is announced
    const successMessage = page.locator('[role="status"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveAttribute('aria-live', 'polite');
  });
});
```

---

## 4. Accessibility Testing Tools

### 4.1 axe DevTools

```javascript
// tests/e2e/accessibility/axe-core.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing with axe DevTools', () => {
  test('should not have accessibility violations on login page', async ({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'guru@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on siswa presensi page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'siswa@siswapresensi.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/siswa/presensi');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### 4.2 Lighthouse Accessibility Audit

```bash
# Run Lighthouse accessibility audit
lighthouse http://localhost:8000 --view --only-categories=accessibility --output=html --output-path=accessibility-report.html

# Run Lighthouse audit with CI
lighthouse http://localhost:8000 --chrome-flags="--headless" --only-categories=accessibility --output=json --output-path=accessibility-report.json
```

### 4.3 WAVE Browser Extension

1. Install WAVE browser extension
2. Navigate to application pages
3. Click WAVE icon to run accessibility audit
4. Review and fix any errors or alerts

---

## 5. Accessibility Checklist

### Visual Design

- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text
- [ ] Text resizable up to 200% without loss of content
- [ ] No color-only information
- [ ] Clear focus indicators
- [ ] Consistent visual design

### Keyboard Navigation

- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] Skip to main content link
- [ ] Keyboard shortcuts for common actions
- [ ] No keyboard traps

### Screen Reader Compatibility

- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] ARIA landmarks defined
- [ ] Dynamic content announced
- [ ] Error messages associated with fields
- [ ] Proper heading hierarchy

### Forms

- [ ] All form fields have labels
- [ ] Error messages associated with fields
- [ ] Required fields indicated
- [ ] Form validation feedback clear
- [ ] Form submission status announced
- [ ] Instructions provided when needed

### Multimedia Content

- [ ] Captions provided for videos
- [ ] Audio descriptions provided
- [ ] Transcripts provided for audio
- [ ] Keyboard controls for media players
- [ ] No auto-playing media

### Mobile Accessibility

- [ ] Touch targets ≥ 44x44 pixels
- [ ] Sufficient spacing between interactive elements
- [ ] Responsive design works with screen magnification
- [ ] Orientation changes handled properly

---

## 6. Running Accessibility Tests

```bash
# Run accessibility tests with Playwright
npm run test:e2e tests/e2e/accessibility

# Run axe DevTools tests
npm run test:accessibility

# Run Lighthouse audit
npm run lighthouse:accessibility

# Run all accessibility tests
npm run test:accessibility:all
```

---

## 7. Test Coverage Targets

| Accessibility Area | Target | Current |
|-------------------|--------|----------|
| Keyboard Navigation | 100% | - |
| Screen Reader Compatibility | 100% | - |
| Color Contrast | 100% | - |
| Form Accessibility | 100% | - |
| ARIA Landmarks | 100% | - |
| Alt Text | 100% | - |

---

## 8. Best Practices

- Use semantic HTML elements
- Provide alternative text for images
- Use ARIA attributes appropriately
- Ensure keyboard accessibility
- Test with screen readers
- Maintain proper heading hierarchy
- Provide sufficient color contrast
- Make forms accessible
- Test on mobile devices
- Regular accessibility audits
- Involve users with disabilities in testing
- Document accessibility decisions

---

## 9. Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/)
- [Lighthouse Accessibility](https://developers.google.com/web/tools/lighthouse)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
