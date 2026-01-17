import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useEvents, useRequests } from '@/hooks/useData';
import { useFamilyMembers, usePresence } from '@/hooks/useFamily';
import { createTask, toggleTaskStatus } from '@/services/tasks';
import { createRequest } from '@/services/requests';
import { updateMemberStatus } from '@/services/members';
import { TaskStatus, PresenceStatus } from '@/types/models';
import './Dashboard.css';

export const DashboardPage: React.FC = () => {
    const { user, familyId } = useAuth();
    const { tasks, loading: tasksLoading } = useTasks();
    const { events, loading: eventsLoading } = useEvents();
    const { requests, loading: requestsLoading } = useRequests();
    const { members, loading: membersLoading } = useFamilyMembers();
    const { todayStatus, loading: presenceLoading } = usePresence();

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
        } catch (error) {
            console.error('Failed to add task:', error);
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
        } catch (error) {
            console.error('Failed to add request:', error);
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
        }
    };

    const handleTogglePresence = async () => {
        if (!user || !familyId) return;
        const dateId = new Date().toISOString().split('T')[0];
        const currentStatus = todayStatus?.members[user.uid] || 'away';
        const newStatus: PresenceStatus = currentStatus === 'home' ? 'away' : 'home';

        try {
            await updateMemberStatus(familyId, user.uid, dateId, newStatus);
        } catch (error) {
            console.error('Failed to update presence:', error);
        }
    };

    const isLoading = tasksLoading || eventsLoading || requestsLoading || membersLoading || presenceLoading;

    if (isLoading && !members.length) {
        return <div className="loading-container">טוען נתונים...</div>;
    }

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
                        {members.map(member => {
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
                                    <span>{member.displayName}</span>
                                    {isMe && <div className="me-badge">את/ה</div>}
                                </div>
                            );
                        })}
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
                            {events.slice(0, 3).map(event => (
                                <li key={event.id} className="list-item event">
                                    <div className="event-time">
                                        {event.startDate?.toDate ? event.startDate.toDate().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
                                    </div>
                                    <span>{event.title}</span>
                                </li>
                            ))}
                            {events.length === 0 && <p className="empty-state">אין אירועים בקרוב</p>}
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
                            {requests.filter(r => r.status === 'open').slice(0, 3).map(req => (
                                <li key={req.id} className="list-item request">
                                    <span className="request-type">{req.type === 'suggestion' ? '💡' : '📢'}</span>
                                    <span>{req.title}</span>
                                </li>
                            ))}
                            {requests.filter(r => r.status === 'open').length === 0 && (
                                <p className="empty-state">אין בקשות חדשות</p>
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
