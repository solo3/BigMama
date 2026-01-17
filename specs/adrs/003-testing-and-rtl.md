# ADR 003: Testing Strategy & RTL Approach

- **Status:** Proposed
- **Date:** 2026-01-16
- **Decisions Made by:** Antigravity (AI)

## Context
BigMama requires robust testing to ensure reliable family coordination. We also need to guarantee a first-class Right-to-Left (RTL) experience for Hebrew users.

## Decision
1.  **Testing Framework:** Use **Vitest** for fast execution and **React Testing Library (RTL)** for user-centric component testing.
2.  **Test Location:** Co-locate tests with the components they test.
3.  **Mocking:** Mock Firebase services in component tests to avoid dependency on the network or emulators during unit testing.
4.  **RTL Implementation:**
    - Use logical CSS properties (e.g., `padding-inline-start` instead of `padding-left`).
    - Set `dir="rtl"` on the root `html` element.
    - Test components in both LTR and RTL orientations where relevant.

## Rationale
- **Vitest:** Seamless integration with Vite and familiar API for those coming from Jest.
- **React Testing Library:** Encourages testing behavior rather than implementation details.
- **Logical Properties:** Future-proofs the app for multi-language support (Hebrew + English).

## Consequences
- **Positive:** High confidence in UI stability and internationalization.
- **Negative:** Slightly more CSS verbosity; requires developers to learn logical properties.
