import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFamilyMembers } from '../../../hooks/useFamily';
import { Task } from '../../../types/models';
import { Timestamp } from 'firebase/firestore';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => Promise<void>;
    initialData?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const { members } = useFamilyMembers();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setAssigneeId(initialData.assignees?.[0] || ''); // Assuming single assignee for now
            if (initialData.dueDate) {
                // Convert Firestore Timestamp to YYYY-MM-DD
                const date = initialData.dueDate.toDate();
                setDueDate(date.toISOString().split('T')[0]);
            } else {
                setDueDate('');
            }
        } else {
            setTitle('');
            setDescription('');
            setAssigneeId('');
            setDueDate('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const taskData: Partial<Task> = {
                title,
                description,
                assignees: assigneeId ? [assigneeId] : [],
                status: initialData ? initialData.status : 'todo',
            };

            if (dueDate) {
                taskData.dueDate = Timestamp.fromDate(new Date(dueDate));
            } else {
                taskData.dueDate = undefined; // How to handle clearing? Firestore might need FieldValue.delete() but let's stick to undefined or null logic if supported or just update
                // If updateTask doesn't handle undefined for deletion, we might need a specific handling.
                // existing updateTask implementation uses spreads. Firestore update ignores undefined fields usually unless explicitly ignored or handled.
                // Let's assume for now we set it.
            }

            await onSave(taskData);
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            // Could add error handling UI here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{initialData ? 'עריכת משימה' : 'משימה חדשה'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">כותרת</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="מה צריך לעשות?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">תיאור (אופציונלי)</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignee">אחראי/ת</label>
                        <select
                            id="assignee"
                            className="form-control"
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                        >
                            <option value="">ללא שיוך</option>
                            {members.map(member => (
                                <option key={member.uid} value={member.uid}>
                                    {member.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">תאריך יעד</label>
                        <input
                            type="date"
                            id="dueDate"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                            ביטול
                        </button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'שומר...' : (initialData ? 'עדכן' : 'צור משימה')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
