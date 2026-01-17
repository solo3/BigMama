# BigMama - Product Requirements

> **Instructions:** Fill in the `Answer:` sections below. Use ✅ or ❌ for yes/no questions.  
> Feel free to add notes or alternatives where things are unclear.

---

## ⚠️ CLARIFICATIONS NEEDED

> **Please answer these before I create the final PRD summary:**

### C1. Can a task be unassigned? (ref: 2.2)
Can tasks exist without a specific assignee, so anyone in the family can "grab" it?

**Answer:** 
sure
---

### C2. Can a task have multiple assignees? (ref: 2.3)
Can a single task be assigned to more than one person? (You answered "A" for completion behavior, but didn't confirm if multiple assignees are allowed)

**Answer:** 
yes, and it means any one of the assignees can complete it
---

### C3. Can members comment on requests? (ref: 5.3)
Can family members add comments/discussion to a request beyond just voting?

**Answer:** 
in the future, not now
---

## 1. Users & Family Setup

### 1.1 How does a family get started?
**Options:**
- A) One person creates the "family" and invites others
- B) Everyone signs up independently and joins via a shared code
- C) Other: 

**Answer:** 
_the fist one creates a family and the rest join, the fist is admin and the others are members -> they can later promote other members to admin, so it means we will need a users role table
---

### 1.2 How do members join an existing family?
**Options:**
- A) Invite link (shareable URL)
- B) Invite code (e.g., "ABC123")
- C) Email invitation sent by admin
- D) Admin manually adds members
- E) Combination: ___

**Answer:** 
A or B
---

### 1.3 Are there roles/permissions?
**Options:**
- A) Everyone is equal (all can create/edit/delete anything)
- B) Admin + Member roles (Admin can manage members, delete things)
- C) More granular (e.g., Parent vs Child permissions)

**Answer:** 
B 
--- 

### 1.4 How do users log in?
**Options (check all that apply):**
- [ ] Email + Password
- [v] Google Sign-In
- [ ] Apple Sign-In
- [ ] No login (shared family device/PIN)

**Answer:** 
google sign in
---

### 1.5 What info does each member's profile have?
**Options (check all that apply):**
- [v ] Display name
- [ v] Avatar (emoji picker)
- [ v] Avatar (photo upload)
- [v ] Color (for calendar/task identification)
- [ ] Phone number
- [ ] Other: ___
<!-- 
**Answer:**  -->

---

## 2. Tasks

### 2.1 Who can create tasks?
**Options:**
- A) Anyone in the family
- B) Only admins/parents
- C) Configurable per family

**Answer:** 
for mvp everyone can create tasks, later we can add the option to restrict it to admins/parents
---

### 2.2 Can a task be unassigned?
(i.e., no specific person, anyone can "grab" it)

**Answer:** ✅ / ❌

---

### 2.3 Can a task have multiple assignees?

**Answer:** ✅ / ❌

**If yes:** When marked done...
- A) One person marks it done for everyone
- B) Each assignee marks their own completion separately
- C) Other: ___

**Answer:** 
A
---

### 2.4 What are the task statuses?
**Options:**
- A) Simple: To Do → Done
- B) Standard: To Do → In Progress → Done
- C) Custom statuses (what would they be?): ___

**Answer:** 
A
---

### 2.5 How do recurring tasks work?
**Options:**
- A) When marked done, a new task is auto-created for the next occurrence
- B) The same task resets to "To Do" on the next occurrence date
- C) Other: ___

**Answer:** 
A
---

### 2.6 Due dates
**Are due dates required or optional?**

**Answer:** Optional

**Time of day:** Should tasks have a specific time (e.g., "3:00 PM") or just a date?

**Answer:** 
time is optional, data also optional
---

### 2.7 Categories / Labels / Tags
**Do you want to categorize tasks?** (e.g., "Chores", "School", "Shopping", "Errands")

**Answer:**  ❌ maybe later

**If yes, are categories:**
- A) Predefined (you pick from a list)
- B) Custom (family can create their own)
- C) Both

**Answer:** 
maybe later
---

### 2.8 Task priority
**Should tasks have priority levels?** (e.g., Low / Medium / High / Urgent)

**Answer:** ✅ optionaly

---

### 2.9 Subtasks
**Can a task have subtasks/checklist items?** (e.g., "Grocery shopping" with items: milk, eggs, bread)

**Answer:** it not subtask, it just a list of items in the content/description

---

## 3. Calendar

### 3.1 What appears on the calendar?
**Options (check all that apply):**
- [v] Events (created as calendar entries)
- [v] Tasks with due dates
- [v] Birthdays / Anniversaries
- [v] Status changes (who's home only

**Answer:** 
also claendar should support hebrew calendar, and able to fileter by person, the default for member is to show only his events, but he can choose to show all family events
---

### 3.2 Event types
**Are there different event types?** (e.g., Appointment, Reminder, Birthday, Holiday)

**Answer:** ✅ / ❌

**If yes, what types?** 
maybe later, but it can have colurs
---

### 3.3 All-day events
**Are all-day events needed?** (e.g., "Dad's Birthday" vs "Soccer 4-5pm")

**Answer:** ✅ 

---

### 3.4 Event visibility
**Options:**
- A) All events are visible to everyone in the family
- B) Events can be marked private (visible only to the person)
- C) Events can be shared with specific members

