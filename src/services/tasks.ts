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
import { Task, TaskStatus } from '../types/models';

const getTasksCol = (familyId: string) => collection(db, 'families', familyId, 'tasks');

export const createTask = async (familyId: string, userId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(getTasksCol(familyId), {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'tasks',
        docId: docRef.id,
        action: 'create',
        userId,
        newData: task,
        timestamp: serverTimestamp()
    });

    return docRef;
};

export const updateTask = async (familyId: string, userId: string, taskId: string, updates: Partial<Task>) => {
    // Get previous data for audit
    const taskSnap = await getDoc(doc(db, 'families', familyId, 'tasks', taskId));
    const previousData = taskSnap.exists() ? taskSnap.data() : null;

    const taskRef = doc(db, 'families', familyId, 'tasks', taskId);
    await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'tasks',
        docId: taskId,
        action: 'update',
        userId,
        previousData,
        newData: updates,
        timestamp: serverTimestamp()
    });
};

export const toggleTaskStatus = async (familyId: string, userId: string, taskId: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus = currentStatus === 'todo' ? 'done' : 'todo';
    return updateTask(familyId, userId, taskId, { status: newStatus });
};

export const deleteTask = async (familyId: string, userId: string, taskId: string) => {
    // Get previous data for audit
    const taskSnap = await getDoc(doc(db, 'families', familyId, 'tasks', taskId));
    const previousData = taskSnap.exists() ? taskSnap.data() : null;

    await deleteDoc(doc(db, 'families', familyId, 'tasks', taskId));

    // Audit
    await addDoc(collection(db, 'audit'), {
        familyId,
        collection: 'tasks',
        docId: taskId,
        action: 'delete',
        userId,
        previousData,
        timestamp: serverTimestamp()
    });
};

export const subscribeToTasks = (familyId: string, callback: (tasks: Task[]) => void) => {
    const q = query(getTasksCol(familyId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Task[];
        callback(tasks);
    });
};
