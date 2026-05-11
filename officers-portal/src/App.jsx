import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import DSSPage from './pages/DSS';
import ActionPlanDetailPage from './pages/ActionPlanDetail';
import AuditTrailPage from './pages/AuditTrail';
import MapViewPage from './pages/MapView';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import LandingPage from './pages/Landing';
import RecentComplaintsPage from './pages/RecentComplaints';
import ProfilePage from './pages/Profile';
import AlertsPage from './pages/Alerts';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
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


