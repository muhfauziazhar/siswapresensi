# Rencana Komunikasi - SiswaPresensi

## Ringkasan Komunikasi

| Jenis Komunikasi | Frekuensi | Durasi | Peserta | Channel |
|------------------|-----------|--------|---------|---------|
| Daily Standup | Setiap hari kerja | 15 menit | Tim development | Slack/Teams |
| Weekly Sync | Setiap minggu | 1 jam | Tim development + PM | Slack/Teams |
| Sprint Planning | Setiap 2 minggu | 1-2 jam | Tim development + PM | Slack/Teams |
| Retrospective | Setiap 2 minggu | 1 jam | Tim development | Slack/Teams |
| Progress Report | Setiap minggu | - | Stakeholder | Email |
| Stakeholder Update | Setiap 2 minggu | 30 menit | Stakeholder + PM | Google Meet |

---

## 1. Daily Standup

### Detail
| | |
--- | --- |
**Frekuensi** | Setiap hari kerja (Senin-Jumat) |
**Waktu** | 09:00 - 09:15 WIB |
**Durasi** | 15 menit |
**Peserta** | Tim development (Backend, Frontend, DevOps, QA) |
**Facilitator** | Project Manager |
**Channel** | Slack / Microsoft Teams |
**Format** | Async atau Sync (sesuai preferensi tim) |

### Agenda
1. Apa yang saya kerjakan kemarin?
2. Apa yang akan saya kerjakan hari ini?
3. Apa ada blocker atau hambatan?

### Format (Jika Async)
```
@mention
- Kemarin: [tugas yang selesai]
- Hari ini: [tugas yang akan dikerjakan]
- Blocker: [jika ada]
```

### Format (Jika Sync)
**Pertemuan:** Video call 15 menit

---

## 2. Weekly Sync

### Detail
| | |
--- | --- |
**Frekuensi** | Setiap minggu |
**Waktu** | Setiap Jumat, 14:00 - 15:00 WIB |
**Durasi** | 60 menit |
**Peserta** | Semua anggota tim (BA, PM, Backend, Frontend, QA) |
**Facilitator** | Project Manager |
**Channel** | Google Meet, Zoom, Slack/Teams |

### Agenda
1. Review progress untuk minggu ini
2. Diskusikan blockers dan issues
3. Plan untuk minggu depan
4. Demo completed features (jika ada)

---

## 3. Sprint Planning

### Detail
| | |
--- | --- |
**Frekuensi** | Setiap 2 minggu (awal sprint) |
**Waktu** | Setiap 2 minggu, 10:00 - 11:30 WIB |
**Durasi** | 90 menit |
**Peserta** | Tim development + PM |
**Facilitator** | Project Manager |
**Channel** | Jira, Linear, Trello, Google Meet |

### Agenda
1. Review backlog
2. Pilih fitur untuk sprint
3. Estimasi effort
4. Assign tasks
5. Set sprint goals

---

## 4. Retrospective

### Detail
| | |
--- | --- |
**Frekuensi** | Setiap 2 minggu (akhir sprint) |
**Waktu** | Setiap 2 minggu, 14:00 - 15:00 WIB |
**Durasi** | 60 menit |
**Peserta** | Semua anggota tim |
**Facilitator** | Project Manager |
**Channel** | Miro, Mural, Google Meet |

### Agenda
1. Apa yang berjalan baik?
2. Apa yang tidak berjalan baik?
3. Apa yang bisa kita improve?
4. Action items untuk sprint berikutnya

---

## 5. Progress Report

### Frekuensi
**Mingguan** (setiap minggu)

### Format
**Markdown atau PDF**

### Penerima
**Semua anggota tim, Stakeholder**

### Konten
- Completed tasks this week
- In-progress tasks
- Planned tasks for next week
- Blockers dan issues
- Milestone progress

