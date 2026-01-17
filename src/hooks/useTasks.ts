import { useState, useEffect } from 'react';
import { Task } from '../types/models';
import { subscribeToTasks } from '../services/tasks';
import { useAuth } from './useAuth';

export const useTasks = () => {
    const { familyId } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToTasks(familyId, (updatedTasks) => {
            setTasks(updatedTasks);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [familyId]);

    return { tasks, loading };
};
