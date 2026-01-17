import { Layout } from './components/common/Layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';

function App() {
  const { familyId, loadingFamily } = useAuth();

  const renderContent = () => {
    if (loadingFamily) {
      return (
        <div className="loading-container" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
          טוען נתוני משפחה...
        </div>
      );
    }

    if (!familyId) {
      return <OnboardingPage />;
    }

    return (
      <Layout>
        <DashboardPage />
      </Layout>
    );
  };

  return (
    <ProtectedRoute>
      {renderContent()}
    </ProtectedRoute>
  );
}

export default App;
