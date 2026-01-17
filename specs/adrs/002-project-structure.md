# ADR 002: Project Structure & Conventions

- **Status:** Proposed
- **Date:** 2026-01-16
- **Decisions Made by:** Antigravity (AI)

## Context
A consistent project structure is vital for maintainability and onboarding. We need to define how files are organized and named across the BigMama codebase.

## Decision
We will follow a feature-based and layer-based organization within `src/`.

### Directory Structure:
- `components/`: Feature-specific and common UI components.
  - `common/`: Standard UI elements (Button, Card, Modal).
  - `{feature}/`: Feature-specific components (e.g., `tasks/`, `calendar/`).
- `pages/`: Top-level route components.
- `hooks/`: Custom React hooks (e.g., `useAuth`, `useTasks`).
- `services/`: External API logic (Firebase/Firestore interactions).
- `types/`: Shared TypeScript models and interfaces.
- `utils/`: Reusable helper functions (dates, validation).
- `styles/`: Global CSS and variables.

### Naming Conventions:
- **Components:** PascalCase (e.g., `TaskCard.tsx`).
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`).
- **Services/Utils:** camelCase (e.g., `firestore.ts`, `formatDate.ts`).
- **Styles:** Same name as component (e.g., `TaskCard.css`).
- **Tests:** Same name + `.test` (e.g., `TaskCard.test.tsx`).

## Rationale
- **Discoverability:** Logical grouping makes it easy to find related files.
- **Predictability:** Consistent naming reduces mental overhead.
- **Scalability:** The feature-based approach prevents any single directory from becoming too cluttered.

## Consequences
- **Positive:** Clear separation of concerns and easier testing.
- **Negative:** Requires discipline to follow consistently; some files might feel "disconnected" if not placed in the right feature folder.
