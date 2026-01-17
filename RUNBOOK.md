# 📘 BigMama Operations Runbook

This guide helps you set up, deploy, and manage the BigMama application. It is designed for users with minimal technical background.

## 🏁 Phase 1: Setup

### 1. Identify Your Environment
Ensure your computer has the following tools installed. If you are unsure, try running the "Check Command" in your terminal (Command Prompt on Windows, Terminal on Mac).

| Tool | Check Command | If Missing |
|------|---------------|------------|
| Node.js | `node -v` | [Download & Install Node.js (LTS)](https://nodejs.org/) |
| Git | `git -v` | [Download & Install Git](https://git-scm.com/) |

### 2. Download the Project
1. Open your terminal.
2. Navigate to where you want the project folder (e.g., `cd Documents`).
3. Run:
   ```bash
   git clone https://github.com/your-repo/BigMama.git
   ```
4. Enter the folder:
   ```bash
   cd BigMama
   ```

### 3. Install Dependencies
Run this command to download all necessary libraries:
```bash
npm install
```
*This may take a few minutes.*

---

## 💻 Phase 2: Local Development (Emulators)

Before deploying to the cloud, you can run BigMama locally using the Firebase Emulator. This allows you to test features without creating a real Firebase project.

### 1. Install Firebase Tools
If you haven't already, install the Firebase command-line tools:
```bash
npm install -g firebase-tools
```
*Note: This requires Java to be installed on your computer.*

### 2. Start the Project
You will need two terminal windows open:

**Window A: Start the Emulators**
```bash
npm run emulators
```
*This starts a local database and auth service. Keep this running.*

**Window B: Start the Web App**
```bash
npm run dev
```
*Open the link shown (usually http://localhost:5173).*

### 3. Open the Emulator UI
Go to [http://localhost:4000](http://localhost:4000) to see your local database and manage test users.

---

## ☁️ Phase 3: Firebase Cloud Setup

BigMama uses Google Firebase for its database and authentication. You need to create a free project.

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Name it `bigmama-family` (or unique name).
4. Disable Google Analytics (optional, simplifies setup).
5. Click **Create project**.

### 2. Configure Authentication
1. In your new project, go to **Build > Authentication** in the left menu.
2. Click **Get Started**.
3. Click **Google** provider.
4. Click **Enable**, select your support email, and click **Save**.

### 3. Configure Database
1. Go to **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose a location (e.g., `eur3` for Europe or `us-central1` for US).
4. Select **Start in Production Mode**.
5. Click **Create**.

### 4. Get Configuration Keys
1. Click the **Gear icon ⚙️** next to "Project Overview" > **Project settings**.
2. Scroll down to **Your apps**.
3. Click the **Web icon (`</>`)**.
4. Register the app (nickname: "BigMama Web").
5. You will see a code block `const firebaseConfig = { ... }`. Keep this tab open.

### 5. Connect App to Firebase
1. In the `BigMama` folder on your computer, find the file `.env.example`.
2. Duplicate it and rename the copy to `.env`.
3. Open `.env` with a text editor (Notepad, TextEdit, VS Code).
4. Copy the values from the Firebase Console into this file. It should look like this:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD...
   VITE_FIREBASE_AUTH_DOMAIN=bigmama-123.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=bigmama-123
   ...
   ```
5. Save the file.

---

## 🚀 Phase 4: Deployment

### 1. Login to Firebase CLI
In your terminal, run:
```bash
npm install -g firebase-tools
firebase login
```
Follow the browser instructions to log in with your Google account.

### 2. Initialize Project
Run:
```bash
firebase use --add
```
Select the project you created in Phase 3 from the list. Give it an alias like `prod`.

### 3. Build & Deploy
Run this single command to send your app to the internet:
```bash
npm run build && firebase deploy
```

### 4. Success!
The terminal will output a **Hosting URL** (e.g., `https://bigmama-123.web.app`).
Click it to open your live application!

---

## 🛠️ Operations & Troubleshooting

### Updating the App
If developers release a new version:
1. Open terminal in `BigMama` folder.
2. Get latest code: `git pull`
3. Update libraries: `npm install`
4. Deploy updates: `npm run build && firebase deploy`

### Backup Data
1. Go to Firebase Console > Firestore Database.
2. Click the **Run backup** or **Export** button (requires Blaze plan, otherwise manual JSON export via scripts is needed).
*Note: The free Spark plan does not support automatic backups.*

### Common Issues

**"Site Not Found"**
- Did you run `firebase deploy`?
- Check the hosting URL in the output.

**"Missing or insufficient permissions" error**
- Ensure your `firestore.rules` were deployed. Run: `firebase deploy --only firestore:rules`.

**"Login Failed" popup**
- Ensure you enabled **Google Auth** in Firebase Console.
- Ensure your domain (`your-app.web.app`) is in the **Authorized Domains** list in Firebase Console > Authentication > Settings.

### Emulator Specific Issues

**"Port already in use" (e.g., 8080 or 9099)**
This happens if a previous session didn't shut down correctly.
1. **Find the Process ID (PID)**:
   ```bash
   lsof -i :8080
   ```
   *(Replace 8080 with the port in the error)*
2. **Kill the old process**:
   ```bash
   kill -9 <PID>
   ```
   *(Replace <PID> with the number from the PID column)*

**How to change Emulator Ports**
If a port is permanently taken:
1. Edit `firebase.json` and change the port in the `"emulators"` section.
2. **Crucial**: Update `src/services/firebase.ts` to match:
   ```typescript
   connectAuthEmulator(auth, 'http://127.0.0.1:NEW_PORT');
   connectFirestoreEmulator(db, '127.0.0.1', NEW_PORT);
   ```
3. Restart emulators.

---

## 🆘 Need Help?
Contact the development team or open an issue on the repository.
