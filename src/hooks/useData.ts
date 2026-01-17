import { useState, useEffect } from 'react';
import { Event, FamilyRequest } from '../types/models';
import { subscribeToEvents } from '../services/events';
import { subscribeToRequests } from '../services/requests';
import { useAuth } from './useAuth';

export const useEvents = () => {
    const { familyId } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) {
            setEvents([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToEvents(familyId, (updatedEvents) => {
            setEvents(updatedEvents);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [familyId]);

    return { events, loading };
};

export const useRequests = () => {
    const { familyId } = useAuth();
    const [requests, setRequests] = useState<FamilyRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) {
            setRequests([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToRequests(familyId, (updatedRequests) => {
            setRequests(updatedRequests);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [familyId]);

    return { requests, loading };
};
