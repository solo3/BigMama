import {
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    serverTimestamp,
    writeBatch,
    Timestamp,
    query,
    collection,
    where,
    onSnapshot,
    orderBy,
    addDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Invite, UserRole } from '../types/models';

export const createInvite = async (familyId: string, createdBy: string, role: UserRole = 'member') => {
    try {
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const inviteData: Omit<Invite, 'id'> = {
            familyId,
            role,
            createdBy,
            createdAt: serverTimestamp() as Timestamp,
        };

        await setDoc(doc(db, 'invites', inviteCode), inviteData);

        // Audit
        await addDoc(collection(db, 'audit'), {
            familyId,
            collection: 'invites',
            docId: inviteCode,
            action: 'create',
            userId: createdBy,
            newData: inviteData,
            timestamp: serverTimestamp()
        });

        return inviteCode;
    } catch (error) {
        console.error('Error creating invite:', error);
        throw error;
    }
};

export const validateInvite = async (inviteCode: string): Promise<Invite> => {
    try {
        const inviteDoc = await getDoc(doc(db, 'invites', inviteCode));
        if (!inviteDoc.exists()) {
            throw new Error('הזמנה לא נמצאה');
        }
        const invite = { id: inviteDoc.id, ...inviteDoc.data() } as Invite;
        if (invite.usedBy) {
            throw new Error('הזמנה זו כבר נוצלה');
        }
        return invite;
    } catch (error) {
        console.error('Error validating invite:', error);
        throw error;
    }
};

export const getInvite = async (inviteCode: string): Promise<Invite | null> => {
    try {
        const inviteDoc = await getDoc(doc(db, 'invites', inviteCode));
        if (inviteDoc.exists()) {
            return { id: inviteDoc.id, ...inviteDoc.data() } as Invite;
        }
        return null;
    } catch (error) {
        console.error('Error getting invite:', error);
        throw error;
    }
};

export const joinFamilyWithInvite = async (uid: string, userName: string, userPhoto: string | undefined, inviteCode: string) => {
    try {
        const invite = await getInvite(inviteCode);
        if (!invite) throw new Error('הזמנה לא נמצאה');
        if (invite.usedBy) throw new Error('הזמנה זו כבר נוצלה');

        const batch = writeBatch(db);

        // 1. Mark invite as used
        batch.update(doc(db, 'invites', inviteCode), {
            usedBy: uid,
            usedAt: serverTimestamp()
        });

        // 2. Add as member to family
        batch.set(doc(db, 'families', invite.familyId, 'members', uid), {
            uid,
            displayName: userName,
            photoURL: userPhoto || null,
            role: invite.role,
            joinedAt: serverTimestamp()
        });

        // 3. Update user doc
        batch.set(doc(db, 'users', uid), {
            uid,
            displayName: userName,
            photoURL: userPhoto || null,
            familyId: invite.familyId,
            updatedAt: serverTimestamp()
        }, { merge: true });

        // 4. Audit: Invite used
        batch.set(doc(collection(db, 'audit')), {
            familyId: invite.familyId,
            collection: 'invites',
            docId: inviteCode,
            action: 'update',
            userId: uid,
            previousData: { usedBy: null },
            newData: { usedBy: uid },
            timestamp: serverTimestamp()
        });

        // 5. Audit: Member created
        batch.set(doc(collection(db, 'audit')), {
            familyId: invite.familyId,
            collection: 'members',
            docId: uid,
            action: 'create',
            userId: uid,
            newData: { displayName: userName, role: invite.role },
            timestamp: serverTimestamp()
        });

        // 6. Audit: User familyId updated
        batch.set(doc(collection(db, 'audit')), {
            familyId: invite.familyId,
            collection: 'users',
            docId: uid,
            action: 'update',
            userId: uid,
            previousData: { familyId: null },
            newData: { familyId: invite.familyId },
            timestamp: serverTimestamp()
        });

        await batch.commit();
        return invite.familyId;
    } catch (error) {
        console.error('Error joining family:', error);
        throw error;
    }
};
export const deleteInvite = async (inviteCode: string, familyId: string, userId: string) => {
    try {
        // Get invite data before deletion for audit
        const inviteSnap = await getDoc(doc(db, 'invites', inviteCode));
        const previousData = inviteSnap.exists() ? inviteSnap.data() : null;

        await deleteDoc(doc(db, 'invites', inviteCode));

        // Audit
        await addDoc(collection(db, 'audit'), {
            familyId,
            collection: 'invites',
            docId: inviteCode,
            action: 'delete',
            userId,
            previousData,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error deleting invite:', error);
        throw error;
    }
};

export const subscribeToInvites = (familyId: string, callback: (invites: Invite[]) => void) => {
    // Note: Due to Firestore query limitations with nulls for ordering, we fetch all for the family 
    // and filter unused ones client-side.
    const q = query(
        collection(db, 'invites'),
        where('familyId', '==', familyId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const invites = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Invite))
            .filter(invite => !invite.usedBy); // Filter active ones
        callback(invites);
    });
};
