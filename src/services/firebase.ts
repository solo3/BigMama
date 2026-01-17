import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Note: For Phase 1 (Local First), we use mock/emulator config.
// Real config will be added when deploying to production.
const firebaseConfig = {
    apiKey: "mock-api-key",
    authDomain: "bigmama-dev.firebaseapp.com",
    projectId: "bigmama-dev",
    storageBucket: "bigmama-dev.appspot.com",
    messagingSenderId: "mock-sender-id",
    appId: "mock-app-id"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators if in development
if (import.meta.env.DEV) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
