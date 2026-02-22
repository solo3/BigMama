import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { DevLogger } from './components/common/DevLogger/DevLogger';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

// Lazy load pages
const OnboardingPage = lazy(() => import('./pages/Onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const TasksPage = lazy(() => import('./pages/Tasks/TasksPage').then(m => ({ default: m.TasksPage })));
const CalendarPage = lazy(() => import('./pages/Calendar/CalendarPage').then(m => ({ default: m.CalendarPage })));
const RequestsPage = lazy(() => import('./pages/Requests/RequestsPage').then(m => ({ default: m.RequestsPage })));
const StatusPage = lazy(() => import('./pages/Status/StatusPage').then(m => ({ default: m.StatusPage })));
const JoinPage = lazy(() => import('./pages/Join/JoinPage').then(m => ({ default: m.JoinPage })));

const PageLoader = () => (
  <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <LoadingSkeleton height={40} width="60%" />
    <LoadingSkeleton height={200} />
    <LoadingSkeleton height={200} />
  </div>
);

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
      return (
        <Routes>
          <Route path="/join/:inviteCode" element={<JoinPage />} />
          <Route path="*" element={<OnboardingPage />} />
        </Routes>
      );
    }

    return (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/join/:inviteCode" element={<JoinPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/join/:inviteCode" element={<JoinPage />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                {renderContent()}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <DevLogger />
    </BrowserRouter>
  );
}

export default App;
