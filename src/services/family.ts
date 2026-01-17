import {
    collection,
    doc,
    setDoc,
    addDoc,
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
