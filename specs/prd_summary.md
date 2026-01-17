# BigMama - Product Requirements Document (PRD)

> **Version:** 1.0  
> **Last Updated:** 2026-01-16  
> **Status:** Approved for MVP Development

---

## 1. Product Overview

### 1.1 Vision
**BigMama** is a family productivity hub — "Jira for families". It helps households coordinate schedules, assign tasks, track who's home, and make group decisions through a voting system.

### 1.2 Target Platforms
- **Primary:** Progressive Web App (PWA)
  - Android (Chrome) — installable to home screen
  - Desktop (any modern browser)
- **Future:** iOS support (via native wrapper or improved PWA support) not in the scope currently

### 1.3 Language & Localization
- **Primary language:** Hebrew 🇮🇱
- **Secondary language:** English 🇬🇧
- **RTL support:** Required (Hebrew is right-to-left)
- **Calendar:** Hebrew calendar and regular calendar support required, also mark saturdays as "שבת" and with color, if possible also notify hebrew holidays

---

## 2. User Management

### 2.1 Family Creation & Joining
| Aspect | Decision |
|--------|----------|
| Family creation | First user creates the family and becomes Admin |
| Joining | Via invite link — Admin generates 2 types: "Invite Parent" (admin role) or "Invite Member" (member role) |
| Authentication | Google Sign-In only |

### 2.2 Roles & Permissions
| Role | Permissions |
|------|-------------|
| **Admin** | Full access: manage members, promote/demote, delete any content, approve requests |
| **Member** | Create/edit own content, vote on requests, update own status |

### 2.3 Member Profile
| Field | Required | Notes |
|-------|----------|-------|
| Display name | ✅ | |
| Avatar | ✅ | Emoji picker OR photo upload |
| Color | ✅ | Used for calendar/task identification |
| Email | ✅ | From Google Sign-In |

---

## 3. Tasks

### 3.1 Task Properties
| Property | Required | Notes |
|----------|----------|-------|
| Title | ✅ | |
| Description | ❌ | Can include a checklist as plain text |
| Assignees | ❌ | Can be unassigned (anyone can grab) or multiple people |
| Due date | ❌ | Optional |
| Due time | ❌ | Optional (only if date is set) |
| Status | ✅ | To Do → Done (simple) |

*Note: Priority levels (Low/Medium/High/Urgent) deferred to v2*

### 3.2 Task Behaviors
| Behavior | Decision |
|----------|----------|
| Who can create | Anyone (MVP) |
| Unassigned tasks | ✅ Allowed — anyone can "grab" |
| Multiple assignees | ✅ Allowed — any one can complete |
| Completion | Any assignee marks it done for everyone |
| Categories/Labels | ❌ Deferred |
| Subtasks | ❌ Not needed (use description for lists) |

### 3.3 Recurring Tasks
| Aspect | Decision |
|--------|----------|
| Priority | 2 (nice to have) |
| Behavior | When marked done, auto-create next occurrence |
| Patterns | Daily, Weekly, Monthly |

---

## 4. Calendar

### 4.1 Calendar Views
| View | Included in MVP |
|------|-----------------|
| Weekly | ✅ |
| Agenda (upcoming list) | ✅ |
| Monthly grid | ❌ Deferred |
| Daily | ❌ Deferred |

### 4.2 Calendar Content
| Content Type | Shown on Calendar |
|--------------|-------------------|
| Events | ✅ |
| Tasks with due dates | ✅ |
| Birthdays / Anniversaries | ✅ |
| Who's Home status | ✅ (home status only) |

### 4.3 Calendar Features
| Feature | Decision |
|---------|----------|
| Hebrew calendar | ✅ Required |
| Hebrew holidays | ✅ Required |
| Shabbat | ✅ Required |
| Gregorian calendar | ✅ Required |
| All-day events | ✅ Supported |
| Event colors | ✅ Supported |
| Event types | ❌ Deferred (just colors for now) |
| Visibility | All events visible to everyone (use member colors to distinguish) |

---

## 5. Who's Home (Status)

### 5.1 Status Options (MVP)
| Status | Emoji |
|--------|-------|
| Home | 🏠 |
| Away | 🚗 |

