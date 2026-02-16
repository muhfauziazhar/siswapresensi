# Bug Reporting - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Bug Reporting SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | QA Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan proses bug reporting untuk SiswaPresensi, termasuk cara melaporkan bug, template, dan workflow.

---

## 2. Bug Severity Levels

| Severity | Description | Response Time | Example |
|----------|-------------|---------------|----------|
| **Critical** | System down, data loss, security breach | 4 hours | Login tidak berfungsi, database crash |
| **High** | Major functionality broken, workaround exists | 24 hours | QR code tidak dapat discan, presensi tidak tersimpan |
| **Medium** | Minor functionality broken, workaround exists | 3 days | Tanggal tidak tampil dengan benar, salah label |
| **Low** | Cosmetic issue, typo, minor UI issue | 1 week | Warna tidak konsisten, typo di teks |
| **Trivial** | Very minor issue, doesn't affect functionality | 2 weeks | Spasi ekstra, format tidak sempurna |

---

## 3. Bug Priority Levels

| Priority | Description | When to Use |
|----------|-------------|--------------|
| **P0** | Must fix before next release | Critical security issues, blocking bugs |
| **P1** | Should fix in next release | High severity bugs, major functionality issues |
| **P2** | Fix when possible | Medium severity bugs, minor functionality issues |
| **P3** | Fix in future release | Low severity bugs, cosmetic issues |
| **P4** | Nice to have | Trivial issues, enhancements |

---

## 4. Bug Reporting Template

### 4.1 GitHub Issue Template

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] <brief description>'
labels: 'bug'
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Screenshots/Videos

If applicable, add screenshots or videos to help explain your problem.

## Environment

- **OS:** [e.g., Windows 10, macOS 12, Ubuntu 22.04]
- **Browser:** [e.g., Chrome 96, Firefox 95, Safari 15]
- **Device:** [e.g., Desktop, iPhone 12, Samsung Galaxy S21]
- **Version:** [e.g., v1.0.0, develop branch]

## Additional Context

Add any other context about the problem here.

## Logs/Error Messages

```
Paste any relevant logs or error messages here
```

## Related Issues

- [ ] #123
- [ ] #456
```

### 4.2 Jira Bug Template

```
Summary: [BUG] QR code tidak dapat discan pada mobile

Description:
Apa yang terjadi?
Ketika siswa mencoba scan QR code menggunakan kamera mobile, QR code tidak terdeteksi.

Bagaimana seharusnya?
QR code seharusnya dapat terdeteksi dan presensi berhasil dicatat.

Langkah-langkah untuk mereproduksi:
1. Buka aplikasi SiswaPresensi di mobile
2. Login sebagai siswa
3. Buka halaman scan QR code
4. Arahkan kamera ke QR code
5. QR code tidak terdeteksi

Environment:
- OS: iOS 15.0
- Browser: Safari
- Device: iPhone 12
- Version: v1.0.0

Severity: High
Priority: P1

Attachments:
- screenshot-qr-code-issue.png
- video-recording.mp4

Labels:
- bug
- mobile
- qr-code
- high-severity
```

---

## 5. Bug Reporting Workflow

### 5.1 Bug Discovery

1. **Discover Bug**
   - During testing
   - During development
   - From user feedback
   - From monitoring alerts

2. **Reproduce Bug**
   - Document steps to reproduce
   - Verify bug is reproducible
   - Note environment details

3. **Document Bug**
   - Use bug reporting template
   - Include all relevant information
   - Attach screenshots/videos
   - Include logs/error messages

4. **Submit Bug Report**
   - Create GitHub issue
   - Assign appropriate labels
   - Set severity and priority
   - Notify relevant team members

### 5.2 Bug Triage

1. **Review Bug Report**
   - Verify bug is reproducible
   - Assess severity and priority
   - Determine impact

2. **Assign Bug**
   - Assign to appropriate developer
   - Set due date based on severity
   - Add to appropriate sprint

3. **Track Bug**
   - Update status regularly
   - Document progress
   - Communicate with stakeholders

### 5.3 Bug Resolution

1. **Fix Bug**
   - Developer implements fix
   - Write tests to prevent regression
   - Document changes

2. **Test Fix**
   - QA verifies fix
   - Run regression tests
   - Verify no new issues introduced

3. **Close Bug**
   - Update issue with resolution details
   - Close issue
   - Notify stakeholders

---

## 6. Bug Reporting Best Practices

### 6.1 Before Reporting

- **Search first** - Check if bug already reported
- **Reproduce consistently** - Ensure bug is reproducible
- **Document steps** - Provide clear steps to reproduce
- **Gather evidence** - Collect screenshots, videos, logs
- **Check environment** - Note OS, browser, version details

### 6.2 When Reporting

- **Use template** - Follow bug reporting template
- **Be specific** - Provide clear, concise description
- **Include context** - Add environment details
- **Attach evidence** - Include screenshots, videos, logs
- **Set severity** - Assign appropriate severity level
- **Set priority** - Assign appropriate priority level

### 6.3 After Reporting

- **Monitor progress** - Track bug status
- **Provide feedback** - Respond to questions
- **Test fix** - Verify fix when ready
- **Close issue** - Confirm bug is resolved

---

## 7. Bug Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **UI/UX** | User interface and user experience issues | Layout problems, broken styles, navigation issues |
| **Functionality** | Feature not working as expected | Buttons not working, forms not submitting, calculations incorrect |
| **Performance** | Performance-related issues | Slow load times, high memory usage, laggy interactions |
| **Security** | Security vulnerabilities | SQL injection, XSS, authentication bypass |
| **Data** | Data-related issues | Data not saving, incorrect data display, data loss |
| **Integration** | Integration issues with external services | API failures, third-party service issues |
| **Compatibility** | Browser/device compatibility issues | Not working on specific browser, mobile issues |
| **Accessibility** | Accessibility issues | Keyboard navigation, screen reader, color contrast |

---

## 8. Bug Tracking Tools

### 8.1 GitHub Issues

**Advantages:**
- Integrated with code repository
- Easy to use
- Free for public repositories
- Good for open-source projects

**When to Use:**
- Small to medium projects
- Open-source projects
- Teams already using GitHub

### 8.2 Jira

**Advantages:**
- Powerful project management
- Custom workflows
- Advanced reporting
- Good for enterprise

**When to Use:**
- Large enterprise projects
- Complex workflows
- Teams already using Jira

### 8.3 Bugzilla

**Advantages:**
- Dedicated bug tracking
- Advanced features
- Customizable
- Good for large projects

**When to Use:**
- Large projects
- Teams already using Bugzilla
- Need dedicated bug tracking

---

## 9. Bug Metrics

### 9.1 Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Bug Discovery Rate** | Number of bugs discovered per week | < 10 |
| **Bug Fix Rate** | Number of bugs fixed per week | > 10 |
| **Bug Backlog** | Number of open bugs | < 50 |
| **Critical Bugs** | Number of critical bugs | 0 |
| **High Severity Bugs** | Number of high severity bugs | < 5 |
| **Mean Time to Detect (MTTD)** | Average time to discover bugs | < 24 hours |
| **Mean Time to Resolve (MTTR)** | Average time to resolve bugs | < 72 hours |
| **Bug Reopen Rate** | Percentage of bugs reopened | < 5% |

### 9.2 Reporting

**Weekly Bug Report:**

```markdown
# Bug Report - Week 7, 2024

