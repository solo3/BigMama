import { useState, useEffect } from 'react';
import { Member, DailyStatus, Family } from '../types/models';
import { subscribeToMembers, subscribeToDailyStatus } from '../services/members';
import { subscribeToFamily } from '../services/family';
import { useAuth } from './useAuth';

export const useFamily = () => {
    const { familyId } = useAuth();
    const [family, setFamily] = useState<Family | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) {
            setFamily(null);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToFamily(familyId, (updatedFamily) => {
            setFamily(updatedFamily);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [familyId]);

    return { family, loading };
};

export const useFamilyMembers = () => {
    const { familyId } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) {
            setMembers([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToMembers(familyId, (updatedMembers) => {
            setMembers(updatedMembers);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [familyId]);

    return { members, loading };
};

export const usePresence = () => {
    const { familyId } = useAuth();
    const [todayStatus, setTodayStatus] = useState<DailyStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) {
            setTodayStatus(null);
            setLoading(false);
            return;
        }

        const dateId = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const unsubscribe = subscribeToDailyStatus(familyId, dateId, (status) => {
            setTodayStatus(status);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [familyId]);

    return { todayStatus, loading };
};
