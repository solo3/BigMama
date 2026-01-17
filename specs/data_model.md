# BigMama - Data Model

> **Version:** 2.1  
> **Last Updated:** 2026-01-16  
> **Aligned with:** PRD Summary v1.0

---

## Firestore Structure Overview

```
firestore/
├── users/                          # NEW: Top-level user lookup
│   └── {uid}/
│       └── familyId: "abc123"      # Which family user belongs to
│
├── invites/                        # NEW: Invite codes
│   └── {inviteCode}/
│       ├── familyId: "abc123"
│       ├── role: "admin" | "member"
│       ├── createdBy: "uid"
│       └── createdAt: timestamp
│
├── families/
│   └── {familyId}/
│       ├── name: "משפחת ישראלי"
│       ├── createdAt: timestamp
│       │
│       ├── members/ (subcollection)
│       │   └── {memberId}/ → Member document
│       │
│       ├── tasks/ (subcollection)
│       │   └── {taskId}/ → Task document
│       │
│       ├── events/ (subcollection)
│       │   └── {eventId}/ → Event document
│       │
│       ├── requests/ (subcollection)
│       │   └── {requestId}/ → Request document
│       │
│       └── statuses/ (subcollection)
│           └── {date}/ → Daily status document (e.g., "2026-01-16")
```

---

## Document Schemas

### User (Top-Level Lookup)

```javascript
{
  // Document ID = Firebase Auth UID
  familyId: "abc123",               // Which family this user belongs to
  createdAt: Timestamp
}
```

**Purpose:** Fast lookup on login to find user's family without scanning all families.

---

### Invite

```javascript
{
  // Document ID = invite code (high entropy, e.g., 12-char alphanumeric)
  // NOT sequential or short (risk of brute-force)
  familyId: "abc123",
  role: "admin" | "member",         // Role assigned to invitee
  createdBy: "member-uid",          // Admin who created this invite
  createdAt: Timestamp,
  usedBy: "new-member-uid" | null,  // Set when invite is used
  usedAt: Timestamp | null
}
```

**Notes:**
- Admin generates two types of invite links:
  - `bigmama.app/join/ABC123` → joins as **member**
  - `bigmama.app/join/XYZ789` → joins as **admin** (parent)
- Each invite code can only be used once (set `usedBy` on use)
- Admin can generate multiple codes

---

### Family

```javascript
{
  // Auto-generated document ID
  name: "משפחת ישראלי",           // Family display name
  createdAt: Timestamp,
  createdBy: "member-uid"          // Firebase Auth UID of creator
}
```

---

### Member

```javascript
{
  // Document ID = Firebase Auth UID
  uid: "firebase-auth-uid",
  
  // Profile
  name: "אבא",                      // Display name
  email: "dad@gmail.com",           // From Google Sign-In
  avatar: "👨",                     // Emoji OR photo URL
  avatarType: "emoji" | "photo",
  color: "#4A90D9",                 // For calendar/task identification
  
  // Role
  role: "admin" | "member",
  
  // Push notifications (v2)
  fcmTokens: ["token1", "token2"],  // Array for multiple devices
  
  // Metadata
  joinedAt: Timestamp,
  lastActiveAt: Timestamp
}
```

**Notes:**
- First member to create the family is automatically `admin`
- Admins can promote other members to `admin`
- A family must have at least one `admin`

---

### Task

