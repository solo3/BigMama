import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createFamily } from '@/services/family';
import './Onboarding.css';

export const OnboardingPage: React.FC = () => {
    const { user, refreshFamily } = useAuth();
    const [familyName, setFamilyName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateFamily = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !familyName.trim()) return;

        setLoading(true);
        try {
            await createFamily(user.uid, familyName, user.displayName || 'משתמש');
            await refreshFamily();
        } catch (error) {
            alert('Failed to create family. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-content">
                <h1>ברוכים הבאים ל-BigMama! 🏠</h1>
                <p>כדי להתחיל, עליך ליצור משפחה חדשה או להצטרף למשפחה קיימת.</p>

                <div className="onboarding-options">
                    <section className="onboarding-section">
                        <h2>צור משפחה חדשה</h2>
                        <form onSubmit={handleCreateFamily}>
                            <input
                                type="text"
                                placeholder="שם המשפחה (למשל: משפחת כהן)"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button type="submit" className="primary-button" disabled={loading}>
                                {loading ? 'יוצר משפחה...' : 'צור משפחה'}
                            </button>
                        </form>
                    </section>

                    <div className="divider">או</div>

                    <section className="onboarding-section">
                        <h2>הצטרף למשפחה קיימת</h2>
                        <p className="invite-hint">בקש מראש המשפחה לשלוח לך קישור הזמנה.</p>
                        <button className="secondary-button" disabled>
                            הזן קוד הזמנה (בקרוב)
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};
