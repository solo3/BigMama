# BigMama - Tech Stack

## Overview

BigMama is a family productivity dashboard — think "Jira/Trello for families". It provides shared calendars, task management, status tracking ("Who's Home"), and a request/suggestion system.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Family Devices                          │
│              (Android Chrome / PC Browsers)                 │
│                                                             │
│         ┌─────────────────────────────────┐                 │
│         │      PWA Frontend (React)       │                 │
│         │   Hosted on Firebase Hosting    │                 │
│         └───────────────┬─────────────────┘                 │
│                         │                                   │
│                         │ Firebase SDK (direct calls)       │
│                         ▼                                   │
│    ┌──────────────────────────────────────────────────┐     │
│    │                 Firebase Services                │     │
│    ├──────────────┬───────────────┬───────────────────┤     │
│    │   Firestore  │     Auth      │   Cloud Messaging │     │
│    │  (Database)  │   (Login)     │   (Push Notifs)   │     │
│    └──────────────┴───────────────┴───────────────────┘     │
│                                                             │
│    ┌──────────────────────────────────────────────────┐     │
│    │         Cloud Functions (Future - LLM/AI)        │     │
│    └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Details

### Frontend

| Component | Technology | Notes |
|-----------|------------|-------|
| **Framework** | React 18 (Vite) | Fast build, modern DX |
| **Language** | TypeScript (TSX) | Type safety, better IDE support |
| **Styling** | Vanilla CSS + CSS Variables | No Tailwind; full control |
| **Icons** | Lucide React | Lightweight, modern icons |
| **PWA** | Vite PWA Plugin | Service worker, installability |
| **Testing** | Vitest + React Testing Library | TDD approach |

### Backend (Firebase)

| Service | Purpose | Free Tier Limits |
|---------|---------|------------------|
| **Firestore** | NoSQL database for all app data | 1 GB storage, 50K reads/day, 20K writes/day |
| **Authentication** | Google Sign-In only | Unlimited |
| **Cloud Messaging (FCM)** | Push notifications for reminders | Unlimited |
| **Hosting** | Serve the PWA | 10 GB storage, 360 MB/day |
| **Cloud Functions** | Future: LLM/AI features, scheduled tasks | 2M invocations/month |

---

## Development Workflow

### Local Development

```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, start Vite dev server
npm run dev
```

- Firestore Emulator: `localhost:8080`
- Auth Emulator: `localhost:9099`
- Emulator UI: `localhost:4000`
- Vite Dev Server: `localhost:5173`

### Deployment

```bash
# Build the React app
npm run build

# Deploy to Firebase
firebase deploy
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "firebase": "^10.x",
    "lucide-react": "^0.x",
    "@hebcal/core": "^5.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "vite-plugin-pwa": "^0.x",
    "@vitejs/plugin-react": "^4.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x"
  }
}
```

---

## Future Enhancements

| Feature | Implementation |
|---------|----------------|
| **AI/LLM Features** | Cloud Functions (Python or Node.js) calling OpenAI/Anthropic APIs |
| **Scheduled Reminders** | Cloud Functions with Pub/Sub scheduler |
| **Offline Support** | Enhanced PWA caching with Workbox |
| **iOS Notifications** | Requires native app wrapper (Capacitor) or Telegram bot fallback |

---

## Security Considerations

- **Firestore Rules**: Restrict read/write to authenticated family members only.
- **Family Isolation**: Each family has a `familyId`; users can only access their own family's data.
- **Auth**: Use Firebase Auth with Google Sign-In (MFA supported by Google).

### Security Hardening (CISO Requirements)
1.  **Invite Code Security**:
    - Codes must be high-entropy (min 12 chars) to prevent brute-force enumeration.
    - `invites` collection MUST NOT be listable (deny `list`, allow `get`).
2.  **Privilege Escalation Prevention**:
    - Only Admins can modify the `members` subcollection.
    - Members cannot update their own `role` field.
3.  **Data Leakage Prevention**:
    - `users` documents are strictly read-only for others (lookups by ID only).
    - Validation of `familyId` consistency on every write.
4.  **Dependencies**:
    - Regular audit of npm packages (specifically `@hebcal/core` and `firebase`).