### Template
```markdown
# Weekly Progress Report - Week [X]

**Date:** [Date]
**Sprint:** [Sprint Number]

## Completed This Week

- [ ] Task 1
- [ ] Task 2

## In Progress

- [ ] Task 3 (50% complete)
- [ ] Task 4 (30% complete)

## Planned for Next Week

- [ ] Task 5
- [ ] Task 6

## Blockers & Issues

- [ ] Issue 1 - Assigned to [Person]
- [ ] Issue 2 - Assigned to [Person]

## Milestone Progress

- Milestone 1: [X]% complete
- Milestone 2: [Y]% complete

## Notes

[Any additional notes or updates]
```

---

## 6. Stakeholder Updates

### Frekuensi
**Bulanan** (atau sesuai kebutuhan)

### Format
**Email atau PDF**

### Penerima
**Stakeholder (business owners, investors)**

### Konten
- Executive summary
- Key achievements
- Upcoming milestones
- Risks dan issues
- Timeline status (on track/at risk/delayed)

### Template
```markdown
# Monthly Stakeholder Update - [Month] [Year]

**Date:** [Date]
**Project:** SiswaPresensi

## Executive Summary

[Brief summary of project status]

## Key Achievements This Month

- Achievement 1
- Achievement 2
- Achievement 3

## Upcoming Milestones

- Milestone 1: [Date] - [Description]
- Milestone 2: [Date] - [Description]

## Risks & Issues

- Risk 1: [Status]
- Risk 2: [Status]

## Timeline Status

- On track / At risk / Delayed
- [Reason if not on track]

## Metrics

- Metric 1: [Value]
- Metric 2: [Value]

## Next Steps

- Step 1
- Step 2
```

---

## 7. Demo Schedule

### Frekuensi
**Bulanan (akhir sprint) atau sesuai diminta**

### Format
**Live demo atau recorded video**

### Penerima
**Semua anggota tim, Stakeholder**

### Konten
- Demo dari completed features
- Walkthrough dari user flows
- Q&A session

---

## Tools

### Project Management

**Primary Tool:** Jira atau Linear

**Usage:**
- Track tasks dan issues
- Manage backlog
- Sprint planning
- Progress tracking

**Setup:**
- Create project: SiswaPresensi
- Configure boards: Kanban atau Scrum
- Set up workflows: To Do → In Progress → Review → Done
- Create labels: Backend, Frontend, QA, Bug, Feature
- Set up priorities: P1, P2, P3, P4

---

### Communication

**Primary Tool:** Slack atau Discord

**Usage:**
- Daily communication
- Quick questions
- Notifications
- File sharing

**Channels:**
- `#general` - General project discussions
- `#dev` - Development discussions
- `#qa` - Testing dan quality discussions
- `#announcements` - Important announcements
- `#random` - Casual conversations

**Notifications:**
- Configure notifications untuk mentions dan direct messages
- Mute non-critical channels selama focus time
- Use status updates untuk indicate availability

---

### Documentation

**Primary Tool:** Notion atau Confluence

**Usage:**
- Project documentation
- Meeting notes
- Decisions log
- Knowledge base

**Structure:**
- Project Overview
- Requirements (BA docs)
- Planning (PM docs)
- Technical (DEV docs)
- Testing (QA docs)
- Meeting Notes
- Decisions Log

---

### Code Review

**Primary Tool:** GitHub (Pull Requests)

**Usage:**
- Code review
- Discussion pada code changes
- Approval process

**Guidelines:**
- Semua code harus direview sebelum merge
- Minimal 1 approval required
- Gunakan PR templates untuk consistency
- Link PRs ke Jira/Linear tickets

---

### Design & Wireframes

**Primary Tool:** Figma atau Adobe XD

**Usage:**
- UI/UX design
- Wireframes
- Mockups
- Prototypes

**Notes:**
- Share designs dengan tim untuk feedback
- Version control untuk design iterations
- Export assets untuk development

---

## Komunikasi Guidelines

### Response Time Expectations

- **Urgent:** Dalam 1 jam (production issues, critical bugs)
- **High:** Dalam 4 jam (blockers, important questions)
- **Medium:** Dalam 24 jam (general questions, discussions)
- **Low:** Dalam 48 jam (nice-to-have items, non-urgent)

### Meeting Etiquette