**Answer:** 
in mvp : A with default filter by person

---

### 3.5 Calendar views
**Which views do you want?**
- [ ] Monthly (grid)
- [v] Weekly
- [ ] Daily
- [v] Agenda (list of upcoming events)

**Answer:** 
make it simple, just weekly and agenda
---

## 4. Status ("Who's Home")

### 4.1 How is status updated?
**Options:**
- A) Each person manually updates their own status
- B) Automatic (based on location/time) — *more complex*
- C) Other: ___
**Answer:** 
A - can be updates py member or parent, can be done in advance

---

### 4.2 What status options are available?
**Default suggestions:**
- 🏠 Home
- 💼 Work
- 📚 School
- 🚗 Away / Out
- ✈️ Vacation

**Your additions/changes:** 
for now: home and away only, but we can add more later
---

### 4.3 Can status have a note?
(e.g., "Home but in meetings until 3pm")

**Answer:** ❌

---

### 4.4 Scheduled/future status
**Can someone set their status for a future date/time?** (e.g., "I'll be away next Tuesday")

**Answer:** ✅ sure, thats the main idea

---

### 4.5 Status history
**Is past status history important?** (e.g., see where everyone was last week)

**Answer:** ❌ store that info, but not implement on ui currently

---

## 5. Requests / Suggestions

### 5.1 What are requests used for?
**Examples (check what applies):**
- [v] Quick suggestions ("Pizza tonight?")
- [v] Activity proposals ("Let's go to the beach Saturday")
- [x] Purchase requests ("Can we buy a new game?")
- [v] Other: __general notifications: today we going to a pizza, FYI, etc

**Answer:** see marks

---

### 5.2 Voting system
**Options:**
- A) 👍 / 👎 (Up/Down vote)
- B) Just 👍 count (like reactions)
- C) No voting, just discussion
- D) Other: ___

**Answer:** A

---

### 5.3 Comments / Discussion
**Can members comment on requests?**

**Answer:** ✅ / ❌

---

### 5.4 Who resolves/approves requests?
**Options:**
- A) Any admin/parent can approve/reject
- B) Majority vote auto-approves
- C) Anyone can mark as approved/done
- D) The person who created it closes it

**Answer:** parent can approve/reject, anyone can vote with thumbs up/down

---

### 5.5 Request expiry
**Do requests have a deadline or auto-expire?** (e.g., "Pizza tonight?" is irrelevant tomorrow)

**Answer:** ✅ 

**If yes, how?**
- A) Creator sets a deadline
- B) Auto-expire after 7 days, configurable, creator and parent can archive it, 
- C) Other: ___

---

## 6. Notifications

### 6.1 What triggers a notification?
**Check all that apply:**
- [v] Task assigned to me
- [x] Task due soon (reminder)
- [v] Task marked complete
- [v] New event added
- [v] Event reminder
- [v] New request created
- [v] Someone voted on my request
- [v] Request approved/rejected
- [v] Someone changed their status
- [ ] Other: ___

**Answer:** marks v above

---

### 6.2 Reminder timing
**How long before a due date/event should reminders be sent?**

**Options:**
- A) Fixed (e.g., always 1 hour before)
- B) Configurable per task/event
- C) User sets their default preference

**Answer:** do not implement reminder timing for now, but we will need to decide on the best way to notify users, for now it will be just push notifications, and in the future we can add more options

---

### 6.3 Notification preferences
**Can each member control their own notification settings?**

**Answer:** ✅  - nice to have for now, but not in mvp

---

## 7. Misc / UI Preferences

### 7.1 Dark mode
**Should the app support dark mode?**

**Answer:** in the future, not now

---

### 7.2 Language
**Just English, or multi-language support?**

**Answer:** hebrew and english, mainly hebrew, pay attention to the RTL, the app is in hebrew, but we want to support english too

---

### 7.3 Default home screen
**When opening the app, what should the user see first?**
**Options:**
- A) Dashboard (summary of today: tasks, events, statuses)
- B) Task list
- C) Calendar
- D) Configurable per user

**Answer:** 
A - dashboard (summary of today: tasks, events, statuses)
---

### 7.4 Any other features or ideas?
(Free-form notes)

**Answer:** 

---

## Your Priority Ranking

**Rank these features by priority (1 = must have for v1, 2 = nice to have, 3 = future)**

| Feature | Priority (1/2/3) |
|---------|------------------|
| Tasks with assignments | 1|
| Recurring tasks | 2|
| Calendar view | 1|
| Who's Home status | 1|
| Requests/Suggestions | 1|
| Push notifications | 2|
| Offline support | 2|
