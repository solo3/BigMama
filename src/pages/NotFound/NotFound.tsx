import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Map } from 'lucide-react';
import './NotFound.css';

export const NotFound: React.FC = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <Map size={80} strokeWidth={1.5} />
                </div>
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">העמוד לא נמצא</h2>
                <p className="not-found-text">
                    נראה שהגעתם למקום שלא קיים במפה של המשפחה.
                    בואו נחזור הביתה.
                </p>
                <Link to="/" className="go-home-btn">
                    <Home size={20} />
                    חזרה לראשי
                </Link>
            </div>
        </div>
    );
};
