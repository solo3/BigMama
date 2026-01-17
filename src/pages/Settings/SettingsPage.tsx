import React, { useState, useEffect } from 'react';
import { useFamily, useFamilyMembers } from '@/hooks/useFamily';
import { updateFamilyName } from '@/services/family';
import { useAuth } from '@/hooks/useAuth';
import styles from './SettingsPage.module.css';
import { Shield, Edit2, Check, X } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { family, loading: loadingFamily } = useFamily();
    const { members, loading: loadingMembers } = useFamilyMembers();
    const { user } = useAuth();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (family) {
            setNewName(family.name);
        }
    }, [family]);

    const handleSaveName = async () => {
        if (!family || !newName.trim() || newName === family.name) {
            setIsEditingName(false);
            return;
        }

        setIsSaving(true);
        try {
            await updateFamilyName(family.id, newName.trim());
            setIsEditingName(false);
        } catch (error) {
            console.error('Failed to update family name:', error);
            alert('שגיאה בעדכון שם המשפחה');
        } finally {
            setIsSaving(false);
        }
    };

    if (loadingFamily || loadingMembers) {
        return <div className={styles.loading}>טוען...</div>;
    }

    return (
        <div className={styles.settingsPage}>
            <header className={styles.header}>
                <h1>הגדרות משפחה</h1>
                <p>נהלו את פרטי המשפחה והחברים שלכם</p>
            </header>

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
                            <button
                                className={`${styles.button} ${styles.secondaryButton}`}
                                onClick={() => setIsEditingName(true)}
                            >
                                <Edit2 size={16} />
                                <span>עריכה</span>
                            </button>
                        </div>
                    )}
                </div>
            </section>

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
                            {member.role === 'admin' && <Shield size={18} className={styles.adminIcon} />}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
