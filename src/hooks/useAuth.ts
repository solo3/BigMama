import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const { user, familyId, loading, loadingFamily, logout, refreshFamily } = useAuthContext();

    return {
        user,
        familyId,
        loading,
        loadingFamily,
        logout,
        refreshFamily,
        isAuthenticated: !!user,
    };
};
