import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useEvents, useRequests } from '@/hooks/useData';
import { useFamilyMembers, usePresence } from '@/hooks/useFamily';
import './Dashboard.css';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { tasks, loading: tasksLoading } = useTasks();
    const { events, loading: eventsLoading } = useEvents();
    const { requests, loading: requestsLoading } = useRequests();
    const { members, loading: membersLoading } = useFamilyMembers();
    const { todayStatus, loading: presenceLoading } = usePresence();

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
                            return (
                                <div key={member.uid} className={`member-status ${status}`}>
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
                        {tasksLoading ? <p>טוען...</p> : (
                            <ul className="dashboard-list">
                                {tasks.filter(t => t.status === 'todo').slice(0, 5).map(task => (
                                    <li key={task.id} className="list-item">
                                        <input type="checkbox" readOnly checked={false} />
                                        <span>{task.title}</span>
                                    </li>
                                ))}
                                {tasks.filter(t => t.status === 'todo').length === 0 && (
                                    <p className="empty-state">אין משימות להיום 🎉</p>
                                )}
                            </ul>
                        )}
                    </div>
                </section>

                {/* Events Widget */}
                <section className="widget events-widget">
                    <div className="widget-header">
                        <h3>אירועים קרובים</h3>
                    </div>
                    <div className="widget-content">
                        {eventsLoading ? <p>טוען...</p> : (
                            <ul className="dashboard-list">
                                {events.slice(0, 3).map(event => (
                                    <li key={event.id} className="list-item event">
                                        <div className="event-time">
                                            {event.startDate.toDate().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <span>{event.title}</span>
                                    </li>
                                ))}
                                {events.length === 0 && <p className="empty-state">אין אירועים בקרוב</p>}
                            </ul>
                        )}
                    </div>
                </section>

                {/* Requests Widget */}
                <section className="widget requests-widget">
                    <div className="widget-header">
                        <h3>בקשות פתוחות</h3>
                    </div>
                    <div className="widget-content">
                        {requestsLoading ? <p>טוען...</p> : (
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
                        )}
                    </div>
                </section>
            </div>

            <div className="quick-actions">
                <button className="fab">+ משימה</button>
                <button className="fab secondary">+ בקשה</button>
            </div>
        </div>
    );
};
