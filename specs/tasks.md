# BigMama - Implementation Tasks

> **Version:** 2.0  
> **Last Updated:** 2026-01-17  
> **Status:** Phase 8 Complete

---

## How to Use This Document

- `[ ]` — Not started
- `[/]` — In progress
- `[x]` — Completed
- `[!]` — Blocked

Update this document as you progress through implementation.

---

## Phase 0: Project Setup

### 0.1 Initialize Project
- [x] Create Vite + React + TypeScript project
  ```bash
  npm create vite@latest . -- --template react-ts
  ```
- [x] Configure `tsconfig.json` for strict mode
- [x] Set up path aliases (`@/components`, `@/hooks`, etc.)

### 0.2 Configure Testing
- [x] Install Vitest + React Testing Library
- [x] Create `vitest.config.ts`
- [x] Add test scripts to `package.json`
- [x] Create first test to verify setup works

### 0.3 Firebase Setup
- [x] Create Firebase project in console
- [x] Enable Firestore Database
- [x] Enable Authentication (Google provider)
- [x] Install Firebase CLI globally
- [x] Run `firebase init` in project
- [x] Configure emulators (Firestore, Auth)
- [x] Add Firebase SDK to project
- [x] Create `src/services/firebase.ts` with config

### 0.4 Project Structure
- [ ] Create folder structure:
  ```
  src/
  ├── components/common/
  ├── components/tasks/
  ├── components/calendar/
  ├── components/requests/
  ├── components/status/
  ├── pages/
  ├── hooks/
  ├── services/
  ├── types/
  ├── utils/
  └── styles/
  ```
- [ ] Create `src/types/models.ts` with interfaces
- [ ] Create `src/styles/variables.css`
- [ ] Create `src/styles/reset.css`
- [ ] Create `src/styles/global.css`

### 0.5 Base Layout
- [ ] Set up React Router
- [ ] Create `Layout` component (header + nav + main)
- [ ] Add RTL support (`<html dir="rtl" lang="he">`)
- [ ] Create placeholder pages (Dashboard, Tasks, Calendar, Requests, Settings)
- [ ] Implement bottom navigation for mobile

### 0.6 Verification
- [ ] `npm run dev` — App loads with nav and placeholder content
- [ ] `npm run test` — Tests execute successfully
- [ ] `firebase emulators:start` — Emulators running
- [ ] Commit: `feat: initial project setup`

---

## Phase 1: Auth & Family Creation

### 1.1 Auth Service
- [ ] Create `src/services/auth.ts`:
  - [ ] `signInWithGoogle()` function
  - [ ] `signOut()` function
  - [ ] `getCurrentUser()` function
- [ ] Write tests for auth service

### 1.2 Auth Hook & Context
- [ ] Create `src/hooks/useAuth.ts`
- [ ] Create `src/context/AuthContext.tsx`
- [ ] Handle auth state changes
- [ ] Add loading state during auth check

### 1.3 Login Page
- [ ] Create `src/pages/Login/Login.tsx`
- [ ] Build Google Sign-In button
- [ ] Handle sign-in errors
- [ ] Redirect to dashboard on success

### 1.4 Create Family Flow
- [ ] Create `src/pages/Onboarding/CreateFamily.tsx`
- [ ] Family name input form
- [ ] Create family document in Firestore
- [ ] Create member document for creator (role: admin)
- [ ] Create user lookup document
- [ ] Redirect to dashboard

### 1.5 Join Family Flow
- [x] Create `src/pages/Onboarding/JoinPage.tsx`
- [x] Route: `/join/:inviteCode`
- [x] Validate invite code exists and not used
- [x] Create member document with role from invite
- [x] Create user lookup document
- [x] Mark invite as used
- [x] Redirect to dashboard

### 1.6 Protected Routes
- [ ] Create `ProtectedRoute` component
- [ ] Redirect unauthenticated users to Login
- [ ] Redirect users without family to Onboarding

### 1.7 Verification
- [ ] User can sign in with Google
- [ ] New user can create family
- [ ] User with invite link can join family
- [ ] Unauthorized access redirects to login
- [ ] Commit: `feat: auth and family creation`

---

## Phase 2: Core Data Layer

