import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { updateProfile } from 'firebase/auth';
import { auth } from './firebase';

export const updateUserProfile = async (uid: string, data: { displayName?: string, photoURL?: string, color?: string }) => {
    try {
        // 1. Update Firebase Auth Profile (if name/photo changed)
        if (auth.currentUser && (data.displayName || data.photoURL)) {
            await updateProfile(auth.currentUser, {
                displayName: data.displayName || auth.currentUser.displayName,
                photoURL: data.photoURL || auth.currentUser.photoURL
            });
        }

        // 2. Update Firestore User Doc
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
