import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    serverTimestamp,
    getDoc,
    addDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Member, DailyStatus, PresenceStatus } from '../types/models';

export const subscribeToMembers = (familyId: string, callback: (members: Member[]) => void) => {
    const q = query(collection(db, 'families', familyId, 'members'), orderBy('displayName', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const members = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        })) as Member[];
        callback(members);
    });
};

export const subscribeToDailyStatus = (familyId: string, dateId: string, callback: (status: DailyStatus | null) => void) => {
    return onSnapshot(doc(db, 'families', familyId, 'status', dateId), (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() } as DailyStatus);
        } else {
            callback(null);
        }
    });
};

export const updateMemberStatus = async (familyId: string, userId: string, uid: string, dateId: string, status: PresenceStatus) => {
    // Get previous data for audit
    const statusSnap = await getDoc(doc(db, 'families', familyId, 'status', dateId));
    const previousStatus = statusSnap.exists() ? statusSnap.data()?.members?.[uid] : null;

    const statusRef = doc(db, 'families', familyId, 'status', dateId);
    await setDoc(statusRef, {
        members: {
            [uid]: status
        },
        updatedAt: serverTimestamp()
    }, { merge: true });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'status',
        docId: dateId,
        action: 'update',
        userId,
        previousData: previousStatus ? { [uid]: previousStatus } : null,
        newData: { [uid]: status },
        timestamp: serverTimestamp()
    });
};
export const removeMember = async (familyId: string, userId: string, memberUid: string) => {
    // Get member data before deletion for audit
    const memberSnap = await getDoc(doc(db, 'families', familyId, 'members', memberUid));
    const previousData = memberSnap.exists() ? memberSnap.data() : null;

    // 1. Remove from family members subcollection
    await deleteDoc(doc(db, 'families', familyId, 'members', memberUid));

    // 2. Clear user's familyId
    await updateDoc(doc(db, 'users', memberUid), {
        familyId: null,
        updatedAt: serverTimestamp()
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'members',
        docId: memberUid,
        action: 'delete',
        userId,
        previousData,
        timestamp: serverTimestamp()
    });

    // Audit: User's familyId set to null
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'users',
        docId: memberUid,
        action: 'update',
        userId,
        previousData: { familyId },
        newData: { familyId: null },
        timestamp: serverTimestamp()
    });
};

export const updateMemberRole = async (familyId: string, userId: string, memberUid: string, newRole: 'admin' | 'member') => {
    // Get previous data for audit
    const memberSnap = await getDoc(doc(db, 'families', familyId, 'members', memberUid));
    const previousData = memberSnap.exists() ? memberSnap.data() : null;

    await updateDoc(doc(db, 'families', familyId, 'members', memberUid), {
        role: newRole,
        updatedAt: serverTimestamp()
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'members',
        docId: memberUid,
        action: 'update',
        userId,
        previousData: previousData ? { role: previousData.role } : null,
        newData: { role: newRole },
        timestamp: serverTimestamp()
    });
};
