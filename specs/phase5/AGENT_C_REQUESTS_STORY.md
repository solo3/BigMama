# Agent C: Requests & Voting System

**Branch:** `feature/requests-voting`  
**Story Points:** 8  
**Priority:** High

## User Story
As a family member, I want to create suggestions and announcements that the family can vote on, so we can make democratic decisions together.

## Acceptance Criteria
1. Requests page at `/requests` with filter tabs (Open/Resolved/All)
2. Request cards showing title, description, author, votes, status
3. Voting functionality (thumbs up/down) with real-time updates
4. Request creation modal with type selector
5. Admin actions (approve/reject/archive)
6. Premium styling, RTL Hebrew, mobile responsive

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Uses existing `useRequests()` hook and `services/requests.ts`
- [ ] No TypeScript errors
- [ ] Real-time sync across tabs
- [ ] Mobile responsive (375px tested)
- [ ] RTL Hebrew works
- [ ] Empty/loading states
- [ ] Error handling
- [ ] Committed to `feature/requests-voting`

## Files to Create
- `src/pages/Requests/RequestsPage.tsx`
- `src/pages/Requests/Requests.css`
- `src/components/common/Modals/RequestModal.tsx`

## Integration
Add to `App.tsx`: `<Route path="/requests" element={<RequestsPage />} />`

## Existing Infrastructure (DO NOT RECREATE)
- ✅ `services/requests.ts` - CRUD functions
- ✅ `hooks/useData.ts` - useRequests() hook
- ✅ `types/models.ts` - FamilyRequest interface