### 2.1 Type Definitions
- [ ] Define all interfaces in `src/types/models.ts`:
  - [ ] `User`
  - [ ] `Family`
  - [ ] `Member`
  - [ ] `Task`
  - [ ] `Event`
  - [ ] `Request`
  - [ ] `DailyStatus`
  - [ ] `Invite`

### 2.2 Firestore Services
- [ ] `src/services/family.ts`:
  - [ ] `getFamily(familyId)`
  - [ ] `updateFamily(familyId, data)`
  - [ ] `getMembers(familyId)`
  - [ ] `updateMember(familyId, memberId, data)`
- [ ] `src/services/tasks.ts`:
  - [ ] `getTasks(familyId)`
  - [ ] `createTask(familyId, task)`
  - [ ] `updateTask(familyId, taskId, data)`
  - [ ] `deleteTask(familyId, taskId)`
- [ ] `src/services/events.ts`:
  - [ ] `getEvents(familyId, dateRange)`
  - [ ] `createEvent(familyId, event)`
  - [ ] `updateEvent(familyId, eventId, data)`
  - [ ] `deleteEvent(familyId, eventId)`
- [ ] `src/services/requests.ts`:
  - [ ] `getRequests(familyId)`
  - [ ] `createRequest(familyId, request)`
  - [ ] `updateRequest(familyId, requestId, data)`
  - [ ] `voteOnRequest(familyId, requestId, vote)`
- [ ] `src/services/status.ts`:
  - [ ] `getStatus(familyId, date)`
  - [ ] `updateMemberStatus(familyId, date, memberId, status)`

### 2.3 React Hooks
- [ ] `src/hooks/useFamily.ts` — family data + members
- [ ] `src/hooks/useTasks.ts` — real-time task list
- [ ] `src/hooks/useEvents.ts` — real-time events
- [ ] `src/hooks/useRequests.ts` — real-time requests
- [ ] `src/hooks/useStatus.ts` — real-time status

### 2.4 Testing
- [ ] Unit tests for service functions
- [ ] Mock Firestore in tests
- [ ] Test hook behavior with mock data

### 2.5 Verification
- [ ] All types compile without errors
- [ ] Services work with Firebase emulator
- [ ] Hooks return data correctly
- [ ] Commit: `feat: core data layer`

---

## Phase 3: Dashboard

### 3.1 Dashboard Layout
- [ ] Create `src/pages/Dashboard/Dashboard.tsx`
- [ ] Design grid layout for widgets
- [ ] Make responsive (stack on mobile)

### 3.2 Who's Home Widget
- [ ] Create `src/components/status/StatusWidget.tsx`
- [ ] Display family members with avatars
- [ ] Show status emoji (🏠 / 🚗)
- [ ] Quick toggle for own status

### 3.3 Today's Tasks Widget
- [ ] Create `src/components/tasks/TodaysTasks.tsx`
- [ ] List tasks due today
- [ ] Show task title + assignees
- [ ] Quick "mark done" button

### 3.4 Upcoming Events Widget
- [ ] Create `src/components/calendar/UpcomingEvents.tsx`
- [ ] List next 5 events
- [ ] Show event title + time
- [ ] Color indicator

### 3.5 Active Requests Widget
- [ ] Create `src/components/requests/ActiveRequests.tsx`
- [ ] Show open requests count
- [ ] Preview of top request
- [ ] Quick vote buttons

### 3.6 Quick Actions
- [ ] Add "+ New Task" floating button
- [ ] Add "+ New Request" button
- [ ] Navigate to respective forms

### 3.7 Verification
- [ ] Dashboard loads with all widgets
- [ ] Widgets show real data from Firestore
- [ ] Responsive layout works
- [ ] Commit: `feat: dashboard with widgets`

---

## Phase 4: Tasks

### 4.1 Tasks Page
- [ ] Create `src/pages/Tasks/Tasks.tsx`
- [ ] List view of all tasks
- [ ] Filter: All / My Tasks
- [ ] Toggle: Show completed

### 4.2 TaskCard Component
- [ ] Create `src/components/tasks/TaskCard/TaskCard.tsx`
- [ ] Display title, description preview
- [ ] Show assignee avatars
- [ ] Display due date (with overdue styling)
- [ ] Checkbox to mark complete
- [ ] Click to open detail/edit

