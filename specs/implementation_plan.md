# BigMama - Implementation Plan

> **Version:** 2.0  
> **Last Updated:** 2026-01-17  
> **Approach:** Iterative, TDD, TypeScript  
> **Status:** Phase 4 Complete

---

## Overview

> **📊 For detailed completion status, see [COMPLETION_STATUS.md](./COMPLETION_STATUS.md)**

This document outlines the implementation phases for BigMama MVP. Each phase builds on the previous one and produces a working, testable increment.

**Phases 0-4 are complete.** The application now includes:
- ✅ Auth & Family Creation
- ✅ Core Data Layer
- ✅ Dashboard with Widgets
- ✅ Advanced Task Management
- ✅ Calendar System
- ✅ Settings & Member Management

```
Phase 0: Project Setup
    ↓
Phase 1: Auth & Family Creation
    ↓
Phase 2: Core Data Layer (Hooks & Services)
    ↓
Phase 3: Dashboard
    ↓
Phase 4: Tasks
    ↓
Phase 5: Calendar
    ↓
Phase 6: Status (Who's Home)
    ↓
Phase 7: Requests
    ↓
Phase 8: Settings & Invite System
    ↓
Phase 9: Polish & PWA
```

---

## Phase 0: Project Setup

**Goal:** Working dev environment with Firebase emulators

### Tasks
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure TypeScript (strict mode)
- [ ] Set up Vitest + React Testing Library
- [ ] Initialize Firebase project (console)
- [ ] Configure Firebase emulators (Firestore, Auth)
- [ ] Create folder structure per development standards
- [ ] Set up CSS variables (colors, spacing, typography)
- [ ] Add RTL support (`dir="rtl"`, logical CSS properties)
- [ ] Create basic layout shell (header, nav, main area)
- [ ] Verify: App runs, emulators work, tests run

### Deliverable
```
✓ npm run dev → App loads with placeholder content
✓ npm run test → Tests execute
✓ firebase emulators:start → Emulators running
```

---

## Phase 1: Auth & Family Creation

**Goal:** User can sign in with Google and create/join a family

### Tasks
- [ ] Implement Google Sign-In button
- [ ] Create `useAuth` hook (login, logout, current user)
- [ ] Create auth context provider
- [ ] Build "Create Family" flow:
  - [ ] Form: family name input
  - [ ] Create family doc + member doc + user doc
- [ ] Build "Join Family" flow:
  - [ ] Route: `/join/:inviteCode`
  - [ ] Validate invite code
  - [ ] Create member doc + user doc
  - [ ] Mark invite as used
- [ ] Protected routes (redirect to login if not authenticated)
- [ ] Test with Firebase emulators

### Deliverable
```
✓ User logs in with Google
✓ New user can create a family
✓ User is redirected to dashboard after login
```

---

## Phase 2: Core Data Layer

**Goal:** Reusable hooks and services for all data operations

### Tasks
- [ ] Define TypeScript interfaces in `types/models.ts`:
  - [ ] `User`, `Family`, `Member`, `Task`, `Event`, `Request`, `DailyStatus`, `Invite`
- [ ] Create Firebase service layer:
  - [ ] `services/auth.ts` — sign in, sign out, get current user
  - [ ] `services/family.ts` — CRUD for family, members
  - [ ] `services/tasks.ts` — CRUD for tasks
  - [ ] `services/events.ts` — CRUD for events
  - [ ] `services/requests.ts` — CRUD for requests
  - [ ] `services/status.ts` — CRUD for daily status
- [ ] Create React hooks:
  - [ ] `useFamily()` — current family data, members list
  - [ ] `useTasks()` — tasks with real-time updates
  - [ ] `useEvents()` — events with real-time updates
  - [ ] `useRequests()` — requests with real-time updates
  - [ ] `useStatus()` — today's status with real-time updates
- [ ] Unit tests for service functions (mocked Firestore)

