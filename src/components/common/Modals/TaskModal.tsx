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

    // Validation state
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setAssigneeId(initialData.assignees?.[0] || ''); // Assuming single assignee for now
            if (initialData.dueDate) {
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
        setTouched({});
        setErrors({});
    }, [initialData, isOpen]);

    const validate = (fieldName?: string) => {
        const newErrors: Record<string, string> = { ...errors };

        if (!fieldName || fieldName === 'title') {
            if (!title.trim()) {
                newErrors.title = 'כותרת המשימה היא שדה חובה';
            } else if (title.length < 2) {
                newErrors.title = 'הכותרת חייבת להכיל לפחות 2 תווים';
            } else {
                delete newErrors.title;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (!isOpen) return null;

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validate(field);
    };

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (touched.title) {
            validate('title'); // Re-validate if already touched
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ title: true });

        if (!validate()) {
            return;
        }

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
                taskData.dueDate = undefined;
            }

            await onSave(taskData);
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = !errors.title && title.trim().length > 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{initialData ? 'עריכת משימה' : 'משימה חדשה'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="title">כותרת <span className="required-star">*</span></label>
                        <input
                            type="text"
                            id="title"
                            className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                            value={title}
                            onChange={handleChangeTitle}
                            onBlur={() => handleBlur('title')}
                            placeholder="מה צריך לעשות?"
                        />
                        {touched.title && errors.title && (
                            <div className="invalid-feedback">{errors.title}</div>
                        )}
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
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading || !isFormValid}
                        >
                            {loading ? 'שומר...' : (initialData ? 'עדכן' : 'צור משימה')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
