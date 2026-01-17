# BigMama Agent Specification

> **Note to Agents**: This file (`agent.md`) is your primary source of truth for understanding the project context, technical standards, and development workflows. Read this before starting any task.

## 1. Project Overview

**BigMama** is a family productivity web application designed to help families coordinate tasks, events, and daily status. It is built for Hebrew speakers (RTL) and emphasizes a premium, user-friendly interface.

### Key Capabilities
- **Authentication**: Google Sign-In with family grouping logic.
- **Dashboard**: Real-time overview of family status ("Who's Home"), tasks, and events.
- **Tasks**: Shared task lists with assignment and due dates.
- **Calendar**: Shared calendar with Hebrew holiday support.
- **Requests**: Democratic voting system for family suggestions.
- **Settings**: Family management and member roles (Admin/Member).

## 2. Tech Stack

- **Runtime**: Node.js v16+ (strict requirement)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS + CSS Modules (`src/styles/variables.css` for tokens)
- **Backend & Auth**: Firebase (Auth, Firestore)
- **State Management**: React Context + Hooks (`src/context/`, `src/hooks/`)
- **Icons**: `lucide-react`
- **Testing**: Vitest + React Testing Library

## 3. Directory Structure

```
src/
├── components/     # Reusable UI components
│   ├── common/     # Shared (Layout, Modals, etc.)
│   └── [feature]/  # Feature-specific components
├── context/        # React Contexts (AuthContext)
├── hooks/          # Custom Hooks (useAuth, useTasks, etc.)
├── pages/          # Route components
├── services/       # Firebase service layer (business logic)
├── types/          # TypeScript interfaces (models.ts)
└── utils/          # Helper functions
specs/             # Documentation & Specs
```

## 4. Coding Standards

### TypeScript
- **Strict Mode**: Enabled. No `any` types unless absolutely necessary.
- **Interfaces**: Define data models in `src/types/models.ts`.
- **Props**: Explicitly define `Props` interfaces for components.

### React
- **Functional Components**: Use `React.FC` or functional declarations.
- **Hooks**: extracting logic into custom hooks (e.g., `useTasks`) is preferred over inline logic.
- **Styling**:
  - Use CSS variables from `index.css` / `variables.css`.
  - Prefer CSS Modules for component-specific styles or plain CSS with BEM-naming if modules aren't used.
  - **RTL**: Ensure `direction: rtl` compatibility.

### Firebase
- **Service Layer**: Do not call Firestore directly in components. Create a function in `src/services/[feature].ts`.
- **Real-time**: Use `onSnapshot` for real-time data sync in hooks.

## 5. Development Workflows

### Starting Development
1. **Emulators**: `npx firebase emulators:start`
2. **Dev Server**: `npm run dev`

### Creating a New Feature
1. **Spec**: Update `specs/tasks.md` and `specs/implementation_plan.md`.
2. **Model**: Add types to `src/types/models.ts`.
3. **Service**: Implement CRUD in `src/services/`.
4. **Hook**: Expose data via `src/hooks/`.
5. **UI**: Build components and page.
6. **Route**: Add to `App.tsx`.

### Verification
- **Build Clean**: `npm run build` must pass without errors.
- **Tests**: `npm test` should pass.
- **Mobile**: Check at 375px width.

## 6. Current Status
- **Phase 4 Complete**: Tasks, Calendar, Dashboard, Settings.
- **Phase 5 Complete**: Requests & Voting System.
- See `specs/COMPLETION_STATUS.md` for live tracking.

## 7. Commands

| Action | Command |
|OSS|---|
| Dev Server | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Emulators | `npx firebase emulators:start` |
