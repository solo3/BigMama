import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FamilyRequest, RequestType } from '../../../types/models';
import { Timestamp } from 'firebase/firestore';

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (request: Partial<FamilyRequest>) => Promise<void>;
}

export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<RequestType>('suggestion');
    const [expiresAt, setExpiresAt] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const requestData: Partial<FamilyRequest> = {
                title,
                description,
                type,
            };

            if (expiresAt) {
                requestData.expiresAt = Timestamp.fromDate(new Date(expiresAt));
            }

            await onSave(requestData);

            // Reset form
            setTitle('');
            setDescription('');
            setType('suggestion');
            setExpiresAt('');
            onClose();
        } catch (error) {
            console.error('Error saving request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setTitle('');
            setDescription('');
            setType('suggestion');
            setExpiresAt('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>בקשה חדשה</h2>
                    <button className="close-btn" onClick={handleClose} disabled={loading}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">כותרת *</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="מה הבקשה?"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">תיאור *</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="פרטים נוספים..."
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">סוג הבקשה *</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-toggle-btn ${type === 'suggestion' ? 'active' : ''}`}
                                onClick={() => setType('suggestion')}
                                disabled={loading}
                            >
                                💡 הצעה
                            </button>
                            <button
                                type="button"
                                className={`type-toggle-btn ${type === 'announcement' ? 'active' : ''}`}
                                onClick={() => setType('announcement')}
                                disabled={loading}
                            >
                                📢 הודעה
                            </button>
                        </div>
                        <small className="form-hint">
                            {type === 'suggestion'
                                ? 'הצעות ניתנות להצבעה על ידי בני המשפחה'
                                : 'הודעות הן אינפורמטיביות בלבד, ללא הצבעה'}
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="expiresAt">תאריך תפוגה (אופציונלי)</label>
                        <input
                            type="date"
                            id="expiresAt"
                            className="form-control"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            disabled={loading}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <small className="form-hint">
                            לבקשות רגישות לזמן
                        </small>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading ? 'שומר...' : 'צור בקשה'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
