import {
    collection,
    doc,
    addDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { FamilyRequest } from '../types/models';

const getRequestsCol = (familyId: string) => collection(db, 'families', familyId, 'requests');

export const createRequest = async (familyId: string, userId: string, request: Omit<FamilyRequest, 'id' | 'createdAt' | 'votes' | 'status'>) => {
    const docRef = await addDoc(getRequestsCol(familyId), {
        ...request,
        status: 'open',
        votes: {},
        createdAt: serverTimestamp(),
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'requests',
        docId: docRef.id,
        action: 'create',
        userId,
        newData: request,
        timestamp: serverTimestamp()
    });

    return docRef;
};

export const voteOnRequest = async (familyId: string, userId: string, requestId: string, vote: 'up' | 'down') => {
    const requestSnap = await getDoc(doc(db, 'families', familyId, 'requests', requestId));
    const previousData = requestSnap.exists() ? requestSnap.data() : null;

    const requestRef = doc(db, 'families', familyId, 'requests', requestId);
    await updateDoc(requestRef, {
        [`votes.${userId}`]: vote
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'requests',
        docId: requestId,
        action: 'update',
        userId,
        previousData: previousData ? { votes: previousData.votes } : null,
        newData: { [`votes.${userId}`]: vote },
        timestamp: serverTimestamp()
    });
};

export const updateRequestStatus = async (familyId: string, userId: string, requestId: string, status: FamilyRequest['status']) => {
    const requestSnap = await getDoc(doc(db, 'families', familyId, 'requests', requestId));
    const previousData = requestSnap.exists() ? requestSnap.data() : null;

    const requestRef = doc(db, 'families', familyId, 'requests', requestId);
    await updateDoc(requestRef, { status });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'requests',
        docId: requestId,
        action: 'update',
        userId,
        previousData: previousData ? { status: previousData.status } : null,
        newData: { status },
        timestamp: serverTimestamp()
    });
};

export const subscribeToRequests = (familyId: string, callback: (requests: FamilyRequest[]) => void) => {
    const q = query(getRequestsCol(familyId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FamilyRequest[];
        callback(requests);
    });
};
