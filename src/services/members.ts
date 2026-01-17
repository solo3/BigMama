import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    setDoc,
    serverTimestamp
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

export const updateMemberStatus = async (familyId: string, uid: string, dateId: string, status: PresenceStatus) => {
    const statusRef = doc(db, 'families', familyId, 'status', dateId);
    return setDoc(statusRef, {
        members: {
            [uid]: status
        },
        updatedAt: serverTimestamp()
    }, { merge: true });
};
