import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const { user, userData, familyId, familyData, loading, loadingFamily, logout, refreshFamily } = useAuthContext();

    return {
        user,
        userData,
        familyId,
        familyData,
        loading,
        loadingFamily,
        logout,
        refreshFamily,
        isAuthenticated: !!user,
    };
};
