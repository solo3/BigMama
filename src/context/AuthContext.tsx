import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { subscribeToAuthChanges, logout as firebaseLogout } from '../services/auth';

interface AuthContextType {
    user: FirebaseUser | null;
    userData: any | null;
    familyId: string | null;
    familyData: any | null;
    loading: boolean;
    loadingFamily: boolean;
    logout: () => Promise<void>;
    refreshFamily: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [familyId, setFamilyId] = useState<string | null>(null);
    const [familyData, setFamilyData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingFamily, setLoadingFamily] = useState(false);

    const fetchFamilyId = async (uid: string) => {
        setLoadingFamily(true);
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setFamilyId(data.familyId);
                setUserData(data);
            } else {
                setFamilyId(null);
                setUserData(null);
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

    const logout = async () => {
        await firebaseLogout();
        setUser(null);
        setUserData(null);
        setFamilyId(null);
        setFamilyData(null);
    };

    useEffect(() => {
        let unsubscribeUser: (() => void) | undefined;

        const unsubscribeAuth = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);

            // Clean up previous user listener
            if (unsubscribeUser) {
                unsubscribeUser();
                unsubscribeUser = undefined;
            }

            if (currentUser) {
                setLoadingFamily(true);
                // Real-time listener for user document to get familyId
                unsubscribeUser = onSnapshot(doc(db, 'users', currentUser.uid),
                    (snapshot: DocumentSnapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data();
                            setFamilyId(data?.familyId || null);
                            setUserData(data || null);
                        } else {
                            setFamilyId(null);
                            setUserData(null);
                        }
                        setLoadingFamily(false);
                        setLoading(false); // Auth + User Data ready
                    },
                    (err: Error) => {
                        console.error('Error listening to user doc:', err);
                        setLoadingFamily(false);
                        setLoading(false);
                    }
                );
            } else {
                setFamilyId(null);
                setUserData(null);
                setLoadingFamily(false);
                setLoading(false); // Auth ready (no user)
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUser) unsubscribeUser();
        };
    }, []);

    useEffect(() => {
        let unsubscribeFamily: (() => void) | undefined;

        if (familyId) {
            unsubscribeFamily = onSnapshot(doc(db, 'families', familyId), (snapshot) => {
                if (snapshot.exists()) {
                    setFamilyData(snapshot.data());
                } else {
                    setFamilyData(null);
                }
            });
        } else {
            setFamilyData(null);
        }

        return () => {
            if (unsubscribeFamily) unsubscribeFamily();
        };
    }, [familyId]);

    const value = {
        user,
        userData,
        familyId,
        familyData,
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
