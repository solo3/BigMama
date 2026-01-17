import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Event } from '../types/models';

const getEventsCol = (familyId: string) => collection(db, 'families', familyId, 'events');

export const createEvent = async (familyId: string, event: Omit<Event, 'id' | 'createdAt'>) => {
    return addDoc(getEventsCol(familyId), {
        ...event,
        createdAt: serverTimestamp(),
    });
};

export const updateEvent = async (familyId: string, eventId: string, updates: Partial<Event>) => {
    const eventRef = doc(db, 'families', familyId, 'events', eventId);
    return updateDoc(eventRef, updates);
};

export const deleteEvent = async (familyId: string, eventId: string) => {
    return deleteDoc(doc(db, 'families', familyId, 'events', eventId));
};

export const subscribeToEvents = (familyId: string, callback: (events: Event[]) => void) => {
    const q = query(getEventsCol(familyId), orderBy('startDate', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Event[];
        callback(events);
    });
};
