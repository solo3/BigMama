import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { validateInvite, joinFamilyWithInvite } from '@/services/invites';
import { getFamily } from '@/services/family';
import { Invite, Family } from '@/types/models';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Users, ArrowRight, AlertCircle } from 'lucide-react';
import './JoinPage.css';

export const JoinPage: React.FC = () => {
    const { inviteCode } = useParams<{ inviteCode: string }>();
    const navigate = useNavigate();
    const { user, signInWithGoogle, logout } = useAuth();

    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [invite, setInvite] = useState<Invite | null>(null);
    const [family, setFamily] = useState<Family | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInviteDetails = async () => {
            if (!inviteCode) {
                setError('קוד הזמנה חסר');
                setLoading(false);
                return;
            }

            try {
                console.log('Validating invite code:', inviteCode);
                const inviteData = await validateInvite(inviteCode);
                console.log('Invite data:', inviteData);
                setInvite(inviteData);

                const familyData = await getFamily(inviteData.familyId);
                console.log('Family data:', familyData);
                setFamily(familyData);
            } catch (err: any) {
                console.error('JoinPage error:', err);
                setError(err.message || 'שגיאה בטעינת ההזמנה');
            } finally {
                setLoading(false);
            }
        };

        fetchInviteDetails();
    }, [inviteCode]);

    const handleJoin = async () => {
        if (!inviteCode || !user) return; // Should be handled by UI state

        setJoining(true);
        try {
            await joinFamilyWithInvite(user.uid, user.displayName || 'Member', user.photoURL || undefined, inviteCode);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'שגיאה בהצטרפות למשפחה');
            setJoining(false);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            // Auth state change will trigger re-render, user will be available
        } catch (error) {
            console.error(error);
            setError('שגיאה בהתחברות');
        }
    };

    if (loading) {
        return (
            <div className="join-page">
                <div className="join-card">
                    <LoadingSkeleton height={80} width={80} borderRadius={40} style={{ margin: '0 auto 20px' }} />
                    <LoadingSkeleton height={32} width={200} style={{ margin: '0 auto 10px' }} />
                    <LoadingSkeleton height={20} width={150} style={{ margin: '0 auto' }} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="join-page">
                <div className="join-card">
                    <div className="join-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
                        <AlertCircle size={40} />
                    </div>
                    <h1>שגיאה</h1>
                    <p className="error-message">{error}</p>
                    <button className="btn-back" onClick={() => navigate('/')}>
                        חזרה לדף הבית
                    </button>
                </div>
            </div>
        );
    }

    if (!invite || !family) {
        return (
            <div className="join-page">
                <div className="join-card">
                    <div className="join-icon" style={{ background: '#f3f4f6', color: '#9ca3af' }}>
                        <AlertCircle size={40} />
                    </div>
                    <h1>שגיאה בטעינת הנתונים</h1>
                    <p>לא הצלחנו לטעון את פרטי ההזמנה.</p>
                    <p style={{ fontSize: '0.8em', color: '#999' }}>
                        Debug: Invite: {invite ? 'OK' : 'Missing'}, Family: {family ? 'OK' : 'Missing'}
                    </p>
                    <button className="btn-back" onClick={() => navigate('/')}>
                        חזרה לדף הבית
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="join-page">
            <div className="join-card">
                <div className="join-icon">
                    <Users size={40} />
                </div>

                <h1>הוזמנת להצטרף למשפחה!</h1>
                <p>
                    את/ה במרחק לחיצה אחת מלהצטרף למשפחת <strong>{family.name}</strong> ב-BigMama.
                </p>

                <div className="family-preview">
                    <div className="family-name">{family.name}</div>
                    <div className="inviter-info">תפקיד: {invite.role === 'admin' ? 'הורה (מנהל/ת)' : 'חבר/ה'}</div>
                </div>

                {!user ? (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>יש להתחבר כדי להצטרף</p>
                        <button className="btn-join" onClick={handleLogin}>
                            התחברות והצטרפות
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <img
                                src={user.photoURL || undefined}
                                alt={user.displayName || ''}
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                            <span>מחובר כ-<strong>{user.displayName}</strong></span>
                        </div>

                        <button
                            className="btn-join"
                            onClick={handleJoin}
                            disabled={joining}
                        >
                            {joining ? 'מצטרף...' : 'הצטרף למשפחה'}
                            <ArrowRight size={20} />
                        </button>

                        <button className="btn-back" onClick={logout}>
                            זה לא אני? התנתק
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
