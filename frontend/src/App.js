import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './components/AuthContext';

//landing
import HomePage from './pages/LandingPage/HomePage';
import AboutUs from './pages/LandingPage/pages/AboutUs';
import Contacts from './pages/LandingPage/pages/Contacts';
import Login from './pages/LandingPage/pages/Login';
import DebateModels from './pages/LandingPage/pages/DebateModels';
import Events from './pages/LandingPage/pages/Events';
import LandingNavbar from './pages/LandingPage/Navbar';
import NewsList from './components/NewsList';

//app
import Dashboard from './pages/pagesLeaderTH/AdminDashboard';
import TaskTracking from './pages/TaskTracking/TaskTraking';
import UserManagement from './pages/userManagment/UserManagment';
import AppNavbar from './pages/common/AppNavbar';
import UserMessages from './pages/pagesLeaderTH/ToContact';
import MemberView from './pages/memberView/MemberView';
import StrategicCoordinatorView from './pages/strategicCoordinatorView/StrategicCoordinatorView';
import PresidentView from './pages/presidentView/PresidentView';
import VicePresidentView from './pages/vicePresidentView/VicePresidentView';
import LeaderView from './pages/leaderView/LeaderView';
import TeamManagement from './pages/leaderView/TeamManagement';



function App() {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <Router>
      {isAuthenticated ? <AppNavbar /> : <LandingNavbar />}
      <Routes>
        {isAuthenticated ? (
          <>
            {userRole === 'strategic_coordinator' && (
              <>
                <Route path="/" element={<Navigate to="/coordinator-dashboard" />} />
                <Route path="/coordinator-dashboard" element={<StrategicCoordinatorView />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/practices" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskTracking />} />
              </>
            )}
            {userRole === 'president' && (
              <>
                <Route path="/" element={<Navigate to="/president-dashboard" />} />
                <Route path="/president-dashboard" element={<PresidentView />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/practices" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskTracking />} />
              </>
            )}
            {userRole === 'vice_president' && (
              <>
                <Route path="/" element={<Navigate to="/vp-dashboard" />} />
                <Route path="/vp-dashboard" element={<VicePresidentView />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/practices" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskTracking />} />
              </>
            )}
            {userRole === 'leader' && (
              <>
                <Route path="/" element={<Navigate to="/leader-dashboard" />} />
                <Route path="/leader-dashboard" element={<LeaderView />} />
                <Route path="/team-management" element={<TeamManagement />} />
                <Route path="/usermessages" element={<UserMessages />} />
                <Route path="/practices" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskTracking />} />
              </>
            )}
            {userRole === 'member' && (
              <>
                <Route path="/" element={<Navigate to="/memberview" />} />
                <Route path="/memberview" element={<MemberView />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/debateModels" element={<DebateModels />} />
            <Route path="/events" element={<Events />} />
            <Route path="/NewsList" element={<NewsList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
