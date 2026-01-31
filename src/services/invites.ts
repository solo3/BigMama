import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    writeBatch,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Invite, UserRole } from '../types/models';

export const createInvite = async (familyId: string, createdBy: string, role: UserRole = 'member') => {
    try {
        // Generate a random 6-character code
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const inviteData: Omit<Invite, 'id'> = {
            familyId,
            role,
            createdBy,
            createdAt: serverTimestamp() as Timestamp,
        };

        await setDoc(doc(db, 'invites', inviteCode), inviteData);
        return inviteCode;
    } catch (error) {
        console.error('Error creating invite:', error);
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

        await batch.commit();
        return invite.familyId;
    } catch (error) {
        console.error('Error joining family:', error);
        throw error;
    }
};
