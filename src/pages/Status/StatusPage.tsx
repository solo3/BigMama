import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFamilyMembers, usePresence } from '@/hooks/useFamily';
import { updateMemberStatus } from '@/services/members';
import { PresenceStatus } from '@/types/models';
import { useToast } from '@/hooks/useToast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Home, Car, UserPlus, Copy, X } from 'lucide-react';
import { createInvite } from '@/services/invites';
import './Status.css';

export const StatusPage: React.FC = () => {
    const { user, familyId } = useAuth();
    const { members, loading: membersLoading } = useFamilyMembers();
    const { todayStatus, loading: statusLoading } = usePresence();
    const { addToast } = useToast();
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [generatingInvite, setGeneratingInvite] = useState(false);

    const handleInvite = async () => {
        if (!familyId || !user) return;
        setGeneratingInvite(true);
        try {
            const code = await createInvite(familyId, user.uid, 'member');
            setInviteCode(code);
            addToast('קוד הזמנה נוצר בהצלחה', 'success');
        } catch (error) {
            console.error('Failed to create invite:', error);
            addToast('שגיאה ביצירת הזמנה', 'error');
        } finally {
            setGeneratingInvite(false);
        }
    };

    const copyInvite = () => {
        if (!inviteCode) return;
        const link = `${window.location.origin}/join/${inviteCode}`;
        navigator.clipboard.writeText(link);
        addToast('הקישור הועתק לספר הכתובות', 'success');
    };

    const handleToggleStatus = async (memberId: string, currentStatus: PresenceStatus) => {
        if (!familyId || !user) return;

        // Members can only toggle their own status, unless admin (simplified for now: only own)
        if (memberId !== user.uid) return;

        const newStatus: PresenceStatus = currentStatus === 'home' ? 'away' : 'home';
        const dateId = new Date().toISOString().split('T')[0];

        try {
            await updateMemberStatus(familyId, user.uid, memberId, dateId, newStatus);
            addToast(`סטטוס עודכן ל-${newStatus === 'home' ? 'בבית' : 'מחוץ לבית'}`, 'success');
        } catch (error) {
            console.error('Failed to update status:', error);
            addToast('שגיאה בעדכון הסטטוס', 'error');
        }
    };

    if (membersLoading || statusLoading) {
        return (
            <div className="status-page">
                <header className="status-header">
                    <LoadingSkeleton width={200} height={40} />
                </header>
                <div className="status-grid">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="status-card-skeleton">
                            <LoadingSkeleton height={120} borderRadius={16} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="status-page">
            <header className="status-header">
                <div className="status-header-content">
                    <div>
                        <h1>מי בבית?</h1>
                        <p className="text-secondary">סטטוס נוכחות משפחתי בזמן אמת</p>
                    </div>
                    <button
                        className="btn-invite-status"
                        onClick={handleInvite}
                        disabled={generatingInvite}
                    >
                        <UserPlus size={18} />
                        <span>הזמן חבר</span>
                    </button>
                </div>

                {inviteCode && (
                    <div className="invite-reveal-banner slide-up">
                        <div className="invite-info">
                            <span className="invite-label">קוד הזמנה:</span>
                            <span className="invite-code-text">{inviteCode}</span>
                        </div>
                        <div className="invite-actions">
                            <button className="btn-copy-small" onClick={copyInvite}>
                                <Copy size={16} />
                                העתק קישור
                            </button>
                            <button className="btn-close-small" onClick={() => setInviteCode(null)}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <div className="status-grid">
                {members.map(member => {
                    const status = todayStatus?.members[member.uid] || 'away';
                    const isMe = member.uid === user?.uid;

                    return (
                        <div
                            key={member.uid}
                            className={`status-card ${status} ${isMe ? 'is-me' : ''}`}
                            onClick={isMe ? () => handleToggleStatus(member.uid, status as PresenceStatus) : undefined}
                        >
                            <div className="status-card-header">
                                <div className="member-avatarLarge">
                                    {member.photoURL ? (
                                        <img src={member.photoURL} alt={member.displayName} />
                                    ) : (
                                        <div className="avatar-placeholder">{member.displayName[0]}</div>
                                    )}
                                </div>
                                <div className="status-icon-badge">
                                    {status === 'home' ? <Home size={20} /> : <Car size={20} />}
                                </div>
                            </div>

                            <div className="status-card-body">
                                <h3 className="member-name">{member.displayName}</h3>
                                <div className="status-text">
                                    {status === 'home' ? 'נמצא/ת בבית' : 'מחוץ לבית'}
                                </div>
                            </div>

                            {isMe && (
                                <div className="status-card-footer">
                                    <span className="tap-hint">לחץ לשינוי סטטוס</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="status-legend">
                <div className="legend-item">
                    <div className="legend-icon home"><Home size={16} /></div>
                    <span>בבית</span>
                </div>
                <div className="legend-item">
                    <div className="legend-icon away"><Car size={16} /></div>
                    <span>בחוץ</span>
                </div>
            </div>
        </div>
    );
};
