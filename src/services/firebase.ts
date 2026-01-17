import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Note: For Phase 1 (Local First), we use mock/emulator config.
// Real config will be added when deploying to production.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bigmama-dev.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bigmama-dev",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bigmama-dev.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "mock-app-id"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators if in development
if (import.meta.env.DEV) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
