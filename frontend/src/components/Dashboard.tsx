import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { ROLE_WELCOME_MESSAGES, APP_NAME } from '../constants';
import Header from './common/Header';
import WelcomeCard from './common/WelcomeCard';
import UserSettings from './common/UserSettings';

// Role Dashboards
import StudentDashboard from './roles/StudentDashboard';
import SubOrgDashboard from './roles/SubOrgDashboard';
import MotherOrgDashboard from './roles/MotherOrgDashboard';
import AdviserDashboard from './roles/AdviserDashboard';
import NCSSCDashboard from './roles/NCSSCDashboard';
import ClinicDashboard from './roles/ClinicDashboard';
import SASDashboard from './roles/SASDashboard';
import AdminDashboard from './roles/AdminDashboard';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const getWelcomeMessage = () => {
    return ROLE_WELCOME_MESSAGES[user?.role || ''] || `Welcome to ${APP_NAME}`;
  };

  const renderRoleDashboard = () => {
    if (isSettingsOpen) {
      return <UserSettings onClose={() => setIsSettingsOpen(false)} />;
    }

    switch (user?.role) {
      case UserRole.STUDENT:
        return <StudentDashboard />;
      case UserRole.SUB_ORGANIZATION:
        return <SubOrgDashboard />;
      case UserRole.MOTHER_ORGANIZATION:
        return <MotherOrgDashboard />;
      case UserRole.ADVISER:
        return <AdviserDashboard />;
      case UserRole.NCSSC:
        return <NCSSCDashboard />;
      case UserRole.CLINIC:
        return <ClinicDashboard />;
      case UserRole.SAS:
        return <SASDashboard />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        user={user}
        logout={logout}
        onSettingsClick={() => setIsSettingsOpen(true)}
        welcomeMessage={getWelcomeMessage()}
      />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <WelcomeCard user={user} />

          <div className="dashboard-grid">
            {renderRoleDashboard()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
