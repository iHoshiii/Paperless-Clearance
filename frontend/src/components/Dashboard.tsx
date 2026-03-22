import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: UserRole | string) => {
    const roleNames: Record<string, string> = {
      [UserRole.STUDENT]: 'Student',
      [UserRole.SUB_ORGANIZATION]: 'Sub-Organization',
      [UserRole.MOTHER_ORGANIZATION]: 'Mother Organization',
      [UserRole.ADVISER]: 'Adviser',
      [UserRole.NCSSC]: 'NCSSC',
      [UserRole.CLINIC]: 'Clinic',
      [UserRole.SAS]: 'SAS',
      [UserRole.ADMIN]: 'Administrator'
    };
    return roleNames[role] || role;
  };

  const getWelcomeMessage = () => {
    const messages: Record<string, string> = {
      [UserRole.STUDENT]: 'Manage your clearance requests and track progress',
      [UserRole.SUB_ORGANIZATION]: 'Organization Clearance Management & Approvals',
      [UserRole.MOTHER_ORGANIZATION]: 'Monitor and manage department-wide clearances',
      [UserRole.ADVISER]: 'Review and approve student clearance forms',
      [UserRole.NCSSC]: 'Strategic Student Services Oversight',
      [UserRole.CLINIC]: 'Medical Clearance Administration',
      [UserRole.SAS]: 'Student Affairs & Services Portal',
      [UserRole.ADMIN]: 'System-wide configuration and user oversight'
    };
    return messages[user?.role || ''] || 'Welcome to Paperless Clearance';
  };

  const renderDashboardCards = () => {
    const role = user?.role as UserRole;

    const cards = [
      {
        id: 'status',
        icon: '📋',
        title: 'Clearance Status',
        description: 'View and manage your clearance requests',
        buttonText: 'View Clearances',
        showFor: [UserRole.STUDENT]
      },
      {
        id: 'documents',
        icon: '📄',
        title: 'Documents',
        description: 'Upload and manage required documents',
        buttonText: 'Manage Files',
        showFor: [UserRole.STUDENT]
      },
      {
        id: 'approvals',
        icon: '✅',
        title: 'Pending Approvals',
        description: 'Review and approve clearance requests',
        buttonText: 'Review Now',
        showFor: [
          UserRole.SUB_ORGANIZATION,
          UserRole.MOTHER_ORGANIZATION,
          UserRole.ADVISER,
          UserRole.NCSSC,
          UserRole.CLINIC,
          UserRole.SAS,
          UserRole.ADMIN
        ]
      },
      {
        id: 'analytics',
        icon: '📊',
        title: 'Analytics',
        description: 'View statistics and clearance reports',
        buttonText: 'View Reports',
        showFor: [
          UserRole.SUB_ORGANIZATION,
          UserRole.MOTHER_ORGANIZATION,
          UserRole.NCSSC,
          UserRole.SAS,
          UserRole.ADMIN
        ]
      },
      {
        id: 'users',
        icon: '👥',
        title: 'User Management',
        description: 'Manage institutional users and roles',
        buttonText: 'Manage Users',
        showFor: [UserRole.ADMIN, UserRole.NCSSC, UserRole.SAS]
      },
      {
        id: 'clinic-records',
        icon: '🏥',
        title: 'Medical Records',
        description: 'Manage and update student medical clearance',
        buttonText: 'View Records',
        showFor: [UserRole.CLINIC, UserRole.ADMIN]
      },
      {
        id: 'sas-services',
        icon: '🎓',
        title: 'Student Services',
        description: 'Oversee SAS-related clearance requirements',
        buttonText: 'Manage Services',
        showFor: [UserRole.SAS, UserRole.ADMIN]
      },
      {
        id: 'ncssc-council',
        icon: '🏛️',
        title: 'Council Portal',
        description: 'Coordinate with NCSSC organizational headers',
        buttonText: 'Open Portal',
        showFor: [UserRole.NCSSC, UserRole.ADMIN]
      },
      {
        id: 'notifications',
        icon: '🔔',
        title: 'Notifications',
        description: 'Stay updated with latest announcements',
        buttonText: 'View All',
        showFor: Object.values(UserRole) as UserRole[]
      }
    ];

    return cards
      .filter(card => card.showFor.includes(role))
      .map(card => (
        <div className="dashboard-card" key={card.id}>
          <div className="card-icon">{card.icon}</div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <button className="card-button">{card.buttonText}</button>
        </div>
      ));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Paperless Clearance</h1>
            <p className="header-subtitle">{getWelcomeMessage()}</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.first_name} {user?.last_name}</span>
              <span className="user-role">{getRoleDisplayName(user?.role || '')}</span>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>Welcome Back, {user?.first_name}!</h2>
            <p>You are logged in as a <strong>{getRoleDisplayName(user?.role || '')}</strong></p>
            <div className="user-details-pills">
              {user?.student_id && (
                <span className="detail-pill">ID: <strong>{user.student_id}</strong></span>
              )}
              {user?.department && (
                <span className="detail-pill">Dept: <strong>{user.department}</strong></span>
              )}
            </div>
          </div>

          <div className="dashboard-grid">
            {renderDashboardCards()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
