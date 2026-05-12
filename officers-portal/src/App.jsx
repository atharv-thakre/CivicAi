import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/dashboard';
import DSSPage from './pages/dss';
import ActionPlanDetailPage from './pages/plans/Detail';
import AuditTrailPage from './pages/audit';
import MapViewPage from './pages/complaints/Map';
import LoginPage from './pages/auth/Login';

import LandingPage from './pages/landing';
import RecentComplaintsPage from './pages/complaints/RecentComplaints';
import ProfilePage from './pages/profile';
import AlertsPage from './pages/alerts';
import SettingsPage from './pages/settings';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dss" element={<DSSPage />} />
                  <Route path="/plans/:id" element={<ActionPlanDetailPage />} />
                  <Route path="/audit" element={<AuditTrailPage />} />
                  <Route path="/audit/:id" element={<AuditTrailPage />} />
                  <Route path="/map" element={<MapViewPage />} />
                  <Route path="/complaints" element={<RecentComplaintsPage />} />
                  <Route path="/complaints/new" element={<RecentComplaintsPage defaultFilter="NEW" />} />
                  <Route path="/complaints/progress" element={<RecentComplaintsPage defaultFilter="IN_PROGRESS" />} />
                  <Route path="/complaints/overdue" element={<RecentComplaintsPage defaultFilter="OVERDUE" />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/plans" element={<div className="p-8 text-center text-muted-foreground">Action Plans Index</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}


