import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { subscribeToAuthChanges, logout } from '../services/auth';

interface AuthContextType {
    user: FirebaseUser | null;
    familyId: string | null;
    loading: boolean;
    loadingFamily: boolean;
    logout: () => Promise<void>;
    refreshFamily: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [familyId, setFamilyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingFamily, setLoadingFamily] = useState(false);

    const fetchFamilyId = async (uid: string) => {
        setLoadingFamily(true);
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                setFamilyId(userDoc.data().familyId);
            } else {
                setFamilyId(null);
            }
        } catch (error) {
            console.error('Error fetching familyId:', error);
            setFamilyId(null);
        } finally {
            setLoadingFamily(false);
        }
    };

    const refreshFamily = async () => {
        if (user) {
            await fetchFamilyId(user.uid);
        }
    };

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchFamilyId(currentUser.uid);
            } else {
                setFamilyId(null);
                setLoadingFamily(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        familyId,
        loading,
        loadingFamily,
        logout,
        refreshFamily
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
