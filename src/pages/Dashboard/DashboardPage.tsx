import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';
import { useEvents, useRequests } from '@/hooks/useData';
import { useFamilyMembers, usePresence } from '@/hooks/useFamily';
import { createTask, toggleTaskStatus } from '@/services/tasks';
import { createRequest } from '@/services/requests';
import { updateMemberStatus } from '@/services/members';
import { TaskStatus, PresenceStatus } from '@/types/models';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import './Dashboard.css';

export const DashboardPage: React.FC = () => {
    const { user, familyId } = useAuth();
    const { addToast } = useToast();
    const { tasks, loading: tasksLoading } = useTasks();
    const { events, loading: eventsLoading } = useEvents();
    const { requests, loading: requestsLoading } = useRequests();
    const { members, loading: membersLoading } = useFamilyMembers();
    const { todayStatus } = usePresence();

    // Task State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);

    // Request State
    const [newRequestTitle, setNewRequestTitle] = useState('');
    const [isAddingRequest, setIsAddingRequest] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user || !familyId) return;

        setIsAddingTask(true);
        try {
            await createTask(familyId, {
                title: newTaskTitle,
                status: 'todo',
                assignees: [],
                createdBy: user.uid,
            });
            setNewTaskTitle('');
            addToast('משימה נוצרה בהצלחה!', 'success');
        } catch (error) {
            console.error('Failed to add task:', error);
            addToast('שגיאה ביצירת המשימה', 'error');
        } finally {
            setIsAddingTask(false);
        }
    };

    const handleAddRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRequestTitle.trim() || !user || !familyId) return;

        setIsAddingRequest(true);
        try {
            await createRequest(familyId, {
                title: newRequestTitle,
                type: 'suggestion',
                description: '',
                createdBy: user.uid,
            });
            setNewRequestTitle('');
            setShowRequestForm(false);
            addToast('בקשה נוצרה בהצלחה!', 'success');
        } catch (error) {
            console.error('Failed to add request:', error);
            addToast('שגיאה ביצירת הבקשה', 'error');
        } finally {
            setIsAddingRequest(false);
        }
    };

    const handleToggleTask = async (taskId: string, currentStatus: TaskStatus) => {
        if (!familyId) return;
        try {
            await toggleTaskStatus(familyId, taskId, currentStatus);
        } catch (error) {
            console.error('Failed to toggle task:', error);
            addToast('שגיאה עדכון סטטוס המשימה', 'error');
        }
    };

    const handleTogglePresence = async () => {
        if (!user || !familyId) return;
        const dateId = new Date().toISOString().split('T')[0];
        const currentStatus = todayStatus?.members[user.uid] || 'away';
        const newStatus: PresenceStatus = currentStatus === 'home' ? 'away' : 'home';

        try {
            await updateMemberStatus(familyId, user.uid, dateId, newStatus);
            addToast(`סטטוס עודכן ל-${newStatus === 'home' ? 'בבית' : 'מחוץ לבית'}`, 'success');
        } catch (error) {
            console.error('Failed to update presence:', error);
            addToast('שגיאה בעדכון הנוכחות', 'error');
        }
    };

    // Removed blocking loading state to show skeletons individually


    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>שלום, {user?.displayName?.split(' ')[0]}! 👋</h1>
                <p className="text-secondary">הנה מה שקורה היום במשפחה.</p>
            </header>

            <div className="dashboard-grid">
                {/* Presence Widget */}
                <section className="widget presence-widget">
                    <div className="widget-header">
                        <h3>מי בבית?</h3>
                    </div>
                    <div className="members-grid">
                        {membersLoading && !members.length ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="member-status">
                                    <LoadingSkeleton variant="circular" width={60} height={60} />
                                    <LoadingSkeleton width={50} height={14} style={{ marginTop: 8 }} />
                                </div>
                            ))
                        ) : (
                            members.map(member => {
                                const status = todayStatus?.members[member.uid] || 'away';
                                const isMe = member.uid === user?.uid;
                                return (
                                    <div
                                        key={member.uid}
                                        className={`member-status ${status} ${isMe ? 'is-me' : ''}`}
                                        onClick={isMe ? handleTogglePresence : undefined}
                                    >
                                        <div className="member-avatar">
                                            {member.photoURL ? (
                                                <img src={member.photoURL} alt={member.displayName} />
                                            ) : (
                                                <div className="avatar-placeholder">{member.displayName[0]}</div>
                                            )}
                                            <div className="status-indicator">
                                                {status === 'home' ? '🏠' : '🚗'}
                                            </div>
                                        </div>
                                        <div className="member-info">
                                            <span className="member-name">{member.displayName}</span>
                                            <span className="member-status-text">
                                                {status === 'home' ? 'בבית' : 'מחוץ לבית'}
                                            </span>
                                        </div>
                                        {isMe && <div className="me-badge">את/ה</div>}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Tasks Widget */}
                <section className="widget tasks-widget">
                    <div className="widget-header">
                        <h3>משימות להיום</h3>
                        <span className="badge">{tasks.filter(t => t.status === 'todo').length}</span>
                    </div>
                    <div className="widget-content">
                        <form onSubmit={handleAddTask} className="quick-add-form">
                            <input
                                type="text"
                                placeholder="משימה חדשה..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                disabled={isAddingTask}
                            />
                            <button type="submit" disabled={isAddingTask || !newTaskTitle.trim()}>
                                {isAddingTask ? '...' : '+'}
                            </button>
                        </form>

                        <ul className="dashboard-list">
                            {tasksLoading && !tasks.length ? (
                                Array(3).fill(0).map((_, i) => (
                                    <li key={i} className="list-item">
                                        <LoadingSkeleton width={20} height={20} borderRadius="50%" />
                                        <LoadingSkeleton width="70%" height={16} />
                                    </li>
                                ))
                            ) : (
                                <>
                                    {tasks.filter(t => t.status === 'todo').slice(0, 5).map(task => (
                                        <li key={task.id} className="list-item">
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'done'}
                                                onChange={() => handleToggleTask(task.id, task.status)}
                                            />
                                            <span>{task.title}</span>
                                        </li>
                                    ))}
                                    {tasks.filter(t => t.status === 'todo').length === 0 && (
                                        <p className="empty-state">אין משימות להיום 🎉</p>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </section>

                {/* Events Widget */}
                <section className="widget events-widget">
                    <div className="widget-header">
                        <h3>אירועים קרובים</h3>
                    </div>
                    <div className="widget-content">
                        <ul className="dashboard-list">
                            {eventsLoading && !events.length ? (
                                Array(3).fill(0).map((_, i) => (
                                    <li key={i} className="list-item event">
                                        <LoadingSkeleton width={30} height={14} />
                                        <LoadingSkeleton width="60%" height={16} />
                                    </li>
                                ))
                            ) : (
                                <>
                                    {events.slice(0, 3).map(event => (
                                        <li key={event.id} className="list-item event">
                                            <div className="event-time">
                                                {event.startDate?.toDate ? event.startDate.toDate().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
                                            </div>
                                            <span>{event.title}</span>
                                        </li>
                                    ))}
                                    {events.length === 0 && <p className="empty-state">אין אירועים בקרוב</p>}
                                </>
                            )}
                        </ul>
                    </div>
                </section>

                {/* Requests Widget */}
                <section className="widget requests-widget">
                    <div className="widget-header">
                        <h3>בקשות פתוחות</h3>
                        <button className="text-button" onClick={() => setShowRequestForm(!showRequestForm)}>
                            {showRequestForm ? 'ביטול' : '+ חדש'}
                        </button>
                    </div>
                    <div className="widget-content">
                        {showRequestForm && (
                            <form onSubmit={handleAddRequest} className="quick-add-form request-form">
                                <input
                                    type="text"
                                    placeholder="על מה נצביע?"
                                    value={newRequestTitle}
                                    onChange={(e) => setNewRequestTitle(e.target.value)}
                                    disabled={isAddingRequest}
                                />
                                <button type="submit" disabled={isAddingRequest || !newRequestTitle.trim()}>
                                    {isAddingRequest ? '...' : 'שאלו'}
                                </button>
                            </form>
                        )}

                        <ul className="dashboard-list">
                            {requestsLoading && !requests.length ? (
                                Array(3).fill(0).map((_, i) => (
                                    <li key={i} className="list-item request">
                                        <LoadingSkeleton width={20} height={20} borderRadius="50%" />
                                        <LoadingSkeleton width="70%" height={16} />
                                    </li>
                                ))
                            ) : (
                                <>
                                    {requests.filter(r => r.status === 'open').slice(0, 3).map(req => (
                                        <li key={req.id} className="list-item request">
                                            <span className="request-type">{req.type === 'suggestion' ? '💡' : '📢'}</span>
                                            <span>{req.title}</span>
                                        </li>
                                    ))}
                                    {requests.filter(r => r.status === 'open').length === 0 && (
                                        <p className="empty-state">אין בקשות חדשות</p>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </section>
            </div>

            <div className="quick-actions">
                <button className="fab" onClick={() => (document.querySelector('.tasks-widget input') as HTMLInputElement)?.focus()}>+ משימה</button>
                <button className="fab secondary" onClick={() => setShowRequestForm(true)}>+ בקשה</button>
            </div>
        </div>
    );
};
