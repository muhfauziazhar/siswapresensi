# Project Roadmap - SiswaPresensi

## Project Summary

- **Name:** SiswaPresensi
- **Duration:** Q1-Q2 2026 (Januari - Juni 2026, 6 bulan)
- **Team Size:** 3-4 orang
- **Budget:** Open-source (tidak ditentukan)

## High-Level Timeline

```
[Jan 2026] → Discovery & Planning (Business Analysis)
[Feb 2026] → Foundation Setup (Infrastructure & Core)
[Mar 2026] → MVP Development (Priority 1 Features)
[Apr 2026] → Enhancement (Priority 2 Features)
[Mei 2026] → Testing & Bug Fixing
[Jun 2026] → Deployment & Launch
```

## Monthly Breakdown

### Januari 2026: Discovery & Planning
**Focus:** Business analysis, requirements gathering, project planning

**Key Activities:**
- [x] Business analysis (BA role)
- [x] User personas & journey mapping
- [x] Feature prioritization (MVP vs full scope)
- [x] Business rules & constraints definition
- [x] Success metrics definition
- [x] Project planning (PM role)

**Deliverables:**
- [x] BA documentation (7 files)
- [ ] PM documentation (7 files)
- [ ] Technical architecture design
- [ ] Database schema design
- [ ] API contract definition

**Milestone:** ✅ Requirements Complete (Feb 2026)

---

### Februari 2026: Foundation Setup
**Focus:** Infrastructure setup, core architecture, authentication

**Key Activities:**
- [ ] Project initialization (Laravel + Inertia.js)
- [ ] Database setup & migrations
- [ ] Authentication system (Laravel Fortify)
- [ ] Basic UI component library (Tailwind CSS)
- [ ] Development environment setup
- [ ] CI/CD pipeline setup

**Deliverables:**
- [ ] Project repository structure
- [ ] Database schema v1
- [ ] Authentication module
- [ ] Base UI components
- [ ] Development & staging environments

**Milestone:** 🎯 Foundation Complete (Mar 2026)

---

### Maret 2026: MVP Development
**Focus:** Core features (Priority 1 - Must Have)

**Key Activities:**
- [ ] User Authentication & Authorization (4 roles)
- [ ] Manajemen Sekolah (Kelas, Mapel, Jadwal)
- [ ] Manajemen Siswa
- [ ] Manajemen Guru
- [ ] Manajemen Orang Tua
- [ ] QR Code Generation
- [ ] QR Code Validation (Scan)
- [ ] Reverse Marking
- [ ] Request Izin/Sakit
- [ ] Approval Workflow
- [ ] Auto-Marking Presensi
- [ ] Dashboard Per Role
- [ ] Laporan Presensi

**Deliverables:**
- [ ] All Priority 1 features implemented
- [ ] Authentication functional
- [ ] QR code system functional
- [ ] Presensi system functional
- [ ] Dashboard functional for all roles

**Milestone:** 🚀 MVP Complete (Apr 2026)

---

### April 2026: Enhancement
**Focus:** Secondary features (Priority 2 - Should Have)

**Key Activities:**
- [ ] Real-Time Notifications
- [ ] Geofencing (Optional)
- [ ] Import/Export Data
- [ ] Mobile-Responsive Design

**Deliverables:**
- [ ] All Priority 2 features implemented
- [ ] Notification system functional
- [ ] Mobile-optimized UI
- [ ] Import/Export functional

**Milestone:** ✨ Enhancement Complete (Mei 2026)

---

### Mei 2026: Testing & Bug Fixing
**Focus:** Quality assurance, testing, and bug fixing

**Key Activities:**
- [ ] Unit testing (Jest/Vitest)
- [ ] Integration testing
- [ ] E2E testing (Playwright/Cypress)
- [ ] Performance testing
- [ ] Security testing
- [ ] Accessibility testing
- [ ] Bug fixing & refinement
- [ ] User acceptance testing (UAT)

**Deliverables:**
- [ ] Test coverage > 80%
- [ ] All critical bugs resolved
- [ ] Performance targets met
- [ ] Security vulnerabilities addressed
- [ ] Accessibility compliant (WCAG 2.1 AA)

**Milestone:** 🧪 Testing Complete (Jun 2026)

---

### Juni 2026: Deployment & Launch
**Focus:** Production deployment and go-live

**Key Activities:**
- [ ] Production environment setup
- [ ] Database migration to production
- [ ] SSL certificate setup (HTTPS)
- [ ] Firebase setup (notifications)
- [ ] Google Maps setup (geofencing, optional)
- [ ] Monitoring & logging setup (Sentry)
- [ ] Backup & recovery setup
- [ ] Final documentation
- [ ] Launch & go-live
- [ ] Post-launch monitoring

**Deliverables:**
- [ ] Production deployment
- [ ] Monitoring dashboard
- [ ] Backup & recovery system
- [ ] Complete documentation
- [ ] Live system

**Milestone:** 🎉 Launch Complete (Jun 2026)

---

## Risk-Based Timeline Adjustments

### Contingency Plan

**Scenario 1: Technical Challenges (1-2 weeks delay)**
- If MVP development takes longer than expected:
  - Defer Priority 2 features to post-launch
  - Focus on core MVP features only
  - Extend testing phase by 1 week

**Scenario 2: Resource Constraints (2-3 weeks delay)**
- If team availability is reduced:
  - Reduce scope to absolute MVP only
  - Extend timeline by 2-3 weeks
  - Consider hiring additional resources

**Scenario 3: Integration Issues (1 week delay)**
- If third-party integrations (Firebase, Google Maps) have issues:
  - Implement fallback solutions
  - Extend testing phase by 1 week
  - Document workarounds

---

## Success Criteria

### Technical Success
- [ ] All Priority 1 features implemented
- [ ] Test coverage > 80%
- [ ] Performance targets met (< 2s load time, < 200ms API response)
- [ ] Security vulnerabilities addressed
- [ ] Accessibility compliant (WCAG 2.1 AA)

### Business Success
- [ ] System deployed and live
- [ ] User acceptance testing passed
- [ ] Documentation complete
- [ ] Team handover complete

### User Success
- [ ] Presensi flow works end-to-end
- [ ] QR code system functional
- [ ] Approval workflow functional
- [ ] Dashboard functional for all roles

---

## Dependencies

### External Dependencies
- Firebase (Web Push) - Required for notifications
- Google Maps API - Required for geofencing (optional)

### Internal Dependencies
- BA documentation - Complete ✅
- PM documentation - In progress
- Technical architecture - Pending
- Database schema - Pending

---

## Next Steps

1. **Immediate (This Week):**
   - Complete PM documentation
   - Design technical architecture
   - Design database schema

2. **Short-term (February 2026):**
   - Initialize project
   - Setup development environment
   - Implement authentication

3. **Medium-term (March-April 2026):**
   - Develop MVP features
   - Develop Priority 2 features

4. **Long-term (May-June 2026):**
   - Testing & bug fixing
   - Deployment & launch

---

## Dokumentasi Terkait
- [Phases & Milestones](./0202-phases.md)
- [Resource Allocation](./0203-resources.md)
- [Risk Assessment](./0204-risks.md)
- [Dependencies](./0205-dependencies.md)
- [Quality Standards](./0206-quality-standards.md)
- [Communication Plan](./0207-communication.md)