```javascript
{
  // Auto-generated document ID
  title: "להוציא את הזבל",          // Task title
  description: "לא לשכוח מיחזור",   // Optional description (can include checklist as text)
  
  // Assignment
  assigneeIds: ["member-uid-1", "member-uid-2"],  // Empty array = unassigned
  createdBy: "member-uid",
  
  // Status
  status: "todo" | "done",
  completedAt: Timestamp | null,
  completedBy: "member-uid" | null,
  
  // Due date (all optional)
  dueDate: "2026-01-20" | null,     // YYYY-MM-DD format
  dueTime: "18:00" | null,          // HH:mm format (only if dueDate is set)
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Notes:**
- If `assigneeIds` is empty, task is "unassigned" (anyone can grab)
- Any assignee can mark the task as done for everyone
- Priority removed for MVP simplicity (add in v2)

---

### Event

```javascript
{
  // Auto-generated document ID
  title: "אימון כדורגל",            // Event title
  description: "להביא בקבוק מים",   // Optional
  
  // Timing
  date: "2026-01-20",               // YYYY-MM-DD (Gregorian)
  hebrewDate: "כ׳ שבט תשפ״ו" | null, // Auto-computed, null if computation fails
  startTime: "16:00" | null,        // HH:mm, null if all-day
  endTime: "17:30" | null,          // HH:mm, null if all-day
  isAllDay: true | false,
  
  // People
  memberIds: ["member-uid-1"],      // Who this event is for
  createdBy: "member-uid",
  
  // Display
  color: "#FF6B6B" | null,          // Custom color (optional)
  
  // Type markers (computed client-side, not stored)
  // isBirthday, isHoliday, isShabbat → compute from date using hebcal
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Notes:**
- `hebrewDate` is auto-computed from `date` when creating/updating event
- If computation fails, continue with `null` (not mandatory)
- Shabbat and holidays are computed client-side from `date` using `@hebcal/core`

---

### Request

```javascript
{
  // Auto-generated document ID
  title: "פיצה לארוחת ערב?",         // Request title
  description: "יש לי חשק לפפרוני 🍕", // Optional details
  
  // Type
  type: "suggestion" | "announcement",  // announcement = FYI, no voting needed
  
  // Author
  createdBy: "member-uid",
  
  // Voting (only for suggestions)
  votes: {
    "member-uid-1": "up",           // 👍
    "member-uid-2": "down",         // 👎
    "member-uid-3": "up"
  },
  
  // Resolution
  status: "open" | "approved" | "rejected" | "archived",
  resolvedBy: "member-uid" | null,
  resolvedAt: Timestamp | null,
  
  // Timing
  relevantDate: "2026-01-16" | null,  // For time-sensitive requests
  relevantTime: "19:00" | null,
  
  // Expiry
  expiresAt: Timestamp,               // Default: createdAt + 7 days
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Notes:**
- `type: "announcement"` is for FYI posts (no voting, no approval needed)
- Only admins can approve/reject suggestions
- Creator or admin can archive
- Expiry handled via client-side query filter: `where('expiresAt', '>', now())`
- Cleanup function for old requests deferred to v2

---

### Daily Status ("Who's Home")

```javascript
{
  // Document ID = date string: "2026-01-16"
  date: "2026-01-16",
  
  statuses: {
    "member-uid-1": {
      status: "home" | "away",
      updatedBy: "member-uid-1",    // Self or parent who updated
      updatedAt: Timestamp
    },
    "member-uid-2": {
      status: "away",
      updatedBy: "member-uid-3",    // Parent set this
      updatedAt: Timestamp
    }
  }
}
```

**Notes:**
- Document is created/updated when any status changes for that date
- Future dates can have status documents (for planning ahead)
- History is stored but UI only shows today/future (MVP)

---

## Invite & Join Flow

### Admin Generates Invite Link

```
1. Admin opens Settings → "Invite Family Member"
2. Admin chooses role: "Add Parent" or "Add Member"
3. App generates unique, high-entropy invite code (e.g., "x8Zk9P2mN4qL")
   - *Security Note:* Do not use short/guessable codes to prevent unauthorized access.
4. App creates document in invites/{inviteCode}
5. App shows shareable link: bigmama.app/join/ABC123
6. Admin shares link via WhatsApp, SMS, etc.
```

### New User Joins via Invite

```
1. New user opens link: bigmama.app/join/ABC123
2. App reads invites/ABC123 → gets familyId and role
3. User signs in with Google
4. App checks: users/{uid} exists?
   - Yes → Error: "You already belong to a family"
   - No → Continue
5. App creates:
   - users/{uid} → { familyId: "abc123" }
   - families/abc123/members/{uid} → { role: "member", name: ... }
6. App updates invites/ABC123 → { usedBy: uid, usedAt: now }
7. Redirect to family dashboard
```

---

## Status Options (MVP)

| Status | Hebrew | Emoji |
|--------|--------|-------|
| `home` | בבית | 🏠 |
| `away` | בחוץ | 🚗 |

*(Future: work, school, vacation)*

---

## Hebrew Calendar Integration

For Hebrew dates, holidays, and Shabbat detection, use:
- **Library:** `@hebcal/core`
- **Computed client-side** for display (Shabbat, holidays)
- **Stored in Event:** `hebrewDate` string (auto-computed on save)

```javascript
import { HebrewCalendar, HDate } from '@hebcal/core';

// Convert Gregorian to Hebrew date (for storage)
function getHebrewDate(dateString) {
  try {
    const hdate = new HDate(new Date(dateString));
    return hdate.toString('h'); // "כ׳ שבט תשפ״ו"
  } catch (e) {
    console.warn('Failed to compute Hebrew date:', e);
    return null; // Not mandatory
  }
}

// Check if Shabbat (for display)
function isShabbat(dateString) {
  const date = new Date(dateString);
  return date.getDay() === 6; // Saturday
}

// Get holidays for a date (for display)
function getHolidays(dateString) {
  const hdate = new HDate(new Date(dateString));
  return HebrewCalendar.getHolidaysOnDate(hdate);
}
```

---

## Indexes Required

| Collection | Fields | Query Purpose |
|------------|--------|---------------|
| `tasks` | `status`, `dueDate` | Pending tasks sorted by due date |
| `tasks` | `assigneeIds`, `status` | Tasks for a specific person |
| `events` | `date` | Events on a specific date |
| `events` | `date`, `memberIds` | Events for a person on a date |
| `requests` | `status`, `expiresAt` | Open non-expired requests |
| `requests` | `status`, `createdAt` | Open requests sorted by newest |

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is a member of this family
    function isFamilyMember(familyId) {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid));
    }
    
    // Check if user is a family admin
    function isFamilyAdmin(familyId) {
      return isFamilyMember(familyId) &&
             get(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection (top-level lookup)
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow create: if request.auth.uid == uid;
      allow update, delete: if false; // Managed by app logic only
    }
    
    // Invites collection
    match /invites/{inviteCode} {
      // Anyone authenticated can read (to validate invite) - GET only, NO LIST
      allow get: if isAuthenticated();
      allow list: if false; // Prevent scanning for valid invites
      // Only family admin can create invites
      allow create: if isAuthenticated() && 
                       isFamilyAdmin(request.resource.data.familyId);
      // Can update usedBy field when joining
      allow update: if isAuthenticated() && 
                       resource.data.usedBy == null;
    }
    
    // Family document
    match /families/{familyId} {
      allow read: if isFamilyMember(familyId);
      allow update: if isFamilyAdmin(familyId);
      allow create: if isAuthenticated();
      
      // Members subcollection
      match /members/{memberId} {
        allow read: if isFamilyMember(familyId);
        allow update: if request.auth.uid == memberId || isFamilyAdmin(familyId);
        allow create: if isAuthenticated();
        allow delete: if isFamilyAdmin(familyId);
      }
      
      // Tasks, Events, Requests, Statuses
      match /{subcollection}/{docId} {
        allow read, write: if isFamilyMember(familyId);
      }
    }
  }
}
```

---

## Example Queries

```javascript
// On login: find user's family
const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
const familyId = userDoc.data()?.familyId;

// Get all pending tasks for my family, sorted by due date
const tasksQuery = query(
  collection(db, 'families', familyId, 'tasks'),
  where('status', '==', 'todo'),
  orderBy('dueDate', 'asc')
);

// Get tasks assigned to me
const myTasksQuery = query(
  collection(db, 'families', familyId, 'tasks'),
  where('assigneeIds', 'array-contains', myUid),
  where('status', '==', 'todo')
);

// Get today's events
const today = formatDate(new Date()); // "2026-01-16"
const eventsQuery = query(
  collection(db, 'families', familyId, 'events'),
  where('date', '==', today)
);

// Get open, non-expired requests
const requestsQuery = query(
  collection(db, 'families', familyId, 'requests'),
  where('status', '==', 'open'),
  where('expiresAt', '>', Timestamp.now()),
  orderBy('expiresAt', 'asc'),
  orderBy('createdAt', 'desc')
);

// Get today's status (who's home)
const statusDoc = await getDoc(
  doc(db, 'families', familyId, 'statuses', today)
);
```

---

## Default Data on Family Creation

When a new family is created, auto-populate:

```javascript
// 1. Create welcome request
await addDoc(collection(db, 'families', familyId, 'requests'), {
  title: "👋 ברוכים הבאים ל-BigMama!",
  description: "נסו ליצור את המשימה הראשונה שלכם",
  type: "announcement",
  createdBy: creatorUid,
  status: "open",
  votes: {},
  expiresAt: Timestamp.fromDate(addDays(new Date(), 7)),
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
});

// 2. Create today's status with creator = home
const today = formatDate(new Date());
await setDoc(doc(db, 'families', familyId, 'statuses', today), {
  date: today,
  statuses: {
    [creatorUid]: {
      status: "home",
      updatedBy: creatorUid,
      updatedAt: Timestamp.now()
    }
  }
});
```
