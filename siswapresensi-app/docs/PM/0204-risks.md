# Risk Assessment - SiswaPresensi

## Risk 1: Scope Creep

**Probability:** High
**Impact:** High
**Description:** Requirements keep expanding during development, leading to timeline delays and budget overruns.

**Mitigation:**
- Clearly define MVP scope upfront
- Use change request process for new features
- Prioritize features (Must Have vs Should Have vs Nice to Have)
- Regular stakeholder reviews to align on scope
- Defer non-critical features to post-launch

**Owner:** Project Manager
**Status:** Open

---

## Risk 2: QR Code Generation/Validation Issues

**Probability:** High
**Impact:** High
**Description:** Difficulties with QR code generation or validation, causing delays in core functionality.

**Mitigation:**
- Research QR code libraries thoroughly upfront
- Start QR code system development early (Phase 3)
- Use sandbox environment for testing
- Have fallback solution (manual input)
- Document QR code generation and validation process clearly

**Owner:** Backend Developer
**Status:** Open

---

## Risk 3: Technical Debt Accumulation

**Probability:** Medium
**Impact:** High
**Description:** Rushing development leads to poor code quality, making future maintenance difficult.

**Mitigation:**
- Enforce code review process
- Use linting and formatting tools
- Write unit tests for critical components
- Schedule regular refactoring time
- Follow coding standards strictly
- Document technical decisions

**Owner:** Backend Developer, Frontend Developer
**Status:** Open

---

## Risk 4: Resource Constraints / Team Burnout

**Probability:** Medium
**Impact:** High
**Description:** Small team (3-4 people) may be overloaded, leading to burnout and reduced productivity.

**Mitigation:**
- Realistic timeline and scope
- Regular team check-ins
- Prioritize features ruthlessly
- Consider hiring additional resources if needed
- Encourage work-life balance
- Use agile methodology to adjust pace

**Owner:** Project Manager
**Status:** Open

---

## Risk 5: Database Design Issues

**Probability:** Medium
**Impact:** Medium
**Description:** Poor database schema design leads to performance issues and difficulty in querying data.

**Mitigation:**
- Design database schema thoroughly upfront
- Use ER diagrams to visualize relationships
- Consider normalization and indexing
- Test database performance with realistic data
- Plan for database migrations
- Document database schema

**Owner:** Backend Developer
**Status:** Open

---

## Risk 6: Security Vulnerabilities

**Probability:** Medium
**Impact:** High
**Description:** Security issues in the application could lead to data breaches or unauthorized access.

**Mitigation:**
- Use Laravel's built-in security features
- Implement proper authentication and authorization
- Validate all inputs (server-side and client-side)
- Use HTTPS/SSL for all communications
- Regular security audits and testing
- Keep dependencies up to date
- Follow OWASP security guidelines

**Owner:** Backend Developer, QA Engineer
**Status:** Open

---

## Risk 7: Performance Issues

**Probability:** Medium
**Impact:** Medium
**Description:** Application may be slow or unresponsive under load, affecting user experience.

**Mitigation:**
- Set performance targets upfront (< 2s load time, < 200ms API response)
- Use caching (Redis, Laravel cache)
- Optimize database queries
- Implement pagination for large datasets
- Use CDN for static assets
- Load testing before deployment
- Monitor performance in production

**Owner:** Backend Developer, Frontend Developer
**Status:** Open

---

## Risk 8: Third-Party Service Failures

**Probability:** Medium
**Impact:** Medium
**Description:** Third-party services (Firebase, Google Maps) may experience downtime or API changes.

**Mitigation:**
- Choose reliable third-party services
- Implement fallback mechanisms
- Monitor third-party service uptime
- Have contingency plans for service failures
- Document third-party integrations
- Consider multiple service options

**Owner:** Backend Developer
**Status:** Open

---

## Risk 9: Poor User Experience

**Probability:** Medium
**Impact:** Medium
**Description:** Application may be difficult to use, leading to low adoption and user frustration.

**Mitigation:**
- Follow user journey and personas from BA docs
- Conduct user testing during development
- Use intuitive UI/UX patterns
- Implement responsive design for mobile
- Provide clear error messages
- Consider accessibility (WCAG 2.1 AA)
- Gather user feedback regularly

**Owner:** Frontend Developer, Project Manager
**Status:** Open

---

## Risk 10: Testing Inadequacy

**Probability:** Medium
**Impact:** Medium
**Description:** Insufficient testing leads to bugs in production and poor system reliability.

**Mitigation:**
- Define test strategy early
- Write unit tests for critical components
- Implement integration tests for API endpoints
- Use E2E tests for critical user flows
- Set test coverage targets (> 80%)
- Schedule dedicated testing phase
- Use automated testing in CI/CD

**Owner:** QA Engineer, Backend Developer, Frontend Developer
**Status:** Open

---

## Risk 11: Deployment Issues

**Probability:** Low
**Impact:** High
**Description:** Problems during deployment to production could cause downtime or data loss.

