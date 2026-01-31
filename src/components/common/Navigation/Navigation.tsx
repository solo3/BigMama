import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Users, MessageSquare, Settings } from 'lucide-react';
import './Navigation.css';

export const Navigation: React.FC = () => {
    return (
        <nav className="navigation">
            <div className="nav-items">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>ראשי</span>
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CheckSquare size={24} />
                    <span>משימות</span>
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={24} />
                    <span>יומן</span>
                </NavLink>
                <NavLink to="/status" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={24} />
                    <span>נוכחות</span>
                </NavLink>
                <NavLink to="/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={24} />
                    <span>בקשות</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={24} />
                    <span>הגדרות</span>
                </NavLink>
            </div>
        </nav>
    );
};
