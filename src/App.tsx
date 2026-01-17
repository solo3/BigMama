import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { TasksPage } from './pages/Tasks/TasksPage';
import { CalendarPage } from './pages/Calendar/CalendarPage';
import { DevLogger } from './components/common/DevLogger/DevLogger';

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
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <ProtectedRoute>
        {renderContent()}
      </ProtectedRoute>
      <DevLogger />
    </BrowserRouter>
  );
}

export default App;
