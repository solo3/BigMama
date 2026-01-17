# Agent D Prompt: Polish & Error Handling

**CRITICAL INSTRUCTIONS:**
1. **User Story:** Read `file:///Users/arielwasserteil/Documents/antigravity/BigMama/specs/phase5/AGENT_D_POLISH_STORY.md`
2. **Branch:** Create and work on `feature/polish-and-errors` - DO NOT commit to master
3. **Base Branch:** Start from `master` branch

## Your Mission
Add professional polish, error handling, and user feedback to the BigMama app.

## Context
- **Role:** Senior Frontend Developer specializing in UX Polish
- **Tech Stack:** React, TypeScript, Firebase
- **Language:** Hebrew (RTL)
- **Project:** BigMama - Family productivity app

## Your Tasks

### 1. Error Boundary
**File:** `src/components/common/ErrorBoundary.tsx`
- Catch React errors
- Display friendly error message
- "Try again" button
- Log errors to console
- Wrap entire app in `main.tsx`

### 2. Loading Skeletons
**File:** `src/components/common/LoadingSkeleton.tsx`
**File:** `src/components/common/LoadingSkeleton.css`
- Create reusable skeleton component
- Add to Dashboard widgets
- Add to Tasks list
- Add to Calendar events
- Add to Requests list (if exists)
- Smooth pulse animation

### 3. Toast Notification System
**File:** `src/components/common/Toast/Toast.tsx`
**File:** `src/components/common/Toast/Toast.css`
**File:** `src/hooks/useToast.ts`
- Success, error, info toast types
- Auto-dismiss after 3 seconds
- Stack multiple toasts
- Slide-in animation
- Add to Layout component

### 4. Form Validation
Enhance existing modals:
- `TaskModal.tsx` - Validate title required
- Add inline error messages
- Disable submit if invalid
- Show validation on blur

### 5. Offline Indicator
**File:** `src/components/common/OfflineIndicator.tsx`
- Detect online/offline status
- Show banner when offline
- "You're offline" message
- Add to Layout component

### 6. 404 Page
**File:** `src/pages/NotFound/NotFound.tsx`
**File:** `src/pages/NotFound/NotFound.css`
- Friendly "Page not found" message
- "Go Home" button
- Hebrew text
- Add catch-all route to App.tsx

### 7. Empty States
Enhance existing pages:
- Dashboard - "Welcome! Add your first task"
- Tasks - "No tasks yet. Create one!"
- Calendar - "No events scheduled"
- Add helpful CTAs

### 8. Add Toast Notifications
Add to all CRUD operations:
- Task created ✅
- Task deleted ✅
- Event created ✅
- Request created ✅
- Family name updated ✅
- Error messages for failures ❌

## Integration Points

### main.tsx
```tsx
import { ErrorBoundary } from './components/common/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Layout.tsx
```tsx
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ToastContainer } from './components/common/Toast/Toast';

<OfflineIndicator />
<ToastContainer />
```

### App.tsx
```tsx
import { NotFound } from './pages/NotFound/NotFound';

<Route path="*" element={<NotFound />} />
```

## Styling Guidelines
- Use existing CSS variables
- RTL Hebrew support
- Mobile responsive
- Smooth animations
- Consistent with app design

## Testing Checklist
- Trigger React error (test ErrorBoundary)
- Go offline (test OfflineIndicator)
- Submit invalid form (test validation)
- Navigate to /invalid-route (test 404)
- Create task (test success toast)
- Fail to create task (test error toast)
- Check loading states on slow connection

## Success Criteria
- Error boundary catches errors
- Loading skeletons smooth
- Toasts work for all actions
- Forms validate properly
- Offline detection works
- 404 page accessible
- No TypeScript errors
- Mobile responsive
- Ready for merge to master
