import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
    const { user, userData, familyData, logout } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const userInitial = userData?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

    return (
        <header className="header">
            <div className="header-right-stacked">
                <div className="header-info">
                    <h1 className="header-logo">BigMama</h1>
                    {familyData?.name && (
                        <span className="family-name">משפחת {familyData.name}</span>
                    )}
                </div>
                <div className="header-user" ref={menuRef}>
                    <button
                        className="user-avatar-button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-haspopup="true"
                        type="button"
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="" className="header-avatar" />
                        ) : (
                            <div className="user-avatar-placeholder">{userInitial}</div>
                        )}
                    </button>

                    {isMenuOpen && (
                        <div className="user-menu-dropdown">
                            <div className="user-menu-info">
                                <span className="user-menu-name">{userData?.displayName || 'משתמש'}</span>
                                {familyData?.name && (
                                    <span className="user-menu-family">משפחת {familyData.name}</span>
                                )}
                            </div>
                            <button className="user-menu-logout" onClick={handleLogout} type="button">
                                התנתק
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
