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
import { Task, TaskStatus } from '../types/models';

const getTasksCol = (familyId: string) => collection(db, 'families', familyId, 'tasks');

export const createTask = async (familyId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addDoc(getTasksCol(familyId), {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const updateTask = async (familyId: string, taskId: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'families', familyId, 'tasks', taskId);
    return updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};

export const toggleTaskStatus = async (familyId: string, taskId: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus = currentStatus === 'todo' ? 'done' : 'todo';
    return updateTask(familyId, taskId, { status: newStatus });
};

export const deleteTask = async (familyId: string, taskId: string) => {
    return deleteDoc(doc(db, 'families', familyId, 'tasks', taskId));
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
