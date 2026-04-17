import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Event } from '../types/models';
import { getHebrewDate } from '../utils/hebrewCalendar';

const getEventsCol = (familyId: string) => collection(db, 'families', familyId, 'events');

export const createEvent = async (familyId: string, userId: string, event: Omit<Event, 'id' | 'createdAt' | 'hebrewDate'>) => {
    const hebrewDate = getHebrewDate(event.startDate.toDate());

    const docRef = await addDoc(getEventsCol(familyId), {
        ...event,
        hebrewDate,
        createdAt: serverTimestamp(),
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'events',
        docId: docRef.id,
        action: 'create',
        userId,
        newData: event,
        timestamp: serverTimestamp()
    });

    return docRef;
};

export const updateEvent = async (familyId: string, userId: string, eventId: string, updates: Partial<Event>) => {
    const eventSnap = await getDoc(doc(db, 'families', familyId, 'events', eventId));
    const previousData = eventSnap.exists() ? eventSnap.data() : null;

    const eventRef = doc(db, 'families', familyId, 'events', eventId);

    if (updates.startDate) {
        updates.hebrewDate = getHebrewDate(updates.startDate.toDate());
    }

    await updateDoc(eventRef, updates);

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'events',
        docId: eventId,
        action: 'update',
        userId,
        previousData,
        newData: updates,
        timestamp: serverTimestamp()
    });
};

export const deleteEvent = async (familyId: string, userId: string, eventId: string) => {
    const eventSnap = await getDoc(doc(db, 'families', familyId, 'events', eventId));
    const previousData = eventSnap.exists() ? eventSnap.data() : null;

    await deleteDoc(doc(db, 'families', familyId, 'events', eventId));

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'events',
        docId: eventId,
        action: 'delete',
        userId,
        previousData,
        timestamp: serverTimestamp()
    });
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
