# BigMama CLI Cheat Sheet

This guide provides common commands for developing, testing, and building the BigMama project.

## 🚀 Development

### Start the development server
```bash
npm run dev
```

### Install dependencies
```bash
npm install
```

## 🧪 Testing

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npx vitest
```

## 🛠️ Validation & Build

### Type-check the project
```bash
npx tsc --noEmit
```

### Lint the project
```bash
npm run lint
```

### Build for production
```bash
npm run build
```

### Preview the production build locally
```bash
npm run preview
```

## 🔧 Firebase CLI Setup

If you haven't set up Firebase on your machine yet, follow these steps:

### 1. Install Firebase Tools
Since the project is using Node v16, install the compatible version:
```bash
npm install -g firebase-tools@12.9.1
```
*Note: You can also use `npx firebase` to use the version installed in `node_modules` without global installation.*

### 2. Login to Firebase
This will open your browser to authenticate.
```bash
firebase login
```

### 3. List your projects
Verify you have access to the project.
```bash
firebase projects:list
```

## 🔥 Firebase (Emulators & Deploy)


> **⚠️ Node.js Compatibility Note**: 
> If you are using **Node.js v16**, ensure you use `firebase-tools` version **12.9.1** or earlier. Modern versions (v13+) require Node.js v18+.
> To fix compatibility issues: `npm install -D firebase-tools@12.9.1`

### Start Firebase emulators
```bash
npx firebase emulators:start --only auth,firestore,ui
```

### Deploy to Firebase
```bash
npx firebase deploy
```