- On time
- Datang dengan prepared
- Keep discussions focused
- Respect everyone's time
- Document action items
- Follow up pada action items

### Async Communication

- Gunakan async communication untuk non-urgent items
- Tulis clear dan concise messages
- Berikan konteks dan background
- Gunakan formatting untuk readability

### Code Review Etiquette

- Constructive dan respectful
- Fokus pada code, bukan person
- Berikan feedback yang jelas
- Sarankan improvements, bukan cuma problems
- Respon dengan cepat pada comments

### Conflict Resolution

- Address conflicts early
- Dengar semua perspektif
- Fokus pada problem, bukan person
- Cari kompromisi jika mungkin
- Escalate ke PM jika unresolved

---

## Escalation Path

### Level 1: Peer-to-Peer

**Issue:** Minor disagreements, technical questions

**Action:** Diskusikan langsung dengan orang yang terlibat

**Timeline:** Selesaikan dalam 24 jam

---

### Level 2: Team Lead / PM

**Issue:** Blockers, unresolved conflicts, scope questions

**Action:** Escalate ke PM atau team lead

**Timeline:** Selesaikan dalam 48 jam

---

### Level 3: Stakeholders

**Issue:** Major scope changes, timeline adjustments, resource issues

**Action:** Escalate ke stakeholders dengan PM recommendation

**Timeline:** Selesaikan dalam 1 minggu

---

### Level 4: Crisis Management

**Issue:** Production issues, critical bugs, security vulnerabilities

**Action:** Immediate escalation ke semua pihak yang relevan

**Timeline:** Selesaikan ASAP (dalam jam)

---

## Onboarding

### New Team Member Onboarding

**Day 1:**
- Welcome email dengan project overview
- Akses ke semua tools (Jira, Slack, GitHub, Notion)
- Introduction ke team members
- Assign a buddy/mentor

**Week 1:**
- Review project documentation
- Setup development environment
- Review codebase
- Attend daily standups

**Week 2:**
- Mulai bekerja pada tasks kecil
- Code review training
- Attend sprint planning

**Week 3-4:**
- Bekerja pada tasks reguler
- Berpartisipasi dalam semua ceremonies
- Terima feedback dari buddy/mentor

---

## Knowledge Sharing

### Tech Talks

**Frekuensi:** Bulanan

**Format:** 30-menit presentation + Q&A

**Topics:**
- New technologies atau tools
- Best practices
- Lessons learned
- Case studies

**Attendees:** Semua anggota tim

---

### Documentation Updates

**Frekuensi:** Sesuai kebutuhan

**Process:**
- Update documentation saat ada perubahan signifikan
- Review documentation bulanan
- Keep documentation akurat dan up-to-date
- Link documentation di tempat yang relevan

---

### Code Review Learning

**Process:**
- Gunakan code reviews sebagai learning opportunities
- Tanyakan pertanyaan selama code review
- Share knowledge melalui comments
- Dokumentasikan decisions di code comments atau PRs

---

## Komunikasi Plan Summary

| Communication Type | Frequency | Duration | Attendees | Tools |
|-------------------|-----------|----------|-----------|-------|
| Daily Standup | Daily | 15 min | All team | Slack/Teams |
| Weekly Sync | Weekly | 60 min | All team | Google Meet |
| Sprint Planning | Bi-weekly | 90 min | Devs + PM | Jira/Linear |
| Retrospective | Bi-weekly | 60 min | All team | Miro |
| Progress Report | Weekly | - | All team + Stakeholders | Notion |
| Stakeholder Updates | Monthly | 30 min | Stakeholders + PM | Google Meet |
| Demos | Bi-weekly | 30-60 min | All team + Stakeholders | Google Meet |

---

## Dokumentasi Terkait
- [Project Roadmap](./0201-roadmap.md)
- [Phases & Milestones](./0202-phases.md)
- [Resource Allocation](./0203-resources.md)
- [Risk Assessment](./0204-risks.md)
- [Dependencies](./0205-dependencies.md)
- [Quality Standards](./0206-quality-standards.md)
