import React from 'react';
import { Home, CheckSquare, Calendar, MessageSquare, Settings } from 'lucide-react';
import './Navigation.css';

export const Navigation: React.FC = () => {
    return (
        <nav className="navigation">
            <div className="nav-items">
                <a href="/" className="nav-item active">
                    <Home size={24} />
                    <span>ראשי</span>
                </a>
                <a href="/tasks" className="nav-item">
                    <CheckSquare size={24} />
                    <span>משימות</span>
                </a>
                <a href="/calendar" className="nav-item">
                    <Calendar size={24} />
                    <span>יומן</span>
                </a>
                <a href="/requests" className="nav-item">
                    <MessageSquare size={24} />
                    <span>בקשות</span>
                </a>
                <a href="/settings" className="nav-item">
                    <Settings size={24} />
                    <span>הגדרות</span>
                </a>
            </div>
        </nav>
    );
};
