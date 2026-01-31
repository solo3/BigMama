import React from 'react';
import { ThumbsUp, ThumbsDown, Check, X, Archive } from 'lucide-react';
import { FamilyRequest, Member } from '../../types/models';
import { voteOnRequest, updateRequestStatus } from '../../services/requests';
import './RequestCard.css';

interface RequestCardProps {
    request: FamilyRequest;
    members: Member[];
    currentUser: { uid: string } | null;
    familyId: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
    request,
    members,
    currentUser,
    familyId,
}) => {
    const author = members.find(m => m.uid === request.createdBy);
    const isAdmin = currentUser && members.find(m => m.uid === currentUser.uid)?.role === 'admin';
    const isCreator = currentUser?.uid === request.createdBy;

    // Calculate vote counts
    const votes = request.votes || {};
    const upVotes = Object.values(votes).filter(v => v === 'up').length;
    const downVotes = Object.values(votes).filter(v => v === 'down').length;
    const userVote = currentUser ? votes[currentUser.uid] : null;

    const handleVote = async (voteType: 'up' | 'down') => {
        if (!currentUser || !familyId) return;

        try {
            // If user already voted this way, we could remove vote, but spec says toggle
            // For simplicity, allow changing vote
            await voteOnRequest(familyId, request.id, currentUser.uid, voteType);
        } catch (error) {
            console.error('Failed to vote:', error);
            alert('שגיאה בהצבעה');
        }
    };

    const handleApprove = async () => {
        if (!familyId || !isAdmin) return;
        try {
            await updateRequestStatus(familyId, request.id, 'approved');
        } catch (error) {
            console.error('Failed to approve:', error);
            alert('שגיאה באישור הבקשה');
        }
    };

    const handleReject = async () => {
        if (!familyId || !isAdmin) return;
        if (!window.confirm('האם לדחות את הבקשה?')) return;
        try {
            await updateRequestStatus(familyId, request.id, 'rejected');
        } catch (error) {
            console.error('Failed to reject:', error);
            alert('שגיאה בדחיית הבקשה');
        }
    };

    const handleArchive = async () => {
        if (!familyId || (!isAdmin && !isCreator)) return;
        if (!window.confirm('האם לארכב את הבקשה?')) return;
        try {
            await updateRequestStatus(familyId, request.id, 'archived');
        } catch (error) {
            console.error('Failed to archive:', error);
            alert('שגיאה בארכוב הבקשה');
        }
    };

    const getStatusBadgeClass = () => {
        switch (request.status) {
            case 'open':
                return 'status-badge status-open';
            case 'approved':
                return 'status-badge status-approved';
            case 'rejected':
                return 'status-badge status-rejected';
            case 'archived':
                return 'status-badge status-archived';
            default:
                return 'status-badge';
        }
    };

    const getStatusText = () => {
        switch (request.status) {
            case 'open':
                return 'פתוחה';
            case 'approved':
                return 'אושרה';
            case 'rejected':
                return 'נדחתה';
            case 'archived':
                return 'בארכיון';
            default:
                return request.status;
        }
    };

    return (
        <div className="request-card">
            <div className="request-header">
                <div className="request-badges">
                    <span className={`type-badge type-${request.type}`}>
                        {request.type === 'suggestion' ? '💡 הצעה' : '📢 הודעה'}
                    </span>
                    <span className={getStatusBadgeClass()}>
                        {getStatusText()}
                    </span>
                </div>
            </div>

            <div className="request-body">
                <h3 className="request-title">{request.title}</h3>
                <p className="request-description">{request.description}</p>
            </div>

            <div className="request-author">
                <img
                    src={author?.photoURL || `https://ui-avatars.com/api/?name=${author?.displayName || 'User'}&background=random`}
                    alt={author?.displayName || 'User'}
                    className="author-avatar"
                />
                <span className="author-name">{author?.displayName || 'משתמש לא ידוע'}</span>
            </div>

            {request.type === 'suggestion' && (
                <div className="voting-section">
                    <button
                        className={`vote-btn vote-up ${userVote === 'up' ? 'active' : ''}`}
                        onClick={() => handleVote('up')}
                        disabled={!currentUser}
                        aria-label="הצבע בעד"
                    >
                        <ThumbsUp size={18} />
                        <span>{upVotes}</span>
                    </button>
                    <button
                        className={`vote-btn vote-down ${userVote === 'down' ? 'active' : ''}`}
                        onClick={() => handleVote('down')}
                        disabled={!currentUser}
                        aria-label="הצבע נגד"
                    >
                        <ThumbsDown size={18} />
                        <span>{downVotes}</span>
                    </button>
                </div>
            )}

            {(isAdmin || isCreator) && request.status === 'open' && (
                <div className="admin-actions">
                    {isAdmin && (
                        <>
                            <button className="admin-btn approve-btn" onClick={handleApprove} aria-label="אשר בקשה">
                                <Check size={16} />
                                אשר
                            </button>
                            <button className="admin-btn reject-btn" onClick={handleReject} aria-label="דחה בקשה">
                                <X size={16} />
                                דחה
                            </button>
                        </>
                    )}
                    {(isAdmin || isCreator) && (
                        <button className="admin-btn archive-btn" onClick={handleArchive} aria-label="ארכב בקשה">
                            <Archive size={16} />
                            ארכב
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