### Deliverable
```
✓ All data types defined
✓ Hooks return mock/emulator data correctly
✓ Real-time updates work
```

---

## Phase 3: Dashboard

**Goal:** Home screen showing today's summary

### Tasks
- [ ] Create Dashboard page layout (grid/flex)
- [ ] Build widgets:
  - [ ] "Who's Home" widget — shows member avatars + status
  - [ ] "Today's Tasks" widget — list of tasks due today
  - [ ] "Upcoming Events" widget — next 3-5 events
  - [ ] "Active Requests" widget — open requests summary
- [ ] Quick action buttons:
  - [ ] "+ New Task"
  - [ ] "+ New Request"
- [ ] Mobile responsive layout
- [ ] RTL alignment

### Deliverable
```
✓ Dashboard shows live data from Firestore
✓ Widgets update in real-time
✓ Works on mobile and desktop
```

---

## Phase 4: Tasks

**Goal:** Full task management functionality

### Tasks
- [ ] Create Tasks page with task list
- [ ] Build `TaskCard` component:
  - [ ] Display title, assignees (avatars), due date
  - [ ] "Mark done" interaction
  - [ ] Visual distinction for overdue tasks
- [ ] Build `TaskForm` component (create/edit):
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Assignee multi-select
  - [ ] Due date picker
  - [ ] Due time picker (optional)
- [ ] Implement task filtering:
  - [ ] All tasks / My tasks
  - [ ] Show completed toggle
- [ ] Task deletion (admin or creator only)
- [ ] Empty state ("No tasks yet")
- [ ] Loading state

### Deliverable
```
✓ Create, view, edit, complete, delete tasks
✓ Filter by assignee
✓ Real-time sync between devices
```

---

## Phase 5: Calendar

**Goal:** Weekly calendar view with events and tasks

### Tasks
- [ ] Create Calendar page
- [ ] Build weekly view grid:
  - [ ] 7 columns (Sun-Sat or based on locale)
  - [ ] Time slots or day blocks
  - [ ] Hebrew date display per day
  - [ ] Shabbat highlighting (Saturday)
- [ ] Build `EventCard` component:
  - [ ] Color-coded by event color or member color
  - [ ] Time display
- [ ] Show tasks with due dates on calendar
- [ ] Build `EventForm` component (create/edit):
  - [ ] Title, description
  - [ ] Date picker
  - [ ] Time pickers (start/end)
  - [ ] All-day toggle
  - [ ] Member assignment
  - [ ] Color picker
- [ ] Navigation: prev/next week, "Today" button
- [ ] Agenda view (simple list of upcoming events)
- [ ] Hebrew holiday display (from `@hebcal/core`)

### Deliverable
```
✓ Weekly view with events and tasks
✓ Create, edit, delete events
✓ Hebrew dates and holidays shown
✓ Shabbat highlighted
```

---

## Phase 6: Status (Who's Home)

**Goal:** Family members can set their status

### Tasks
- [ ] Create Status page/widget
- [ ] Build `StatusBoard` component:
  - [ ] Grid of family members
  - [ ] Each member shows avatar + current status
- [ ] Build `StatusToggle` component:
  - [ ] Toggle between Home 🏠 / Away 🚗
- [ ] Allow setting status for future dates:
  - [ ] "Set status for tomorrow"
  - [ ] Date picker for future status
- [ ] Admin can set status for any member
- [ ] Real-time sync

### Deliverable
```
✓ View all family members' status
✓ Update own status (or child's if admin)
✓ Set future status
```

---

## Phase 7: Requests

**Goal:** Create suggestions and vote on them

### Tasks
- [ ] Create Requests page
- [ ] Build `RequestCard` component:
  - [ ] Title, description, author
  - [ ] Vote buttons (👍 / 👎)
  - [ ] Vote count display
  - [ ] Expiry countdown (if time-sensitive)
  - [ ] Status badge (open, approved, rejected)