### 4.3 TaskForm Component
- [ ] Create `src/components/tasks/TaskForm/TaskForm.tsx`
- [ ] Title input (required)
- [ ] Description textarea
- [ ] Assignee multi-select (family members)
- [ ] Due date picker
- [ ] Due time picker
- [ ] Save / Cancel buttons

### 4.4 Task Modal
- [ ] Create modal wrapper component
- [ ] Open modal for new task
- [ ] Open modal for edit task
- [ ] Confirm dialog for delete

### 4.5 Task Operations
- [ ] Create task → add to Firestore
- [ ] Edit task → update in Firestore
- [ ] Complete task → update status
- [ ] Delete task → remove from Firestore

### 4.6 Empty & Loading States
- [ ] Empty state: "No tasks yet" with CTA
- [ ] Loading skeleton

### 4.7 Verification
- [ ] CRUD operations work
- [ ] Real-time sync between tabs
- [ ] Filter and toggle work
- [ ] Commit: `feat: task management`

---

## Phase 5: Calendar

### 5.1 Calendar Page
- [ ] Create `src/pages/Calendar/Calendar.tsx`
- [ ] Navigation: prev/next week, today button
- [ ] Toggle: Week / Agenda view

### 5.2 Weekly View
- [ ] Create `src/components/calendar/WeekView/WeekView.tsx`
- [ ] 7-column grid (Sun-Sat)
- [ ] Gregorian date display
- [ ] Hebrew date display (per day)
- [ ] Shabbat highlighting (Saturday)

### 5.3 Hebrew Calendar Integration
- [ ] Create `src/utils/hebrewCalendar.ts`
- [ ] Convert Gregorian → Hebrew date
- [ ] Get Hebrew holidays for date
- [ ] Detect Shabbat
- [ ] Handle errors gracefully

### 5.4 EventCard Component
- [ ] Create `src/components/calendar/EventCard/EventCard.tsx`
- [ ] Color stripe/background
- [ ] Title and time display
- [ ] Member indicator

### 5.5 Events on Calendar
- [ ] Fetch events for visible week
- [ ] Render events in correct day slot
- [ ] Show tasks with due dates
- [ ] Show Hebrew holidays

### 5.6 Agenda View
- [ ] Create `src/components/calendar/AgendaView/AgendaView.tsx`
- [ ] List of upcoming events
- [ ] Grouped by date
- [ ] Include tasks with due dates

### 5.7 EventForm Component
- [ ] Create `src/components/calendar/EventForm/EventForm.tsx`
- [ ] Title, description
- [ ] Date picker
- [ ] Start/End time pickers
- [ ] All-day toggle
- [ ] Member assignment
- [ ] Color picker

### 5.8 Verification
- [ ] Week view renders correctly
- [ ] Hebrew dates display
- [ ] Shabbat is highlighted
- [ ] Events CRUD works
- [ ] Commit: `feat: calendar with Hebrew support`

---

## Phase 6: Status (Who's Home)

### 6.1 Status Page
- [x] Create `src/pages/Status/Status.tsx`
- [x] Full-page status board
- [ ] Date selector for future status
- [x] Member list with "exists/at home" markers and contrast polish
- [x] "Invite Member" button and code generation logic

### 6.2 StatusBoard Component
- [x] Create `src/components/status/StatusBoard/StatusBoard.tsx`
- [x] Grid of family member cards
- [x] Each card shows avatar, name, status

### 6.3 StatusCard Component
- [x] Create `src/components/status/StatusCard/StatusCard.tsx`
- [x] Member avatar and name
- [x] Status toggle (Home / Away)
- [x] Emoji indicator

### 6.4 Status Operations
- [x] Update own status
- [ ] Admin can update anyone's status
- [ ] Set status for future date
- [x] Real-time sync

### 6.5 Verification
- [x] Status updates work
- [ ] Future status setting works
- [ ] Admin permissions work
- [x] Commit: `feat: who's home status`

---

## Phase 7: Requests

### 7.1 Requests Page
- [x] Create `src/pages/Requests/Requests.tsx`
- [x] List of requests
- [x] Filter: Open / Resolved / All
- [x] "+ New Request" button

### 7.2 RequestCard Component
- [x] Create `src/components/requests/RequestCard/RequestCard.tsx`
- [x] Title, description
- [x] Author avatar + name
- [x] Type badge (suggestion / announcement)
- [x] Vote buttons (👍 / 👎)
- [x] Vote counts
- [x] Status badge

