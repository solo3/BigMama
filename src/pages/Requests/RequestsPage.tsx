import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRequests } from '../../hooks/useData';
import { useFamilyMembers } from '../../hooks/useFamily';
import { useAuth } from '../../hooks/useAuth';
import { createRequest } from '../../services/requests';
import { RequestCard } from '../../components/requests/RequestCard';
import { RequestModal } from '../../components/common/Modals/RequestModal';
import { FamilyRequest } from '../../types/models';
import './Requests.css';

type FilterType = 'open' | 'resolved' | 'all';

export const RequestsPage = () => {
    const { requests, loading } = useRequests();
    const { members } = useFamilyMembers();
    const { user, familyId } = useAuth();
    const [activeFilter, setActiveFilter] = useState<FilterType>('open');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateRequest = () => {
        setIsModalOpen(true);
    };

    const handleSaveRequest = async (requestData: Partial<FamilyRequest>) => {
        if (!familyId || !user) return;

        try {
            await createRequest(familyId, user.uid, {
                title: requestData.title || '',
                description: requestData.description || '',
                type: requestData.type || 'suggestion',
                createdBy: user.uid,
                expiresAt: requestData.expiresAt,
            });
        } catch (error) {
            console.error('Failed to create request:', error);
            alert('שגיאה ביצירת הבקשה');
        }
    };

    const getFilteredRequests = () => {
        if (!requests) return [];

        switch (activeFilter) {
            case 'open':
                return requests.filter(r => r.status === 'open');
            case 'resolved':
                return requests.filter(r => r.status === 'approved' || r.status === 'rejected');
            case 'all':
                return requests;
            default:
                return requests;
        }
    };

    const filteredRequests = getFilteredRequests();

    if (loading) {
        return <div className="loading-container">טוען בקשות...</div>;
    }

    return (
        <div className="requests-page-container">
            <header className="requests-header">
                <h1>בקשות והצבעות</h1>
                <button className="add-request-btn" onClick={handleCreateRequest}>
                    <Plus size={20} />
                    בקשה חדשה
                </button>
            </header>

            <div className="requests-tabs">
                <button
                    className={`tab-btn ${activeFilter === 'open' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('open')}
                >
                    פתוחות
                </button>
                <button
                    className={`tab-btn ${activeFilter === 'resolved' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('resolved')}
                >
                    טופלו
                </button>
                <button
                    className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    הכל
                </button>
            </div>

            <div className="requests-list">
                {filteredRequests.length === 0 && (
                    <div className="empty-state">
                        {activeFilter === 'open' && 'אין בקשות פתוחות'}
                        {activeFilter === 'resolved' && 'אין בקשות שטופלו'}
                        {activeFilter === 'all' && 'אין בקשות להצגה'}
                    </div>
                )}

                {filteredRequests.map(request => (
                    <RequestCard
                        key={request.id}
                        request={request}
                        members={members}
                        currentUser={user}
                        familyId={familyId || ''}
                    />
                ))}
            </div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRequest}
            />
        </div>
    );
};