**Mitigation:**
- Use staging environment for testing
- Automate deployment process (CI/CD)
- Document deployment process
- Have rollback plan ready
- Test deployment process thoroughly
- Monitor deployment closely
- Use database migrations carefully

**Owner:** Backend Developer, DevOps
**Status:** Open

---

## Risk 12: Legal & Compliance Issues

**Probability:** Low
**Impact:** High
**Description:** Non-compliance with regulations (GDPR, Indonesian law) could lead to legal issues.

**Mitigation:**
- Research applicable regulations
- Implement data protection measures
- Provide terms & conditions and privacy policy
- Allow users to request data deletion
- Follow PCI DSS for payment processing (if applicable)
- Consult legal counsel if needed

**Owner:** Project Manager, Backend Developer
**Status:** Open

---

## Risk 13: Documentation Gaps

**Probability:** Low
**Impact:** Medium
**Description:** Poor documentation makes maintenance and onboarding difficult.

**Mitigation:**
- Document code as you write it
- Keep README files up to date
- Document API endpoints
- Document deployment process
- Document business rules and logic
- Use inline comments for complex code
- Create user documentation for admin panel

**Owner:** All Team Members
**Status:** Open

---

## Risk 14: Stakeholder Misalignment

**Probability:** Low
**Impact:** Medium
**Description:** Stakeholders may have different expectations, leading to conflicts and rework.

**Mitigation:**
- Regular stakeholder meetings
- Clear communication of progress and issues
- Document decisions and changes
- Manage expectations realistically
- Get stakeholder approval at key milestones
- Provide regular progress reports

**Owner:** Project Manager
**Status:** Open

---

## Risk 15: Technology Obsolescence

**Probability:** Low
**Impact:** Low
**Description:** Chosen technology stack may become outdated or unsupported during development.

**Mitigation:**
- Choose stable, well-supported technologies
- Keep dependencies up to date
- Monitor for security vulnerabilities
- Plan for future upgrades
- Use LTS versions when available

Laravel 10/11 is LTS, React is widely adopted

**Owner:** Backend Developer, Frontend Developer
**Status:** Open

---

## Risk Summary

| Risk | Probability | Impact | Priority | Owner |
|------|-------------|---------|----------|-------|
| Scope Creep | High | High | P1 | Project Manager |
| QR Code Issues | High | High | P1 | Backend Developer |
| Technical Debt | Medium | High | P2 | Backend/Frontend Dev |
| Resource Constraints | Medium | High | P2 | Project Manager |
| Database Design Issues | Medium | Medium | P3 | Backend Developer |
| Security Vulnerabilities | Medium | High | P2 | Backend Developer, QA |
| Performance Issues | Medium | Medium | P3 | Backend/Frontend Dev |
| Third-Party Failures | Medium | Medium | P3 | Backend Developer |
| Poor User Experience | Medium | Medium | P3 | Frontend Developer |
| Testing Inadequacy | Medium | Medium | P3 | QA Engineer |
| Deployment Issues | Low | High | P2 | Backend Developer |
| Legal & Compliance | Low | High | P2 | Project Manager |
| Documentation Gaps | Low | Medium | P4 | All Team |
| Stakeholder Misalignment | Low | Medium | P4 | Project Manager |
| Technology Obsolescence | Low | Low | P4 | Backend/Frontend Dev |

---

## Risk Monitoring Plan

### Weekly Risk Review
- Review all open risks
- Update probability and impact based on new information
- Track mitigation progress
- Identify new risks

### Monthly Risk Report
- Summary of all risks
- Status of mitigation efforts
- New risks identified
- Risks that have been closed

### Risk Closure Criteria
A risk can be closed when:
- Mitigation has been implemented successfully
- Risk is no longer relevant (e.g., phase complete)
- Risk has been accepted by stakeholders

---

## Contingency Plans

### If Timeline Slips by 2-4 Weeks
- Defer Priority 3 features (Nice to Have)
- Reduce testing scope (focus on critical tests)
- Extend timeline by 2-4 weeks
- Communicate delay to stakeholders

### If Timeline Slips by 4+ Weeks
- Defer Priority 2 features (Should Have)
- Reduce scope to absolute MVP only
- Extend timeline significantly
- Re-evaluate project scope with stakeholders

### If Critical Bug Found Late
- Prioritize bug fix over new features
- Extend testing phase if needed
- Consider delaying launch
- Communicate issue to stakeholders

### If QR Code Integration Fails
- Implement manual input as fallback
- Consider alternative QR code library
- Delay launch until QR code is functional
- Communicate issue to stakeholders

---

## Dokumentasi Terkait
- [Project Roadmap](./0201-roadmap.md)
- [Phases & Milestones](./0202-phases.md)
- [Resource Allocation](./0203-resources.md)
- [Dependencies](./0205-dependencies.md)
- [Quality Standards](./0206-quality-standards.md)
- [Communication Plan](./0207-communication.md)
