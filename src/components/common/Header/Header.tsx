import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-logo">BigMama</h1>
                <div className="header-user">
                    {/* User info will go here */}
                    <div className="user-avatar-placeholder" />
                </div>
            </div>
        </header>
    );
};