*(More statuses can be added later: Work, School, Vacation)*

### 5.2 Status Features
| Feature | Included in MVP |
|---------|-----------------|
| Manual update | ✅ By self or parent |
| Future scheduling | ✅ Set status for future dates |
| Status notes | ❌ Not included |
| History storage | ✅ Stored in DB |
| History UI | ❌ Deferred |

---

## 6. Requests / Suggestions

### 6.1 Request Types
- Quick suggestions ("Pizza tonight?")
- Activity proposals ("Beach on Saturday?")
- General announcements/FYI ("We're getting pizza today")

*(Purchase requests excluded for now)*

### 6.2 Request Properties
| Property | Required | Notes |
|----------|----------|-------|
| Title | ✅ | |
| Description | ❌ | |
| Relevant date/time | ❌ | For time-sensitive requests |
| Expiry | ✅ | Default: 7 days (configurable) |

### 6.3 Request Behaviors
| Behavior | Decision |
|----------|----------|
| Voting | 👍 / 👎 (Up/Down) |
| Comments | ❌ Deferred |
| Who approves | Admin only |
| Who archives | Creator or Admin |
| Auto-expire | After 7 days (configurable) |

---

## 7. Notifications

### 7.1 Notification Triggers (MVP)
| Trigger | Notify Who |
|---------|------------|
| Task assigned to me | Assignee |
| Task marked complete | Assignees |
| New event added | Relevant members |
| Event reminder | Relevant members |
| New request created | All members |
| Someone voted on my request | Request creator |
| Request approved/rejected | Request creator |
| Someone changed their status | All members |

### 7.2 Notification Features
| Feature | Included in MVP |
|---------|-----------------|
| In-app notifications | ✅ Badges/toasts when viewing app |
| Push notifications | ❌ Deferred to v2 (requires Cloud Functions) |
| Reminder timing configuration | ❌ Deferred |
| Per-user preferences | ❌ Deferred |

---

## 8. UI / UX

### 8.1 Design Decisions
| Aspect | Decision |
|--------|----------|
| Default screen | Dashboard (today's summary) |
| Dark mode | ❌ Deferred |
| RTL layout | ✅ Required (Hebrew primary) |

### 8.2 Navigation Structure
```
┌─────────────────────────────────────┐
│           BigMama                    │
├─────────────────────────────────────┤
│  🏠 Dashboard (Home)                │  ← Default
│  ✅ Tasks                           │
│  📅 Calendar                        │
│  💬 Requests                        │
│  👤 Profile / Settings              │
└─────────────────────────────────────┘
```

---

## 9. Priority Matrix

### MVP (v1) — Must Have
| Feature | Status |
|---------|--------|
| Dashboard (today's summary) | 🔲 |
| Tasks (create, assign, complete) | 🔲 |
| Calendar (weekly + agenda) | 🔲 |
| Who's Home status | 🔲 |
| Requests with voting | 🔲 |
| Hebrew + RTL support | 🔲 |
| Google Sign-In | 🔲 |
| Family invite system | 🔲 |

### v2 — Nice to Have
| Feature | Status |
|---------|--------|
| Recurring tasks | 🔲 |
| Task priority levels | 🔲 |
| Push notifications | 🔲 |
| Offline support | 🔲 |
| Request cleanup function | 🔲 |

### Future
| Feature | Status |
|---------|--------|
| Dark mode | 🔲 |
| Task categories/labels | 🔲 |
| Request comments | 🔲 |
| Notification preferences | 🔲 |
| AI/LLM features | 🔲 |

---

## 10. Technical Stack (Summary)

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) PWA |
| Backend | Firebase (Firestore, Auth, FCM) |
| Hosting | Firebase Hosting |
| Database | Firestore (NoSQL) |
| Notifications | Firebase Cloud Messaging |

*See `specs/tech_stack.md` for full details.*

---

## Appendix: Open Questions for Future

1. **iOS notifications** — PWA push notifications don't work on iOS. Consider Telegram bot or native wrapper.
2. **Recurring task edge cases** — What happens if a recurring task is overdue and not completed? 
3. **Family size limits** — Any maximum number of members per family? not on the scope
4. **Data export** — Should users be able to export their family data? not on the scope
