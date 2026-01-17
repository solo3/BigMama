import {
    collection,
    doc,
    addDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { FamilyRequest } from '../types/models';

const getRequestsCol = (familyId: string) => collection(db, 'families', familyId, 'requests');

export const createRequest = async (familyId: string, request: Omit<FamilyRequest, 'id' | 'createdAt' | 'votes' | 'status'>) => {
    return addDoc(getRequestsCol(familyId), {
        ...request,
        status: 'open',
        votes: {},
        createdAt: serverTimestamp(),
    });
};

export const voteOnRequest = async (familyId: string, requestId: string, uid: string, vote: 'up' | 'down') => {
    const requestRef = doc(db, 'families', familyId, 'requests', requestId);
    return updateDoc(requestRef, {
        [`votes.${uid}`]: vote
    });
};

export const updateRequestStatus = async (familyId: string, requestId: string, status: FamilyRequest['status']) => {
    const requestRef = doc(db, 'families', familyId, 'requests', requestId);
    return updateDoc(requestRef, { status });
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
