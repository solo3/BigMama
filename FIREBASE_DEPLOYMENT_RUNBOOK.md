# BigMama - Firebase Deployment Runbook

> **Target Audience:** Developers with no Firebase experience  
> **Version:** 1.0  
> **Last Updated:** 2026-01-17

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
   - [1.1 Node.js Upgrade](#11-nodejs-upgrade-if-needed)
2. [Step 1: Create Firebase Account](#2-create-firebase-account)
3. [Step 2: Create Firebase Project](#3-create-firebase-project)
4. [Step 3: Enable Firebase Services](#4-enable-firebase-services)
5. [Step 4: Install Firebase CLI](#5-install-firebase-cli)
6. [Step 5: Connect App to Firebase](#6-connect-app-to-firebase)
7. [Step 6: Deploy to Firebase](#7-deploy-to-firebase)
8. [Troubleshooting](#8-troubleshooting)
9. [Quick Reference](#9-quick-reference)
10. [Deployment Workflow](#10-deployment-workflow)

---

## 1. Prerequisites

Before starting, ensure you have:

- **Node.js v18+** installed
  ```bash
  node --version  # Should show v18.x or higher
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version  # Should show v9.x or higher
  ```

- **Git** (for version control)

- **Web browser** (Chrome recommended)

### 1.1 Node.js Upgrade (If Needed)

If your Node.js version is below v18, **Firebase CLI won't work**. Here's how to upgrade on macOS:

**Quick install using `n` (Node version manager):**

```bash
# Install n globally
npm install -g n

# Install latest Node.js (v22)
n 22

# If permission error, use custom prefix:
export N_PREFIX="$HOME/.local"
n 22

# Verify
node --version  # Should show v22.x.x

# Make it permanent (add to ~/.zshrc):
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
echo 'export N_PREFIX="$HOME/.local"' >> ~/.zshrc
```

**Common issue:** Node.js v16 doesn't support new firebase-tools
- Error: "Unsupported engine" warnings during install
- Solution: Upgrade to Node.js v18+ using the steps above

---

## 2. Create Firebase Account

### 2.1 Sign Up for Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Sign in"** (top right)
3. Click **"Get started"**
4. Sign in with your **Google account** (same as your Android phone Gmail)
5. Accept the terms and conditions

### 2.2 Understanding Firebase Pricing

**Important:** BigMama uses these Firebase services:

| Service | Free Tier | Used For |
|---------|-----------|----------|
| Firebase Auth | Unlimited | Google Sign-In |
| Cloud Firestore | 1GB storage, 50K reads/day | Database |
| Firebase Hosting | 10GB storage | Website hosting |
| Cloud Functions | 2M invocations/month | Future features |

**For a family app (small usage):** You will likely stay within the **Spark (Free) plan** forever.

### 2.3 Check Current Plan

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **⚙️ Settings** (gear icon) → **"Usage and billing"**
3. Check you're on **"Blaze"** (Pay-as-you-go) or **"Spark"** (Free)
4. For MVP, **Spark plan is sufficient**

---

## 3. Create Firebase Project

### 3.1 Create New Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `bigmama` (or your preferred name)
4. Google Analytics: **Enable** (recommended, but optional)
5. Accept Firebase terms → Click **"Create project"**
6. Wait for project creation (~30 seconds)

### 3.2 Project Dashboard

After creation, you'll see the project dashboard with:
- **Build** section (Auth, Firestore, etc.)
- **Release & Monitor** section
- **Project Settings**

---

## 4. Enable Firebase Services

### 4.1 Enable Authentication

1. In Firebase Console → **Build** → **Authentication**
2. Click **"Get started"**
3. Under **"Sign-in method"**, click on **Google**
4. Toggle **"Enable"**
5. Select a **Project support email** (your Google email)
6. Click **"Save"**

**Result:** Google Sign-In is now enabled for your app.

### 4.2 Enable Cloud Firestore

1. In Firebase Console → **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users:
   - For Israel: `europe-west1 (Belgium)` or `me-central1 (Tel Aviv)`
5. Click **"Enable"**
6. Wait for database creation (~1 minute)

### 4.3 Configure Firestore Security Rules

**⚠️ Important:** Test mode allows anyone to read/write. For production, update rules:

1. In Firestore → **Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is a member of this family
    function isFamilyMember(familyId) {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid));
    }
    
    // Check if user is a family admin
    function isFamilyAdmin(familyId) {
      return isFamilyMember(familyId) &&
             get(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection (top-level lookup)
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow create: if request.auth.uid == uid;
      allow update, delete: if false;
    }
    
    // Invites collection
    match /invites/{inviteCode} {
      allow get: if isAuthenticated();
      allow list: if false;
      allow create: if isAuthenticated() && 
                       isFamilyAdmin(request.resource.data.familyId);
      allow update: if isAuthenticated() && 
                       resource.data.usedBy == null;
    }
    
    // Family document
    match /families/{familyId} {
      allow read: if isFamilyMember(familyId);
      allow update: if isFamilyAdmin(familyId);
      allow create: if isAuthenticated();
      
      // Members subcollection
      match /members/{memberId} {
        allow read: if isFamilyMember(familyId);
        allow update: if request.auth.uid == memberId || isFamilyAdmin(familyId);
        allow create: if isAuthenticated();
        allow delete: if isFamilyAdmin(familyId);
      }
      
      // Tasks, Events, Requests, Statuses
      match /{subcollection}/{docId} {
        allow read, write: if isFamilyMember(familyId);
      }
    }
  }
}
```

3. Click **"Publish"**

---

## 5. Install Firebase CLI

Firebase CLI (Command Line Interface) lets you deploy from terminal.

### 5.1 Install Firebase Tools Globally

```bash
npm install -g firebase-tools
```

### 5.2 Verify Installation

```bash
firebase --version
# Should show: 12.x.x or higher
```

### 5.3 Login to Firebase CLI

```bash
firebase login
```

- Opens browser → Click **"Allow"** to grant permissions
- Returns to terminal with success message

### 5.4 List Your Projects

```bash
firebase projects:list
```

You should see your newly created project in the list.

---

## 6. Connect App to Firebase

### 6.1 Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **⚙️ Settings** (gear icon)
4. Scroll to **"Your apps"** section
5. Click **"Web"** icon (</>) to add a web app
6. Enter app nickname: `BigMama Web`
7. **Don't check** "Firebase Hosting" (we'll set this separately)
8. Click **"Register app"**
9. **Copy the configuration** - you'll need it for the next step:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 6.2 Create Environment File

Create a file called `.env.local` in the project root:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

### 6.3 Update Firebase Service

Open `src/services/firebase.ts` and replace the config:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREFIRE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 6.4 Test Locally

1. Stop any running dev server (Ctrl+C)
2. Restart with:
   ```bash
   npm run dev
   ```
3. Navigate to http://localhost:5173
4. Try to sign in with Google
5. If it works → Firebase is connected! ✅

---

## 7. Deploy to Firebase

### 7.1 Initialize Firebase Hosting

1. In project root, run:
   ```bash
   firebase init hosting
   ```

2. **Select features:**
   - ◉ Hosting: Configure files for Firebase Hosting

3. **Select project:** Choose your Firebase project

4. **What do you want to use as your public directory?** `dist`
   - This is Vite's build output folder

5. **Configure as single-page app?** `No`
   - BigMama uses React Router, but we'll handle this differently

6. **Set up automatic builds?** `No`
   - We'll deploy manually

7. **File dist/404.html already exists. Overwrite?** `No`

### 7.2 Update firebase.json

Edit `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 7.3 Build the App

```bash
npm run build
```

This creates the `dist/` folder with production files.

### 7.4 Deploy to Firebase Hosting

```bash
firebase deploy
```

**Output will show:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

### 7.5 Your App is Live! 🎉

Access it at: `https://your-project.web.app`

You can also add a custom domain later from Firebase Console → Hosting.

---

## 8. Troubleshooting

### Issue: Can't Login with Google Account

**Error:** "Cannot read image.png" or browser login not working

**Solutions:**

1. **Use CI token (recommended for terminal):**
   ```bash
   firebase login:ci
   ```
   - Opens browser, grants access
   - Returns a token like `1//0g...`
   - Use token: `firebase deploy --token "your-token"`

2. **Deploy with token:**
   ```bash
   firebase deploy --only hosting --token "1//0g..."
   ```

3. **Check browser:**
   - Make sure you're logged in to the correct Google account in Chrome
   - Allow cookies for firebase.google.com

---

### Error: "Permission denied" or "Missing or insufficient permissions"

**Cause:** Firestore security rules are too restrictive.

**Fix:**
1. Go to Firebase Console → Firestore → Rules
2. Temporarily use test mode:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. Publish → Test → Update rules with proper permissions

---

### Error: "auth/operation-not-allowed"

**Cause:** Google Sign-In not enabled.

**Fix:**
1. Firebase Console → Authentication → Sign-in method
2. Enable Google Sign-In
3. Save

---

### Error: "Firebase App not initialized"

**Cause:** Environment variables not loaded.

**Fix:**
1. Ensure `.env.local` exists in project root
2. Ensure variable names start with `VITE_`
3. Restart dev server: `npm run dev`

---

### Error: "Firebase CLI not logged in"

**Fix:**
```bash
firebase logout
firebase login
```

---

### Error: "Hosting deploy failed - no public directory"

**Cause:** `dist/` folder doesn't exist.

**Fix:**
```bash
npm run build
firebase deploy
```

---

### Error: "Project not found"

**Cause:** Firebase CLI not connected to correct project.

**Fix:**
```bash
firebase projects:list  # See available projects
firebase use your-project-id  # Switch to correct project
```

---

## 9. Quick Reference

### Common Commands

| Command | Description |
|---------|-------------|
| `firebase login` | Login to Firebase |
| `firebase projects:list` | List your Firebase projects |
| `firebase use project-id` | Switch active project |
| `firebase deploy` | Deploy to Firebase Hosting |
| `firebase emulators:start` | Start local emulators |
| `firebase deploy --only firestore:rules` | Deploy only Firestore rules |

### Firebase Console URLs

| Service | URL |
|---------|-----|
| Firebase Console | https://console.firebase.google.com |
| Firestore | Build → Firestore Database |
| Authentication | Build → Authentication |
| Hosting | Build → Hosting |
| Project Settings | ⚙️ → Project Settings |

### Environment Variables Checklist

- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

### Deployment Checklist

- [ ] Firebase project created
- [ ] Google Sign-In enabled
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Environment variables set
- [ ] App builds successfully (`npm run build`)
- [ ] Deployed to Firebase (`firebase deploy`)
- [ ] App accessible at *.web.app URL

---

## Need Help?

### Official Firebase Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Authentication Guide](https://firebase.google.com/docs/auth)

### Community Support
- [Firebase Community](https://www.reddit.com/r/Firebase/)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

---

**Next Steps:** After deployment, configure [Firestore indexes](https://firebase.google.com/docs/firestore/query-data/indexing) for optimal query performance.

---

## 10. Deployment Workflow

**Quick commands to deploy updates:**

```bash
# 1. Make sure Node.js 22 is active
export PATH="$HOME/.local/bin:$PATH"  # Or use ~/.zshrc

# 2. Build the app
npm run build

# 3. Deploy to Firebase
firebase deploy --only hosting
```

**Full deployment (includes firestore rules):**
```bash
firebase deploy
```

**Deploy only firestore rules:**
```bash
firebase deploy --only firestore:rules
```

---

### Deployment Checklist

Before deploying:
- [ ] Tests pass: `npm test`
- [ ] Build passes: `npm run build`
- [ ] Correct Firebase project: `firebase projects:list`
- [ ] Firebase services enabled (Auth, Firestore)

After deploying:
- [ ] App loads at https://your-project.web.app
- [ ] Login works with Google
- [ ] Data saves to Firestore

---

### First-Time Setup Summary

If starting from scratch on a new machine:

```bash
# 1. Ensure Node.js v18+
node --version

# 2. Install dependencies
npm install

# 3. Install Firebase CLI
npm install -g firebase-tools

# 4. Login to Firebase
firebase login

# 5. Select project
firebase projects:list
firebase use your-project-id

# 6. Build and deploy
npm run build
firebase deploy --only hosting
```

---

*Document created for BigMama project - Hebrew Family Productivity App*
*Last Updated: 2026-01-17*
