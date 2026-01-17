import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createFamily } from '@/services/family';
import { useToast } from '@/hooks/useToast';
import './Onboarding.css';

export const OnboardingPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [familyName, setFamilyName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateFamily = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Attempting to create family...', familyName);
        if (!user || !familyName.trim() || loading) return;

        setLoading(true);
        try {
            const familyId = await createFamily(user.uid, familyName, user.displayName || 'משתמש');
            console.log('Family created successfully with ID:', familyId);
            addToast('המשפחה נוצרה בהצלחה!', 'success');

            // Safety: If navigation doesn't happen in 5 seconds, let user try again
            setTimeout(() => setLoading(false), 5000);
        } catch (error: any) {
            console.error('Failed to create family:', error);
            addToast('שגיאה ביצירת המשפחה. נסו שוב.', 'error');
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
