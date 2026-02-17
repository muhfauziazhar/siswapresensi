# Phases & Milestones - SiswaPresensi

## Phase 1: Discovery & Planning (Jan 2026)

**Goal:** Define scope, requirements, and project plan

**Duration:** 4 weeks (iJan 2026)

**Deliverables:**
- [x] Business requirements document (BA/0101-overview.md)
- [x] User personas (BA/0102-user-personas.md)
- [x] User journey mapping (BA/0103-user-journey.md)
- [x] Feature prioritization (BA/0104-features.md)
- [x] Business rules (BA/0105-business-rules.md)
- [x] Constraints (BA/0106-constraints.md)
- [x] Success metrics (BA/0107-success-metrics.md)
- [ ] Project roadmap (PM/0201-roadmap.md)
- [ ] Phases & milestones (PM/0202-phases.md)
- [ ] Resource allocation (PM/0203-resources.md)
- [ ] Risk assessment (PM/0204-risks.md)
- [ ] Dependencies (PM/0205-dependencies.md)
- [ ] Quality standards (PM/0206-quality-standards.md)
- [ ] Communication plan (PM/0207-communication.md)
- [ ] Technical specifications (DEV/0401-tech-stack.md)
- [ ] Architecture diagram (DEV/0402-architecture.md)
- [ ] API contract (DEV/0403-api-contract.md)
- [ ] Database schema (DEV/0404-data-model.md)

**Timeline:**
- Week 1-2: Business analysis (BA role)
- Week 3-4: Project planning (PM role)

**Dependencies:** None

**Risks:**
- **High:** Unclear requirements leading to scope creep
- **Medium:** Stakeholder misalignment on priorities
- **Low:** Documentation delays

**Success Criteria:**
- All BA documentation complete
- All PM documentation complete
- Technical specifications defined
- Stakeholder approval received

**Milestone:** Requirements Complete (Feb 2026)

---

## Phase 2: Foundation Setup (Feb 2026)

**Goal:** Setup project infrastructure and core architecture

**Duration:** 4 weeks (Feb 2026)

**Deliverables:**
- [ ] Project repository structure
- [ ] Laravel + Inertia.js setup
- [ ] Database setup & migrations
- [ ] Authentication system (Laravel Fortify)
- [ ] Basic API structure
- [ ] UI component library (Tailwind CSS)
- [ ] Development environment setup
- [ ] Staging environment setup
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] Code quality tools (ESLint, Prettier, PHP CS Fixer)

**Timeline:**
- Week 1: Project initialization & database setup
- Week 2: Authentication & authorization
- Week 3: API structure & UI components
- Week 4: CI/CD & development environment

**Dependencies:** Phase 1 (Discovery & Planning)

**Risks:**
- **High:** Tech stack incompatibility
- **Medium:** Database design issues
- **Low:** CI/CD setup delays

**Success Criteria:**
- Project builds successfully
- Authentication works
- Database migrations run
- CI/CD pipeline functional

**Milestone:** Foundation Complete (Mar 2026)

---

## Phase 3: MVP Development (Mar 2026)

**Goal:** Implement core features (Priority 1 - Must Have)

**Duration:** 4 weeks (Mar 2026)

**Deliverables:**

### Backend Features
- [ ] User Authentication (Login Admin)
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
- [ ] Laporan Presensi

### Frontend Features
- [ ] Dashboard Per Role (Admin, Guru, Siswa, Orang Tua)
- [ ] Public jadwal page
- [ ] Presensi flow (Guru)
- [ ] QR code display (Siswa)
- [ ] Request izin/sakit form (Orang Tua)
- [ ] Approval page (Guru)
- [ ] Admin management pages
- [ ] Transaction report page

**Timeline:**
- Week 1: Manajemen data (Users, Kelas, Mapel, Jadwal)
- Week 2: QR Code System & Presensi Flow
- Week 3: Approval Workflow & Auto-Marking
- Week 4: Dashboard & Reports

**Dependencies:** Phase 2 (Foundation Setup)

**Risks:**
- **High:** QR code generation/validation issues
- **Medium:** Database design issues
- **Low:** UI/UX delays

**Success Criteria:**
- All Priority 1 features implemented
- End-to-end presensi flow works
- QR code system functional
- Dashboard functional for all roles

**Milestone:** MVP Complete (Apr 2026)

---

## Phase 4: Enhancement (Apr 2026)

**Goal:** Implement secondary features (Priority 2 - Should Have)

**Duration:** 4 weeks (Apr 2026)

**Deliverables:**
- [ ] Real-Time Notifications
- [ ] Geofencing (Optional)
- [ ] Import/Export Data
- [ ] Mobile-Responsive Design

**Timeline:**
- Week 1: Real-Time Notifications
- Week 2: Geofencing
- Week 3: Import/Export Data
- Week 4: Mobile-Responsive Design

**Dependencies:** Phase 3 (MVP Development)

**Risks:**
- **Medium:** Firebase integration issues
- **Medium:** Google Maps integration issues
- **Low:** Mobile responsiveness issues

