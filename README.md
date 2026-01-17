# BigMama - Family Productivity App

BigMama is a Hebrew-language family productivity web application built with React, TypeScript, and Firebase. It helps families coordinate tasks, events, presence status, and family requests in one centralized platform.

## 📋 Prerequisites

- **Node.js**: v16.x or higher
- **npm**: v7.x or higher
- **Firebase CLI**: v12.9.1 (for Node v16) or latest (for Node v18+)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 🏃 Running the App

### Development Mode (with Hot Reload)

```bash
npm run dev
```

This starts the Vite development server with:
- Hot Module Replacement (HMR)
- Automatic connection to Firebase emulators (if running)
- DevLogger component for debugging

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build Locally

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## 🧪 Testing & Debugging

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npx vitest

# Run tests with coverage
npx vitest --coverage
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

### Using Firebase Emulators

The app automatically connects to Firebase emulators when running in development mode (`npm run dev`).

#### Start Emulators

```bash
npx firebase emulators:start
```

This starts:
- **Auth Emulator**: `http://127.0.0.1:9099`
- **Firestore Emulator**: `http://127.0.0.1:8080`
- **Emulator UI**: `http://127.0.0.1:4000`

The emulator UI provides a web interface to:
- View and manage authentication users
- Browse Firestore collections and documents
- Monitor emulator logs

### DevLogger Component

The app includes a built-in `DevLogger` component that displays real-time debugging information in development mode:

- Current user information
- Family ID
- Recent Firestore operations
- Authentication state changes

The DevLogger appears as a floating panel in the bottom-right corner during development.

### Skipping Authentication for Local Testing

There are several ways to bypass authentication during local development:

#### Option 1: Use Firebase Auth Emulator (Recommended)

When using emulators, you can create test users directly in the Auth Emulator UI:

1. Start emulators: `npx firebase emulators:start`
2. Open Emulator UI: `http://127.0.0.1:4000`
3. Go to **Authentication** tab
4. Click **Add User** and create test accounts
5. Sign in with these accounts in your app

#### Option 2: Modify ProtectedRoute Component

For quick testing without authentication, temporarily modify `src/components/common/ProtectedRoute.tsx`:

```tsx
// Temporarily bypass auth check
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // return <>{children}</>;  // Uncomment this line to skip auth
  
  const { user, loading } = useAuth();
  // ... rest of the component
};
```

> **⚠️ Warning**: Remember to revert this change before committing!

#### Option 3: Use Seed Data

The app includes a `seedData.ts` utility that can populate the emulator with test data:

```typescript
// In src/utils/seedData.ts
import { seedFamilyData } from '@/utils/seedData';

// Call this after authentication in development
await seedFamilyData(familyId, userId);
```

## 🔥 Firebase Deployment

### Prerequisites

1. **Install Firebase CLI** (if not already installed):

```bash
# For Node v16
npm install -g firebase-tools@12.9.1

# For Node v18+
npm install -g firebase-tools
```

2. **Login to Firebase**:

```bash
firebase login
```

3. **Verify Project Access**:

```bash
firebase projects:list
```

### Deployment Steps

#### 1. Update Firebase Configuration

Before deploying to production, update `src/services/firebase.ts` with your actual Firebase project configuration:

```typescript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

> **💡 Tip**: Get these values from Firebase Console → Project Settings → General

#### 2. Build the App

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

#### 3. Deploy to Firebase

```bash
# Deploy everything (hosting + Firestore rules + indexes)
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Firestore indexes
firebase deploy --only firestore:indexes
```

#### 4. Verify Deployment

After deployment:

1. Visit your app at: `https://your-project.web.app`
2. Test authentication flow
3. Verify Firestore security rules are working
4. Check browser console for errors

### Firestore Security Rules

The app uses comprehensive security rules defined in `firestore.rules`. Key rules:

- Users can only read/write their own user document
- Family members can read/write data within their family
- Admin role required for certain operations

To update rules after changes:

```bash
firebase deploy --only firestore:rules
```

### Firestore Indexes

Required indexes are defined in `firestore.indexes.json`. Deploy them with:

```bash
firebase deploy --only firestore:indexes
```

## 📁 Project Structure

```
BigMama/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── common/       # Shared components (Layout, Navigation, etc.)
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (Dashboard, Tasks, Calendar, etc.)
│   ├── services/         # Firebase service modules
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── specs/                # Project specifications and documentation
├── public/               # Static assets
├── dist/                 # Production build output
└── firebase.json         # Firebase configuration
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests once |
| `npm run lint` | Lint code with ESLint |
| `npx vitest` | Run tests in watch mode |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx firebase emulators:start` | Start Firebase emulators |
| `npx firebase deploy` | Deploy to Firebase |

## 🛠️ Development Workflow

1. **Start emulators** (in one terminal):
   ```bash
   npx firebase emulators:start
   ```

2. **Start dev server** (in another terminal):
   ```bash
   npm run dev
   ```

3. **Make changes** and see them reflected instantly via HMR

4. **Run tests** to verify functionality:
   ```bash
   npm test
   ```

5. **Build and deploy** when ready:
   ```bash
   npm run build
   firebase deploy
   ```

## 🌐 Environment-Specific Behavior

The app automatically detects the environment:

- **Development** (`npm run dev`):
  - Connects to Firebase emulators
  - Shows DevLogger component
  - Enables verbose logging
  
- **Production** (`npm run build`):
  - Connects to production Firebase
  - Hides DevLogger
  - Optimized bundle size

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm test`
4. Build: `npm run build`
5. Commit: `git commit -m "feat: your feature"`
6. Push and create a pull request

---

**Note**: This project uses Hebrew (RTL) as the primary language. All UI text should be in Hebrew.
