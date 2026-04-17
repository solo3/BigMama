import {
    collection,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    writeBatch,
    addDoc
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

        // 5. Audit: Family created
        const auditRef = doc(collection(db, 'audit'));
        batch.set(auditRef, {
            familyId,
            collection: 'families',
            docId: familyId,
            action: 'create',
            userId: uid,
            newData: { name: familyName, createdBy: uid },
            timestamp: serverTimestamp()
        });

        // 6. Audit: Member added (creator)
        const memberAuditRef = doc(collection(db, 'audit'));
        batch.set(memberAuditRef, {
            familyId,
            collection: 'members',
            docId: uid,
            action: 'create',
            userId: uid,
            newData: { displayName: userName, role: 'admin' },
            timestamp: serverTimestamp()
        });

        // 7. Audit: User updated with familyId
        const userAuditRef = doc(collection(db, 'audit'));
        batch.set(userAuditRef, {
            familyId,
            collection: 'users',
            docId: uid,
            action: 'update',
            userId: uid,
            previousData: { familyId: null },
            newData: { familyId },
            timestamp: serverTimestamp()
        });

        // 8. Commit Batch
        await batch.commit();

        return familyId;
    } catch (error) {
        console.error('Error creating family:', error);
        throw error;
    }
};

export const updateFamilyName = async (familyId: string, newName: string, userId: string) => {
    try {
        // Get previous data for audit
        const docSnap = await getDoc(doc(db, 'families', familyId));
        const previousData = docSnap.exists() ? docSnap.data() : null;

        await setDoc(doc(db, 'families', familyId), {
            name: newName,
            updatedAt: serverTimestamp()
        }, { merge: true });

        // Audit: Family name updated
        await addDoc(collection(db, 'audit'), {
            familyId,
            collection: 'families',
            docId: familyId,
            action: 'update',
            userId,
            previousData: previousData ? { name: previousData.name } : null,
            newData: { name: newName },
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating family name:', error);
        throw error;
    }
};
export const getFamily = async (familyId: string): Promise<Family | null> => {
    try {
        const docRef = doc(db, 'families', familyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Family;
        }
        return null;
    } catch (error) {
        console.error('Error getting family:', error);
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
