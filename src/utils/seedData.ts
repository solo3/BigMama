import {
    collection,
    doc,
    setDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';

export const seedDevData = async (uid: string) => {
    if (!import.meta.env.DEV) return;

    const familyId = 'dev_family_123';
    const now = Timestamp.now();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTs = Timestamp.fromDate(tomorrow);

    console.log('🌱 Seeding data for family:', familyId);

    // 1. Create Family
    await setDoc(doc(db, 'families', familyId), {
        name: 'משפחת כהן (Dev)',
        createdBy: uid,
        createdAt: now
    });

    // 2. Create User Profile
    await setDoc(doc(db, 'users', uid), {
        uid,
        email: 'dev@test.com',
        displayName: 'אריאל כהן',
        familyId,
        updatedAt: now
    });

    // 3. Create Member
    await setDoc(doc(db, 'families', familyId, 'members', uid), {
        uid,
        displayName: 'אריאל כהן',
        role: 'admin',
        joinedAt: now
    });

    // 4. Create Tasks
    const tasksCol = collection(db, 'families', familyId, 'tasks');
    const tasks = [
        { title: 'לקנות חלב', status: 'todo' },
        { title: 'לשלם ארנונה', status: 'todo' },
        { title: 'להזמין טכנאי', status: 'done' },
        { title: 'לקבוע תור לרופא', status: 'todo' },
        { title: 'להשקות עציצים', status: 'todo' },
    ];

    for (const task of tasks) {
        await setDoc(doc(tasksCol), {
            ...task,
            assignees: [],
            createdBy: uid,
            createdAt: now,
            updatedAt: now
        });
    }

    // 5. Create Events
    const eventsCol = collection(db, 'families', familyId, 'events');
    await setDoc(doc(eventsCol), {
        title: 'ארוחת ערב אצל סבתא',
        startDate: tomorrowTs,
        endDate: Timestamp.fromDate(new Date(tomorrow.getTime() + 7200000)), // +2 hours
        isAllDay: false,
        assignees: [],
        createdBy: uid,
        createdAt: now
    });

    // 6. Create Request
    const requestsCol = collection(db, 'families', familyId, 'requests');
    await setDoc(doc(requestsCol), {
        title: 'ללכת לסרט ביום שישי?',
        description: 'יצא סרט חדש של מארוול',
        type: 'suggestion',
        status: 'open',
        votes: { [uid]: 'up' },
        createdBy: uid,
        createdAt: now
    });

    console.log('✅ Seed complete! Family ID:', familyId);
    return familyId;
};
