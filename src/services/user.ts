import { doc, updateDoc, serverTimestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { updateProfile } from 'firebase/auth';
import { auth } from './firebase';

export const updateUserProfile = async (uid: string, familyId: string, actingUserId: string, data: { displayName?: string, photoURL?: string, color?: string }) => {
    try {
        // Get previous data for audit
        const userSnap = await getDoc(doc(db, 'users', uid));
        const previousData = userSnap.exists() ? userSnap.data() : null;

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

        // 3. Audit
        await addDoc(collection(db, 'audit'), {
            familyId,
            collection: 'users',
            docId: uid,
            action: 'update',
            userId: actingUserId,
            previousData,
            newData: data,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
