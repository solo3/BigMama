# BigMama - Development Standards

> **Version:** 1.0  
> **Last Updated:** 2026-01-16

---

## Core Principles

### 1. Iterative Development

**Build → Test → Verify → Proceed**

- Implement one feature at a time
- Verify it works in the browser before moving on
- Commit after each working feature
- Don't build multiple features simultaneously
- **Create an ADR (Architecture Decision Record) for every significant decision or task** to document the "why" for future maintainers.

```
❌ Wrong: Build Tasks + Calendar + Requests → Test everything at once
✅ Right: Build Tasks → Test → Commit → Build Calendar → Test → Commit → ...
```

### 2. Test-Driven Development (TDD)

**Write tests first, then implement**

For each feature:
1. **Red** — Write a failing test
2. **Green** — Write minimal code to pass
3. **Refactor** — Clean up code while tests pass

```
❌ Wrong: Write component → Maybe add tests later
✅ Right: Write test for component → Write component → Test passes
```

### 3. Type Safety

**TypeScript everywhere**

- All `.ts` and `.tsx` files must pass type checking
- No `any` types (use `unknown` if truly unknown)
- Define interfaces for all data models
- Use strict TypeScript config

### 4. Local-First Development

**Everything runs locally before deployment**

- All development and testing happens against **Firebase Emulators**
- No interaction with production Firebase during development
- Deployment to Firebase Hosting is a **later phase** (Phase 9)
- Test thoroughly locally before any cloud deployment

```
❌ Wrong: Develop against production Firebase
✅ Right: Develop against local emulators → Test → Only deploy when ready
```

### 5. Run Scripts

**Automate repetitive tasks**

- If a task needs to be run more than once, create a script
- Scripts go in `package.json` or a `/scripts` folder
- Document scripts in README

Required scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "emulators": "firebase emulators:start",
    "dev:all": "concurrently \"npm run dev\" \"npm run emulators\""
  }
}
```

---

## Code Organization

### Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/              # Generic (Button, Card, Modal)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.css
│   │   └── ...
│   ├── tasks/               # Task-specific components
│   ├── calendar/            # Calendar-specific components
│   ├── requests/            # Request-specific components
│   └── status/              # Status-specific components
│
├── pages/                   # Route-level components
│   ├── Dashboard/
│   ├── Tasks/
│   ├── Calendar/
│   ├── Requests/
│   └── Settings/
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useFamily.ts
│   ├── useTasks.ts
│   └── ...
│
├── services/                # Firebase/external services
│   ├── firebase.ts          # Firebase init
│   ├── auth.ts              # Auth functions
│   ├── firestore.ts         # Firestore queries
│   └── ...
│
├── types/                   # TypeScript type definitions
│   ├── models.ts            # Data models (Task, Event, etc.)
│   ├── firebase.ts          # Firebase-specific types
│   └── ...
│
├── utils/                   # Utility functions
│   ├── dates.ts             # Date formatting, Hebrew calendar
│   ├── validation.ts        # Form validation
│   └── ...
│
├── styles/                  # Global styles
│   ├── variables.css        # CSS variables (colors, spacing)
│   ├── reset.css            # CSS reset
│   └── global.css           # Global styles
│
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── router.tsx               # Route definitions
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TaskCard.tsx` |
| Hooks | camelCase with `use` prefix | `useTasks.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `Task`, `Member` |
| CSS files | Same as component | `TaskCard.css` |
| Test files | Same + `.test` | `TaskCard.test.tsx` |
| Constants | UPPER_SNAKE_CASE | `MAX_TASKS_PER_PAGE` |

---

## Testing Standards

### Test File Location

Tests live next to the code they test:

```
components/
└── TaskCard/
    ├── TaskCard.tsx
    └── TaskCard.test.tsx      # ← Right here
```

### What to Test

| Layer | What to Test | Priority |
|-------|--------------|----------|
| **Components** | Renders correctly, user interactions, props | High |
| **Hooks** | State changes, side effects | High |
| **Utils** | Pure function input/output | High |
| **Services** | Mock Firebase, test query logic | Medium |

### Test Structure

```typescript
describe('TaskCard', () => {
  describe('rendering', () => {
    it('should display task title', () => {
      // ...
    });

    it('should show assignee avatars', () => {
      // ...
    });
  });

  describe('interactions', () => {
    it('should mark task as done when clicked', () => {
      // ...
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Git Workflow

### Commit Messages

Use conventional commits:

```
feat: add task creation form
fix: resolve calendar date offset bug
refactor: extract date utils to separate file
test: add tests for TaskCard component
docs: update README with setup instructions
style: fix RTL alignment in header
```

### Branch Strategy (for future)

```
main          ← Production-ready code
└── develop   ← Integration branch
    └── feature/task-creation   ← Feature branches
```

For MVP solo development, working on `main` is fine.

---

## Code Style

### TypeScript

```typescript
// ✅ Good: Explicit types, interfaces
interface Task {
  id: string;
  title: string;
  assigneeIds: string[];
  status: 'todo' | 'done';
}

function createTask(data: Omit<Task, 'id'>): Promise<Task> {
  // ...
}

// ❌ Bad: any, implicit types
function createTask(data: any) {
  // ...
}
```

### React Components

```typescript
// ✅ Good: Typed props, functional components
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <div className="task-card">
      {/* ... */}
    </div>
  );
}

// ❌ Bad: Inline types, class components
export function TaskCard(props: { task: any }) {
  // ...
}
```

### CSS

```css
/* ✅ Good: Use CSS variables, semantic class names */
.task-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.task-card--completed {
  opacity: 0.6;
}

/* ❌ Bad: Magic numbers, non-semantic names */
.tc {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
}
```

---

## RTL (Right-to-Left) Guidelines

Since Hebrew is the primary language:

### CSS

```css
/* Use logical properties instead of physical */
/* ✅ Good */
margin-inline-start: 1rem;  /* Works for both RTL and LTR */
padding-inline-end: 0.5rem;
text-align: start;

/* ❌ Bad */
margin-left: 1rem;          /* Breaks in RTL */
padding-right: 0.5rem;
text-align: left;
```

### HTML

```html
<!-- Set direction at root level -->
<html dir="rtl" lang="he">
```

### Icons

Some icons need to be flipped in RTL (arrows, etc.):

```css
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}
```

---

## Firebase Best Practices

### Queries

```typescript
// ✅ Good: Type-safe queries with error handling
async function getTasks(familyId: string): Promise<Task[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'families', familyId, 'tasks'),
        where('status', '==', 'todo'),
        orderBy('createdAt', 'desc')
      )
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}
```

### Real-time Listeners

```typescript
// ✅ Good: Clean up subscriptions
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'families', familyId, 'tasks'),
    (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  );

  return () => unsubscribe();  // ← Always clean up!
}, [familyId]);
```

---

## Definition of Done

A feature is "done" when:

- [ ] Code compiles without TypeScript errors
- [ ] All tests pass
- [ ] Feature works in browser (manual verification)
- [ ] RTL layout looks correct
- [ ] Code is committed with meaningful message
- [ ] No console errors/warnings

---

## Development Checklist per Feature

Before moving to the next feature:

```
□ Tests written and passing
□ Component renders correctly
□ Responsive on mobile (375px) and desktop
□ RTL layout works
□ Firebase integration tested with emulator
□ Error states handled (loading, error, empty)
□ Console is clean (no errors/warnings)
□ Code committed
```
