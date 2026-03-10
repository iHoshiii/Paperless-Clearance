import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      student: 'Student',
      sub_organization: 'Sub-Organization',
      mother_organization: 'Mother Organization',
      adviser: 'Adviser',
      ncssc: 'NCSSC',
      clinic: 'Clinic',
      sas: 'SAS',
      admin: 'Administrator'
    };
    return roleNames[role] || role;
  };

  const getWelcomeMessage = () => {
    const messages: { [key: string]: string } = {
      student: 'Welcome to your clearance dashboard',
      sub_organization: 'Organization Clearance Management',
      mother_organization: 'Mother Organization Dashboard',
      adviser: 'Adviser Clearance Portal',
      ncssc: 'NCSSC Administration',
      clinic: 'Clinic Clearance System',
      sas: 'SAS Clearance Portal',
      admin: 'System Administration'
    };
    return messages[user?.role || ''] || 'Welcome to Paperless Clearance';
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
            <h2>Welcome, {user?.first_name}!</h2>
            <p>You are logged in as a <strong>{getRoleDisplayName(user?.role || '')}</strong></p>
            {user?.student_id && (
              <p>Student ID: <strong>{user.student_id}</strong></p>
            )}
            {user?.department && (
              <p>Department: <strong>{user.department}</strong></p>
            )}
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">📋</div>
              <h3>Clearance Status</h3>
              <p>View and manage your clearance requests</p>
              <button className="card-button">View Clearances</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📄</div>
              <h3>Documents</h3>
              <p>Upload and manage required documents</p>
              <button className="card-button">Manage Documents</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">🔔</div>
              <h3>Notifications</h3>
              <p>Stay updated with latest notifications</p>
              <button className="card-button">View Notifications</button>
            </div>

            {(user?.role === 'adviser' || 
              user?.role === 'sub_organization' || 
              user?.role === 'mother_organization' || 
              user?.role === 'ncssc' || 
              user?.role === 'clinic' || 
              user?.role === 'sas' || 
              user?.role === 'admin') && (
              <div className="dashboard-card">
                <div className="card-icon">✅</div>
                <h3>Pending Approvals</h3>
                <p>Review and approve clearance requests</p>
                <button className="card-button">Review Requests</button>
              </div>
            )}

            {user?.role === 'admin' && (
              <>
                <div className="dashboard-card">
                  <div className="card-icon">👥</div>
                  <h3>User Management</h3>
                  <p>Manage system users and roles</p>
                  <button className="card-button">Manage Users</button>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">📊</div>
                  <h3>Reports</h3>
                  <p>Generate system reports and analytics</p>
                  <button className="card-button">View Reports</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
