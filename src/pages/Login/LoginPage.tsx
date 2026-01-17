import React from 'react';
import { signInWithGoogle, signInDev } from '@/services/auth';
import { seedDevData } from '@/utils/seedData';
import './Login.css';

export const LoginPage: React.FC = () => {
    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    };

    const handleDevLogin = async () => {
        try {
            const user = await signInDev();
            if (user) {
                await seedDevData(user.uid);
                // Navigation handled by AuthContext
            }
        } catch (error) {
            console.error(error);
            alert('Dev login failed');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-icon">🏠</div>
                    <h1>BigMama</h1>
                    <p className="login-tagline">ניהול משפחתי חכם</p>
                </div>

                <button className="google-login-button" onClick={handleLogin}>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="google-icon"
                    />
                    <span>התחברות עם גוגל</span>
                </button>

                <p className="login-footer">
                    בלחיצה על התחברות, הינך מסכים לתנאי השימוש
                </p>

                {import.meta.env.DEV && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Development Only</p>
                        <button
                            className="google-login-button"
                            onClick={handleDevLogin}
                            style={{ background: '#333', color: 'white' }}
                        >
                            🐞 Dev Login (Skip Auth)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
