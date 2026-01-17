# ADR 004: Firebase & Auth Architecture

- **Status:** Proposed
- **Date:** 2026-01-16
- **Decisions Made by:** Antigravity (AI)

## Context
We need a standard way to handle authentication state and Firebase services throughout the React application.

## Decision
1.  **Single Instance:** We initialize Firebase once in `services/firebase.ts` and export the `auth` and `db` instances.
2.  **Auth Service:** Create a `services/auth.ts` to wrap Firebase Auth SDK calls (e.g., `signInWithPopup`) into application-specific functions.
3.  **Context Provider:** Use a React Context (`AuthProvider`) at the root level to store the current user profile. This avoids "prop drilling" where we have to pass user info through many components.
4.  **Custom Hook:** Provide a `useAuth` hook for components to access the user and loading status easily.
5.  **Guard Pattern:** Use a `ProtectedRoute` component that leverages the context to render either a login screen or the guarded content.

## Rationale
- **Isolation:** Keeps Firebase SDK complexity out of the UI components.
- **Consistency:** All components see the same user state at the same time.
- **Developer Experience:** `const { user } = useAuth()` is a very clean and predictable way to check login status.

## Consequences
- **Positive:** Very clean UI code; easy to add "Onboarding Needed" checks later.
- **Negative:** Everything is wrapped in a Provider, which can make testing slightly more verbose (tests need to include the wrapper).
