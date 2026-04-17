import React, { useState, useEffect } from 'react';
import { useFamily, useFamilyMembers } from '@/hooks/useFamily';
import { updateFamilyName } from '@/services/family';
import { removeMember, updateMemberRole } from '@/services/members';
import { useInvites } from '@/hooks/useData';
import { createInvite, deleteInvite } from '@/services/invites';
import { updateUserProfile } from '@/services/user';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import styles from './SettingsPage.module.css';
import { Shield, Edit2, Check, X, UserPlus, Copy, LogOut, User as UserIcon, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { family, loading: loadingFamily } = useFamily();
    const { members, loading: loadingMembers } = useFamilyMembers();
    const { invites, loading: loadingInvites } = useInvites();
    const { user, logout } = useAuth();
    const { addToast } = useToast();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);

    const isAdmin = members.find(m => m.uid === user?.uid)?.role === 'admin';

    useEffect(() => {
        if (family) {
            setNewName(family.name);
        }
        if (user) {
            setProfileName(user.displayName || '');
        }
    }, [family, user]);

    const handleSaveProfile = async () => {
        if (!user || !family || !profileName.trim() || profileName === user.displayName) {
            setIsEditingProfile(false);
            return;
        }

        setIsSaving(true);
        try {
            await updateUserProfile(user.uid, family.id, user.uid, { displayName: profileName.trim() });
            addToast('הפרופיל עודכן בהצלחה', 'success');
            setIsEditingProfile(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            addToast('שגיאה בעדכון הפרופיל', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveName = async () => {
        if (!family || !newName.trim() || newName === family.name || !user) {
            setIsEditingName(false);
            return;
        }

        setIsSaving(true);
        try {
            await updateFamilyName(family.id, newName.trim(), user.uid);
            addToast('שם המשפחה עודכן בהצלחה', 'success');
            setIsEditingName(false);
        } catch (error) {
            console.error('Failed to update family name:', error);
            addToast('שגיאה בעדכון שם המשפחה', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateInvite = async (role: 'admin' | 'member') => {
        if (!family || !user) return;

        try {
            const code = await createInvite(family.id, user.uid, role);
            const link = `${window.location.origin}/join/${code}`;
            setInviteLink(link);
            addToast('הזמנה נוצרה בהצלחה', 'success');
        } catch (error) {
            console.error('Failed to create invite:', error);
            addToast('שגיאה ביצירת הזמנה', 'error');
        }
    };

    const copyToClipboard = (text?: string) => {
        const toCopy = text || inviteLink;
        if (toCopy) {
            navigator.clipboard.writeText(toCopy);
            addToast('הקישור הועתק לספר הכתובות', 'success');
        }
    };

    const handleDeleteInvite = async (code: string) => {
        if (!family || !user || !window.confirm('האם את/ה בטוח שברצונך למחוק את ההזמנה?')) return;

        try {
            await deleteInvite(code, family.id, user.uid);
            addToast('ההזמנה נמחקה', 'success');
        } catch (error) {
            console.error('Failed to delete invite:', error);
            addToast('שגיאה במחיקת ההזמנה', 'error');
        }
    };

    const handleUpdateRole = async (memberUid: string, currentRole: 'admin' | 'member') => {
        if (!family || !user) return;
        const newRole = currentRole === 'admin' ? 'member' : 'admin';
        try {
            await updateMemberRole(family.id, user.uid, memberUid, newRole);
            addToast('תפקיד המשתמש עודכן', 'success');
        } catch (error) {
            console.error('Failed to update role:', error);
            addToast('שגיאה בעדכון התפקיד', 'error');
        }
    };

    const handleRemoveMember = async (memberUid: string, name: string) => {
        if (!family || !user) return;
        if (!window.confirm(`האם את/ה בטוח שברצונך להסיר את ${name} מהמשפחה?`)) return;

        try {
            await removeMember(family.id, user.uid, memberUid);
            addToast(`${name} הוסר/ה מהמשפחה`, 'success');
        } catch (error) {
            console.error('Failed to remove member:', error);
            addToast('שגיאה בהסרת המשתמש', 'error');
        }
    };

    if (loadingFamily || loadingMembers || loadingInvites) {
        return <div className={styles.loading}>טוען...</div>;
    }

    return (
        <div className={styles.settingsPage}>
            <header className={styles.header}>
                <h1>הגדרות משפחה</h1>
                <p>נהלו את פרטי המשפחה והחברים שלכם</p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <UserIcon size={20} />
                    הפרופיל שלי
                    {isAdmin && <span className={styles.adminBadge}>מנהל/ת</span>}
                </h2>
                <div className={styles.row}>
                    <div className={styles.label}>שם תצוגה:</div>
                    {isEditingProfile ? (
                        <div className={styles.row}>
                            <input
                                type="text"
                                className={styles.input}
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                disabled={isSaving}
                                autoFocus
                            />
                            <div className={styles.buttonGroup}>
                                <button
                                    className={`${styles.button} ${styles.primaryButton}`}
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    className={`${styles.button} ${styles.secondaryButton}`}
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        setProfileName(user?.displayName || '');
                                    }}
                                    disabled={isSaving}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.row}>
                            <span className={styles.value}>
                                {user?.displayName}
                                {isAdmin && <span className={styles.adminBadge}>מנהל/ת</span>}
                            </span>
                            <button
                                className={`${styles.button} ${styles.secondaryButton}`}
                                onClick={() => setIsEditingProfile(true)}
                            >
                                <Edit2 size={16} />
                                <span>עריכה</span>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>פרטי המשפחה</h2>
                <div className={styles.row}>
                    <div className={styles.label}>שם המשפחה:</div>
                    {isEditingName ? (
                        <div className={styles.row}>
                            <input
                                type="text"
                                className={styles.input}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                disabled={isSaving}
                                autoFocus
                            />
                            <div className={styles.buttonGroup}>
                                <button
                                    className={`${styles.button} ${styles.primaryButton}`}
                                    onClick={handleSaveName}
                                    disabled={isSaving}
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    className={`${styles.button} ${styles.secondaryButton}`}
                                    onClick={() => {
                                        setIsEditingName(false);
                                        setNewName(family?.name || '');
                                    }}
                                    disabled={isSaving}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.row}>
                            <span className={styles.value}>{family?.name}</span>
                            {isAdmin && (
                                <button
                                    className={`${styles.button} ${styles.secondaryButton}`}
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <Edit2 size={16} />
                                    <span>עריכה</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {isAdmin && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>הזמנת חברים</h2>
                    <div className={styles.inviteSection}>
                        <p className={styles.description}>צרו קישור הזמנה כדי להוסיף בני משפחה ל-BigMama.</p>
                        <div className={styles.inviteButtons}>
                            <button
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleGenerateInvite('admin')}
                            >
                                <UserPlus size={18} />
                                הזמנת הורה (מנהל/ת)
                            </button>
                            <button
                                className={`${styles.button} ${styles.secondaryButton}`}
                                onClick={() => handleGenerateInvite('member')}
                            >
                                <UserPlus size={18} />
                                הזמנת ילד/חבר
                            </button>
                        </div>
                        {inviteLink && (
                            <div className={styles.inviteLinkBox}>
                                <div className={styles.inviteLink}>{inviteLink}</div>
                                <button className={`${styles.button} ${styles.primaryButton} ${styles.copyButton}`} onClick={() => copyToClipboard()}>
                                    <Copy size={16} />
                                    העתק קישור
                                </button>
                            </div>
                        )}

                        {invites.length > 0 && (
                            <div className={styles.inviteList}>
                                <h3 className={styles.inviteListTitle}>הזמנות פעילות</h3>
                                {invites.map((invite) => (
                                    <div key={invite.id} className={styles.inviteItem}>
                                        <div className={styles.inviteItemInfo}>
                                            <span className={styles.inviteCode}>{invite.id}</span>
                                            <span className={styles.inviteMeta}>
                                                {invite.role === 'admin' ? 'הורה' : 'חבר/ה'} • {new Date(invite.createdAt?.seconds * 1000).toLocaleDateString('he-IL')}
                                            </span>
                                        </div>
                                        <div className={styles.buttonGroup}>
                                            <button
                                                className={`${styles.button} ${styles.secondaryButton}`}
                                                onClick={() => copyToClipboard(`${window.location.origin}/join/${invite.id}`)}
                                                title="העתק קישור"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                className={`${styles.button} ${styles.deleteButton}`}
                                                onClick={() => handleDeleteInvite(invite.id)}
                                                title="מחק הזמנה"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>חברי המשפחה</h2>
                <div className={styles.memberList}>
                    {members.map((member) => (
                        <div key={member.uid} className={styles.memberItem}>
                            <div className={styles.memberInfo}>
                                <div className={styles.avatar}>
                                    {member.displayName.charAt(0)}
                                </div>
                                <div>
                                    <div className={styles.memberName}>
                                        {member.displayName}
                                        {member.uid === user?.uid && " (את/ה)"}
                                    </div>
                                    <div className={`${styles.memberRole} ${member.role === 'admin' ? styles.admin : ''}`}>
                                        {member.role === 'admin' ? 'מנהל/ת' : 'חבר/ה'}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.memberActions}>
                                {isAdmin && member.uid !== user?.uid && (
                                    <>
                                        <button
                                            className={styles.roleButton}
                                            onClick={() => handleUpdateRole(member.uid, member.role)}
                                        >
                                            שנה תפקיד
                                        </button>
                                        <button
                                            className={`${styles.button} ${styles.memberDeleteButton}`}
                                            onClick={() => handleRemoveMember(member.uid, member.displayName)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                                {member.role === 'admin' && <Shield size={18} className={styles.adminIcon} />}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <button className={`${styles.button} ${styles.secondaryButton}`} onClick={logout} style={{ width: '100%', marginTop: 'var(--spacing-lg)', color: '#ef4444', borderColor: '#fee2e2' }}>
                <LogOut size={18} />
                <span>התנתקות</span>
            </button>
        </div>
    );
};
