# BigMama - Security Architecture

This document outlines the authentication and authorization mechanisms for the BigMama application, ensuring the privacy and integrity of family data.

---

## 1. Authentication (Identity)

We leverage **Firebase Authentication** with **Google Sign-In** as the sole identity provider.

### 1.1 Login Flow
1. User authenticates via Google's OAuth2 flow.
2. Google provides a cryptographically signed identity token.
3. Firebase Authentication verifies the Google token and issues a BigMama-specific session.

### 1.2 Token Management
| Token Type | Purpose | TTL (Time to Live) |
| :--- | :--- | :--- |
| **ID Token (JWT)** | Proves identity to Firestore for every request. | **1 Hour** |
| **Refresh Token** | Used by the SDK to fetch a new JWT automatically. | **Indefinite** (until logout/revocation) |

*Security Benefit:* If an ID token is intercepted, it is only valid for a maximum of 60 minutes.

---

## 2. Authorization (Permissions)

Authorization is enforced at the **Server Level** using **Firestore Security Rules**. Even if a client is compromised, the database will refuse unauthorized requests.

### 2.1 The "Bouncer" Logic
Every request to the database is passed through a logic gate:
- **Identity Check:** Does the requester have a valid, non-expired JWT?
- **Membership Check:** Is the requester's `UID` present in the `members` subcollection of the target `familyId`?
- **Role Check:** Does the requested action (e.g., deleting a member) require the `admin` role?

### 2.2 Role-Based Access Control (RBAC)
| Role | Description | Permissions |
| :--- | :--- | :--- |
| **Admin** | Parent / Family Creator | Full CRUD on all family data, invites, and member roles. |
| **Member** | Child / Participant | CRU on tasks, events, and requests. Cannot delete others' content or manage roles. |

---

## 3. Data Isolation

BigMama uses a hierarchical data structure to ensure "Family-Level Isolation."

### 3.1 Namespace Hardening
Data is stored under the family path: `/families/{familyId}/{subcollection}/{docId}`.
- Every query from the app must specify the `familyId`.
- Security rules verify that the logged-in user belongs to that specific `familyId`.
- **Cross-Family Leakage:** It is mathematically and logically impossible to query data from `family_B` while authenticated as a member of `family_A`.

### 3.2 Protecting Identifiers
- **UID (User ID):** Used as a "Username." Knowing a UID does not grant access; only possessing the signed JWT for that UID does.
- **Family ID:** 20-character random strings. Guessing a Family ID is impossible (20 characters, base62 entropy).
- **Invite Codes:** 12-character high-entropy alphanumeric strings to prevent join-link brute-forcing.

---

## 4. Security Rules Summary (Code Logic)

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Must be logged in
    function isSignedIn() { return request.auth != null; }
    
    // 2. Must belong to the family
    function isMember(fId) {
      return isSignedIn() && exists(/databases/$(database)/documents/families/$(fId)/members/$(request.auth.uid));
    }

    match /families/{fId} {
      // Access allowed only if isMember(fId) is true
      allow read, write: if isMember(fId);
      
      match /members/{mId} {
        // Only admins can delete/promote members
        allow delete: if isMember(fId) && getMember(fId).role == 'admin';
      }
    }
  }
}
```

---

## 5. Security FAQ

**Q: Can a hacker fetch my data if they know my Family ID?**  
A: **No.** Even if they know the ID, their JWT will not match the member list for that family. Firestore will return a "Permission Denied" error before sending any data.

**Q: What happens if I lose my phone?**  
A: Since we use Google SSO, you can revoke the session remotely via your Google Account's "Security" tab. This invalidates the refresh token immediately.

**Q: Is the data encrypted?**  
A: Yes. Data is encrypted **In-Transit** (via HTTPS/SSL) and **At-Rest** (on Google's physical servers).
