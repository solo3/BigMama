import { collection, doc, addDoc, serverTimestamp, WriteBatch, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AuditEntry, AuditAction } from '../types/models';

export const logAudit = async (
    familyId: string,
    collectionName: string,
    docId: string,
    action: AuditAction,
    userId: string,
    options?: {
        previousData?: unknown;
        newData?: unknown;
        batch?: WriteBatch;
    }
): Promise<string | void> => {
    const auditData: Omit<AuditEntry, 'id'> = {
        familyId,
        collection: collectionName,
        docId,
        action,
        userId,
        previousData: options?.previousData,
        newData: options?.newData,
        timestamp: serverTimestamp() as Timestamp,
    };

    const auditRef = collection(db, 'audit');

    if (options?.batch) {
        const newDocRef = doc(auditRef);
        options.batch.set(newDocRef, auditData);
        return newDocRef.id;
    }

    const docRef = await addDoc(auditRef, auditData);
    return docRef.id;
};