import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { joinFamilyWithInvite, getInvite } from '@/services/invites';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import styles from './JoinPage.module.css';

export const JoinPage: React.FC = () => {
    const { inviteCode } = useParams<{ inviteCode: string }>();
    const { user, familyId } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [inviteValid, setInviteValid] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const validateInvite = async () => {
            if (!inviteCode) return;

            try {
                const invite = await getInvite(inviteCode);
                if (invite && !invite.usedBy) {
                    setInviteValid(true);
                    // Get family name
                    const familyDoc = await getDoc(doc(db, 'families', invite.familyId));
                    if (familyDoc.exists()) {
                        setFamilyName(familyDoc.data().name);
                    }
                } else {
                    addToast('הזמנה לא בתוקף או כבר נוצלה', 'error');
                }
            } catch (error) {
                console.error('Error validating invite:', error);
            } finally {
                setLoading(false);
            }
        };

        validateInvite();
    }, [inviteCode]);

    useEffect(() => {
        // If user is already in a family, redirect to dashboard
        if (familyId) {
            navigate('/');
        }
    }, [familyId, navigate]);

    const handleJoin = async () => {
        if (!user || !inviteCode || joining) return;

        setJoining(true);
        try {
            await joinFamilyWithInvite(
                user.uid,
                user.displayName || 'משתמש',
                user.photoURL || undefined,
                inviteCode
            );
            addToast('הצטרפת למשפחה בהצלחה!', 'success');
            // FamilyId listener in AuthContext should pick this up
        } catch (error: any) {
            console.error('Error joining family:', error);
            addToast(error.message || 'שגיאה בהצטרפות למשפחה', 'error');
            setJoining(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>בודק הזמנה...</div>;
    }

    if (!inviteValid) {
        return (
            <div className={styles.joinPage}>
                <div className={styles.card}>
                    <h1>הזמנה לא בתוקף</h1>
                    <p>פוג תוקף ההזמנה או שהיא כבר נוצלה. בקשו מהמנהל להפיק הזמנה חדשה.</p>
                    <button className={styles.button} onClick={() => navigate('/')}>חזרה לדף הבית</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.joinPage}>
            <div className={styles.card}>
                <div className={styles.welcomeEmoji}>🏠</div>
                <h1>הזמנה למשפחת {familyName}</h1>
                <p>הוזמנת להצטרף למשפחה ב-BigMama. בואו נתחיל!</p>

                <div className={styles.userInfo}>
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || ''} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarPlaceholder}>{user?.displayName?.charAt(0)}</div>
                    )}
                    <div className={styles.userName}>{user?.displayName}</div>
                </div>

                <button
                    className={styles.joinButton}
                    onClick={handleJoin}
                    disabled={joining}
                >
                    {joining ? 'מצטרף...' : 'הצטרפות למשפחה'}
                </button>

                <button className={styles.cancelButton} onClick={() => navigate('/')}>ביטול</button>
            </div>
        </div>
    );
};
