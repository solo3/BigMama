# ADR 001: Security Architecture (Auth & Authz)

- **Status:** Approved
- **Date:** 2026-01-16
- **Decisions Made by:** Antigravity (AI) & Ariel (User)

## Context
BigMama is a family-oriented application storing private data (tasks, calendar, status). We need a robust mechanism to ensure users can only access their own family's data without building a custom backend server.

## Decision
We chose **Firebase Authentication** combined with **Firestore Security Rules** for a "Backend-as-a-Service" (BaaS) approach.

### Key Implementation Details:
1.  **Identity Provider:** Use Google SSO. This offloads password management and MFA to a trusted provider.
2.  **Session Management:** Use Firebase ID Tokens (JWT) with a 1-hour TTL. The SDK handles silent refresh via Refresh Tokens.
3.  **Data Isolation:** 
    - Use a hierarchical path: `/families/{familyId}/{collection}/{docId}`.
    - User/Family link is stored in a top-level `/users/{uid}` document.
4.  **Security Rules:** Enforcement is done on Google's servers. Rules check the requester's JWT against the family's member list before granting access.

## Rationale
- **Zero-Trust Backend:** We don't need to maintain a server; Google's bouncer (Security Rules) is more secure and reliable than a custom-built API.
- **Privacy by Design:** Even if a Family ID is discovered, data remains locked unless the user is explicitly added as a member.
- **Auditability:** Security rules are versioned and can be tested locally using the Firebase Emulator.

## Consequences
- **Positive:** Low maintenance, high security, built-in scalability.
- **Negative:** Hard dependency on Firebase; logic must be written in Common Expression Language (CEL) for security rules.
