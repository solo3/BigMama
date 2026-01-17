import {
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const createFamily = async (uid: string, familyName: string, userName: string) => {
    try {
        // 1. Create Family Document
        const familyRef = await addDoc(collection(db, 'families'), {
            name: familyName,
            createdAt: serverTimestamp(),
            createdBy: uid
        });

        const familyId = familyRef.id;

        // 2. Create Member Document (Subcollection)
        await setDoc(doc(db, 'families', familyId, 'members', uid), {
            uid,
            displayName: userName,
            role: 'admin',
            joinedAt: serverTimestamp()
        });

        // 3. Update User Document
        await setDoc(doc(db, 'users', uid), {
            uid,
            displayName: userName,
            familyId: familyId,
            updatedAt: serverTimestamp()
        });

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

export const subscribeToFamily = (familyId: string, callback: (family: any) => void) => {
    return onSnapshot(doc(db, 'families', familyId), (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    });
};