**Success Criteria:**
- All Priority 2 features implemented
- Notification system functional
- Mobile-optimized UI
- Import/Export functional

**Milestone:** Enhancement Complete (Mei 2026)

---

## Phase 5: Testing & Bug Fixing (Mei 2026)

**Goal:** Quality assurance (QA), testing, and bug fixing

**Duration:** 4 weeks (Mei 2026)

**Deliverables:**

### Testing
- [ ] Unit tests (Jest/Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance tests
- [ ] Security tests
- [ ] Accessibility tests
- [ ] User acceptance testing (UAT)

### Bug Fixing
- [ ] Critical bugs resolved (SLA: 4 hours)
- [ ] High bugs resolved (SLA: 24 hours)
- [ ] Medium bugs resolved (SLA: 3 days)
- [ ] Low bugs resolved (SLA: 1 week)

**Timeline:**
- Week 1: Unit & integration testing
- Week 2: E2E testing & bug fixing
- Week 3: Performance & security testing
- Week 4: Accessibility testing & UAT

**Dependencies:** Phase 4 (Enhancement)

**Risks:**
- **High:** Critical bugs found late in testing
- **Medium:** Performance issues discovered
- **Low:** Minor UI bugs

**Success Criteria:**
- Test coverage > 80%
- All critical bugs resolved
- Performance targets met
- Security vulnerabilities addressed
- Accessibility compliant (WCAG 2.1 AA)

**Milestone:** Testing Complete (iJun 2026)

---

## Phase 6: Deployment & Launch (iJun 2026)

**Goal:** Production deployment and go-live

**Duration:** 4 weeks (iJun 2026)

**Deliverables:**
- [ ] Production environment setup
- [ ] Database migration to production
- [ ] SSL certificate setup (HTTPS)
- [ ] Firebase setup (Web Push notifications)
- [ ] Google Maps setup (Geofencing, optional)
- [ ] Monitoring & logging setup (Sentry)
- [ ] Backup & recovery setup
- [ ] Final documentation
- [ ] Launch & go-live
- [ ] Post-launch monitoring

**Timeline:**
- Week 1: Production environment setup
- Week 2: Database migration & SSL setup
- Week 3: Third-party integrations production setup
- Week 4: Launch & post-launch monitoring

**Dependencies:** Phase 5 (Testing & Bug Fixing)

**Risks:**
- **High:** Production deployment issues
- **Medium:** Database migration issues
- **Low:** Post-launch bugs

**Success Criteria:**
- Production deployment successful
- System live and accessible
- Monitoring functional
- Backup & recovery functional
- Documentation complete

**Milestone:** Launch Complete (iJun 2026)

---

## Phase 7: Post-Launch Support (Jul 2026 onwards)

**Goal:** Ongoing support, maintenance, and improvements

**Duration:** Ongoing

**Deliverables:**
- [ ] Bug monitoring & fixing
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Minor improvements
- [ ] Priority 3 features (Nice to Have) - Optional

**Timeline:**
- Ongoing

**Dependencies:** Phase 6 (Deployment & Launch)

**Risks:**
- **Medium:** Post-launch critical bugs
- **Low:** Performance degradation over time

**Success Criteria:**
- System stable
- User feedback positive
- Metrics meeting targets

---

## Milestone Summary

| Milestone | Date | Status | Description |
|-----------|------|--------|-------------|
| Requirements Complete | Feb 2026 | Complete | BA & PM documentation complete |
| Foundation Complete | Mar 2026 | Pending | Infrastructure & core architecture |
| MVP Complete | Apr 2026 | Pending | Core features (Priority 1) |
| Enhancement Complete | Mei 2026 | Pending | Secondary features (Priority 2) |
| Testing Complete | Jun 2026 | Pending | Quality assurance & bug fixing |
| Launch Complete | Jun 2026 | Pending | Production deployment & go-live |

---

## Critical Path

The critical path for the project is:

1. **Phase 1** → Phase 2 → Phase 3 → Phase 6 (Minimum Viable Product)

This represents the shortest path to deliver a working system. Phase 4 (Enhancement) and Phase 5 (Testing) can be adjusted if timeline constraints arise.

---

## Dependencies Between Phases

```
Phase 1 (Discovery & Planning)
    ↓
Phase 2 (Foundation Setup)
    ↓
Phase 3 (MVP Development)
    ↓
Phase 4 (Enhancement) ← Can be deferred if needed
    ↓
Phase 5 (Testing & Bug Fixing)
    ↓
Phase 6 (Deployment & Launch)
    ↓
Phase 7 (Post-Launch Support)
```

---

## Dokumentasi Terkait
- [Project Roadmap](./0201-roadmap.md)
- [Resource Allocation](./0203-resources.md)
- [Risk Assessment](./0204-risks.md)
- [Dependencies](./0205-dependencies.md)
- [Quality Standards](./0206-quality-standards.md)
- [Communication Plan](./0207-communication.md)
