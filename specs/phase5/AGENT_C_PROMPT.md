# Agent C Prompt: Requests & Voting System

**CRITICAL INSTRUCTIONS:**
1. **User Story:** Read `file:///Users/arielwasserteil/Documents/antigravity/BigMama/specs/phase5/AGENT_C_REQUESTS_STORY.md`
2. **Branch:** Create and work on `feature/requests-voting` - DO NOT commit to master
3. **Base Branch:** Start from `master` branch

## Your Mission
Implement the Requests & Voting System for the BigMama family productivity app.

## Context
- **Role:** Senior Frontend Developer specializing in Interactive UIs
- **Tech Stack:** React, TypeScript, Firebase
- **Language:** Hebrew (RTL)
- **Project:** BigMama - Family productivity app

## What Already Exists (DO NOT RECREATE)
- ✅ `services/requests.ts` - All CRUD functions for requests
- ✅ `hooks/useData.ts` - Contains `useRequests()` hook
- ✅ `types/models.ts` - `FamilyRequest` interface
- ✅ Navigation link to `/requests` exists

## Your Tasks

### 1. Create Requests Page
**File:** `src/pages/Requests/RequestsPage.tsx`
- Use `useRequests()` hook to fetch data
- Implement filter tabs: Open, Resolved, All
- "New Request" button opens modal
- List of RequestCard components
- Empty state when no requests
- Loading state

### 2. Create Request Card Component
**File:** `src/components/requests/RequestCard.tsx` (create folder)
**File:** `src/components/requests/RequestCard.css`
- Display: title, description, author (with avatar)
- Type badge: 💡 Suggestion or 📢 Announcement
- Vote buttons (👍 👎) - only for suggestions
- Real-time vote count
- Status badge (open/approved/rejected)
- Admin actions (if user is admin)

### 3. Create Request Modal
**File:** `src/components/common/Modals/RequestModal.tsx`
- Title input (required)
- Description textarea
- Type toggle (Suggestion/Announcement)
- Optional: relevant date picker
- Save/Cancel buttons
- Form validation

### 4. Implement Voting Logic
- Use `voteOnRequest()` from `services/requests.ts`
- Toggle vote (can change from up to down)
- Disable voting on own requests
- Real-time vote count updates

### 5. Implement Admin Actions
- Approve/Reject buttons (admin only)
- Archive button (creator or admin)
- Use `updateRequestStatus()` from services
- Confirmation dialogs

### 6. Add Route
Update `src/App.tsx`:
```tsx
import { RequestsPage } from './pages/Requests/RequestsPage';
// Add route:
<Route path="/requests" element={<RequestsPage />} />
```

### 7. Styling
- Premium, modern design
- RTL Hebrew support
- Mobile responsive
- Smooth vote animations
- Color-coded status badges

## Resources
- `src/services/requests.ts` - Backend logic
- `src/hooks/useData.ts` - Data hooks
- `src/hooks/useAuth.ts` - Current user
- `src/hooks/useFamily.ts` - Family members for avatars

## Testing Checklist
- Create suggestion
- Create announcement
- Vote on suggestion
- Change vote
- Admin approve/reject
- Filter tabs work
- Real-time sync (test in 2 tabs)
- Mobile responsive

## Success Criteria
- All features work
- No TypeScript errors
- No console errors
- RTL Hebrew works
- Mobile responsive
- Ready for merge to master