## Summary

| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Bugs Discovered | 8 | 12 | -33% |
| Bugs Fixed | 10 | 8 | +25% |
| Bug Backlog | 45 | 47 | -2 |
| Critical Bugs | 0 | 0 | 0 |
| High Severity Bugs | 3 | 5 | -40% |
| MTTD | 18 hours | 24 hours | -25% |
| MTTR | 60 hours | 72 hours | -17% |

## Top 5 Bugs

1. [Critical] QR code tidak dapat discan pada mobile (#123)
2. [High] Presensi tidak tersimpan saat offline (#124)
3. [High] Laporan tidak dapat digenerate untuk kelas tertentu (#125)
4. [Medium] Tanggal tidak tampil dengan benar di dashboard (#126)
5. [Medium] Notifikasi tidak dikirim ke orang tua (#127)

## Bugs Fixed This Week

1. Login tidak berfungsi pada Safari (#118)
2. Form izin tidak dapat disubmit (#119)
3. QR code expiry tidak berfungsi (#120)
4. Reverse marking tidak update database (#121)
5. Dashboard tidak tampilkan statistik (#122)

## Recommendations

1. Prioritize critical and high severity bugs
2. Increase test coverage for QR code functionality
3. Implement offline support for presensi
4. Fix report generation for all classes
5. Test on mobile devices more frequently

## Next Steps

1. Fix QR code scanning issue on mobile
2. Implement offline presensi support
3. Fix report generation
4. Test mobile compatibility
5. Increase automated testing
```

---

## 10. Bug Prevention

### 10.1 Code Review

- **Review all code changes**
- **Check for common bugs**
- **Verify test coverage**
- **Ensure security best practices**

### 10.2 Automated Testing

- **Unit tests** - Test individual components
- **Integration tests** - Test component interactions
- **E2E tests** - Test user flows
- **Performance tests** - Test performance

### 10.3 Static Analysis

- **Use linters** - Catch code style issues
- **Use type checkers** - Catch type errors
- **Use security scanners** - Catch security vulnerabilities

### 10.4 Code Quality

- **Follow coding standards**
- **Write clean, maintainable code**
- **Document code**
- **Refactor regularly**

---

## 11. Communication

### 11.1 Bug Notification

- **Slack channel** - #siswapresensi-bugs
- **Email** - qa@siswapresensi.com
- **Stand-up** - Daily stand-up meeting

### 11.2 Bug Discussion

- **GitHub comments** - Discuss bug in issue
- **Slack discussion** - Discuss in Slack channel
- **Meeting** - Schedule meeting if needed

### 11.3 Bug Updates

- **Comment on issue** - Update bug status
- **Notify team** - Notify relevant team members
- **Update stakeholders** - Keep stakeholders informed

---

## 12. Documentation

### 12.1 Bug Documentation

- **Document all bugs** - Create bug report for each bug
- **Document resolution** - Document how bug was fixed
- **Document lessons learned** - Document what was learned

### 12.2 Knowledge Base

- **Create knowledge base** - Document common bugs
- **Share knowledge** - Share with team
- **Update regularly** - Keep knowledge base up to date

---

## 13. Training

### 13.1 Bug Reporting Training

- **Train team** - Train team on bug reporting process
- **Provide examples** - Provide good examples
- **Review bug reports** - Review bug reports regularly

### 13.2 Bug Prevention Training

- **Train on best practices** - Train on code quality
- **Train on testing** - Train on testing strategies
- **Train on security** - Train on security best practices

---

## Dokumentasi Terkait
- [Test Strategy](./0301-test-strategy.md)
- [Unit Tests](./0302-unit-tests.md)
- [Integration Tests](./0303-integration-tests.md)
- [E2E Tests](./0304-e2e-tests.md)
- [Performance Tests](./0305-performance-tests.md)
- [Security Tests](./0306-security-tests.md)
- [Accessibility Tests](./0307-accessibility-tests.md)