### 7.3 Voting
- [x] Implement vote button clicks
- [x] Toggle vote (can change vote)
- [x] Real-time vote count updates

### 7.4 RequestForm Component
- [x] Create `src/components/requests/RequestForm/RequestForm.tsx`
- [x] Title, description
- [x] Type toggle
- [x] Relevant date/time (optional)

### 7.5 Admin Actions
- [x] Approve button (admin only)
- [x] Reject button (admin only)
- [x] Archive button (creator or admin)

### 7.6 Expiry Handling
- [ ] Filter out expired requests in query
- [ ] Show expiry countdown for time-sensitive requests

### 7.7 Verification
- [x] Create requests works
- [x] Voting works
- [x] Admin approve/reject works
- [ ] Expired requests hidden
- [x] Commit: `feat: requests and voting`

---

## Phase 8: Settings & Invite

### 8.1 Settings Page
- [ ] Create `src/pages/Settings/Settings.tsx`
- [ ] Sections: Profile, Family, Invites, App

### 8.2 Profile Section
- [x] Edit display name
- [x] Avatar picker (emoji or photo)
- [x] Color picker
- [x] Save changes

### 8.3 Family Section (Admin)
- [x] Family name edit
- [x] Members list
- [x] Role management (promote/demote)
- [x] Remove member

### 8.4 Invite System
- [x] "Invite Parent" button → generate admin link
- [x] "Invite Member" button → generate member link
- [x] Create invite document in Firestore
- [x] Copy link to clipboard
- [x] Show active invites
- [x] Delete unused invite

### 8.5 App Settings
- [x] Language toggle (Hebrew / English)
- [x] Logout button

### 8.6 Verification
- [x] Profile updates save
- [x] Invite links work
- [x] Admin can manage members
- [x] Language toggle works
- [x] Commit: `feat: settings and invites`

---
## Phase 9: Join Flow
### 9.1 Join Logic
- [x] Implement `validateInvite` service
- [x] Implement `joinFamilyWithInvite` service (transactional)
- [x] Handle error states (expired/invalid/used code)

### 9.2 Join Page
- [x] Create `src/pages/Join/JoinPage.tsx`
- [x] Retrieve invite code from URL
- [x] Display family info (Name, Inviter)
- [x] "Join Family" button
- [x] Redirect to dashboard on success

### 9.3 Routing & Auth
- [x] Add `/join/:inviteCode` route
- [x] Ensure non-logged-in users are redirected to Login then back to Join

## Phase 9: Polish & PWA

### 9.1 PWA Configuration
- [x] Configure `vite-plugin-pwa`
- [x] Create manifest.json
- [x] Add app icons (192x192, 512x512)
- [x] Set theme color

### 9.2 Offline Support
- [x] Service worker caches static assets
- [x] Offline fallback page

### 9.3 Loading States
- [x] Add loading skeletons to all pages
- [x] Smooth transitions

### 9.4 Error Handling
- [x] Error boundary component
- [x] Friendly error messages
- [x] Retry functionality

### 9.5 Empty States
- [x] Design empty states for each list
- [x] Helpful CTAs

### 9.6 Animations
- [x] Page transitions
- [x] Task completion animation
- [x] Vote animation
- [x] Status toggle animation

### 9.7 Performance
- [x] Lazy load routes
- [ ] Analyze bundle size
- [ ] Optimize images

### 9.8 Accessibility
- [ ] Keyboard navigation
- [x] ARIA labels
- [ ] Focus management

### 9.9 Final Testing
- [ ] Test on real Android device
- [ ] Install PWA from Chrome
- [ ] Test all features
- [ ] Fix any bugs

### 9.10 Deployment
- [ ] Build production bundle
- [ ] Deploy to Firebase Hosting
- [ ] Configure custom domain (if any)
- [ ] Test production deployment

### 9.11 Verification
- [x] App installable on Android
- [x] Works offline (basic)
- [x] Performance is acceptable
- [x] Commit: `feat: pwa and polish`

---

## Post-MVP Tasks (v2)

These are tracked here but not implemented in MVP:

- [ ] Recurring tasks
- [ ] Task priority levels
- [ ] Push notifications
- [ ] Offline support (full)
- [ ] Request comments
- [ ] Dark mode
- [ ] Notification preferences
- [ ] Request cleanup Cloud Function