- [ ] Build `RequestForm` component:
  - [ ] Title, description
  - [ ] Type toggle (suggestion vs announcement)
  - [ ] Relevant date/time (optional)
- [ ] Implement voting:
  - [ ] One vote per member
  - [ ] Can change vote
- [ ] Admin actions:
  - [ ] Approve / Reject buttons
- [ ] Archive functionality
- [ ] Filter: Open / Resolved / All
- [ ] Auto-filter expired requests (client-side)

### Deliverable
```
✓ Create requests (suggestion or announcement)
✓ Vote on suggestions
✓ Admin can approve/reject
✓ Expired requests hidden
```

---

## Phase 8: Settings & Invite System

**Goal:** Family settings and invite management

### Tasks
- [ ] Create Settings page
- [ ] Profile section:
  - [ ] Edit display name
  - [ ] Change avatar (emoji picker or photo upload)
  - [ ] Change color
- [ ] Family section (admin only):
  - [ ] Edit family name
  - [ ] View members list
  - [ ] Promote/demote members
  - [ ] Remove members
- [ ] Invite system:
  - [ ] "Invite Parent" button → generates admin invite link
  - [ ] "Invite Member" button → generates member invite link
  - [ ] Copy link to clipboard
  - [ ] View active invites
- [ ] Language toggle (Hebrew / English)
- [ ] Logout button

### Deliverable
```
✓ Edit profile
✓ Manage family members (admin)
✓ Generate and share invite links
```

---

## Phase 9: Polish & PWA

**Goal:** Production-ready, installable PWA

### Tasks
- [ ] PWA manifest:
  - [ ] App name, icons, theme color
  - [ ] Installability criteria
- [ ] Service worker:
  - [ ] Cache static assets
  - [ ] Offline fallback page
- [ ] Loading states for all pages
- [ ] Error boundaries
- [ ] Empty states with helpful messages
- [ ] Animations/transitions:
  - [ ] Page transitions
  - [ ] Task completion animation
  - [ ] Vote animation
- [ ] Performance optimization:
  - [ ] Lazy load routes
  - [ ] Optimize bundle size
- [ ] Accessibility:
  - [ ] Keyboard navigation
  - [ ] Screen reader labels
- [ ] Final testing on real Android device
- [ ] Deploy to Firebase Hosting

### Deliverable
```
✓ App installable on Android
✓ Works offline (basic functionality)
✓ Deployed and accessible via URL
```

---

## Implementation Order Summary

| Phase | Duration Estimate | Dependencies |
|-------|-------------------|--------------|
| Phase 0: Setup | 2-3 hours | None |
| Phase 1: Auth | 3-4 hours | Phase 0 |
| Phase 2: Data Layer | 4-6 hours | Phase 1 |
| Phase 3: Dashboard | 3-4 hours | Phase 2 |
| Phase 4: Tasks | 4-6 hours | Phase 2, 3 |
| Phase 5: Calendar | 6-8 hours | Phase 2, 4 |
| Phase 6: Status | 2-3 hours | Phase 2, 3 |
| Phase 7: Requests | 4-5 hours | Phase 2, 3 |
| Phase 8: Settings | 4-5 hours | Phase 1, 2 |
| Phase 9: Polish | 4-6 hours | All above |

**Total Estimated: 36-50 hours**

---

## Verification Checkpoints

After each phase:

1. **Tests pass** — `npm run test`
2. **TypeScript compiles** — `npm run build`
3. **Manual smoke test** — verify feature in browser
4. **Firebase emulator** — data persists correctly
5. **Mobile responsive** — test at 375px width
6. **RTL works** — Hebrew layout correct
7. **Commit code** — meaningful commit message

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Hebrew calendar library issues | Test `@hebcal/core` early in Phase 5 |
| Firebase emulator setup problems | Document steps, test in Phase 0 |
| RTL layout bugs | Build RTL-first, test continuously |
| Complex form interactions | Keep forms simple, add complexity in v2 |
| Performance with real-time listeners | Limit listeners per page, use pagination |
