import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Family } from '../types/models';

export const createFamily = async (uid: string, familyName: string, userName: string) => {
    try {
        const batch = writeBatch(db);

        // 1. Generate Family ID
        const familyRef = doc(collection(db, 'families'));
        const familyId = familyRef.id;

        // 2. Add Family Doc
        batch.set(familyRef, {
            name: familyName,
            createdAt: serverTimestamp(),
            createdBy: uid
        });

        // 3. Add Member Doc
        const memberRef = doc(db, 'families', familyId, 'members', uid);
        batch.set(memberRef, {
            uid,
            displayName: userName,
            role: 'admin',
            joinedAt: serverTimestamp()
        });

        // 4. Update User Doc
        const userRef = doc(db, 'users', uid);
        batch.set(userRef, {
            uid,
            displayName: userName,
            familyId: familyId,
            updatedAt: serverTimestamp()
        });

        // 5. Commit Batch
        await batch.commit();

        return familyId;
    } catch (error) {
        console.error('Error creating family:', error);
        throw error;
    }
};

export const updateFamilyName = async (familyId: string, newName: string) => {
    try {
        await setDoc(doc(db, 'families', familyId), {
            name: newName,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating family name:', error);
        throw error;
    }
};

export const subscribeToFamily = (familyId: string, callback: (family: Family | null) => void) => {
    return onSnapshot(doc(db, 'families', familyId), (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() } as Family);
        } else {
            callback(null);
        }
    });
};
