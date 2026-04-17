import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'member';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    familyId: string | null;
    color?: string;
    updatedAt: Timestamp;
}

export interface Family {
    id: string;
    name: string;
    createdBy: string;
    createdAt: Timestamp;
}

export interface Member {
    uid: string;
    displayName: string;
    role: UserRole;
    photoURL?: string;
    joinedAt: Timestamp;
}

export type TaskStatus = 'todo' | 'done';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assignees: string[]; // Array of UIDs
    dueDate?: Timestamp;
    createdBy: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    startDate: Timestamp;
    endDate: Timestamp;
    isAllDay: boolean;
    color?: string;
    assignees: string[]; // Array of UIDs
    createdBy: string;
    createdAt: Timestamp;
    hebrewDate?: string; // Hebrew date string (e.g., "כ׳ שבט תשפ"ו")
}

export type RequestStatus = 'open' | 'approved' | 'rejected' | 'archived';
export type RequestType = 'suggestion' | 'announcement';

export interface FamilyRequest {
    id: string;
    title: string;
    description: string;
    type: RequestType;
    status: RequestStatus;
    votes: Record<string, 'up' | 'down'>; // UID -> vote
    createdBy: string;
    createdAt: Timestamp;
    expiresAt?: Timestamp;
}

export type PresenceStatus = 'home' | 'away';

export interface DailyStatus {
    id: string; // date string YYYY-MM-DD
    members: Record<string, PresenceStatus>; // UID -> status
    updatedAt: Timestamp;
}

export type AuditAction = 'create' | 'update' | 'delete';

export interface AuditEntry {
    id: string;
    familyId: string;
    collection: string;
    docId: string;
    action: AuditAction;
    userId: string;
    previousData?: unknown;
    newData?: unknown;
    timestamp: Timestamp;
}

export interface Invite {
    id: string; // The invite code
    familyId: string;
    role: UserRole;
    createdBy: string;
    createdAt: Timestamp;
    usedBy?: string;
    usedAt?: Timestamp;
}
